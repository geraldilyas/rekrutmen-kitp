<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'job_id',
        'title',
        'file_path',
        'published_at'
    ];

    protected $casts = [
        'published_at' => 'datetime'
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}
