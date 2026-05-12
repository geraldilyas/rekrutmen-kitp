<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationStageResult extends Model
{
    protected $fillable = [
        'application_id',
        'job_stage_id',
        'status',
        'notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function stage()
    {
        return $this->belongsTo(JobStage::class, 'job_stage_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}