<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Modules\HR\Models\Department;
use App\Modules\HR\Models\Employee;

class DesignerUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the Creatives department
        $creativesDepartment = Department::where('name', 'Creatives')->first();

        if (!$creativesDepartment) {
            // If Creatives department doesn't exist, create it
            $creativesDepartment = Department::create([
                'name' => 'Creatives',
                'description' => 'Handles enquiry designs, mockups, renders, and material lists for production',
                'is_active' => true,
            ]);
        }

        // Create employee record for designer
        $designerEmployee = Employee::create([
            'employee_id' => 'EMP' . time(), // Generate unique employee ID
            'first_name' => 'John',
            'last_name' => 'Designer',
            'email' => 'designer@company.com',
            'phone' => '+1234567890',
            'hire_date' => now()->subMonths(6),
            'department_id' => $creativesDepartment->id,
            'position' => 'Senior Designer',
            'salary' => 75000,
            'status' => 'active',
            'employment_type' => 'full-time',
        ]);

        // Create user account for designer
        $designerUser = User::create([
            'name' => 'John Designer',
            'email' => 'designer@company.com',
            'password' => bcrypt('password'),
            'employee_id' => $designerEmployee->id,
            'department_id' => $creativesDepartment->id,
            'is_active' => true,
            'email_verified_at' => now(),
            'last_login_at' => null,
        ]);

        // Assign Designer role
        $designerUser->assignRole('Designer');
    }
}
