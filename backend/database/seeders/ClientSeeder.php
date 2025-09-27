e<?php

namespace Database\Seeders;

use App\Modules\ClientService\Models\Client;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            [
                'full_name' => 'TechCorp Solutions Inc',
                'company_name' => 'TechCorp Solutions',
                'contact_person' => 'Sarah Johnson',
                'email' => 'contact@techcorp.com',
                'phone' => '+1-555-0101',
                'alt_contact' => '+1-555-0102',
                'address' => '123 Business Ave, Suite 100',
                'city' => 'New York',
                'county' => 'Manhattan',
                'postal_address' => 'PO Box 12345',
                'customer_type' => 'company',
                'lead_source' => 'Website',
                'preferred_contact' => 'email',
                'industry' => 'Technology',
                'registration_date' => Carbon::now()->subDays(60),
                'status' => 'active',
                'is_active' => true,
            ],
            [
                'full_name' => 'RetailMax Chain LLC',
                'company_name' => 'RetailMax Chain',
                'contact_person' => 'Robert Wilson',
                'email' => 'info@retailmax.com',
                'phone' => '+1-555-0102',
                'alt_contact' => '+1-555-0103',
                'address' => '456 Shopping Blvd',
                'city' => 'Los Angeles',
                'county' => 'Los Angeles County',
                'postal_address' => 'PO Box 67890',
                'customer_type' => 'company',
                'lead_source' => 'Referral',
                'preferred_contact' => 'Phone',
                'industry' => 'Retail',
                'registration_date' => Carbon::now()->subDays(45),
                'status' => 'active',
                'is_active' => true,
            ],
            [
                'full_name' => 'Grand Plaza Hotel Group',
                'company_name' => 'Grand Plaza Hotel',
                'contact_person' => 'Maria Garcia',
                'email' => 'events@grandplaza.com',
                'phone' => '+1-555-0104',
                'alt_contact' => '+1-555-0105',
                'address' => '789 Luxury Lane',
                'city' => 'Chicago',
                'county' => 'Cook County',
                'postal_address' => 'PO Box 11111',
                'customer_type' => 'company',
                'lead_source' => 'Direct',
                'preferred_contact' => 'email',
                'industry' => 'Hospitality',
                'registration_date' => Carbon::now()->subDays(30),
                'status' => 'active',
                'is_active' => true,
            ],
            [
                'full_name' => 'Metro Events Incorporated',
                'company_name' => 'Metro Events Inc',
                'contact_person' => 'David Chen',
                'email' => 'planning@metrocvents.com',
                'phone' => '+1-555-0106',
                'alt_contact' => '+1-555-0107',
                'address' => '321 Event Street',
                'city' => 'Miami',
                'county' => 'Miami-Dade County',
                'postal_address' => 'PO Box 22222',
                'customer_type' => 'company',
                'lead_source' => 'Trade Show',
                'preferred_contact' => 'email',
                'industry' => 'Events',
                'registration_date' => Carbon::now()->subDays(15),
                'status' => 'active',
                'is_active' => true,
            ],
            [
                'full_name' => 'FreshBite Restaurant Group',
                'company_name' => 'FreshBite Restaurants',
                'contact_person' => 'Lisa Brown',
                'email' => 'management@freshbite.com',
                'phone' => '+1-555-0108',
                'alt_contact' => '+1-555-0109',
                'address' => '654 Dining Drive',
                'city' => 'Seattle',
                'county' => 'King County',
                'postal_address' => 'PO Box 33333',
                'customer_type' => 'company',
                'lead_source' => 'Website',
                'preferred_contact' => 'phone',
                'industry' => 'Food & Beverage',
                'registration_date' => Carbon::now()->subDays(20),
                'status' => 'active',
                'is_active' => true,
            ],
        ];

        foreach ($clients as $clientData) {
            Client::firstOrCreate(
                ['email' => $clientData['email']],
                $clientData
            );
        }

        $this->command->info('Clients seeded successfully: ' . count($clients));
    }
}
