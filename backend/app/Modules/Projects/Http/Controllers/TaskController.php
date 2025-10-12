<?php

namespace App\Modules\Projects\Http\Controllers;

use App\Models\EnquiryDepartmentalTask;
use App\Modules\Projects\Models\EnquiryTask;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Modules\Projects\Services\EnquiryWorkflowService;
use App\Modules\Projects\Services\NotificationService;
use App\Models\TaskAssignmentHistory;
use App\Constants\Permissions;

class TaskController extends Controller
{
    protected EnquiryWorkflowService $workflowService;
    protected NotificationService $notificationService;

    public function __construct(EnquiryWorkflowService $workflowService, NotificationService $notificationService)
    {
        $this->workflowService = $workflowService;
        $this->notificationService = $notificationService;
    }

    /**
     * Get all enquiry tasks across all enquiries
     */
    public function getAllEnquiryTasks(Request $request): JsonResponse
    {
        \Log::info("[DEBUG] getAllEnquiryTasks called, user: " . Auth::id());

        try {
            $query = EnquiryTask::with('enquiry', 'creator', 'assignedTo', 'assignedBy', 'assignmentHistory.assignedTo', 'assignmentHistory.assignedBy');

            // Apply filters if provided
            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }

            if ($request->has('priority') && $request->priority) {
                $query->where('priority', $request->priority);
            }

            if ($request->has('assigned_user_id') && $request->assigned_user_id) {
                $query->where('assigned_to', $request->assigned_user_id);
            }

            if ($request->has('enquiry_id') && $request->enquiry_id) {
                $query->where('project_enquiry_id', $request->enquiry_id);
            }

            // Search functionality
            if ($request->has('search') && $request->search) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'like', "%{$searchTerm}%")
                      ->orWhereHas('enquiry', function ($enquiryQuery) use ($searchTerm) {
                          $enquiryQuery->where('title', 'like', "%{$searchTerm}%");
                      });
                });
            }

            $tasks = $query->orderBy('id')->get(); // Order by ID for consistent ordering

            \Log::info("[DEBUG] getAllEnquiryTasks retrieved " . $tasks->count() . " tasks");

            return response()->json([
                'data' => $tasks,
                'message' => 'All enquiry tasks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error("[DEBUG] getAllEnquiryTasks failed: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve all enquiry tasks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get enquiry tasks for a specific enquiry
     */
    public function getEnquiryTasks(int $enquiryId): JsonResponse
    {
        \Log::info("[DEBUG] getEnquiryTasks called for enquiryId: {$enquiryId}, user: " . Auth::id());

        try {
            $tasks = EnquiryTask::where('project_enquiry_id', $enquiryId)
                ->with('enquiry', 'creator', 'assignedTo', 'assignedBy', 'assignmentHistory.assignedTo', 'assignmentHistory.assignedBy')
                ->orderBy('id') // Order by ID for consistent ordering
                ->get();

            \Log::info("[DEBUG] getEnquiryTasks retrieved " . $tasks->count() . " tasks for enquiry {$enquiryId}");
            foreach ($tasks as $task) {
                \Log::info("[DEBUG] Task {$task->id}: title='{$task->title}', status='{$task->status}', assigned_by=" . ($task->assigned_by ?? 'null') . ", history_count=" . ($task->assignmentHistory ? $task->assignmentHistory->count() : 0));
            }

            return response()->json([
                'data' => $tasks,
                'message' => 'Enquiry tasks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error("[DEBUG] getEnquiryTasks failed for enquiry {$enquiryId}: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve enquiry tasks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get departmental tasks
     */
    public function getDepartmentalTasks(Request $request): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::TASK_READ) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized access to tasks'
            ], 403);
        }

        try {
            $query = EnquiryDepartmentalTask::with('enquiry', 'department', 'assignedUser', 'creator');

            // Filter by enquiry if provided
            if ($request->has('enquiry_id')) {
                $query->where('project_enquiry_id', $request->enquiry_id);
            }

            // Filter by department if provided
            if ($request->has('department_id')) {
                $query->where('department_id', $request->department_id);
            }

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by assigned user if provided
            if ($request->has('assigned_user_id')) {
                $query->where('assigned_user_id', $request->assigned_user_id);
            }

            // Filter tasks by user's department
            $user = Auth::user();
            $query->where('department_id', $user->department_id);

            $tasks = $query->orderBy('created_at', 'desc')->paginate(15);

            return response()->json([
                'data' => $tasks,
                'message' => 'Departmental tasks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve departmental tasks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update task status
     */
    public function updateTaskStatus(Request $request, int $taskId): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::TASK_UPDATE) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized to update tasks'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $task = EnquiryDepartmentalTask::findOrFail($taskId);

            // Check if task belongs to user's department
            $user = Auth::user();
            if ($task->department_id !== $user->department_id) {
                return response()->json([
                    'message' => 'Unauthorized to update tasks in this department'
                ], 403);
            }

            $updatedTask = $this->workflowService->updateTaskStatus($taskId, $request->status, $user->id);

            // Update notes if provided
            if ($request->has('notes')) {
                $task->notes = $request->notes;
                $task->save();
            }

            return response()->json([
                'data' => $updatedTask->load('enquiry', 'department', 'assignedUser'),
                'message' => 'Task status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update task status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign task to user
     */
    public function assignTask(Request $request, int $taskId): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::TASK_ASSIGN) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized to assign tasks'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'assigned_user_id' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $task = EnquiryDepartmentalTask::findOrFail($taskId);

            // Check if task belongs to user's department
            $user = Auth::user();
            if ($task->department_id !== $user->department_id) {
                return response()->json([
                    'message' => 'Unauthorized to assign tasks in this department'
                ], 403);
            }

            $task->update([
                'assigned_user_id' => $request->assigned_user_id,
                'assigned_at' => now(),
                'assigned_by' => $user->id,
            ]);

            return response()->json([
                'data' => $task->load('enquiry', 'department', 'assignedUser'),
                'message' => 'Task assigned successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to assign task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get task details
     */
    public function show(int $taskId): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::TASK_READ) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized access to tasks'
            ], 403);
        }

        try {
            $task = EnquiryDepartmentalTask::with('enquiry', 'department', 'assignedUser', 'creator')
                ->findOrFail($taskId);

            // Check if task belongs to user's department
            $user = Auth::user();
            if ($task->department_id !== $user->department_id) {
                return response()->json([
                    'message' => 'Unauthorized to view tasks in this department'
                ], 403);
            }

            return response()->json([
                'data' => $task,
                'message' => 'Task details retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve task details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update task details
     */
    public function update(Request $request, int $taskId): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::TASK_UPDATE) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized to update tasks'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'task_description' => 'nullable|string',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'estimated_hours' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $task = EnquiryDepartmentalTask::findOrFail($taskId);

            // Check if task belongs to user's department
            $user = Auth::user();
            if ($task->department_id !== $user->department_id) {
                return response()->json([
                    'message' => 'Unauthorized to update tasks in this department'
                ], 403);
            }

            $task->update($request->only([
                'task_description',
                'priority',
                'estimated_hours',
                'due_date',
                'notes',
            ]));

            return response()->json([
                'data' => $task->load('enquiry', 'department', 'assignedUser'),
                'message' => 'Task updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign task to user (for EnquiryTask)
     */
    public function assignEnquiryTask(Request $request, int $taskId): JsonResponse
    {

        // Check permissions - only Project Managers and above can assign tasks
        $user = Auth::user();
        if (!$user->hasPermissionTo(Permissions::TASK_ASSIGN) &&
            !$user->hasRole(['Super Admin', 'Project Manager'])) {
            \Log::warning("[DEBUG] assignEnquiryTask permission denied for user " . Auth::id());
            return response()->json([
                'message' => 'Unauthorized to assign tasks. Only Project Managers can assign tasks.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'assigned_user_id' => 'required|integer|exists:users,id',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'due_date' => 'nullable|date|after:yesterday', // Allow today
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $assignedUser = \App\Models\User::findOrFail($request->assigned_user_id);
            \Log::info("[DEBUG] assignEnquiryTask found assigned user: {$assignedUser->id} ({$assignedUser->name}), department: " . ($assignedUser->department_id ?? 'null'));

            // Additional validation: assigned user must have a department
            if (!$assignedUser->department_id) {
                \Log::warning("[DEBUG] assignEnquiryTask failed: assigned user {$assignedUser->id} has no department");
                return response()->json([
                    'message' => 'Cannot assign task to user without department'
                ], 422);
            }

            $assignmentData = array_filter([
                'priority' => $request->priority,
                'due_date' => $request->due_date ? \Carbon\Carbon::parse($request->due_date) : null,
                'notes' => $request->notes,
            ]);

            \Log::info("[DEBUG] assignEnquiryTask calling workflowService->assignEnquiryTask with data: " . json_encode($assignmentData));

            $task = $this->workflowService->assignEnquiryTask($taskId, $assignedUser->id, $user->id, $assignmentData);

            \Log::info("[DEBUG] assignEnquiryTask workflow service returned task: {$task->id}, status: {$task->status}, assigned_by: " . ($task->assigned_by ?? 'null'));

            // Send notification
            $this->notificationService->sendTaskAssignmentNotification($task, $assignedUser, $user);

            $loadedTask = $task->load('department', 'assignedBy', 'assignedTo', 'assignmentHistory');
            \Log::info("[DEBUG] assignEnquiryTask loaded task with relationships, history count: " . ($loadedTask->assignmentHistory ? $loadedTask->assignmentHistory->count() : 0));

            return response()->json([
                'data' => $loadedTask,
                'message' => 'Task assigned successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error("[DEBUG] assignEnquiryTask failed: " . $e->getMessage() . "\nStack trace: " . $e->getTraceAsString());
            return response()->json([
                'message' => 'Failed to assign task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get task assignment history
     */
    public function getTaskAssignmentHistory(int $taskId): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::TASK_READ) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized access to task history'
            ], 403);
        }

        try {
            $history = TaskAssignmentHistory::where('enquiry_task_id', $taskId)
                ->with('assignedTo', 'assignedBy')
                ->orderBy('assigned_at', 'desc')
                ->get();

            return response()->json([
                'data' => $history,
                'message' => 'Task assignment history retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve task assignment history',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reassign task to a different user
     */
    public function reassignEnquiryTask(Request $request, int $taskId): JsonResponse
    {
        // Check permissions - only Project Managers and above can reassign tasks
        $user = Auth::user();
        if (!$user->hasPermissionTo(Permissions::TASK_ASSIGN) &&
            !$user->hasRole(['Super Admin', 'Project Manager'])) {
            return response()->json([
                'message' => 'Unauthorized to reassign tasks. Only Project Managers can reassign tasks.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'new_assigned_user_id' => 'required|integer|exists:users,id',
            'reason' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $newAssignedUser = \App\Models\User::findOrFail($request->new_assigned_user_id);

            // Additional validation: new assigned user must have a department
            if (!$newAssignedUser->department_id) {
                return response()->json([
                    'message' => 'Cannot reassign task to user without department'
                ], 422);
            }

            $task = $this->workflowService->reassignEnquiryTask(
                $taskId,
                $newAssignedUser->id,
                $user->id,
                $request->reason
            );

            // Send notification to new assignee
            $this->notificationService->sendTaskAssignmentNotification($task, $newAssignedUser, $user);

            return response()->json([
                'data' => $task->load('department', 'assignedBy', 'assignmentHistory'),
                'message' => 'Task reassigned successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to reassign task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update enquiry task details
     */
    public function updateEnquiryTask(Request $request, int $taskId): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::TASK_UPDATE) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized to update tasks'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'due_date' => 'nullable|date|after:yesterday', // Allow today
            'notes' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:pending,in_progress,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $task = EnquiryTask::findOrFail($taskId);

            $oldStatus = $task->status;
            $task->update($request->only([
                'title',
                'priority',
                'due_date',
                'notes',
                'status',
            ]));

            // Send notification if task was marked as completed
            if ($oldStatus !== 'completed' && $request->status === 'completed') {
                $this->notificationService->sendTaskCompletedNotification($task, $user);
            }

            return response()->json([
                'data' => $task->load('assignedBy', 'assignmentHistory'),
                'message' => 'Task updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update task',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
