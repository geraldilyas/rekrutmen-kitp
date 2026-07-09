<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Job extends Model
{
        use HasFactory, SoftDeletes;

        protected $fillable = [
            'title',
            'type',
            'description',
            'qualification',
            'duration',
            'location',
            'unit_kerja',
            'recruiter_name',
            'start_date',
            'end_date',
            'requirements',
            'deadline',
            'kuota',
            'category',
            'created_by',
            'selection_status',
        ];

        protected $appends = ['selection_ready'];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function penyeleksi()
    {
        return $this->belongsToMany(User::class, 'job_penyeleksi', 'job_id', 'user_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function formFields()
    {
        return $this->belongsToMany(
            \App\Models\FormField::class,
            'job_form_fields',     
            'job_id',              
            'form_field_id'       
        )->withPivot('order');
    }

    public function stages()
    {
            return $this->hasMany(\App\Models\JobStage::class, 'job_id')->orderBy('stage_order');    }

 protected function casts(): array
{
    return [
        'start_date' => 'datetime',
        'end_date'   => 'datetime',
        'deadline'   => 'datetime',
    ];
}

    public function getSelectionReadyAttribute()
    {
        // Pastikan deadline lowongan sudah lewat
        if (!$this->deadline || $this->deadline->isFuture()) {
            return false;
        }

        // Ambil semua stage ID untuk lowongan ini
        $stageIds = $this->stages->pluck('id');
        if ($stageIds->isEmpty()) {
            return false;
        }

        // Cek apakah ada pelamar yang masih memiliki status 'pending' pada salah satu stage
        $hasPending = \App\Models\ApplicationStageResult::whereIn('job_stage_id', $stageIds)
            ->where('status', 'pending')
            ->exists();

        return !$hasPending;
    }

    protected static function booted()
    {
        static::addGlobalScope(new \App\Models\Scopes\AdminDataScope);
    }
}