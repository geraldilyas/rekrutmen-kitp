<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobStage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'job_id',
        'name',
        'stage_order',
        'start_date',
        'end_date',
        'type',
        'weight',
        'test_link',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'type' => 'string',
        'is_active' => 'boolean',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function results()
    {
        return $this->hasMany(ApplicationStageResult::class);
    }
}