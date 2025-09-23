<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DesignerRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Designer role if it doesn't exist
        $designerRole = Role::firstOrCreate(
            ['name' => 'Designer'],
            [
                'guard_name' => 'web',
                'description' => 'Can access Creatives & Design module to manage designs, mockups, renders, and material lists',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Get or create permissions for the Designer role
        $permissions = [
            // Design permissions
            'design.create',
            'design.read',
            'design.update',
            'design.delete',
            'design.approve',
            'design.reject',

            // Mockup permissions
            'mockup.create',
            'mockup.read',
            'mockup.update',
            'mockup.delete',
            'mockup.approve',
            'mockup.reject',

            // Render permissions
            'render.create',
            'render.read',
            'render.update',
            'render.delete',
            'render.approve',
            'render.reject',

            // Material permissions
            'material.create',
            'material.read',
            'material.update',
            'material.delete',
            'material.approve',
            'material.finalize',

            // Material item permissions
            'material.item.create',
            'material.item.read',
            'material.item.update',
            'material.item.delete',
        ];

        foreach ($permissions as $permissionName) {
            $permission = Permission::firstOrCreate(
                ['name' => $permissionName],
                [
                    'guard_name' => 'web',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // Assign permission to Designer role if not already assigned
            if (!$designerRole->hasPermissionTo($permissionName)) {
                $designerRole->givePermissionTo($permission);
            }
        }
    }
}
