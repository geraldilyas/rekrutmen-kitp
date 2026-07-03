<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlacklistedNik extends Model
{
    use HasFactory;

    protected $fillable = [
        'nik',
        'name',
        'reason',
        'blacklisted_by',
    ];

    public function blacklistedBy()
    {
        return $this->belongsTo(User::class, 'blacklisted_by');
    }
}
