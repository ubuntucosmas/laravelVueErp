<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\HR\Models\Department;

class CreativesDepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Creatives department if it doesn't exist
        Department::firstOrCreate(
            ['name' => 'Creatives'],
            [
                'description' => 'Handles enquiry designs, mockups, renders, and material lists for production',
                'budget' => 100000.00,
                'location' => 'Main Office',
            ]
        );
    }
}
