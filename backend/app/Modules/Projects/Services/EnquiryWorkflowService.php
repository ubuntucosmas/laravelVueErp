<?php

namespace App\Modules\Projects\Services;

use App\Models\ProjectEnquiry;
use App\Models\TaskAssignmentHistory;
use App\Models\User;
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

        // Check if tasks already exist for this enquiry to prevent duplication
        $existingTasksCount = EnquiryTask::where('project_enquiry_id', $enquiry->id)->count();
        if ($existingTasksCount > 0) {
            Log::info("Tasks already exist for enquiry {$enquiry->id} ({$existingTasksCount} tasks found). Skipping task creation.");
            return;
        }

        try {
            $taskTemplates = [
                ['title' => 'Site Survey', 'type' => 'survey'],
                ['title' => 'Design & Concept Development', 'type' => 'design'],
                ['title' => 'Material & Cost Listing', 'type' => 'materials'],
                ['title' => 'Budget Creation', 'type' => 'budget'],
                ['title' => 'Quote Preparation', 'type' => 'quote'],
                ['title' => 'Quote Approval', 'type' => 'quote_approval'],
                ['title' => 'Procurement & Inventory Management', 'type' => 'procurement'],
                ['title' => 'Project Conversion', 'type' => 'conversion'],
                ['title' => 'production', 'type' => 'production'],
                ['title' => 'Logistics', 'type' => 'logistics'],
                ['title' => 'Event Setup & Execution', 'type' => 'setup'],
                ['title' => 'Client Handover', 'type' => 'handover'],
                ['title' => 'Set Down & Return', 'type' => 'setdown'],
                ['title' => 'Archival & Reporting', 'type' => 'report'],
            ];

            foreach ($taskTemplates as $template) {
                EnquiryTask::create([
                    'project_enquiry_id' => $enquiry->id,
                    'title' => $template['title'],
                    'type' => $template['type'],
                    'status' => 'pending',
                    'priority' => 'medium',
                    'notes' => $this->getDefaultNotesForTask($template['type']),
                    'created_by' => $enquiry->created_by,
                ]);

                Log::info("Created unassigned {$template['type']} task for enquiry {$enquiry->id}");
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

    /**
     * Get default notes for a task type
     */
    private function getDefaultNotesForTask(string $type): string
    {
        $notes = [
            'survey' => 'Conduct site survey for the enquiry',
            'design' => 'Create design concepts and mockups',
            'materials' => 'Specify and source materials for the project',
            'budget' => 'Create budget for the project',
            'quote' => 'Prepare final quote for the project',
            'quote_approval' => 'Approve the prepared quote',
            'procurement' => 'Manage procurement and inventory',
            'conversion' => 'Convert enquiry to project',
            'production' => 'Handle production activities',
            'logistics' => 'Manage logistics and transportation',
            'setup' => 'Set up event and execute',
            'handover' => 'Hand over to client',
            'setdown' => 'Set down and return equipment',
            'report' => 'Archive and generate reports',
        ];

        return $notes[$type] ?? 'Complete this task';
    }
}
