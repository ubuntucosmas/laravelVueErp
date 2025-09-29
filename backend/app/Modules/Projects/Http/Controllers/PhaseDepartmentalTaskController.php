<?php

namespace App\Modules\Projects\Http\Controllers;

use App\Models\Enquiry;
use App\Modules\Projects\Models\EnquiryDepartmentalTask;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller;

class PhaseDepartmentalTaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = EnquiryDepartmentalTask::with('enquiry.client', 'department', 'assignedUser');

        // Temporarily allow all access for debugging
        // TODO: Restore proper access control

        // Apply filters
        if ($request->has('enquiry_id') && $request->enquiry_id) {
            $query->where('enquiry_id', $request->enquiry_id);
        }

        if ($request->has('department_id') && $request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('assigned_user_id') && $request->assigned_user_id) {
            $query->where('assigned_user_id', $request->assigned_user_id);
        }

        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }

        $tasks = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'data' => $tasks,
            'message' => 'Departmental tasks retrieved successfully'
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'enquiry_id' => 'required|integer|exists:enquiries,id',
            'department_id' => 'required|integer|exists:departments,id',
            'task_name' => 'required|string|max:255',
            'task_description' => 'nullable|string',
            'priority' => 'nullable|string|in:low,medium,high',
            'estimated_hours' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date|after:today',
            'assigned_user_id' => 'nullable|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if user can access the department
        if (!Auth::user()->canAccessDepartment($request->department_id)) {
            return response()->json([
                'message' => 'Unauthorized to create tasks for this department'
            ], 403);
        }

        $task = EnquiryDepartmentalTask::create([
            'enquiry_id' => $request->enquiry_id,
            'department_id' => $request->department_id,
            'task_name' => $request->task_name,
            'task_description' => $request->task_description,
            'priority' => $request->priority ?? 'medium',
            'estimated_hours' => $request->estimated_hours,
            'due_date' => $request->due_date,
            'assigned_user_id' => $request->assigned_user_id,
            'created_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Departmental task created successfully',
            'data' => $task->load('enquiry.client', 'department', 'assignedUser')
        ], 201);
    }

    public function show(EnquiryDepartmentalTask $task): JsonResponse
    {
        // Check access
        if (!Auth::user()->canAccessDepartment($task->department_id)) {
            return response()->json([
                'message' => 'Unauthorized to view this task'
            ], 403);
        }

        return response()->json([
            'data' => $task->load('enquiry.client', 'department', 'assignedUser', 'creator'),
            'message' => 'Departmental task retrieved successfully'
        ]);
    }

    public function update(Request $request, EnquiryDepartmentalTask $task): JsonResponse
    {
        // Check access
        if (!Auth::user()->canAccessDepartment($task->department_id)) {
            return response()->json([
                'message' => 'Unauthorized to update this task'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'task_name' => 'sometimes|required|string|max:255',
            'task_description' => 'nullable|string',
            'status' => 'sometimes|required|string|in:pending,in_progress,completed,cancelled',
            'priority' => 'sometimes|required|string|in:low,medium,high',
            'estimated_hours' => 'nullable|numeric|min:0',
            'actual_hours' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
            'assigned_user_id' => 'nullable|integer|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only([
            'task_name',
            'task_description',
            'status',
            'priority',
            'estimated_hours',
            'actual_hours',
            'due_date',
            'assigned_user_id',
            'notes',
        ]);

        // Handle status transitions with proper timestamp management
        if (isset($updateData['status']) && $updateData['status'] !== $task->status) {
            if ($updateData['status'] === 'completed' && !$task->completed_at) {
                $updateData['completed_at'] = now();
            } elseif ($updateData['status'] === 'in_progress' && !$task->started_at) {
                $updateData['started_at'] = now();
            }
        }

        $task->update($updateData);

        return response()->json([
            'message' => 'Departmental task updated successfully',
            'data' => $task->load('enquiry.client', 'department', 'assignedUser')
        ]);
    }

    public function destroy(EnquiryDepartmentalTask $task): JsonResponse
    {
        // Check access
        if (!Auth::user()->canAccessDepartment($task->department_id)) {
            return response()->json([
                'message' => 'Unauthorized to delete this task'
            ], 403);
        }

        $task->delete();

        return response()->json([
            'message' => 'Departmental task deleted successfully'
        ]);
    }

    public function performAction(Request $request, EnquiryDepartmentalTask $task): JsonResponse
    {
        // Check access
        if (!Auth::user()->canAccessDepartment($task->department_id)) {
            return response()->json([
                'message' => 'Unauthorized to perform actions on this task'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'action' => 'required|string|in:claim,start,complete,submit',
            'notes' => 'nullable|string',
            'actual_hours' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $action = $request->action;
        $result = ['success' => false, 'task' => $task, 'message' => 'Action not performed'];

        switch ($action) {
            case 'claim':
                if ($task->status === 'pending' && !$task->assigned_user_id) {
                    $task->update(['assigned_user_id' => Auth::id()]);
                    $result = ['success' => true, 'task' => $task, 'message' => 'Task claimed successfully'];
                }
                break;
            case 'start':
                if ($task->assigned_user_id === Auth::id() && $task->status === 'pending') {
                    $task->update(['status' => 'in_progress', 'started_at' => now()]);
                    $result = ['success' => true, 'task' => $task, 'message' => 'Task started successfully'];
                }
                break;
            case 'complete':
                if ($task->assigned_user_id === Auth::id() && $task->status === 'in_progress') {
                    $updateData = ['status' => 'completed', 'completed_at' => now()];
                    if ($request->actual_hours) {
                        $updateData['actual_hours'] = $request->actual_hours;
                    }
                    $task->update($updateData);
                    $result = ['success' => true, 'task' => $task, 'message' => 'Task completed successfully'];
                }
                break;
            case 'submit':
                if ($task->assigned_user_id === Auth::id() && $task->status === 'completed') {
                    $task->update(['submitted_at' => now()]);
                    $result = ['success' => true, 'task' => $task, 'message' => 'Task submitted successfully'];
                }
                break;
        }

        return response()->json($result);
    }

    public function getStats(Request $request): JsonResponse
    {
        $query = EnquiryDepartmentalTask::query();

        // Apply department access control
        $user = Auth::user();
        $accessibleDepartments = $user->getAccessibleDepartments()->pluck('id')->toArray();

        if (!empty($accessibleDepartments)) {
            $query->whereIn('department_id', $accessibleDepartments);
        } else {
            return response()->json([
                'total_tasks' => 0,
                'completed_tasks' => 0,
                'in_progress_tasks' => 0,
                'pending_tasks' => 0,
                'overdue_tasks' => 0,
                'completion_rate' => 0,
                'department_breakdown' => []
            ]);
        }

        if ($request->has('enquiry_id')) {
            $query->where('enquiry_id', $request->enquiry_id);
        }

        $tasks = $query->get();

        $stats = [
            'total_tasks' => $tasks->count(),
            'completed_tasks' => $tasks->where('status', 'completed')->count(),
            'in_progress_tasks' => $tasks->where('status', 'in_progress')->count(),
            'pending_tasks' => $tasks->where('status', 'pending')->count(),
            'overdue_tasks' => $tasks->filter(function ($task) {
                return $task->due_date && $task->due_date->isPast() && $task->status !== 'completed';
            })->count(),
            'completion_rate' => $tasks->count() > 0 ? round(($tasks->where('status', 'completed')->count() / $tasks->count()) * 100, 2) : 0,
            'department_breakdown' => []
        ];

        // Department breakdown
        $departments = $tasks->groupBy('department_id');
        foreach ($departments as $deptId => $deptTasks) {
            $stats['department_breakdown'][] = [
                'department_id' => $deptId,
                'department_name' => $deptTasks->first()->department->name ?? 'Unknown',
                'task_count' => $deptTasks->count(),
                'completed_count' => $deptTasks->where('status', 'completed')->count(),
                'completion_rate' => $deptTasks->count() > 0 ? round(($deptTasks->where('status', 'completed')->count() / $deptTasks->count()) * 100, 2) : 0
            ];
        }

        return response()->json($stats);
    }
}
