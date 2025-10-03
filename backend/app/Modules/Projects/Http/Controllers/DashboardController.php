<?php

namespace App\Modules\Projects\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use App\Modules\Projects\Services\ProjectsDashboardService;
use App\Constants\Permissions;

class DashboardController extends Controller
{
    protected ProjectsDashboardService $dashboardService;

    public function __construct(ProjectsDashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Get enquiry metrics for dashboard
     */
    public function enquiryMetrics(Request $request): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::DASHBOARD_PROJECTS) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized access to dashboard metrics'
            ], 403);
        }

        try {
            $metrics = $this->dashboardService->getEnquiryMetrics();

            return response()->json([
                'data' => $metrics,
                'message' => 'Enquiry metrics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve enquiry metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get task metrics for dashboard
     */
    public function taskMetrics(Request $request): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::DASHBOARD_PROJECTS) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized access to dashboard metrics'
            ], 403);
        }

        try {
            $metrics = $this->dashboardService->getTaskMetrics();

            return response()->json([
                'data' => $metrics,
                'message' => 'Task metrics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve task metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get project metrics for dashboard
     */
    public function projectMetrics(Request $request): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::DASHBOARD_PROJECTS) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized access to dashboard metrics'
            ], 403);
        }

        try {
            $metrics = $this->dashboardService->getProjectMetrics();

            return response()->json([
                'data' => $metrics,
                'message' => 'Project metrics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve project metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activities for dashboard
     */
    public function recentActivities(Request $request): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::DASHBOARD_PROJECTS) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized access to dashboard activities'
            ], 403);
        }

        try {
            $limit = $request->get('limit', 10);
            $activities = $this->dashboardService->getRecentActivities($limit);

            return response()->json([
                'data' => $activities,
                'message' => 'Recent activities retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve recent activities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get alerts for dashboard
     */
    public function alerts(Request $request): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::DASHBOARD_PROJECTS) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized access to dashboard alerts'
            ], 403);
        }

        try {
            $alerts = $this->dashboardService->getAlerts();

            return response()->json([
                'data' => $alerts,
                'message' => 'Alerts retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve alerts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get comprehensive dashboard data
     */
    public function dashboard(Request $request): JsonResponse
    {
        // Check permissions
        if (!Auth::user()->hasPermissionTo(Permissions::DASHBOARD_PROJECTS) &&
            !Auth::user()->hasRole(['Super Admin', 'Project Manager', 'Project Officer'])) {
            return response()->json([
                'message' => 'Unauthorized access to dashboard'
            ], 403);
        }

        try {
            $data = [
                'enquiry_metrics' => $this->dashboardService->getEnquiryMetrics(),
                'task_metrics' => $this->dashboardService->getTaskMetrics(),
                'project_metrics' => $this->dashboardService->getProjectMetrics(),
                'recent_activities' => $this->dashboardService->getRecentActivities(10),
                'alerts' => $this->dashboardService->getAlerts(),
            ];

            return response()->json([
                'data' => $data,
                'message' => 'Dashboard data retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
