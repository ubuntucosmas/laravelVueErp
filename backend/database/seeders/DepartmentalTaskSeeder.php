<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Modules\Projects\Models\PhaseDepartmentalTask;
use App\Modules\Projects\Models\ProjectPhase;
use App\Modules\HR\Models\Department;
use App\Models\User;
use App\Models\ProjectEnquiry;

class DepartmentalTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some existing data
        $projectPhases = ProjectPhase::all();
        $departments = Department::all();
        $users = User::all();

        // If no project phases exist, create a basic project and phases for testing
        if ($projectPhases->isEmpty()) {
            $this->command->info('No project phases found. Creating basic project and phases for testing.');

            // Create a basic client if needed
            $client = \App\Modules\ClientService\Models\Client::first();
            if (!$client) {
                $client = \App\Modules\ClientService\Models\Client::create([
                    'full_name' => 'Test Client',
                    'email' => 'test@client.com',
                    'phone' => '+254700000000',
                    'address' => 'Test Address',
                    'city' => 'Nairobi',
                    'county' => 'Nairobi',
                    'customer_type' => 'company',
                    'lead_source' => 'test',
                    'preferred_contact' => 'email',
                    'registration_date' => now()->toDateString(),
                ]);
            }

            // Create a basic enquiry
            $enquiry = ProjectEnquiry::create([
                'client_id' => $client->id,
                'title' => 'Test Project Enquiry',
                'description' => 'Test project for departmental tasks',
                'priority' => 'medium',
                'status' => 'enquiry_logged',
                'date_received' => now()->toDateString(),
                'created_by' => 1,
            ]);

            // Create a basic project
            $project = \App\Modules\Projects\Models\Project::create([
                'enquiry_id' => $enquiry->id,
                'title' => 'Test Project',
                'description' => 'Test project for departmental tasks',
                'date_received' => now()->toDateString(),
                'status' => 'initiated',
                'client_id' => $client->id,
                'created_by' => 1,
            ]);

            // Get phases
            $phases = \App\Modules\Projects\Models\Phase::all();
            if ($phases->isEmpty()) {
                $this->command->info('No phases found. Skipping departmental task seeding.');
                return;
            }

            // Create project phases
            foreach ($phases->take(3) as $phase) { // Just create 3 phases for testing
                ProjectPhase::create([
                    'project_id' => $project->id,
                    'phase_id' => $phase->id,
                    'name' => $phase->name,
                    'description' => $phase->description,
                    'order' => $phase->order,
                    'estimated_duration' => $phase->estimated_duration ?? 7,
                    'status' => 'in_progress',
                    'start_date' => now()->toDateString(),
                    'progress_percentage' => 25,
                ]);
            }

            $projectPhases = ProjectPhase::all();
        }

        if ($departments->isEmpty()) {
            $this->command->info('No departments found. Skipping departmental task seeding.');
            return;
        }

        // Sample departmental tasks for different phases
        $tasks = [
            // Procurement Phase Tasks
            [
                'project_phase_id' => $projectPhases->where('name', 'Procurement & Material Sourcing')->first()?->id ?? $projectPhases->first()->id,
                'department_id' => $departments->where('name', 'Procurement')->first()?->id ?? $departments->first()->id,
                'task_name' => 'Material Procurement',
                'task_description' => 'Order all required materials from approved suppliers.',
                'status' => 'pending',
                'priority' => 'high',
                'estimated_hours' => 16.0,
                'due_date' => now()->addDays(3)->toDateString(),
                'order' => 1,
            ],
            [
                'project_phase_id' => $projectPhases->where('name', 'Procurement & Material Sourcing')->first()?->id ?? $projectPhases->first()->id,
                'department_id' => $departments->where('name', 'Procurement')->first()?->id ?? $departments->first()->id,
                'task_name' => 'Supplier Evaluation',
                'task_description' => 'Evaluate and select suppliers based on quality, price, and delivery time.',
                'status' => 'completed',
                'priority' => 'medium',
                'estimated_hours' => 8.0,
                'due_date' => now()->addDays(1)->toDateString(),
                'order' => 2,
            ],

            // Production Phase Tasks
            [
                'project_phase_id' => $projectPhases->where('name', 'Production')->first()?->id ?? $projectPhases->skip(1)->first()?->id ?? $projectPhases->first()->id,
                'department_id' => $departments->where('name', 'Production')->first()?->id ?? $departments->first()->id,
                'task_name' => 'Manufacturing Execution',
                'task_description' => 'Produce items according to specifications and quality standards.',
                'status' => 'in_progress',
                'priority' => 'high',
                'estimated_hours' => 40.0,
                'due_date' => now()->addDays(5)->toDateString(),
                'order' => 1,
            ],
            [
                'project_phase_id' => $projectPhases->where('name', 'Production')->first()?->id ?? $projectPhases->skip(1)->first()?->id ?? $projectPhases->first()->id,
                'department_id' => $departments->where('name', 'Production')->first()?->id ?? $departments->first()->id,
                'task_name' => 'Quality Control',
                'task_description' => 'Perform quality checks on manufactured items.',
                'status' => 'pending',
                'priority' => 'high',
                'estimated_hours' => 12.0,
                'due_date' => now()->addDays(4)->toDateString(),
                'order' => 2,
            ],

            // Logistics Phase Tasks
            [
                'project_phase_id' => $projectPhases->where('name', 'Logistics')->first()?->id ?? $projectPhases->skip(2)->first()?->id ?? $projectPhases->first()->id,
                'department_id' => $departments->where('name', 'Logistics')->first()?->id ?? $departments->first()->id,
                'task_name' => 'Transportation Planning',
                'task_description' => 'Arrange transportation and logistics for project delivery.',
                'status' => 'pending',
                'priority' => 'medium',
                'estimated_hours' => 6.0,
                'due_date' => now()->addDays(7)->toDateString(),
                'order' => 1,
            ],

            // Design Phase Tasks (if design department exists)
            [
                'project_phase_id' => $projectPhases->where('name', 'Design & Concept Development')->first()?->id ?? $projectPhases->first()->id,
                'department_id' => $departments->where('name', 'Design')->first()?->id ?? $departments->where('name', 'Creatives')->first()?->id ?? $departments->first()->id,
                'task_name' => 'Design Concept Creation',
                'task_description' => 'Create initial design concepts for the project.',
                'status' => 'completed',
                'priority' => 'high',
                'estimated_hours' => 24.0,
                'due_date' => now()->addDays(2)->toDateString(),
                'order' => 1,
            ],
            [
                'project_phase_id' => $projectPhases->where('name', 'Design & Concept Development')->first()?->id ?? $projectPhases->first()->id,
                'department_id' => $departments->where('name', 'Design')->first()?->id ?? $departments->where('name', 'Creatives')->first()?->id ?? $departments->first()->id,
                'task_name' => 'Client Design Review',
                'task_description' => 'Present design concepts to client for feedback.',
                'status' => 'in_progress',
                'priority' => 'medium',
                'estimated_hours' => 4.0,
                'due_date' => now()->addDays(1)->toDateString(),
                'order' => 2,
            ],
        ];

        // Assign some tasks to users if users exist
        $assignedUsers = $users->take(3)->pluck('id')->toArray();

        foreach ($tasks as $index => $taskData) {
            // Randomly assign some tasks to users
            if (!empty($assignedUsers) && rand(0, 1)) {
                $taskData['assigned_user_id'] = $assignedUsers[array_rand($assignedUsers)];
            }

            // Set timestamps for completed tasks
            if ($taskData['status'] === 'completed') {
                $taskData['started_at'] = now()->subDays(rand(1, 5));
                $taskData['completed_at'] = now()->subDays(rand(0, 2));
                $taskData['actual_hours'] = $taskData['estimated_hours'] * (0.8 + rand(0, 40) / 100); // 80-120% of estimated
            } elseif ($taskData['status'] === 'in_progress') {
                $taskData['started_at'] = now()->subDays(rand(1, 3));
            }

            PhaseDepartmentalTask::create($taskData);
        }

        $this->command->info('Departmental tasks seeded successfully!');
    }
}
