<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Modules\HR\Http\Controllers\EmployeeController;
use App\Modules\HR\Http\Controllers\DepartmentController;
use App\Modules\Admin\Http\Controllers\UserController;
use App\Modules\Admin\Http\Controllers\RoleController;
use App\Modules\Admin\Http\Controllers\PermissionController;
use App\Modules\ClientService\Http\Controllers\ClientController;
use App\Modules\ClientService\Http\Controllers\EnquiryController as ClientServiceEnquiryController;
use App\Modules\Projects\Http\Controllers\EnquiryController;
use App\Modules\Projects\Http\Controllers\ProjectController;
use App\Modules\Projects\Http\Controllers\PhaseDepartmentalTaskController;
use App\Http\Controllers\SiteSurveyController;
use App\Constants\Permissions;

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', function () {
    $user = auth()->user();
    return response()->json($user->load('roles'));
})->middleware('auth:sanctum');

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {

    // User permissions and navigation
    Route::get('/user/permissions', function () {
        return response()->json([
            'permissions' => auth()->user()->getNavigationPermissions(),
            'roles' => auth()->user()->roles->pluck('name'),
            'departments' => auth()->user()->getAccessibleDepartments()
        ]);
    });

    // HR Module Routes
    Route::prefix('hr')->group(function () {
        // Employee management
        Route::apiResource('employees', EmployeeController::class)->middleware([
            'index' => 'permission:' . Permissions::EMPLOYEE_READ,
            'store' => 'permission:' . Permissions::EMPLOYEE_CREATE,
            'show' => 'permission:' . Permissions::EMPLOYEE_READ,
            'update' => 'permission:' . Permissions::EMPLOYEE_UPDATE,
            'destroy' => 'permission:' . Permissions::EMPLOYEE_DELETE,
        ]);
        // Department management
        Route::get('departments', [DepartmentController::class, 'index'])
            ->middleware('permission:' . Permissions::DEPARTMENT_READ);
        Route::post('departments', [DepartmentController::class, 'store'])
            ->middleware('permission:' . Permissions::DEPARTMENT_CREATE);
        Route::get('departments/{department}', [DepartmentController::class, 'show'])
            ->middleware('permission:' . Permissions::DEPARTMENT_READ);
        Route::put('departments/{department}', [DepartmentController::class, 'update'])
            ->middleware('permission:' . Permissions::DEPARTMENT_UPDATE);
        Route::patch('departments/{department}', [DepartmentController::class, 'update'])
            ->middleware('permission:' . Permissions::DEPARTMENT_UPDATE);
        Route::delete('departments/{department}', [DepartmentController::class, 'destroy'])
            ->middleware('permission:' . Permissions::DEPARTMENT_DELETE);
    });

    // Admin Module Routes
    Route::prefix('admin')->middleware(['permission:' . Permissions::ADMIN_ACCESS])->group(function () {
        // User management
        Route::get('users/available-employees', [UserController::class, 'availableEmployees'])
            ->middleware('permission:' . Permissions::USER_READ);
        Route::apiResource('users', UserController::class)->parameters([
            'users' => 'user'
        ])->middleware([
            'index' => 'permission:' . Permissions::USER_READ,
            'store' => 'permission:' . Permissions::USER_CREATE,
            'show' => 'permission:' . Permissions::USER_READ,
            'update' => 'permission:' . Permissions::USER_UPDATE,
            'destroy' => 'permission:' . Permissions::USER_DELETE,
        ]);

        // Role and Permission management
        Route::apiResource('roles', RoleController::class)->middleware([
            'index' => 'permission:' . Permissions::ROLE_READ,
            'store' => 'permission:' . Permissions::ROLE_CREATE,
            'show' => 'permission:' . Permissions::ROLE_READ,
            'update' => 'permission:' . Permissions::ROLE_UPDATE,
            'destroy' => 'permission:' . Permissions::ROLE_DELETE,
        ]);
        Route::apiResource('permissions', PermissionController::class)->middleware([
            'index' => 'permission:' . Permissions::ROLE_READ, // Admin can view permissions
        ]);
    });

    // Project Officers endpoint (accessible by Client Service for enquiry assignment)
    Route::get('project-officers', [UserController::class, 'getProjectOfficers'])
        ->middleware('permission:' . Permissions::ENQUIRY_UPDATE);

    // ClientService Module Routes
    Route::prefix('clientservice')->group(function () {
        // Client management
        Route::get('clients', [ClientController::class, 'index'])
            ->middleware('permission:' . Permissions::CLIENT_READ);
        Route::get('clients/{client}', [ClientController::class, 'show'])
            ->middleware('permission:' . Permissions::CLIENT_READ);
        Route::post('clients', [ClientController::class, 'store'])
            ->middleware('permission:' . Permissions::CLIENT_CREATE);
        Route::put('clients/{client}', [ClientController::class, 'update'])
            ->middleware('permission:' . Permissions::CLIENT_UPDATE);
        Route::patch('clients/{client}/toggle-status', [ClientController::class, 'toggleStatus'])
            ->middleware('permission:' . Permissions::CLIENT_UPDATE);

        // Enquiry management
        Route::get('enquiries', [ClientServiceEnquiryController::class, 'index'])
            ->middleware('permission:' . Permissions::ENQUIRY_READ);
        Route::get('enquiries/{enquiry}', [ClientServiceEnquiryController::class, 'show'])
            ->middleware('permission:' . Permissions::ENQUIRY_READ);
        Route::post('enquiries', [ClientServiceEnquiryController::class, 'store'])
            ->middleware('permission:' . Permissions::ENQUIRY_CREATE);
        Route::put('enquiries/{enquiry}', [ClientServiceEnquiryController::class, 'update'])
            ->middleware('permission:' . Permissions::ENQUIRY_UPDATE);
        Route::delete('enquiries/{enquiry}', [ClientServiceEnquiryController::class, 'destroy'])
            ->middleware('permission:' . Permissions::ENQUIRY_DELETE);
    });

    // Projects Module Routes
    Route::prefix('projects')->group(function () {
        // Enquiry management
        Route::get('enquiries', [EnquiryController::class, 'index'])
            ->middleware('permission:' . Permissions::ENQUIRY_READ);
        Route::get('enquiries/{enquiry}', [EnquiryController::class, 'show'])
            ->middleware('permission:' . Permissions::ENQUIRY_READ);
        Route::post('enquiries', [EnquiryController::class, 'store'])
            ->middleware('permission:' . Permissions::ENQUIRY_CREATE);
        Route::put('enquiries/{enquiry}', [EnquiryController::class, 'update'])
            ->middleware('permission:' . Permissions::ENQUIRY_UPDATE);
        Route::put('enquiries/{enquiry}/phases/{phase}', [EnquiryController::class, 'updatePhase'])
            ->middleware('permission:' . Permissions::ENQUIRY_UPDATE);
        Route::post('enquiries/{enquiry}/approve-quote', [EnquiryController::class, 'approveQuote'])
            ->middleware('permission:' . Permissions::ENQUIRY_UPDATE);
        Route::post('enquiries/{enquiry}/convert', [EnquiryController::class, 'convertToProject'])
            ->middleware('permission:' . Permissions::ENQUIRY_CONVERT);

        // Departmental tasks management - temporarily outside auth for debugging
    });

    // Temporarily outside auth for debugging departmental tasks
    Route::get('projects/departmental-tasks', [PhaseDepartmentalTaskController::class, 'index']);
    Route::prefix('projects')->middleware('auth:sanctum')->group(function () {
        Route::post('departmental-tasks', [PhaseDepartmentalTaskController::class, 'store']); // No permission for debugging
        Route::get('departmental-tasks/{task}', [PhaseDepartmentalTaskController::class, 'show']); // No permission for debugging
        Route::put('departmental-tasks/{task}', [PhaseDepartmentalTaskController::class, 'update']); // No permission for debugging
        Route::delete('departmental-tasks/{task}', [PhaseDepartmentalTaskController::class, 'destroy']); // No permission for debugging
        Route::post('departmental-tasks/{task}/action', [PhaseDepartmentalTaskController::class, 'performAction']); // No permission for debugging
        Route::get('departmental-tasks-stats', [PhaseDepartmentalTaskController::class, 'getStats']); // No permission for debugging
        Route::post('departmental-tasks/{task}/action', [PhaseDepartmentalTaskController::class, 'performAction'])
            ->middleware('permission:' . Permissions::TASK_UPDATE);
        Route::get('departmental-tasks-stats', [PhaseDepartmentalTaskController::class, 'getStats'])
            ->middleware('permission:' . Permissions::TASK_READ);

        // Site survey management
        Route::apiResource('site-surveys', SiteSurveyController::class); // Temporarily remove permissions for debugging

        // Project workflow management
        Route::get('{project}/workflow-status', [ProjectController::class, 'getWorkflowStatus'])
            ->middleware('permission:' . Permissions::PROJECT_READ);
        Route::post('{project}/phases/{phaseId}/tasks/{taskId}/claim', [ProjectController::class, 'claimTask'])
            ->middleware('permission:' . Permissions::TASK_UPDATE);
        Route::post('{project}/phases/{phaseId}/tasks/{taskId}/start', [ProjectController::class, 'startTask'])
            ->middleware('permission:' . Permissions::TASK_UPDATE);
        Route::post('{project}/phases/{phaseId}/tasks/{taskId}/complete', [ProjectController::class, 'completeTask'])
            ->middleware('permission:' . Permissions::TASK_COMPLETE);
        Route::post('{project}/phases/{phaseId}/tasks/{taskId}/submit', [ProjectController::class, 'submitTask'])
            ->middleware('permission:' . Permissions::TASK_UPDATE);
        Route::put('{project}/phases/{phaseId}/tasks/{taskId}/status', [ProjectController::class, 'updateTaskStatus'])
            ->middleware('permission:' . Permissions::TASK_UPDATE);
    });
});
