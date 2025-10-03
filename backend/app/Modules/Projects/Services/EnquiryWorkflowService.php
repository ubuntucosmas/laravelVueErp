<?php

namespace App\Modules\Projects\Services;

use App\Models\ProjectEnquiry;
use App\Models\EnquiryDepartmentalTask;
use App\Models\TaskAssignmentHistory;
use App\Models\User;
use App\Modules\HR\Models\Department;
use App\Modules\Projects\Models\EnquiryTask;
use Illuminate\Support\Facades\Log;

class EnquiryWorkflowService
{
    /**
     * Create workflow tasks for a newly created enquiry (unassigned)
     */
    public function createWorkflowTasksForEnquiry(ProjectEnquiry $enquiry): void
    {
        Log::info("Creating unassigned workflow tasks for enquiry ID: {$enquiry->id}");

        try {
            // Create Site Survey task if not skipped
            if (!$enquiry->site_survey_skipped) {
                EnquiryTask::create([
                    'project_enquiry_id' => $enquiry->id,
                    'title' => 'Site Survey',
                    'type' => 'survey',
                    'status' => 'pending',
                    'priority' => 'medium',
                    'notes' => 'Conduct site survey for the enquiry',
                    'created_by' => $enquiry->created_by,
                ]);

                Log::info("Created unassigned site survey task for enquiry {$enquiry->id}");
            } else {
                // If site survey is skipped, create design task immediately
                EnquiryTask::create([
                    'project_enquiry_id' => $enquiry->id,
                    'title' => 'Design',
                    'type' => 'design',
                    'status' => 'pending',
                    'priority' => 'medium',
                    'notes' => 'Create design concepts and mockups',
                    'created_by' => $enquiry->created_by,
                ]);

                Log::info("Created unassigned design task for enquiry {$enquiry->id} (site survey skipped)");
            }

            Log::info("Successfully created unassigned workflow tasks for enquiry {$enquiry->id}");

        } catch (\Exception $e) {
            Log::error("Failed to create workflow tasks for enquiry {$enquiry->id}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Create project and tasks for an enquiry (when converting to project)
     */
    public function createProjectAndTasksForEnquiry(ProjectEnquiry $enquiry)
    {
        // This would create a full project with all tasks
        // For now, just return the enquiry as project creation logic might be elsewhere
        Log::info("Project creation for enquiry {$enquiry->id} requested but not implemented yet");

        return $enquiry;
    }

    /**
     * Get tasks for an enquiry
     */
    public function getTasksForEnquiry(int $enquiryId)
    {
        return EnquiryDepartmentalTask::where('project_enquiry_id', $enquiryId)
            ->with('department', 'assignedUser')
            ->orderBy('created_at')
            ->get();
    }

    /**
     * Update task status and handle workflow progression
     */
    public function updateTaskStatus(int $taskId, string $status, ?int $userId = null): EnquiryTask
    {
        $task = EnquiryTask::findOrFail($taskId);

        $oldStatus = $task->status;
        $task->status = $status;

        $task->save();

        Log::info("Task {$taskId} status changed from {$oldStatus} to {$status}");

        // Note: Automatic workflow progression is disabled for manual assignment workflow

        return $task;
    }

    /**
     * Handle workflow progression based on task completion (manual assignment required)
     */
    private function handleWorkflowProgression(EnquiryDepartmentalTask $task): void
    {
        $enquiry = ProjectEnquiry::find($task->project_enquiry_id);
        if (!$enquiry) return;

        // Update enquiry status based on completed task
        $this->updateEnquiryStatusBasedOnTask($enquiry, $task);

        // Note: Automatic task creation is disabled. Project managers must manually assign next tasks.
        Log::info("Task {$task->task_name} completed for enquiry {$enquiry->id}. Manual assignment required for next steps.");
    }

    /**
     * Create materials task
     */
    private function createMaterialsTask(int $enquiryId): void
    {
        $enquiry = ProjectEnquiry::find($enquiryId);
        if (!$enquiry) return;

        $procurementDept = Department::where('name', 'procurement')->first();
        if ($procurementDept) {
            EnquiryDepartmentalTask::create([
                'project_enquiry_id' => $enquiryId,
                'department_id' => $procurementDept->id,
                'task_name' => 'Materials',
                'task_description' => 'Specify and source materials for the project',
                'priority' => 'medium',
                'status' => 'pending',
                'created_by' => $enquiry->created_by,
            ]);

            Log::info("Created materials task for enquiry {$enquiryId}");
        }
    }

    /**
     * Create budget task
     */
    private function createBudgetTask(int $enquiryId): void
    {
        $enquiry = ProjectEnquiry::find($enquiryId);
        if (!$enquiry) return;

        $financeDept = Department::where('name', 'finance')->first();
        if ($financeDept) {
            EnquiryDepartmentalTask::create([
                'project_enquiry_id' => $enquiryId,
                'department_id' => $financeDept->id,
                'task_name' => 'Budget',
                'task_description' => 'Create budget for the project',
                'priority' => 'high',
                'status' => 'pending',
                'created_by' => $enquiry->created_by,
            ]);

            Log::info("Created budget task for enquiry {$enquiryId}");
        }
    }

    /**
     * Create design task (for after site survey)
     */
    private function createDesignTask(int $enquiryId): void
    {
        $enquiry = ProjectEnquiry::find($enquiryId);
        if (!$enquiry) return;

        $creativesDept = Department::where('name', 'creatives')->first();
        if ($creativesDept) {
            EnquiryDepartmentalTask::create([
                'project_enquiry_id' => $enquiryId,
                'department_id' => $creativesDept->id,
                'task_name' => 'Design',
                'task_description' => 'Create design concepts and mockups',
                'priority' => 'medium',
                'status' => 'pending',
                'created_by' => $enquiry->created_by,
            ]);

            Log::info("Created design task for enquiry {$enquiryId}");
        }
    }

    /**
     * Create quote task
     */
    private function createQuoteTask(int $enquiryId): void
    {
        $enquiry = ProjectEnquiry::find($enquiryId);
        if (!$enquiry) return;

        $projectsDept = Department::where('name', 'projects')->first();
        if ($projectsDept) {
            EnquiryDepartmentalTask::create([
                'project_enquiry_id' => $enquiryId,
                'department_id' => $projectsDept->id,
                'task_name' => 'Quote',
                'task_description' => 'Prepare final quote for the project',
                'priority' => 'high',
                'status' => 'pending',
                'created_by' => $enquiry->created_by,
            ]);

            Log::info("Created quote task for enquiry {$enquiryId}");
        }
    }

    /**
     * Update enquiry status based on completed task
     */
    private function updateEnquiryStatusBasedOnTask(ProjectEnquiry $enquiry, EnquiryDepartmentalTask $task): void
    {
        if ($task->status !== 'completed') return;

        $newStatus = null;

        switch ($task->task_name) {
            case 'Site Survey':
                $newStatus = 'site_survey_completed';
                break;
            case 'Design':
                $newStatus = 'design_completed';
                break;
            case 'Materials':
                $newStatus = 'materials_specified';
                break;
            case 'Budget':
                $newStatus = 'budget_created';
                break;
            case 'Quote':
                $newStatus = 'quote_prepared';
                break;
        }

        if ($newStatus && $enquiry->status !== $newStatus) {
            $enquiry->status = $newStatus;
            $enquiry->save();
            Log::info("Updated enquiry {$enquiry->id} status to {$newStatus} after completing {$task->task_name} task");
        }
    }

    /**
     * Manually assign an enquiry task to a department and user
     */
    public function assignEnquiryTask(int $taskId, int $assignedUserId, int $assignedByUserId, array $assignmentData = []): EnquiryTask
    {
        Log::info("[DEBUG] EnquiryWorkflowService::assignEnquiryTask starting: taskId={$taskId}, assignedUserId={$assignedUserId}, assignedByUserId={$assignedByUserId}", $assignmentData);

        $task = EnquiryTask::findOrFail($taskId);
        Log::info("[DEBUG] Found task {$taskId}: title='{$task->title}', current status='{$task->status}', assigned_by=" . ($task->assigned_by ?? 'null'));

        $assignedUser = User::findOrFail($assignedUserId);
        $assignedByUser = User::findOrFail($assignedByUserId);
        Log::info("[DEBUG] Found users: assigned={$assignedUser->name} (dept: {$assignedUser->department_id}), assigner={$assignedByUser->name}");

        // Validate assignment rules
        $this->validateTaskAssignment($task, $assignedUser, $assignmentData);

        // Update task with assignment data
        $updateData = [
            'department_id' => $assignedUser->department_id,
            'assigned_by' => $assignedByUserId,
            'assigned_at' => now(),
        ];

        if (isset($assignmentData['priority'])) {
            $updateData['priority'] = $assignmentData['priority'];
        }

        if (isset($assignmentData['due_date'])) {
            $updateData['due_date'] = $assignmentData['due_date'];
        }

        if (isset($assignmentData['notes'])) {
            $updateData['notes'] = $assignmentData['notes'];
        }

        Log::info("[DEBUG] Updating task {$taskId} with data: " . json_encode($updateData));
        $task->update($updateData);

        // Create assignment history
        $history = TaskAssignmentHistory::create([
            'enquiry_task_id' => $task->id,
            'assigned_to' => $assignedUserId,
            'assigned_by' => $assignedByUserId,
            'assigned_at' => now(),
            'notes' => $assignmentData['notes'] ?? null,
        ]);

        Log::info("[DEBUG] Created assignment history entry {$history->id} for task {$taskId}");

        $updatedTask = $task->fresh(); // Get fresh instance
        Log::info("[DEBUG] Task {$taskId} assignment completed. Final state: status='{$updatedTask->status}', assigned_by={$updatedTask->assigned_by}, department_id=" . ($updatedTask->department_id ?? 'null'));

        return $updatedTask;
    }

    /**
     * Validate task assignment rules
     */
    private function validateTaskAssignment(EnquiryTask $task, User $assignedUser, array $assignmentData = []): void
    {
        // Check if task is already assigned to a different department
        if ($task->department_id && $task->department_id !== $assignedUser->department_id) {
            // Allow reassignment but log it
            Log::warning("Reassigning task {$task->id} from department {$task->department_id} to {$assignedUser->department_id}");
        }

        // Check if user belongs to a department
        if (!$assignedUser->department_id) {
            throw new \Exception("Cannot assign task to user without department");
        }

        // Check for duplicate assignments in same department (optional - can be configured)
        $existingTasks = EnquiryTask::where('project_enquiry_id', $task->project_enquiry_id)
            ->where('department_id', $assignedUser->department_id)
            ->where('type', $task->type)
            ->where('id', '!=', $task->id)
            ->count();

        if ($existingTasks > 0) {
            Log::warning("Assigning duplicate task type '{$task->type}' to department {$assignedUser->department_id} for enquiry {$task->project_enquiry_id}");
        }

        // Validate due date if provided
        if (isset($assignmentData['due_date']) && $assignmentData['due_date']) {
            $dueDate = \Carbon\Carbon::parse($assignmentData['due_date']);
            if ($dueDate->isPast()) {
                throw new \Exception("Due date cannot be in the past");
            }
        }
    }

    /**
     * Reassign task to a different user
     */
    public function reassignEnquiryTask(int $taskId, int $newAssignedUserId, int $reassignedByUserId, string $reason = null): EnquiryTask
    {
        $task = EnquiryTask::findOrFail($taskId);
        $newAssignedUser = User::findOrFail($newAssignedUserId);
        $reassignedByUser = User::findOrFail($reassignedByUserId);

        // Validate reassignment
        if (!$task->assigned_by) {
            throw new \Exception("Cannot reassign unassigned task");
        }

        if ($task->assigned_by === $newAssignedUserId) {
            throw new \Exception("Cannot reassign to the same user");
        }

        // Create reassignment history entry
        TaskAssignmentHistory::create([
            'enquiry_task_id' => $task->id,
            'assigned_to' => $newAssignedUserId,
            'assigned_by' => $reassignedByUserId,
            'assigned_at' => now(),
            'notes' => "Reassigned from user {$task->assigned_by}. Reason: {$reason}",
        ]);

        // Update task assignment
        $task->update([
            'department_id' => $newAssignedUser->department_id,
            'assigned_by' => $reassignedByUserId,
            'assigned_at' => now(),
        ]);

        Log::info("Task {$taskId} reassigned from user {$task->assigned_by} to user {$newAssignedUserId} by user {$reassignedByUserId}");

        return $task;
    }

    /**
     * Create a manual enquiry task
     */
    public function createManualEnquiryTask(int $enquiryId, array $taskData, int $createdByUserId): EnquiryTask
    {
        $enquiry = ProjectEnquiry::findOrFail($enquiryId);

        $task = EnquiryTask::create([
            'project_enquiry_id' => $enquiryId,
            'title' => $taskData['title'],
            'type' => $taskData['type'] ?? 'manual',
            'status' => $taskData['status'] ?? 'pending',
            'priority' => $taskData['priority'] ?? 'medium',
            'due_date' => isset($taskData['due_date']) ? \Carbon\Carbon::parse($taskData['due_date']) : null,
            'notes' => $taskData['notes'] ?? null,
            'created_by' => $createdByUserId,
        ]);

        Log::info("Manual enquiry task created for enquiry {$enquiryId}: {$task->title}");

        return $task;
    }

    /**
     * Check and escalate overdue tasks
     */
    public function checkAndEscalateOverdueTasks(): void
    {
        $overdueTasks = EnquiryTask::where('due_date', '<', now())
            ->where('status', '!=', 'completed')
            ->whereNotNull('assigned_by')
            ->get();

        foreach ($overdueTasks as $task) {
            $this->escalateTaskPriority($task);
            $this->sendOverdueNotifications($task);
        }

        Log::info("Checked and escalated {$overdueTasks->count()} overdue tasks");
    }

    /**
     * Escalate task priority based on overdue duration
     */
    private function escalateTaskPriority(EnquiryTask $task): void
    {
        $daysOverdue = $task->due_date->diffInDays(now());
        $currentPriority = $task->priority;

        $newPriority = match(true) {
            $daysOverdue >= 7 => 'urgent',
            $daysOverdue >= 3 => 'high',
            $daysOverdue >= 1 => 'high',
            default => $currentPriority
        };

        if ($newPriority !== $currentPriority) {
            $task->update(['priority' => $newPriority]);
            Log::info("Escalated task {$task->id} priority from {$currentPriority} to {$newPriority} (overdue by {$daysOverdue} days)");
        }
    }

    /**
     * Send overdue notifications
     */
    private function sendOverdueNotifications(EnquiryTask $task): void
    {
        // Send notification to assigned user if exists
        if ($task->assigned_by) {
            $assignedUser = User::find($task->assigned_by);
            if ($assignedUser) {
                app(NotificationService::class)->sendTaskOverdueNotification($task, $assignedUser);
            }
        }

        // Send notification to project manager
        $projectManagerRole = \Spatie\Permission\Models\Role::where('name', 'Project Manager')->first();
        if ($projectManagerRole) {
            $projectManagers = $projectManagerRole->users;
            foreach ($projectManagers as $pm) {
                app(NotificationService::class)->sendTaskOverdueNotification($task, $pm);
            }
        }
    }

    /**
     * Check and send due date reminders
     */
    public function checkAndSendDueDateReminders(): void
    {
        // Tasks due in 1 day
        $tasksDueSoon = EnquiryTask::where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDay())
            ->where('status', '!=', 'completed')
            ->whereNotNull('assigned_by')
            ->get();

        foreach ($tasksDueSoon as $task) {
            $assignedUser = User::find($task->assigned_by);
            if ($assignedUser) {
                app(NotificationService::class)->sendTaskDueSoonNotification($task, $assignedUser);
            }
        }

        Log::info("Sent due date reminders for {$tasksDueSoon->count()} tasks");
    }

    /**
     * Get tasks requiring attention (overdue or due soon)
     */
    public function getTasksRequiringAttention(): \Illuminate\Database\Eloquent\Collection
    {
        return EnquiryTask::where(function ($query) {
            $query->where('due_date', '<', now()) // Overdue
                  ->orWhere('due_date', '<=', now()->addDays(2)); // Due within 2 days
        })
        ->where('status', '!=', 'completed')
        ->with('enquiry', 'department')
        ->orderBy('due_date')
        ->get();
    }
}
