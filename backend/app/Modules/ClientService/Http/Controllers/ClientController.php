<?php

namespace App\Modules\ClientService\Http\Controllers;

use App\Modules\ClientService\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ClientController
{
    /**
     * Store a newly created client.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'required|string|max:20',
            'alt_contact' => 'nullable|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'county' => 'required|string|max:255',
            'postal_address' => 'nullable|string|max:255',
            'customer_type' => 'required|in:individual,company,organization',
            'lead_source' => 'required|string|max:255',
            'preferred_contact' => 'required|in:email,phone,sms',
            'industry' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'registration_date' => 'required|date',
            'status' => 'sometimes|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $client = Client::create($request->all());

        return response()->json([
            'message' => 'Client created successfully',
            'data' => $client
        ], 201);
    }
    /**
     * Update the specified client.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'required|email|unique:clients,email,' . $id,
            'phone' => 'required|string|max:20',
            'alt_contact' => 'nullable|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'county' => 'required|string|max:255',
            'postal_address' => 'nullable|string|max:255',
            'customer_type' => 'required|in:individual,company,organization',
            'lead_source' => 'required|string|max:255',
            'preferred_contact' => 'required|in:email,phone,sms',
            'industry' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'registration_date' => 'required|date',
            'status' => 'sometimes|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $client = Client::findOrFail($id);
        $client->update($request->all());

        return response()->json([
            'message' => 'Client updated successfully',
            'data' => $client
        ]);
    }
    /**
     * Display a paginated listing of clients.
     */
    public function index(): JsonResponse
    {
        $clients = Client::paginate(15);

        return response()->json([
            'data' => $clients
        ]);
    }

    /**
     * Display the specified client.
     */
    public function show($id): JsonResponse
    {
        $client = Client::findOrFail($id);

        return response()->json([
            'data' => $client
        ]);
    }

    /**
     * Toggle the active status of the specified client.
     */
    public function toggleStatus($id): JsonResponse
    {
        $client = Client::findOrFail($id);
        $client->is_active = !$client->is_active;
        $client->status = $client->is_active ? 'active' : 'inactive';
        $client->save();

        return response()->json([
            'message' => 'Client status toggled successfully',
            'data' => $client
        ]);
    }
}
