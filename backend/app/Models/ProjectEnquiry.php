<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Modules\ClientService\Models\Client;

class ProjectEnquiry extends Model
{
    use HasFactory;

    protected $table = 'project_enquiries';

    protected $fillable = [
        'date_received',
        'expected_delivery_date',
        'client_id',
        'title',
        'description',
        'project_scope',
        'priority',
        'status',
        'department_id',
        'assigned_department',
        'estimated_budget',
        'project_deliverables',
        'contact_person',
        'assigned_po',
        'follow_up_notes',
        'enquiry_number',
        'converted_to_project_id',
        'venue',
        'site_survey_skipped',
        'site_survey_skip_reason',
        'quote_approved',
        'quote_approved_at',
        'quote_approved_by',
        'created_by',
        // Project fields
        'project_id',
        'start_date',
        'end_date',
        'budget',
        'current_phase',
        'assigned_users',
    ];

    protected $casts = [
        'date_received' => 'date',
        'expected_delivery_date' => 'date',
        'site_survey_skipped' => 'boolean',
        'assigned_po' => 'integer',
        'quote_approved' => 'boolean',
        'quote_approved_at' => 'datetime',
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2',
        'estimated_budget' => 'decimal:2',
        'assigned_users' => 'array',
        'current_phase' => 'integer',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\HR\Models\Department::class);
    }

    public function enquiryTasks(): HasMany
    {
        return $this->hasMany(\App\Modules\Projects\Models\EnquiryTask::class, 'project_enquiry_id');
    }

    // Scopes
    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    public function scopeAccessibleByUser($query, $user)
    {
        $accessibleDepartments = $user->getAccessibleDepartments()->pluck('id')->toArray();

        // Allow enquiries without department assignment, or with accessible departments
        return $query->where(function ($q) use ($accessibleDepartments) {
            $q->whereNull('department_id')
              ->orWhereIn('department_id', $accessibleDepartments);
        });
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['planning', 'in_progress']);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Approve the quote for this enquiry and convert to project
     */
    public function approveQuote(int $userId): bool
    {
        // Check if user has finance approval permission
        $user = User::find($userId);
        if (!$user || !$user->hasPermissionTo('finance.quote.approve')) {
            throw new \Exception('Unauthorized: Only users with finance approval permission can approve quotes');
        }

        $this->update([
            'quote_approved' => true,
            'quote_approved_at' => now(),
            'quote_approved_by' => $userId,
            'project_id' => $this->generateProjectId(),
            'status' => 'converted_to_project'
        ]);

        return true;
    }

    /**
     * Generate a unique project ID
     */
    public function generateProjectId(): string
    {
        $now = now();
        $year = $now->year;
        $month = str_pad($now->month, 2, '0', STR_PAD_LEFT);

        // Get the last project number for this month
        $lastProject = self::whereYear('created_at', $year)
                          ->whereMonth('created_at', $now->month)
                          ->whereNotNull('project_id')
                          ->orderBy('id', 'desc')
                          ->first();

        $nextNumber = $lastProject ? intval(substr($lastProject->project_id, -3)) + 1 : 1;
        $formattedNumber = str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        return "WNG-{$year}{$month}-{$formattedNumber}";
    }
}
