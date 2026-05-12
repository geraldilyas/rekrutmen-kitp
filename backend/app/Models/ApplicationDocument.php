<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationDocument extends Model
{
    protected $table = 'application_documents';

    public $timestamps = false;

    protected $fillable = [
        'application_id',
        'type',
        'file_path',
        'uploaded_at'
    ];

    // Relasi ke Application
    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}