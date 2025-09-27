<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\Models\EnquiryDepartmentalTask;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EnquiryDepartmentalTaskService
{
    /**
     * Claim a task
     */
    public function claimTask(EnquiryDepartmentalTask $task, $user): bool
    {
        $this->authorizeTaskAccess($task, $user);

        if ($task->assigned_user_id) {
            throw new \Exception('Task is already claimed by another user');
        }

        if ($task->status !== 'pending') {
            throw new \Exception('Task is not available for claiming');
        }

        DB::beginTransaction();
        try {
            $task->assigned_user_id = $user->id;
            $task->save();

            // Log audit trail
            $this->logTaskAction($task, 'claimed', $user);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Start a task
     */
    public function startTask(EnquiryDepartmentalTask $task, $user): bool
    {
        $this->authorizeTaskAccess($task, $user);

        if ($task->status !== 'pending') {
            throw new \Exception('Task is not in pending status');
        }

        DB::beginTransaction();
        try {
            $task->status = 'in_progress';
            $task->started_at = now();
            $task->assigned_user_id = $user->id;
            $task->save();

            // Log audit trail
            $this->logTaskAction($task, 'started', $user);

            // Dispatch notification
            $this->notifyTaskStart($task);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Complete a task
     */
    public function completeTask(EnquiryDepartmentalTask $task, $user): bool
    {
        $this->authorizeTaskAccess($task, $user);

        if ($task->status !== 'in_progress') {
            throw new \Exception('Task is not in progress');
        }

        DB::beginTransaction();
        try {
            $task->status = 'completed';
            $task->completed_at = now();
            $task->save();

            // Log audit trail
            $this->logTaskAction($task, 'completed', $user);

            // Check enquiry progression
            $this->checkEnquiryProgression($task);

            // Dispatch notification
            $this->notifyTaskCompletion($task);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Submit a task for review
     */
    public function submitTask(EnquiryDepartmentalTask $task, $user): bool
    {
        $this->authorizeTaskAccess($task, $user);

        if ($task->status !== 'in_progress') {
            throw new \Exception('Task is not in progress');
        }

        DB::beginTransaction();
        try {
            $task->status = 'submitted';
            $task->submitted_at = now();
            $task->save();

            // Log audit trail
            $this->logTaskAction($task, 'submitted', $user);

            // Notify reviewers
            $this->notifyTaskSubmission($task);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update task status with validation
     */
    public function updateTaskStatus(EnquiryDepartmentalTask $task, string $newStatus, $user, string $notes = null): bool
    {
        $this->authorizeTaskAccess($task, $user);

        if (!$this->isValidStatusTransition($task->status, $newStatus)) {
            throw new \Exception("Invalid status transition from {$task->status} to {$newStatus}");
        }

        DB::beginTransaction();
        try {
            $oldStatus = $task->status;
            $task->status = $newStatus;

            // Set timestamps based on status
            $this->setStatusTimestamps($task, $newStatus);

            if ($notes) {
                $task->notes = $notes;
            }

            $task->save();

            // Log audit trail
            $this->logTaskAction($task, "status_changed_to_{$newStatus}", $user, $notes);

            // Handle status-specific logic
            $this->handleStatusChange($task, $oldStatus, $newStatus, $user);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Check enquiry progression based on completed tasks
     */
    private function checkEnquiryProgression(EnquiryDepartmentalTask $completedTask): void
    {
        // Check if all tasks for this enquiry are completed
        $totalTasks = EnquiryDepartmentalTask::where('enquiry_id', $completedTask->enquiry_id)->count();
        $completedTasks = EnquiryDepartmentalTask::where('enquiry_id', $completedTask->enquiry_id)
            ->where('status', 'completed')
            ->count();

        if ($totalTasks > 0 && $totalTasks === $completedTasks) {
            // All enquiry tasks completed - could trigger enquiry status update
            Log::info('All enquiry departmental tasks completed', [
                'enquiry_id' => $completedTask->enquiry_id,
                'total_tasks' => $totalTasks
            ]);
        }
    }

    /**
     * Authorize task access
     */
    private function authorizeTaskAccess(EnquiryDepartmentalTask $task, $user): void
    {
        // Check if user belongs to the task's department
        if ($user->employee && $user->employee->department_id !== $task->department_id) {
            throw new \Exception('Access denied: User does not belong to the required department');
        }
    }

    /**
     * Validate status transition
     */
    private function isValidStatusTransition(string $currentStatus, string $newStatus): bool
    {
        $validTransitions = [
            'pending' => ['in_progress', 'cancelled'],
            'in_progress' => ['completed', 'submitted', 'on_hold'],
            'submitted' => ['approved', 'rejected', 'in_progress'],
            'approved' => ['completed'],
            'rejected' => ['in_progress'],
            'on_hold' => ['in_progress', 'cancelled'],
            'completed' => [], // Terminal state
            'cancelled' => [], // Terminal state
        ];

        return in_array($newStatus, $validTransitions[$currentStatus] ?? []);
    }

    /**
     * Set status timestamps
     */
    private function setStatusTimestamps(EnquiryDepartmentalTask $task, string $status): void
    {
        switch ($status) {
            case 'in_progress':
                if (!$task->started_at) {
                    $task->started_at = now();
                }
                break;
            case 'completed':
                if (!$task->completed_at) {
                    $task->completed_at = now();
                }
                break;
            case 'submitted':
                if (!$task->submitted_at) {
                    $task->submitted_at = now();
                }
                break;
        }
    }

    /**
     * Handle status change logic
     */
    private function handleStatusChange(EnquiryDepartmentalTask $task, string $oldStatus, string $newStatus, $user): void
    {
        switch ($newStatus) {
            case 'completed':
                $this->checkEnquiryProgression($task);
                $this->notifyTaskCompletion($task);
                break;
            case 'submitted':
                $this->notifyTaskSubmission($task);
                break;
            case 'approved':
                $this->notifyTaskApproval($task);
                break;
            case 'rejected':
                $this->notifyTaskRejection($task);
                break;
        }
    }

    /**
     * Log task action for audit trail
     */
    private function logTaskAction(EnquiryDepartmentalTask $task, string $action, $user, string $notes = null): void
    {
        Log::info('Enquiry task action performed', [
            'task_id' => $task->id,
            'enquiry_id' => $task->enquiry_id,
            'action' => $action,
            'user_id' => $user->id,
            'user_name' => $user->name,
            'old_status' => $task->getOriginal('status'),
            'new_status' => $task->status,
            'notes' => $notes,
            'timestamp' => now(),
        ]);
    }

    /**
     * Notification methods
     */
    private function notifyTaskStart(EnquiryDepartmentalTask $task): void
    {
        // Dispatch notification event
        // event(new EnquiryTaskStarted($task));
    }

    private function notifyTaskCompletion(EnquiryDepartmentalTask $task): void
    {
        // event(new EnquiryTaskCompleted($task));
    }

    private function notifyTaskSubmission(EnquiryDepartmentalTask $task): void
    {
        // event(new EnquiryTaskSubmitted($task));
    }

    private function notifyTaskApproval(EnquiryDepartmentalTask $task): void
    {
        // event(new EnquiryTaskApproved($task));
    }

    private function notifyTaskRejection(EnquiryDepartmentalTask $task): void
    {
        // event(new EnquiryTaskRejected($task));
    }
}
