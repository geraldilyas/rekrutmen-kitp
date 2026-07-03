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
        'last_reminder_at',
    ];

    protected $appends = ['calculated_final_score'];

    protected $casts = [
        'applied_at' => 'datetime',
        'last_reminder_at' => 'datetime',
    ];

    public function getCalculatedFinalScoreAttribute()
    {
        // 1. Pastikan relasi dasar ter-load
        if (!$this->relationLoaded('stageResults') || !$this->relationLoaded('job')) {
            return null;
        }

        $job = $this->job;

        // 2. AMANKAN DISINI: Cek apakah $job bernilai null (misal lowongan sudah dihapus)
        if (!$job || !$job->relationLoaded('stages')) {
            return null;
        }

        $totalScore = 0;

        foreach ($job->stages as $stage) {
            // Amankan pencarian nilai tahapan agar tidak error jika collection kosong
            $result = $this->stageResults ? $this->stageResults->where('job_stage_id', $stage->id)->first() : null;
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
        return $this->belongsTo(Job::class, 'job_id');
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

    // TAMBAHAN INI
    public function documents()
    {
        return $this->hasManyThrough(
            UserDocument::class,
            User::class,
            'id',       // users.id
            'user_id',  // user_documents.user_id
            'user_id',  // applications.user_id
            'id'
        );
    }

    protected static function booted()
    {
        static::addGlobalScope(new \App\Models\Scopes\ApplicationDataScope);
    }
}