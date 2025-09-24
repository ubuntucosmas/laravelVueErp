<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Modules\ClientService\Models\Client;

class Enquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_received',
        'expected_delivery_date',
        'client_name',
        'project_name',
        'project_deliverables',
        'contact_person',
        'status',
        'assigned_po',
        'follow_up_notes',
        'project_id',
        'enquiry_number',
        'converted_to_project_id',
        'venue',
        'site_survey_skipped',
        'site_survey_skip_reason',
        'created_by',
    ];

    protected $casts = [
        'date_received' => 'date',
        'expected_delivery_date' => 'date',
        'site_survey_skipped' => 'boolean',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
