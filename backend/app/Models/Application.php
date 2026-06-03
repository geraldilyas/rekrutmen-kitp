<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Application extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'job_id',
        'status',
        'final_score',
        'applied_at',
    ];

    protected $appends = ['calculated_final_score'];

    public function getCalculatedFinalScoreAttribute()
    {
        if (!$this->relationLoaded('stageResults') || !$this->relationLoaded('job') || !$this->job->relationLoaded('stages')) {
            return null;
        }

        $totalScore = 0;
        foreach ($this->job->stages as $stage) {
            $result = $this->stageResults->where('job_stage_id', $stage->id)->first();
            $score = $result ? ($result->score ?? 0) : 0;
            $totalScore += ($score * $stage->weight) / 100;
        }

        return round($totalScore, 2);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function answers()
    {
        return $this->hasMany(ApplicationAnswer::class);
    }

    public function stageResults()
    {
        return $this->hasMany(ApplicationStageResult::class);
    }

    public function histories()
    {
        return $this->hasMany(ApplicationStatusHistory::class);
    }

    protected static function booted()
    {
        static::addGlobalScope(new \App\Models\Scopes\ApplicationDataScope);
    }
}
