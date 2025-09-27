<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnquiryDepartmentalTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'enquiry_id',
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
        'notes',
        'task_order',
        'created_by',
    ];

    protected $casts = [
        'estimated_hours' => 'decimal:2',
        'actual_hours' => 'decimal:2',
        'due_date' => 'date',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    // Relationships
    public function enquiry(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Enquiry::class);
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

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->where('status', '!=', 'completed');
    }

    public function scopeAssignedToUser($query, $userId)
    {
        return $query->where('assigned_user_id', $userId);
    }

    // Methods
    public function markAsInProgress(): bool
    {
        if ($this->status === 'pending') {
            return $this->update([
                'status' => 'in_progress',
                'started_at' => now(),
            ]);
        }
        return false;
    }

    public function markAsCompleted($actualHours = null): bool
    {
        if ($this->status === 'in_progress') {
            $updateData = [
                'status' => 'completed',
                'completed_at' => now(),
            ];

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

    public function updatePriority($priority): bool
    {
        if (in_array($priority, ['low', 'medium', 'high'])) {
            return $this->update(['priority' => $priority]);
        }
        return false;
    }

    public function setDueDate($date): bool
    {
        return $this->update(['due_date' => $date]);
    }

    public function addNote($note): bool
    {
        $currentNotes = $this->notes ? $this->notes . "\n\n" : '';
        return $this->update(['notes' => $currentNotes . now()->format('Y-m-d H:i:s') . ': ' . $note]);
    }

    // Lifecycle management
    public function canTransitionTo($newStatus): bool
    {
        $validTransitions = [
            'pending' => ['in_progress', 'cancelled'],
            'in_progress' => ['completed', 'pending'],
            'completed' => [], // Terminal state
            'cancelled' => [], // Terminal state
        ];

        return in_array($newStatus, $validTransitions[$this->status] ?? []);
    }

    public function transitionTo($newStatus): bool
    {
        if (!$this->canTransitionTo($newStatus)) {
            return false;
        }

        $updateData = ['status' => $newStatus];

        if ($newStatus === 'in_progress' && !$this->started_at) {
            $updateData['started_at'] = now();
        } elseif ($newStatus === 'completed' && !$this->completed_at) {
            $updateData['completed_at'] = now();
        }

        return $this->update($updateData);
    }
}
