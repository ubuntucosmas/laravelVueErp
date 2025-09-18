<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Models\User;
use App\Modules\HR\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class UserController
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        // Apply filters
        if ($request->has('department_id') && $request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('role_id') && $request->role_id) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('roles.id', $request->role_id);
            });
        }

        if ($request->has('is_active') && $request->is_active !== null) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('employee', function ($employeeQuery) use ($search) {
                      $employeeQuery->where('first_name', 'like', "%{$search}%")
                                    ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply pagination if requested
        $perPage = $request->get('per_page', 15);
        $users = $query->with(['employee', 'department', 'roles'])->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ]
        ]);
    }

    /**
     * Get list of available employees for user creation.
     */
    public function availableEmployees(Request $request): JsonResponse
    {
        $query = Employee::active()->whereNotIn('id', function ($subQuery) {
            $subQuery->select('employee_id')->from('users')->whereNotNull('employee_id');
        });

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $employees = $query->with('department')->get();

        return response()->json([
            'data' => $employees
        ]);
    }

    /**
     * Store a newly created user from employee.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id|unique:users,employee_id',
            'password' => 'required|string|min:8|confirmed',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get employee data
        $employee = Employee::findOrFail($request->employee_id);

        // Create user
        $user = User::create([
            'name' => $employee->name,
            'email' => $employee->email,
            'password' => Hash::make($request->password),
            'employee_id' => $employee->id,
            'department_id' => $employee->department_id,
            'is_active' => true,
        ]);

        // Assign roles
        $roles = Role::whereIn('id', $request->role_ids)->get();
        $user->syncRoles($roles);

        return response()->json([
            'message' => 'User created successfully',
            'data' => $user->load(['employee', 'department', 'roles'])
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => $user->load(['employee', 'department', 'roles'])
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        try {
            \Log::info('User update request received', [
                'user_id' => $user->id,
                'request_data' => $request->all()
            ]);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
                'password' => 'sometimes|nullable|string|min:8|confirmed',
                'department_id' => 'sometimes|nullable|exists:departments,id',
                'is_active' => 'sometimes|boolean',
                'role_ids' => 'sometimes|array',
                'role_ids.*' => 'exists:roles,id',
            ]);

            if ($validator->fails()) {
                \Log::warning('User update validation failed', [
                    'user_id' => $user->id,
                    'errors' => $validator->errors()
                ]);
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = $request->only(['name', 'email', 'department_id', 'is_active']);
            \Log::info('Update data prepared', ['update_data' => $updateData]);

            // Handle password update if provided
            if ($request->has('password') && !empty($request->password)) {
                $updateData['password'] = Hash::make($request->password);
                \Log::info('Password update included for user ' . $user->id);
            }

            \Log::info('Updating user with data', ['user_id' => $user->id, 'data' => $updateData]);
            $user->update($updateData);

            // Handle role synchronization if role_ids are provided
            if ($request->has('role_ids') && is_array($request->role_ids)) {
                try {
                    $roles = Role::whereIn('id', $request->role_ids)->get();
                    $user->syncRoles($roles);
                    \Log::info('Roles synced for user ' . $user->id, ['role_ids' => $request->role_ids]);
                } catch (\Exception $e) {
                    // Log the error but don't fail the entire update
                    \Log::error('Failed to sync roles for user ' . $user->id . ': ' . $e->getMessage());
                }
            }

            \Log::info('User update completed successfully', ['user_id' => $user->id]);

            return response()->json([
                'message' => 'User updated successfully',
                'data' => $user->load(['employee', 'department', 'roles'])
            ]);

        } catch (\Exception $e) {
            \Log::error('User update failed with exception', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'An error occurred while updating the user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}