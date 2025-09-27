# Enquiry Departmental Tasks Design

## Overview

This design introduces enquiry-specific departmental tasks that allow departments to start working on tasks immediately when an enquiry is received, before it's converted to a project. This enables parallel processing and better workflow management.

## Database Schema

### enquiry_departmental_tasks Table

```sql
CREATE TABLE enquiry_departmental_tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    enquiry_id BIGINT UNSIGNED NOT NULL,
    department_id BIGINT UNSIGNED NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    assigned_user_id BIGINT UNSIGNED NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    estimated_hours DECIMAL(8,2) NULL,
    actual_hours DECIMAL(8,2) NULL,
    due_date DATE NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    notes TEXT NULL,
    task_order INT DEFAULT 0,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_enquiry_department (enquiry_id, department_id),
    INDEX idx_status (status),
    INDEX idx_assigned_user (assigned_user_id),
    INDEX idx_due_date (due_date),
    INDEX idx_priority (priority)
);
```

## Model Architecture

### EnquiryDepartmentalTask Model

```php
<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnquiryDepartmentalTask extends Model
{
    protected $fillable = [
        'enquiry_id', 'department_id', 'task_name', 'task_description',
        'status', 'assigned_user_id', 'priority', 'estimated_hours',
        'actual_hours', 'due_date', 'started_at', 'completed_at',
        'notes', 'task_order', 'created_by'
    ];

    protected $casts = [
        'estimated_hours' => 'decimal:2',
        'actual_hours' => 'decimal:2',
        'due_date' => 'date',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function enquiry(): BelongsTo
    {
        return $this->belongsTo(Enquiry::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\HR\Models\Department::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'assigned_user_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    // Scopes
    public function scopePending($query) { return $query->where('status', 'pending'); }
    public function scopeInProgress($query) { return $query->where('status', 'in_progress'); }
    public function scopeCompleted($query) { return $query->where('status', 'completed'); }
    public function scopeByDepartment($query, $departmentId) { return $query->where('department_id', $departmentId); }
    public function scopeByPriority($query, $priority) { return $query->where('priority', $priority); }
    public function scopeOverdue($query) { return $query->where('due_date', '<', now())->where('status', '!=', 'completed'); }
    public function scopeAssignedToUser($query, $userId) { return $query->where('assigned_user_id', $userId); }

    // Methods
    public function markAsInProgress(): bool
    {
        if ($this->status === 'pending') {
            return $this->update(['status' => 'in_progress', 'started_at' => now()]);
        }
        return false;
    }

    public function markAsCompleted($actualHours = null): bool
    {
        if ($this->status === 'in_progress') {
            $updateData = ['status' => 'completed', 'completed_at' => now()];
            if ($actualHours !== null) {
                $updateData['actual_hours'] = $actualHours;
            }
            return $this->update($updateData);
        }
        return false;
    }

    public function isOverdue(): bool
    {
        return $this->due_date && $this->due_date->isPast() && $this->status !== 'completed';
    }

    public function assignToUser($userId): bool
    {
        return $this->update(['assigned_user_id' => $userId]);
    }
}
```

## Service Layer

### EnquiryDepartmentalTaskService

Similar to PhaseDepartmentalTaskService but adapted for enquiries:

```php
<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\Models\EnquiryDepartmentalTask;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EnquiryDepartmentalTaskService
{
    public function claimTask(EnquiryDepartmentalTask $task, $user): bool
    {
        // Similar to PhaseDepartmentalTaskService but for enquiry tasks
        // Check department access, update assignment, log action
    }

    public function startTask(EnquiryDepartmentalTask $task, $user): bool
    {
        // Start task, set timestamps, notify stakeholders
    }

    public function completeTask(EnquiryDepartmentalTask $task, $user): bool
    {
        // Complete task, check enquiry progression, notify
    }

    public function updateTaskStatus(EnquiryDepartmentalTask $task, string $newStatus, $user): bool
    {
        // Validate status transitions, update task, log changes
    }
}
```

## Enquiry to Project Conversion

When an enquiry is converted to a project:

1. **Option A: Migrate Tasks to Project Phases**
   - Create project phases based on enquiry phases
   - Convert enquiry departmental tasks to phase departmental tasks
   - Map tasks to appropriate phases based on department and task type

2. **Option B: Keep Separate but Link**
   - Keep enquiry tasks as historical records
   - Create new phase tasks for the project
   - Link enquiry tasks to project for reference

3. **Option C: Hybrid Approach**
   - Migrate pre-conversion tasks to initial project phases
   - Mark them as completed or in progress
   - Create new tasks for post-conversion work

**Recommended: Option A with migration logic**

```php
// In ProjectService or EnquiryService
public function convertEnquiryToProject($enquiryId, $projectData)
{
    DB::beginTransaction();
    try {
        // Create project
        $project = Project::create(array_merge($projectData, [
            'enquiry_id' => $enquiryId
        ]));

        // Create project phases
        $this->createProjectPhasesFromEnquiry($project, $enquiryId);

        // Migrate enquiry tasks to project phases
        $this->migrateEnquiryTasksToProjectPhases($enquiryId, $project->id);

        // Update enquiry status
        Enquiry::find($enquiryId)->update([
            'converted_to_project_id' => $project->id,
            'status' => 'converted'
        ]);

        DB::commit();
        return $project;
    } catch (\Exception $e) {
        DB::rollBack();
        throw $e;
    }
}

private function migrateEnquiryTasksToProjectPhases($enquiryId, $projectId)
{
    $enquiryTasks = EnquiryDepartmentalTask::where('enquiry_id', $enquiryId)->get();

    foreach ($enquiryTasks as $enquiryTask) {
        // Find appropriate project phase for this department
        $projectPhase = ProjectPhase::where('project_id', $projectId)
            ->where('department_id', $enquiryTask->department_id)
            ->first();

        if ($projectPhase) {
            // Create phase departmental task
            PhaseDepartmentalTask::create([
                'project_phase_id' => $projectPhase->id,
                'department_id' => $enquiryTask->department_id,
                'task_name' => $enquiryTask->task_name,
                'task_description' => $enquiryTask->task_description,
                'status' => $enquiryTask->status,
                'assigned_user_id' => $enquiryTask->assigned_user_id,
                'priority' => $enquiryTask->priority,
                'estimated_hours' => $enquiryTask->estimated_hours,
                'actual_hours' => $enquiryTask->actual_hours,
                'due_date' => $enquiryTask->due_date,
                'started_at' => $enquiryTask->started_at,
                'completed_at' => $enquiryTask->completed_at,
                'notes' => $enquiryTask->notes,
                'order' => $enquiryTask->task_order,
            ]);

            // Mark enquiry task as migrated
            $enquiryTask->update(['status' => 'migrated']);
        }
    }
}
```

## Frontend Integration

### Restructured Frontend: Task-Flow Focused Design

**Core Principle: Simplify and Focus on Task Management**

Remove complex multi-step workflows and consolidate around departmental task execution:

```
📁 frontend/src/modules/projects/
├── 📁 views/ (Simplified Views)
│   ├── EnquiriesManagement.vue (List all enquiries with task status)
│   ├── EnquiryTasks.vue (Main task management - replaces EnquiryWorkflow)
│   ├── ProjectsManagement.vue (List projects)
│   └── ProjectsDepartmentDashboard.vue (Department overview)
│
├── 📁 components/ (Streamlined Components)
│   ├── DepartmentalTaskDashboard.vue (Unified task dashboard)
│   ├── DepartmentalTaskList.vue (Task list with context awareness)
│   ├── DepartmentalTaskCard.vue (Individual task display)
│   ├── DepartmentalTaskModal.vue (Task actions and details)
│   ├── DepartmentalTaskFilters.vue (Context-aware filtering)
│   ├── TaskProgressIndicator.vue (Progress visualization)
│   └── TaskStatusBadge.vue (Status indicators)
│
└── 📁 composables/ (Focused Composables)
    ├── useEnquiryTasks.ts (Enquiry task management)
    ├── useProjectTasks.ts (Project task management)
    └── useTaskActions.ts (Shared task operations)
```

**Key Changes:**

1. **Consolidate EnquiryWorkflow.vue** → **EnquiryTasks.vue**
   - Remove 4-step workflow complexity
   - Focus directly on departmental task execution
   - Integrate task creation and management

2. **Remove Unnecessary Views:**
   - `EnquiryDetailWorkflow.vue` (merge into EnquiryTasks)
   - `SiteSurveysManagement.vue` (integrate as tasks)
   - `ProjectCloseOutReport.vue` (simplify or remove)

3. **Streamline Components:**
   - Keep core task components
   - Remove specialized modals (integrate into TaskModal)
   - Focus on reusable, context-aware components

4. **Task-Flow Navigation:**
   ```
   Enquiries List → Enquiry Tasks → Department Task Actions
   Projects List → Project Tasks → Department Task Actions
   ```

### API Endpoints

```php
// Routes for enquiry tasks
Route::prefix('enquiries/{enquiryId}/departmental-tasks')->group(function () {
    Route::get('/', [EnquiryDepartmentalTaskController::class, 'index']);
    Route::post('/', [EnquiryDepartmentalTaskController::class, 'store']);
    Route::get('/{taskId}', [EnquiryDepartmentalTaskController::class, 'show']);
    Route::put('/{taskId}', [EnquiryDepartmentalTaskController::class, 'update']);
    Route::delete('/{taskId}', [EnquiryDepartmentalTaskController::class, 'destroy']);
    Route::post('/{taskId}/claim', [EnquiryDepartmentalTaskController::class, 'claim']);
    Route::post('/{taskId}/start', [EnquiryDepartmentalTaskController::class, 'start']);
    Route::post('/{taskId}/complete', [EnquiryDepartmentalTaskController::class, 'complete']);
});
```

### Department Dashboard Updates

Update department dashboards to show both project and enquiry tasks using the same component with different contexts:

```vue
<!-- In ProjectsDepartmentDashboard.vue -->
<template>
  <div class="space-y-6">
    <!-- Existing project tasks section -->
    <DepartmentalTaskDashboard
      context="project"
      :context-id="selectedProjectId"
      title="Project Tasks"
    />

    <!-- Enquiry tasks section -->
    <DepartmentalTaskDashboard
      context="enquiry"
      :context-id="selectedEnquiryId"
      title="Enquiry Tasks"
    />
  </div>
</template>
```

**Benefits of Integration:**
- **Code Reuse**: Leverage existing component logic and UI
- **Consistent UX**: Same interaction patterns for both contexts
- **Easier Maintenance**: Single codebase for task management
- **Faster Development**: No need to rebuild similar components

## Benefits

1. **Parallel Processing**: Departments can start work immediately on enquiries
2. **Better Tracking**: Clear visibility of pre-project activities
3. **Seamless Conversion**: Tasks migrate smoothly when enquiry becomes project
4. **Resource Planning**: Better allocation based on enquiry workload
5. **Audit Trail**: Complete history from enquiry to project completion

## Implementation Benefits

**Simplified User Experience:**
- **Direct Task Access**: Users go straight to tasks instead of navigating complex workflows
- **Unified Interface**: Same components handle both enquiry and project tasks
- **Reduced Cognitive Load**: Fewer views and clearer navigation paths

**Improved Maintainability:**
- **Consolidated Codebase**: Fewer specialized components to maintain
- **Reusable Components**: Context-aware components work across different contexts
- **Easier Testing**: Simplified component hierarchy

**Enhanced Task Flow:**
- **Immediate Action**: Tasks can be created and assigned as soon as enquiries are received
- **Parallel Processing**: Multiple departments can work simultaneously
- **Clear Progress Tracking**: Unified progress indicators across contexts

## Implementation Phases

1. **Phase 1**: Database schema and backend models/services ✅
2. **Phase 2**: API endpoints and controllers
3. **Phase 3**: Restructure frontend components (remove unnecessary views)
4. **Phase 4**: Implement EnquiryTasks.vue (consolidated task management)
5. **Phase 5**: Update department dashboards with context-aware components
6. **Phase 6**: Migration logic and testing
7. **Phase 7**: User training and documentation updates

This design provides a robust foundation for enquiry-specific departmental task management while maintaining compatibility with the existing project phase task system.