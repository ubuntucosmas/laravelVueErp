<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions (only if they don't exist)
        $permissions = [
            // User Management
            'user.create', 'user.read', 'user.update', 'user.delete', 'user.assign_role', 'user.assign_department',

            // Role Management
            'role.create', 'role.read', 'role.update', 'role.delete', 'role.assign_permission',

            // Department Management
            'department.create', 'department.read', 'department.update', 'department.delete',

            // Employee Management (HR)
            'employee.create', 'employee.read', 'employee.update', 'employee.delete',

            // Project Management
            'project.create', 'project.read', 'project.update', 'project.delete', 'project.assign_users',

            // Finance
            'finance.view', 'finance.approve', 'finance.create_invoice',

            // HR
            'hr.view_employees', 'hr.manage_payroll', 'hr.create_position',

            // System Admin
            'admin.access', 'admin.logs_view', 'admin.settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin'], ['description' => 'Full system access']);
        $superAdminRole->givePermissionTo(Permission::all());

        $adminRole = Role::firstOrCreate(['name' => 'Admin'], ['description' => 'Administrative access']);
        $adminRole->givePermissionTo([
            'user.create', 'user.read', 'user.update', 'user.assign_role', 'user.assign_department',
            'role.read', 'department.read', 'department.update',
            'employee.read', 'project.read', 'finance.view', 'hr.view_employees',
            'admin.access'
        ]);

        $hrRole = Role::firstOrCreate(['name' => 'HR'], ['description' => 'Human Resources access']);
        $hrRole->givePermissionTo([
            'employee.create', 'employee.read', 'employee.update', 'employee.delete',
            'user.read', 'user.update', 'department.read',
            'hr.view_employees', 'hr.manage_payroll', 'hr.create_position'
        ]);

        $clientServiceRole = Role::firstOrCreate(['name' => 'Client Service'], ['description' => 'Client acquisition and enquiry management']);
        $clientServiceRole->givePermissionTo([
            'user.read', 'department.read',
            'project.create', 'project.read', 'project.update' // For managing clients and enquiries
        ]);

        $managerRole = Role::firstOrCreate(['name' => 'Manager'], ['description' => 'Department management']);
        $managerRole->givePermissionTo([
            'user.read', 'user.update', 'department.read',
            'employee.read', 'project.read', 'project.update', 'project.assign_users'
        ]);

        $employeeRole = Role::firstOrCreate(['name' => 'Employee'], ['description' => 'Basic employee access']);
        $employeeRole->givePermissionTo([
            'user.read', 'project.read'
        ]);
    }
}
