<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
        protected $fillable = [
            'title',
            'type',
            'description',
            'qualification',
            'duration',
            'location',
            'unit_kerja',
            'start_date',
            'end_date',
            'requirements',
            'deadline',
            'category',
        ];

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
}