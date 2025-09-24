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

    // HR Module Routes (require authentication and department access)
    Route::middleware('department.access')->prefix('hr')->group(function () {
        // Employee management
        Route::apiResource('employees', EmployeeController::class);
        // Department management
        Route::apiResource('departments', DepartmentController::class);
    });

    // Admin Module Routes
    Route::prefix('admin')->group(function () {
        // User management
        Route::get('users/available-employees', [UserController::class, 'availableEmployees']);
        Route::apiResource('users', UserController::class);

        // Role and Permission management
        Route::apiResource('roles', RoleController::class);
        Route::apiResource('permissions', PermissionController::class);
    });

    // ClientService Module Routes
    Route::prefix('clientservice')->group(function () {
        // Client management
        Route::get('clients', [ClientController::class, 'index']);
        Route::get('clients/{client}', [ClientController::class, 'show']);
        Route::post('clients', [ClientController::class, 'store']);
        Route::put('clients/{client}', [ClientController::class, 'update']);
        Route::patch('clients/{client}/toggle-status', [ClientController::class, 'toggleStatus']);

        // Enquiry management
        Route::get('enquiries', [ClientServiceEnquiryController::class, 'index']);
        Route::get('enquiries/{enquiry}', [ClientServiceEnquiryController::class, 'show']);
        Route::post('enquiries', [ClientServiceEnquiryController::class, 'store']);
        Route::put('enquiries/{enquiry}', [ClientServiceEnquiryController::class, 'update']);
        Route::delete('enquiries/{enquiry}', [ClientServiceEnquiryController::class, 'destroy']);
    });

    // Projects Module Routes
    // Route::prefix('projects')->group(function () {
    //     // Enquiry management
    //     Route::get('enquiries', [EnquiryController::class, 'index']);
    //     Route::get('enquiries/{enquiry}', [EnquiryController::class, 'show']);
    //     Route::post('enquiries', [EnquiryController::class, 'store']);
    //     Route::put('enquiries/{enquiry}/phases/{phase}', [EnquiryController::class, 'updatePhase']);
    //     Route::post('enquiries/{enquiry}/approve-quote', [EnquiryController::class, 'approveQuote']);
    //     Route::post('enquiries/{enquiry}/convert', [EnquiryController::class, 'convertToProject']);
    // });
});
