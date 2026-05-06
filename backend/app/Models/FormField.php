<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    protected $fillable = [
        'label',
        'type',
        'is_required',
        'category'
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean'
    ];

    public function jobs()
    {
        return $this->belongsToMany(
            \App\Models\Job::class,
            'job_form_fields',
            'form_field_id',
            'job_id'
        );
    }
}