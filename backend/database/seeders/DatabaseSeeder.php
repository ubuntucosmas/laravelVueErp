<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed departments first
        $this->call(DepartmentSeeder::class);

        // Seed project phases
        $this->call(PhaseSeeder::class);

        // Then seed employees
        $this->call(EmployeeSeeder::class);

        // Finally seed roles and permissions
        $this->call(RoleAndPermissionSeeder::class);

        // Seed Creatives department and Designer role
        $this->call([
            CreativesDepartmentSeeder::class,
            DesignerRoleSeeder::class,
        ]);

        // Create a default admin user
        $adminUser = \App\Models\User::factory()->create([
            'name' => 'System Administrator',
            'email' => 'admin@company.com',
            'is_active' => true,
        ]);

        // Assign Super Admin role
        $adminUser->assignRole('Super Admin');

        // Create department-specific users
        $this->call([
            SuperAdminUserSeeder::class,
            AdminUserSeeder::class,
            HRUserSeeder::class,
            ClientServiceUserSeeder::class,
            DesignerUserSeeder::class,
            FinanceRolesSeeder::class,
        ]);

        // Seed projects and project phases
        // $this->call(ProjectsSeeder::class);

        // Seed departmental tasks (after all prerequisites are created)
        $this->call(DepartmentalTaskSeeder::class);
    }
}
