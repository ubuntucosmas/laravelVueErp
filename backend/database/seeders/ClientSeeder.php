<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\ClientService\Models\Client;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'full_name' => 'John Doe Enterprises',
                'email' => 'john.doe@enterprises.com',
                'phone' => '+254700123456',
                'address' => '123 Business Street',
                'city' => 'Nairobi',
                'county' => 'Nairobi',
                'customer_type' => 'company',
                'lead_source' => 'website',
                'preferred_contact' => 'email',
                'registration_date' => now()->subMonths(6)->toDateString(),
            ],
            [
                'full_name' => 'Jane Smith Ltd',
                'email' => 'jane.smith@ltd.com',
                'phone' => '+254711234567',
                'address' => '456 Corporate Avenue',
                'city' => 'Mombasa',
                'county' => 'Mombasa',
                'customer_type' => 'company',
                'lead_source' => 'referral',
                'preferred_contact' => 'phone',
                'registration_date' => now()->subMonths(3)->toDateString(),
            ],
            [
                'full_name' => 'Michael Johnson',
                'email' => 'michael.johnson@email.com',
                'phone' => '+254722345678',
                'address' => '789 Residential Road',
                'city' => 'Kisumu',
                'county' => 'Kisumu',
                'customer_type' => 'individual',
                'lead_source' => 'social_media',
                'preferred_contact' => 'email',
                'registration_date' => now()->subMonths(1)->toDateString(),
            ],
            [
                'full_name' => 'Sarah Wilson Corp',
                'email' => 'sarah.wilson@corp.com',
                'phone' => '+254733456789',
                'address' => '321 Industrial Park',
                'city' => 'Eldoret',
                'county' => 'Uasin Gishu',
                'customer_type' => 'company',
                'lead_source' => 'trade_show',
                'preferred_contact' => 'phone',
                'registration_date' => now()->subMonths(2)->toDateString(),
            ],
            [
                'full_name' => 'David Brown LLC',
                'email' => 'david.brown@llc.com',
                'phone' => '+254744567890',
                'address' => '654 Commercial Plaza',
                'city' => 'Nakuru',
                'county' => 'Nakuru',
                'customer_type' => 'company',
                'lead_source' => 'cold_call',
                'preferred_contact' => 'email',
                'registration_date' => now()->subWeeks(2)->toDateString(),
            ],
        ];

        foreach ($clients as $clientData) {
            Client::create($clientData);
        }
    }
}
