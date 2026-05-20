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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function documents()
    {
        return $this->hasMany(ApplicationDocument::class);
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
