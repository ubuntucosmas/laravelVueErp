<?php

namespace App\Modules\Projects\Services;

use App\Models\Enquiry;
use App\Models\User;
use App\Modules\Projects\Models\EnquiryDepartmentalTask;
use App\Modules\HR\Models\Department;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EnquiryWorkflowService
{
    /**
     * Create departmental tasks for a new enquiry
     */
    public function createWorkflowTasksForEnquiry(Enquiry $enquiry): void
    {
        DB::beginTransaction();
        try {
            $tasks = $this->getWorkflowTaskDefinitions();

            foreach ($tasks as $taskData) {
                // Get next available user for the department
                $assignedUser = $this->getNextAvailableUserForDepartment($taskData['department_id']);

                Log::info('Creating task', [
                    'task_name' => $taskData['task_name'],
                    'department_id' => $taskData['department_id'],
                    'assigned_user_id' => $assignedUser ? $assignedUser->id : null,
                    'enquiry_id' => $enquiry->id
                ]);

                EnquiryDepartmentalTask::create([
                    'enquiry_id' => $enquiry->id,
                    'department_id' => $taskData['department_id'],
                    'assigned_user_id' => $assignedUser ? $assignedUser->id : null,
                    'task_name' => $taskData['task_name'],
                    'task_description' => $taskData['task_description'],
                    'status' => 'pending',
                    'priority' => $taskData['priority'],
                    'estimated_hours' => $taskData['estimated_hours'],
                    'due_date' => $this->calculateDueDate($enquiry->date_received, $taskData['due_days']),
                    'task_order' => $taskData['order'],
                    'created_by' => $enquiry->created_by,
                ]);

                if ($assignedUser) {
                    Log::info('Task assigned to user', [
                        'task_name' => $taskData['task_name'],
                        'user_id' => $assignedUser->id,
                        'user_name' => $assignedUser->name
                    ]);
                } else {
                    Log::warning('No user available for task assignment', [
                        'task_name' => $taskData['task_name'],
                        'department_id' => $taskData['department_id']
                    ]);
                }
            }

            Log::info('Enquiry workflow tasks created', [
                'enquiry_id' => $enquiry->id,
                'tasks_created' => count($tasks)
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create enquiry workflow tasks', [
                'enquiry_id' => $enquiry->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get the next available user for task assignment in a department using load-balancing
     */
    private function getNextAvailableUserForDepartment(int $departmentId): ?User
    {
        // Get active users in the department
        $users = User::active()->inDepartment($departmentId)->get();

        if ($users->isEmpty()) {
            Log::warning('No active users found in department', ['department_id' => $departmentId]);
            return null;
        }

        // Get task counts for each user (pending and in_progress tasks)
        $userTaskCounts = [];
        foreach ($users as $user) {
            $taskCount = EnquiryDepartmentalTask::where('assigned_user_id', $user->id)
                ->whereIn('status', ['pending', 'in_progress'])
                ->count();
            $userTaskCounts[$user->id] = $taskCount;
        }

        // Find user with minimum task count (load-balancing)
        $minTasks = min($userTaskCounts);
        $availableUsers = array_filter($userTaskCounts, fn($count) => $count === $minTasks);

        // If multiple users have the same min count, pick the first one
        $selectedUserId = array_key_first($availableUsers);

        return $users->find($selectedUserId);
    }

    /**
     * Get workflow task definitions
     */
    private function getWorkflowTaskDefinitions(): array
    {
        // Get department IDs
        $projectsDept = Department::where('name', 'projects')->first();
        $creativesDept = Department::where('name', 'creatives')->first();
        $financeDept = Department::where('name', 'finance')->first();
        $procurementDept = Department::where('name', 'procurement')->first();
        $productionDept = Department::where('name', 'production')->first();

        // Log department finding for debugging
        Log::info('Department lookup results', [
            'projects_found' => $projectsDept ? $projectsDept->id : null,
            'creatives_found' => $creativesDept ? $creativesDept->id : null,
            'finance_found' => $financeDept ? $financeDept->id : null,
            'procurement_found' => $procurementDept ? $procurementDept->id : null,
            'production_found' => $productionDept ? $productionDept->id : null,
        ]);

        // Use projects department as fallback
        $defaultDeptId = $projectsDept ? $projectsDept->id : 1;

        return [
            // Site Survey Phase
            [
                'department_id' => $projectsDept ? $projectsDept->id : $defaultDeptId,
                'task_name' => 'Conduct Site Survey',
                'task_description' => 'Perform on-site assessment and data collection for the project location',
                'priority' => 'high',
                'estimated_hours' => 8,
                'due_days' => 7,
                'order' => 1,
            ],
            // Creatives & Design Phase
            [
                'department_id' => $creativesDept ? $creativesDept->id : $defaultDeptId,
                'task_name' => 'Design Assets and Material Specification',
                'task_description' => 'Create design mockups, renders, artworks, 3D designs and define detailed material requirements and specifications for the project',
                'priority' => 'medium',
                'estimated_hours' => 16,
                'due_days' => 14,
                'order' => 2,
            ],
            // Finance & Costing Phase
            [
                'department_id' => $financeDept ? $financeDept->id : $defaultDeptId,
                'task_name' => 'Budget Generation',
                'task_description' => 'Create comprehensive project budget with cost breakdowns and financial planning',
                'priority' => 'high',
                'estimated_hours' => 10,
                'due_days' => 10,
                'order' => 3,
            ],
            [
                'department_id' => $financeDept ? $financeDept->id : $defaultDeptId,
                'task_name' => 'Quote & Invoice Management',
                'task_description' => 'Prepare client quotes, manage invoicing, and handle payment processing',
                'priority' => 'high',
                'estimated_hours' => 8,
                'due_days' => 14,
                'order' => 4,
            ],
            // Procurement Phase
            [
                'department_id' => $procurementDept ? $procurementDept->id : $defaultDeptId,
                'task_name' => 'Material Requests',
                'task_description' => 'Create and submit material requests based on project specifications and requirements',
                'priority' => 'high',
                'estimated_hours' => 12,
                'due_days' => 21,
                'order' => 5,
            ],
            [
                'department_id' => $procurementDept ? $procurementDept->id : $defaultDeptId,
                'task_name' => 'Purchase Orders',
                'task_description' => 'Generate and process purchase orders for approved materials and services',
                'priority' => 'medium',
                'estimated_hours' => 8,
                'due_days' => 25,
                'order' => 6,
            ],
            // Production Phase
            [
                'department_id' => $productionDept ? $productionDept->id : $defaultDeptId,
                'task_name' => 'Execute Production',
                'task_description' => 'Carry out the production process according to specifications and quality standards',
                'priority' => 'high',
                'estimated_hours' => 40,
                'due_days' => 35,
                'order' => 7,
            ],
            [
                'department_id' => $productionDept ? $productionDept->id : $defaultDeptId,
                'task_name' => 'Quality Control',
                'task_description' => 'Perform quality inspections and ensure all components meet specifications',
                'priority' => 'high',
                'estimated_hours' => 16,
                'due_days' => 38,
                'order' => 8,
            ],
            // Event Setup Phase
            [
                'department_id' => $projectsDept ? $projectsDept->id : $defaultDeptId,
                'task_name' => 'Site Delivery',
                'task_description' => 'Deliver and transport all equipment and materials to the event site',
                'priority' => 'high',
                'estimated_hours' => 20,
                'due_days' => 45,
                'order' => 9,
            ],
            [
                'department_id' => $projectsDept ? $projectsDept->id : $defaultDeptId,
                'task_name' => 'Setup Execution',
                'task_description' => 'Execute the complete setup process including installation and final preparations',
                'priority' => 'high',
                'estimated_hours' => 16,
                'due_days' => 47,
                'order' => 10,
            ],
            // Client Handover Phase
            [
                'department_id' => $projectsDept ? $projectsDept->id : $defaultDeptId,
                'task_name' => 'Final Handover',
                'task_description' => 'Complete the final handover of project deliverables and documentation to the client',
                'priority' => 'high',
                'estimated_hours' => 8,
                'due_days' => 50,
                'order' => 11,
            ],
            [
                'department_id' => $projectsDept ? $projectsDept->id : $defaultDeptId,
                'task_name' => 'Feedback Collection',
                'task_description' => 'Collect client feedback and document any final requirements or adjustments',
                'priority' => 'medium',
                'estimated_hours' => 4,
                'due_days' => 52,
                'order' => 12,
            ],
            // Set Down & Return Phase
            [
                'department_id' => $projectsDept ? $projectsDept->id : $defaultDeptId,
                'task_name' => 'Dismantling',
                'task_description' => 'Carefully dismantle all equipment and materials from the event site',
                'priority' => 'high',
                'estimated_hours' => 12,
                'due_days' => 56,
                'order' => 13,
            ],
            [
                'department_id' => $projectsDept ? $projectsDept->id : $defaultDeptId,
                'task_name' => 'Returns & Storage',
                'task_description' => 'Handle equipment returns to suppliers and organize storage of reusable materials',
                'priority' => 'medium',
                'estimated_hours' => 10,
                'due_days' => 58,
                'order' => 14,
            ],
            // Archival & Reporting Phase
            [
                'department_id' => $projectsDept ? $projectsDept->id : $defaultDeptId,
                'task_name' => 'Close Project',
                'task_description' => 'Complete all project closure activities and finalize project records',
                'priority' => 'medium',
                'estimated_hours' => 8,
                'due_days' => 65,
                'order' => 15,
            ],
            [
                'department_id' => $projectsDept ? $projectsDept->id : $defaultDeptId,
                'task_name' => 'Analytics & Reports',
                'task_description' => 'Generate performance analytics, final reports, and update project metrics',
                'priority' => 'low',
                'estimated_hours' => 12,
                'due_days' => 70,
                'order' => 16,
            ],
        ];
    }

    /**
     * Calculate due date based on enquiry date received
     */
    private function calculateDueDate($dateReceived, int $dueDays): string
    {
        return \Carbon\Carbon::parse($dateReceived)->addDays($dueDays)->toDateString();
    }
}
