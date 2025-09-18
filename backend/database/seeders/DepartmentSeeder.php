<?php

namespace Database\Seeders;

use App\Modules\HR\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Projects',
                'description' => 'Project management and coordination across all departments',
                'budget' => 500000.00,
                'location' => 'Main Office'
            ],
            [
                'name' => 'Accounts/Finance',
                'description' => 'Financial management, accounting, and budgeting',
                'budget' => 300000.00,
                'location' => 'Finance Wing'
            ],
            [
                'name' => 'Production',
                'description' => 'Manufacturing, quality control, and production operations',
                'budget' => 800000.00,
                'location' => 'Production Floor'
            ],
            [
                'name' => 'Design/Creatives',
                'description' => 'Creative design, branding, and visual communications',
                'budget' => 200000.00,
                'location' => 'Design Studio'
            ],
            [
                'name' => 'Procurement',
                'description' => 'Supplier management and purchasing operations',
                'budget' => 150000.00,
                'location' => 'Procurement Office'
            ],
            [
                'name' => 'Costing',
                'description' => 'Cost analysis, pricing strategy, and financial planning',
                'budget' => 100000.00,
                'location' => 'Finance Wing'
            ],
            [
                'name' => 'Logistics',
                'description' => 'Transportation, warehousing, and supply chain management',
                'budget' => 250000.00,
                'location' => 'Warehouse'
            ],
            [
                'name' => 'Stores',
                'description' => 'Inventory management and stock control',
                'budget' => 120000.00,
                'location' => 'Warehouse'
            ]
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}