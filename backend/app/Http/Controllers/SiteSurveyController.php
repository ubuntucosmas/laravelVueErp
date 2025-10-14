<?php

namespace App\Http\Controllers;

use App\Models\SiteSurvey;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class SiteSurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = SiteSurvey::with('enquiry.client');

        if ($request->has('enquiry_id')) {
            $query->where('enquiry_id', $request->enquiry_id);
        }

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        $siteSurveys = $query->get();

        return response()->json($siteSurveys);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'enquiry_id' => 'required|numeric|exists:project_enquiries,id',
            'project_id' => 'nullable|numeric',
            'site_visit_date' => 'required|date',
            'status' => ['nullable', Rule::in(['pending', 'completed', 'approved', 'rejected'])],
            'project_manager' => 'nullable|string|max:255',
            'other_project_manager' => 'nullable|string|max:255',
            'client_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'attendees' => 'nullable|array',
            'attendees.*' => 'string',
            'client_contact_person' => 'nullable|string|max:255',
            'client_phone' => 'nullable|string|max:20',
            'client_email' => 'nullable|email|max:255',
            'project_description' => 'required|string',
            'objectives' => 'nullable|string',
            'current_condition' => 'nullable|string',
            'existing_branding' => 'nullable|string',
            'access_logistics' => 'nullable|string',
            'parking_availability' => 'nullable|string',
            'size_accessibility' => 'nullable|string',
            'lifts' => 'nullable|string|max:255',
            'door_sizes' => 'nullable|string|max:255',
            'loading_areas' => 'nullable|string',
            'site_measurements' => 'nullable|string',
            'room_size' => 'nullable|string|max:255',
            'constraints' => 'nullable|string',
            'electrical_outlets' => 'nullable|string',
            'food_refreshment' => 'nullable|string',
            'branding_preferences' => 'nullable|string',
            'material_preferences' => 'nullable|string',
            'color_scheme' => 'nullable|string|max:255',
            'brand_guidelines' => 'nullable|string',
            'special_instructions' => 'nullable|string',
            'project_start_date' => 'nullable|date',
            'project_deadline' => 'nullable|date',
            'milestones' => 'nullable|string',
            'safety_conditions' => 'nullable|string',
            'potential_hazards' => 'nullable|string',
            'safety_requirements' => 'nullable|string',
            'additional_notes' => 'nullable|string',
            'special_requests' => 'nullable|string',
            'action_items' => 'nullable|array',
            'action_items.*' => 'string',
            'prepared_by' => 'nullable|string|max:255',
            'prepared_signature' => 'nullable|string',
            'prepared_date' => 'nullable|date',
            'client_approval' => 'nullable|boolean',
            'client_signature' => 'nullable|string',
            'client_approval_date' => 'nullable|date',
        ]);

        $siteSurvey = SiteSurvey::create($validated);

        return response()->json($siteSurvey->load('enquiry.client'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SiteSurvey $siteSurvey): JsonResponse
    {
        return response()->json($siteSurvey->load('enquiry.client'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SiteSurvey $siteSurvey): JsonResponse
    {
        $validated = $request->validate([
            'enquiry_id' => 'sometimes|numeric|exists:project_enquiries,id',
            'project_id' => 'nullable|numeric',
            'site_visit_date' => 'sometimes|date',
            'status' => ['nullable', Rule::in(['pending', 'completed', 'approved', 'rejected'])],
            'project_manager' => 'nullable|string|max:255',
            'other_project_manager' => 'nullable|string|max:255',
            'client_name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'attendees' => 'nullable|array',
            'attendees.*' => 'string',
            'client_contact_person' => 'nullable|string|max:255',
            'client_phone' => 'nullable|string|max:20',
            'client_email' => 'nullable|email|max:255',
            'project_description' => 'sometimes|string',
            'objectives' => 'nullable|string',
            'current_condition' => 'nullable|string',
            'existing_branding' => 'nullable|string',
            'access_logistics' => 'nullable|string',
            'parking_availability' => 'nullable|string',
            'size_accessibility' => 'nullable|string',
            'lifts' => 'nullable|string|max:255',
            'door_sizes' => 'nullable|string|max:255',
            'loading_areas' => 'nullable|string',
            'site_measurements' => 'nullable|string',
            'room_size' => 'nullable|string|max:255',
            'constraints' => 'nullable|string',
            'electrical_outlets' => 'nullable|string',
            'food_refreshment' => 'nullable|string',
            'branding_preferences' => 'nullable|string',
            'material_preferences' => 'nullable|string',
            'color_scheme' => 'nullable|string|max:255',
            'brand_guidelines' => 'nullable|string',
            'special_instructions' => 'nullable|string',
            'project_start_date' => 'nullable|date',
            'project_deadline' => 'nullable|date',
            'milestones' => 'nullable|string',
            'safety_conditions' => 'nullable|string',
            'potential_hazards' => 'nullable|string',
            'safety_requirements' => 'nullable|string',
            'additional_notes' => 'nullable|string',
            'special_requests' => 'nullable|string',
            'action_items' => 'nullable|array',
            'action_items.*' => 'string',
            'prepared_by' => 'nullable|string|max:255',
            'prepared_signature' => 'nullable|string',
            'prepared_date' => 'nullable|date',
            'client_approval' => 'nullable|boolean',
            'client_signature' => 'nullable|string',
            'client_approval_date' => 'nullable|date',
        ]);

        $siteSurvey->update($validated);

        return response()->json($siteSurvey->load('enquiry.client'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SiteSurvey $siteSurvey): JsonResponse
    {
        $siteSurvey->delete();

        return response()->json(['message' => 'Site survey deleted successfully']);
    }
}
