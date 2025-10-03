<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\HR\Models\Department;

class EnquiryDepartmentalTask extends Model
{
    use HasFactory;

    protected $table = 'enquiry_departmental_tasks';

    protected $fillable = [
        'project_enquiry_id',
        'department_id',
        'task_name',
        'task_description',
        'status',
        'assigned_user_id',
        'priority',
        'estimated_hours',
        'actual_hours',
        'due_date',
        'started_at',
        'completed_at',
        'submitted_at',
        'notes',
        'task_order',
        'created_by',
    ];

    protected $casts = [
        'due_date' => 'date',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'submitted_at' => 'datetime',
        'estimated_hours' => 'decimal:2',
        'actual_hours' => 'decimal:2',
    ];

    // Relationships
    public function enquiry(): BelongsTo
    {
        return $this->belongsTo(ProjectEnquiry::class, 'project_enquiry_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    public function scopeByEnquiry($query, $enquiryId)
    {
        return $query->where('project_enquiry_id', $enquiryId);
    }
}
