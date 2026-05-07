<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationStatusHistory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'application_id',
        'status',
        'notes',
        'created_at'
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}