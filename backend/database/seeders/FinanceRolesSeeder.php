<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class FinanceRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Finance roles
        $accountsRole = Role::firstOrCreate(['name' => 'Accounts'], ['description' => 'Financial accounting and invoicing']);
        $accountsRole->givePermissionTo([
            'finance.view', 'finance.create_invoice', 'finance.approve',
            'project.read', 'user.read'
        ]);

        $costingRole = Role::firstOrCreate(['name' => 'Costing'], ['description' => 'Cost analysis and budget management']);
        $costingRole->givePermissionTo([
            'finance.view', 'finance.approve',
            'project.read', 'project.update', 'user.read'
        ]);

        // Create sample users for testing
        $accountsUser = \App\Models\User::firstOrCreate(
            ['email' => 'accounts@example.com'],
            [
                'name' => 'Accounts User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $accountsUser->assignRole('Accounts');

        $costingUser = \App\Models\User::firstOrCreate(
            ['email' => 'costing@example.com'],
            [
                'name' => 'Costing User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $costingUser->assignRole('Costing');
    }
}
