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
            'category',
            'created_by',
        ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
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
        return $this->hasMany(JobStage::class)->orderBy('stage_order');
    }

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date'   => 'date',
            'deadline'   => 'date',
        ];
    }

    protected static function booted()
    {
        static::addGlobalScope(new \App\Models\Scopes\AdminDataScope);
    }
}