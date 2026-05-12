<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'user_id',
        'job_id',
        'status',
        'applied_at'
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

    public function histories()
    {
        return $this->hasMany(ApplicationStatusHistory::class);
    }

    public function stageResults()
    {
        return $this->hasMany(ApplicationStageResult::class);
    }
}
