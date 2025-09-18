<?php

namespace Database\Seeders;

use App\Modules\HR\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            // Projects Department
            [
                'employee_id' => 'EMP0001',
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@company.com',
                'phone' => '+1234567890',
                'department_id' => 1,
                'position' => 'Project Manager',
                'hire_date' => '2023-01-15',
                'salary' => 75000.00,
                'status' => 'active'
            ],
            [
                'employee_id' => 'EMP0002',
                'first_name' => 'George',
                'last_name' => 'Taylor',
                'email' => 'george.taylor@company.com',
                'phone' => '+1234567891',
                'department_id' => 1,
                'position' => 'Senior Project Coordinator',
                'hire_date' => '2023-03-20',
                'salary' => 65000.00,
                'status' => 'active'
            ],

            // Accounts/Finance Department
            [
                'employee_id' => 'EMP0003',
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane.smith@company.com',
                'phone' => '+1234567892',
                'department_id' => 2,
                'position' => 'Finance Manager',
                'hire_date' => '2022-11-10',
                'salary' => 80000.00,
                'status' => 'active'
            ],

            // Production Department
            [
                'employee_id' => 'EMP0004',
                'first_name' => 'Bob',
                'last_name' => 'Johnson',
                'email' => 'bob.johnson@company.com',
                'phone' => '+1234567893',
                'department_id' => 3,
                'position' => 'Production Supervisor',
                'hire_date' => '2023-02-28',
                'salary' => 60000.00,
                'status' => 'active'
            ],
            [
                'employee_id' => 'EMP0005',
                'first_name' => 'Helen',
                'last_name' => 'White',
                'email' => 'helen.white@company.com',
                'phone' => '+1234567894',
                'department_id' => 3,
                'position' => 'Quality Control Specialist',
                'hire_date' => '2023-06-15',
                'salary' => 55000.00,
                'status' => 'active'
            ],

            // Design/Creatives Department
            [
                'employee_id' => 'EMP0006',
                'first_name' => 'Alice',
                'last_name' => 'Brown',
                'email' => 'alice.brown@company.com',
                'phone' => '+1234567895',
                'department_id' => 4,
                'position' => 'Lead Designer',
                'hire_date' => '2023-04-12',
                'salary' => 70000.00,
                'status' => 'active'
            ],

            // Procurement Department
            [
                'employee_id' => 'EMP0007',
                'first_name' => 'Charlie',
                'last_name' => 'Wilson',
                'email' => 'charlie.wilson@company.com',
                'phone' => '+1234567896',
                'department_id' => 5,
                'position' => 'Procurement Manager',
                'hire_date' => '2023-01-08',
                'salary' => 62000.00,
                'status' => 'active'
            ],

            // Costing Department
            [
                'employee_id' => 'EMP0008',
                'first_name' => 'Diana',
                'last_name' => 'Davis',
                'email' => 'diana.davis@company.com',
                'phone' => '+1234567897',
                'department_id' => 6,
                'position' => 'Cost Analyst',
                'hire_date' => '2023-05-22',
                'salary' => 58000.00,
                'status' => 'active'
            ],

            // Logistics Department
            [
                'employee_id' => 'EMP0009',
                'first_name' => 'Edward',
                'last_name' => 'Miller',
                'email' => 'edward.miller@company.com',
                'phone' => '+1234567898',
                'department_id' => 7,
                'position' => 'Logistics Coordinator',
                'hire_date' => '2023-03-10',
                'salary' => 56000.00,
                'status' => 'active'
            ],

            // Stores Department
            [
                'employee_id' => 'EMP0010',
                'first_name' => 'Fiona',
                'last_name' => 'Garcia',
                'email' => 'fiona.garcia@company.com',
                'phone' => '+1234567899',
                'department_id' => 8,
                'position' => 'Inventory Manager',
                'hire_date' => '2023-07-05',
                'salary' => 52000.00,
                'status' => 'active'
            ]
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}