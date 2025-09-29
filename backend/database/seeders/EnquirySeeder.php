<?php

namespace Database\Seeders;

use App\Models\Enquiry;
use App\Modules\ClientService\Models\Client;
use Illuminate\Database\Seeder;

class EnquirySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing clients
        $clients = Client::all();

        if ($clients->isEmpty()) {
            $this->command->info('No clients found. Creating sample clients first.');

            // Create sample clients
            $client1 = Client::create([
                'full_name' => 'TechCorp Solutions Ltd',
                'email' => 'info@techcorp.com',
                'phone' => '+254700000001',
                'address' => 'Westlands, Nairobi',
                'city' => 'Nairobi',
                'county' => 'Nairobi',
                'customer_type' => 'company',
                'lead_source' => 'website',
                'preferred_contact' => 'email',
                'registration_date' => now()->toDateString(),
            ]);

            $client2 = Client::create([
                'full_name' => 'Green Valley Resort',
                'email' => 'reservations@greenvalley.com',
                'phone' => '+254700000002',
                'address' => 'Limuru Road, Nairobi',
                'city' => 'Nairobi',
                'county' => 'Nairobi',
                'customer_type' => 'company',
                'lead_source' => 'referral',
                'preferred_contact' => 'phone',
                'registration_date' => now()->toDateString(),
            ]);

            $clients = collect([$client1, $client2]);
        }

        // Create sample enquiries
        $enquiries = [
            [
                'client_id' => $clients->first()->id,
                'enquiry_number' => 'ENQ-' . date('Y') . '-001',
                'title' => 'Corporate Event Branding & Signage',
                'description' => 'Complete branding package for TechCorp Solutions annual conference including main stage backdrop, directional signage, and promotional materials.',
                'priority' => 'high',
                'status' => 'enquiry_logged',
                'date_received' => now()->subDays(5)->toDateString(),
                'expected_delivery_date' => now()->addDays(30)->toDateString(),
                'project_scope' => 'Design and production of corporate branding materials for a 500-person conference event.',
                'estimated_budget' => 250000.00,
                'contact_person' => 'Jane Doe',
                'venue' => 'Safari Park Hotel, Nairobi',
                'created_by' => 1, // Assuming admin user
            ],
            [
                'client_id' => $clients->last()->id,
                'enquiry_number' => 'ENQ-' . date('Y') . '-002',
                'title' => 'Resort Welcome Signage & Decor',
                'description' => 'Custom welcome signage and decorative elements for the Green Valley Resort lobby and entrance area.',
                'priority' => 'medium',
                'status' => 'enquiry_logged',
                'date_received' => now()->subDays(3)->toDateString(),
                'expected_delivery_date' => now()->addDays(20)->toDateString(),
                'project_scope' => 'Design and installation of custom signage and decorative elements for resort entrance and lobby.',
                'estimated_budget' => 150000.00,
                'contact_person' => 'Michael Johnson',
                'venue' => 'Green Valley Resort, Limuru',
                'created_by' => 1,
            ],
            [
                'client_id' => $clients->first()->id,
                'enquiry_number' => 'ENQ-' . date('Y') . '-003',
                'title' => 'Product Launch Event Setup',
                'description' => 'Complete event setup for TechCorp new product launch including stage design, lighting, and multimedia displays.',
                'priority' => 'urgent',
                'status' => 'site_survey_completed',
                'date_received' => now()->subDays(7)->toDateString(),
                'expected_delivery_date' => now()->addDays(15)->toDateString(),
                'project_scope' => 'Full event production setup for product launch event at a premium venue.',
                'estimated_budget' => 400000.00,
                'contact_person' => 'Sarah Wilson',
                'venue' => 'InterContinental Hotel, Nairobi',
                'created_by' => 1,
            ],
            [
                'client_id' => $clients->last()->id,
                'enquiry_number' => 'ENQ-' . date('Y') . '-004',
                'title' => 'Seasonal Decor Installation',
                'description' => 'Installation of seasonal decorative elements throughout the resort including holiday lighting and themed displays.',
                'priority' => 'low',
                'status' => 'design_completed',
                'date_received' => now()->subDays(2)->toDateString(),
                'expected_delivery_date' => now()->addDays(45)->toDateString(),
                'project_scope' => 'Seasonal decor installation and maintenance for resort common areas.',
                'estimated_budget' => 80000.00,
                'contact_person' => 'David Brown',
                'venue' => 'Green Valley Resort, Limuru',
                'created_by' => 1,
            ],
            [
                'client_id' => $clients->first()->id,
                'enquiry_number' => 'ENQ-' . date('Y') . '-005',
                'title' => 'Office Reception Redesign',
                'description' => 'Complete redesign of TechCorp office reception area including custom furniture, lighting, and branding elements.',
                'priority' => 'medium',
                'status' => 'quote_prepared',
                'date_received' => now()->subDays(10)->toDateString(),
                'expected_delivery_date' => now()->addDays(60)->toDateString(),
                'project_scope' => 'Office reception area redesign with custom furniture and branding integration.',
                'estimated_budget' => 300000.00,
                'contact_person' => 'Lisa Chen',
                'venue' => 'TechCorp Headquarters, Westlands',
                'created_by' => 1,
            ],
        ];

        foreach ($enquiries as $enquiryData) {
            Enquiry::create($enquiryData);
        }

        $this->command->info('Sample enquiries created successfully!');
        $this->command->info('Created ' . count($enquiries) . ' enquiries for testing.');
    }
}
