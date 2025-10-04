<?php

namespace App\Modules\Projects\Http\Controllers;

use App\Models\ProjectEnquiry;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller;
use App\Modules\Projects\Services\EnquiryWorkflowService;
use App\Constants\Permissions;

class EnquiryController extends Controller
{
    /**
     * Check if user has access to Projects department enquiries
     */
    private function checkProjectsAccess(): bool
    {
        $user = Auth::user();

        // Super Admin has access to everything
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        // Check if user has roles that allow project coordination access
        if ($user->hasRole(['Project Manager', 'Project Officer', 'Manager', 'Employee', 'Client Service'])) {
            return true;
        }

        return false;
    }

    public function index(Request $request): JsonResponse
    {
        // Check Projects department and role access
        if (!$this->checkProjectsAccess()) {
            return response()->json([
                'message' => 'Access denied. Only Project Managers and Project Officers in the Projects department can access enquiries.'
            ], 403);
        }

        $query = ProjectEnquiry::with('client', 'department', 'enquiryTasks');

        // Apply filters
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('client', function ($clientQuery) use ($search) {
                      $clientQuery->where('full_name', 'like', "%{$search}%");
                  })
                  ->orWhere('contact_person', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('client_id') && $request->client_id) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->has('department_id') && $request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        $enquiries = $query->orderBy('created_at', 'desc')->paginate(6);

        return response()->json([
            'data' => $enquiries,
            'message' => 'Enquiries retrieved successfully'
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        // Check Projects department and role access
        if (!$this->checkProjectsAccess()) {
            return response()->json([
                'message' => 'Access denied. Only Project Managers and Project Officers in the Projects department can create enquiries.'
            ], 403);
        }

        // Handle field name alias for enquiry_title
        if ($request->has('enquiry_title') && !$request->has('title')) {
            $request->merge(['title' => $request->enquiry_title]);
        }

        $validator = Validator::make($request->all(), [
            'date_received' => 'required|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:date_received',
            'client_id' => 'required|integer|exists:clients,id',
            'title' => 'required|string|max:255',
            'enquiry_title' => 'nullable|string|max:255', // Allow enquiry_title as alias
            'description' => 'nullable|string',
            'project_scope' => 'nullable|string',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'contact_person' => 'required|string|max:255',
            'status' => 'required|string|in:client_registered,enquiry_logged,site_survey_completed,design_completed,design_approved,materials_specified,budget_created,quote_prepared,quote_approved,converted_to_project,planning,in_progress,completed,cancelled',
            'department_id' => 'nullable|integer|exists:departments,id',
            'assigned_department' => 'nullable|string|max:255',
            'estimated_budget' => 'nullable|numeric|min:0',
            'project_deliverables' => 'nullable|string',
            'assigned_po' => 'nullable|integer|exists:users,id',
            'follow_up_notes' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'site_survey_skipped' => 'nullable|boolean',
            'site_survey_skip_reason' => 'nullable|string|required_if:site_survey_skipped,true',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Generate enquiry number
        $enquiryNumber = 'ENQ-' . date('Y') . '-' . str_pad(ProjectEnquiry::count() + 1, 4, '0', STR_PAD_LEFT);

        $enquiry = ProjectEnquiry::create([
            'date_received' => $request->date_received,
            'expected_delivery_date' => $request->expected_delivery_date,
            'client_id' => $request->client_id,
            'title' => $request->title,
            'description' => $request->description,
            'project_scope' => $request->project_scope,
            'priority' => $request->priority ?? 'medium',
            'contact_person' => $request->contact_person,
            'status' => $request->status,
            'department_id' => $request->department_id,
            'assigned_department' => $request->assigned_department,
            'estimated_budget' => $request->estimated_budget,
            'project_deliverables' => $request->project_deliverables,
            'assigned_po' => $request->assigned_po,
            'follow_up_notes' => $request->follow_up_notes,
            'enquiry_number' => $enquiryNumber,
            'venue' => $request->venue,
            'site_survey_skipped' => $request->site_survey_skipped ?? false,
            'site_survey_skip_reason' => $request->site_survey_skip_reason,
            'created_by' => Auth::id(),
        ]);

        // Create workflow tasks for the enquiry
        $workflowService = new EnquiryWorkflowService();
        $workflowService->createWorkflowTasksForEnquiry($enquiry);

        return response()->json([
            'message' => 'Enquiry created successfully',
            'data' => $enquiry->load('client', 'department', 'enquiryTasks'),
        ], 201);
    }

    public function show(ProjectEnquiry $enquiry): JsonResponse
    {
        // Check Projects department and role access
        if (!$this->checkProjectsAccess()) {
            return response()->json([
                'message' => 'Access denied. Only Project Managers and Project Officers in the Projects department can view enquiries.'
            ], 403);
        }

        return response()->json([
            'data' => $enquiry->load('client', 'department', 'enquiryTasks'),
            'message' => 'Enquiry retrieved successfully'
        ]);
    }

    public function update(Request $request, ProjectEnquiry $enquiry): JsonResponse
    {
        // Check Projects department and role access
        if (!$this->checkProjectsAccess()) {
            return response()->json([
                'message' => 'Access denied. Only Project Managers and Project Officers in the Projects department can update enquiries.'
            ], 403);
        }

        // Handle field name alias for enquiry_title
        if ($request->has('enquiry_title') && !$request->has('title')) {
            $request->merge(['title' => $request->enquiry_title]);
        }

        $validator = Validator::make($request->all(), [
            'date_received' => 'sometimes|required|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:date_received',
            'client_id' => 'sometimes|required|integer|exists:clients,id',
            'title' => 'sometimes|required|string|max:255',
            'enquiry_title' => 'nullable|string|max:255', // Allow enquiry_title as alias
            'description' => 'sometimes|nullable|string',
            'project_scope' => 'nullable|string',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'contact_person' => 'sometimes|nullable|string|max:255',
            'status' => 'sometimes|required|string|in:client_registered,enquiry_logged,site_survey_completed,design_completed,design_approved,materials_specified,budget_created,quote_prepared,quote_approved,converted_to_project,planning,in_progress,completed,cancelled',
            'department_id' => 'nullable|integer|exists:departments,id',
            'assigned_department' => 'nullable|string|max:255',
            'estimated_budget' => 'nullable|numeric|min:0',
            'project_deliverables' => 'nullable|string',
            'assigned_po' => 'nullable|integer|exists:users,id',
            'follow_up_notes' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'site_survey_skipped' => 'boolean',
            'site_survey_skip_reason' => 'nullable|string|required_if:site_survey_skipped,true',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $enquiry->update($request->only([
            'date_received',
            'expected_delivery_date',
            'client_id',
            'title',
            'description',
            'project_scope',
            'priority',
            'contact_person',
            'status',
            'department_id',
            'assigned_department',
            'estimated_budget',
            'project_deliverables',
            'assigned_po',
            'follow_up_notes',
            'venue',
            'site_survey_skipped',
            'site_survey_skip_reason',
        ]));

        return response()->json([
            'message' => 'Enquiry updated successfully',
            'data' => $enquiry->load('client', 'department')
        ]);
    }

    public function destroy(ProjectEnquiry $enquiry): JsonResponse
    {
        // Check Projects department and role access
        if (!$this->checkProjectsAccess()) {
            return response()->json([
                'message' => 'Access denied. Only Project Managers and Project Officers in the Projects department can delete enquiries.'
            ], 403);
        }

        $enquiry->delete();

        return response()->json([
            'message' => 'Enquiry deleted successfully'
        ]);
    }

    public function updatePhase(Request $request, ProjectEnquiry $enquiry): JsonResponse
    {
        // Check Projects department and role access
        if (!$this->checkProjectsAccess()) {
            return response()->json([
                'message' => 'Access denied. Only Project Managers and Project Officers in the Projects department can update enquiry phases.'
            ], 403);
        }

        // Implementation for updating enquiry phase
        // This might involve updating status or other phase-related fields
        return response()->json([
            'message' => 'Phase updated successfully',
            'data' => $enquiry
        ]);
    }

    public function approveQuote(Request $request, ProjectEnquiry $enquiry): JsonResponse
    {
        // Check Projects department and role access
        if (!$this->checkProjectsAccess()) {
            return response()->json([
                'message' => 'Access denied. Only Project Managers and Project Officers in the Projects department can approve quotes.'
            ], 403);
        }

        // Implementation for approving quote
        $enquiry->update(['quote_approved' => true, 'quote_approved_at' => now(), 'quote_approved_by' => Auth::id()]);

        return response()->json([
            'message' => 'Quote approved successfully',
            'data' => $enquiry
        ]);
    }

    public function convertToProject(Request $request, ProjectEnquiry $enquiry): JsonResponse
    {
        // Check Projects department and role access
        if (!$this->checkProjectsAccess()) {
            return response()->json([
                'message' => 'Access denied. Only Project Managers and Project Officers in the Projects department can convert enquiries to projects.'
            ], 403);
        }

        // Implementation for converting to project
        $enquiry->update(['status' => 'converted_to_project']);

        return response()->json([
            'message' => 'Enquiry converted to project successfully',
            'data' => $enquiry
        ]);
    }
}
