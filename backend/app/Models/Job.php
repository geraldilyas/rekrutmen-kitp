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
        'category',
    ];

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}