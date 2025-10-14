<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\HR\Models\Department;

class EnquiryTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_enquiry_id',
        'department_id',
        'title',
        'type',
        'status',
        'priority',
        'due_date',
        'assigned_at',
        'assigned_by',
        'assigned_to',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'status' => 'string',
        'priority' => 'string',
        'due_date' => 'datetime',
        'assigned_at' => 'datetime',
    ];

    // Task type to department mapping
    const TASK_TYPE_DEPARTMENT_MAPPING = [
        'survey' => 'Client Service',
        'design' => 'Design/Creatives',
        'materials' => 'Procurement',
        'budget' => 'Accounts/Finance',
        'quote' => 'Costing',
        'production' => 'Production',
        'logistics' => 'Logistics',
        'stores' => 'Stores',
        'project_management' => 'Projects',
    ];

    // Relationships
    public function enquiry(): BelongsTo
    {
        return $this->belongsTo(\App\Models\ProjectEnquiry::class, 'project_enquiry_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'assigned_by');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'assigned_to');
    }

    public function assignmentHistory()
    {
        return $this->hasMany(\App\Models\TaskAssignmentHistory::class, 'enquiry_task_id');
    }

    // Helper method to get department for task type
    public function getMappedDepartment()
    {
        $departmentName = self::TASK_TYPE_DEPARTMENT_MAPPING[$this->type] ?? null;
        if ($departmentName) {
            return Department::where('name', $departmentName)->first();
        }
        return null;
    }

    // Scope to filter by department
    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    // Accessor to provide enquiry_id as alias for project_enquiry_id
    public function getEnquiryIdAttribute()
    {
        return $this->project_enquiry_id;
    }
}
