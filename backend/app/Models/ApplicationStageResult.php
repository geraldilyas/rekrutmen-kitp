<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApplicationStageResult extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'application_id',
        'job_stage_id',
        'status',
        'score',
        'notes',
        'reviewed_by',
        'reviewed_at',
        'released_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'released_at' => 'datetime',
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