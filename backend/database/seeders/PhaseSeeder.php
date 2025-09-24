<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PhaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $phases = [
            [
                'name' => 'client_registration',
                'title' => 'Client Registration',
                'icon' => 'user-plus',
                'summary' => 'Register client information',
                'description' => 'Collect and verify client details',
                'order' => 1,
            ],
            [
                'name' => 'enquiry_logging',
                'title' => 'Enquiry Logging',
                'icon' => 'clipboard-list',
                'summary' => 'Log enquiry details',
                'description' => 'Record enquiry information and requirements',
                'order' => 2,
            ],
            [
                'name' => 'site_survey',
                'title' => 'Site Survey',
                'icon' => 'map-marker-alt',
                'summary' => 'Conduct site survey',
                'description' => 'Visit site and gather necessary information',
                'order' => 3,
            ],
            [
                'name' => 'design',
                'title' => 'Design',
                'icon' => 'palette',
                'summary' => 'Create design concepts',
                'description' => 'Develop and finalize design specifications',
                'order' => 4,
            ],
            [
                'name' => 'materials_specification',
                'title' => 'Materials Specification',
                'icon' => 'cubes',
                'summary' => 'Specify required materials',
                'description' => 'List and specify all materials needed',
                'order' => 5,
            ],
            [
                'name' => 'budgeting',
                'title' => 'Budgeting',
                'icon' => 'calculator',
                'summary' => 'Create project budget',
                'description' => 'Calculate costs and create budget breakdown',
                'order' => 6,
            ],
            [
                'name' => 'quotation',
                'title' => 'Quotation',
                'icon' => 'file-invoice-dollar',
                'summary' => 'Prepare quotation',
                'description' => 'Create and send quotation to client',
                'order' => 7,
            ],
        ];

        foreach ($phases as $phase) {
            \App\Modules\Projects\Models\Phase::create($phase);
        }
    }
}
