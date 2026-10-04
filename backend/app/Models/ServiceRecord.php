<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'mechanic_id',
        'odometer_km',
        'tindakan',
        'suku_cadang',
        'catatan_mekanik',
    ];

    protected $casts = [
        'odometer_km' => 'integer',
        'suku_cadang' => 'array',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function mechanic(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mechanic_id');
    }
}
