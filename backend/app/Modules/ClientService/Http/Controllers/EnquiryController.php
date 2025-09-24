<?php

namespace App\Modules\ClientService\Http\Controllers;

use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller;

class EnquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Enquiry::with('client');

        // Apply filters
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('project_name', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('client_id') && $request->client_id) {
            $query->where('client_id', $request->client_id);
        }

        $enquiries = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'data' => $enquiries,
            'message' => 'Enquiries retrieved successfully'
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date_received' => 'required|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:date_received',
            'client_name' => 'required|string|max:255',
            'project_name' => 'required|string|max:255',
            'project_deliverables' => 'required|string',
            'contact_person' => 'required|string|max:255',
            'status' => 'required|string|in:client_registered,enquiry_logged,site_survey_completed,design_completed,design_approved,materials_specified,budget_created,quote_prepared,quote_approved,converted_to_project,cancelled',
            'assigned_po' => 'nullable|string|max:255',
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

        // Generate enquiry number
        $enquiryNumber = 'ENQ-' . date('Y') . '-' . str_pad(Enquiry::count() + 1, 4, '0', STR_PAD_LEFT);

        $enquiry = Enquiry::create([
            'date_received' => $request->date_received,
            'expected_delivery_date' => $request->expected_delivery_date,
            'client_name' => $request->client_name,
            'project_name' => $request->project_name,
            'project_deliverables' => $request->project_deliverables,
            'contact_person' => $request->contact_person,
            'status' => $request->status,
            'assigned_po' => $request->assigned_po,
            'follow_up_notes' => $request->follow_up_notes,
            'enquiry_number' => $enquiryNumber,
            'venue' => $request->venue,
            'site_survey_skipped' => $request->site_survey_skipped ?? false,
            'site_survey_skip_reason' => $request->site_survey_skip_reason,
            'created_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Enquiry created successfully',
            'data' => $enquiry->load('client')
        ], 201);
    }

    public function show(Enquiry $enquiry): JsonResponse
    {
        return response()->json([
            'data' => $enquiry->load('client'),
            'message' => 'Enquiry retrieved successfully'
        ]);
    }

    public function update(Request $request, Enquiry $enquiry): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date_received' => 'sometimes|required|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:date_received',
            'client_name' => 'sometimes|required|string|max:255',
            'project_name' => 'sometimes|required|string|max:255',
            'project_deliverables' => 'sometimes|required|string',
            'contact_person' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|string|in:client_registered,enquiry_logged,site_survey_completed,design_completed,design_approved,materials_specified,budget_created,quote_prepared,quote_approved,converted_to_project,cancelled',
            'assigned_po' => 'nullable|string|max:255',
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
            'client_name',
            'project_name',
            'project_deliverables',
            'contact_person',
            'status',
            'assigned_po',
            'follow_up_notes',
            'venue',
            'site_survey_skipped',
            'site_survey_skip_reason',
        ]));

        return response()->json([
            'message' => 'Enquiry updated successfully',
            'data' => $enquiry->load('client')
        ]);
    }

    public function destroy(Enquiry $enquiry): JsonResponse
    {
        $enquiry->delete();

        return response()->json([
            'message' => 'Enquiry deleted successfully'
        ]);
    }
}
