<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'tanggal',
        'jam_mulai',
        'kuota_maksimal',
        'terisi',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
        'kuota_maksimal' => 'integer',
        'terisi' => 'integer',
    ];

    protected $appends = [
        'sisa_kuota',
        'is_available',
    ];

    public function getSisaKuotaAttribute(): int
    {
        return max(0, $this->kuota_maksimal - $this->terisi);
    }

    public function getIsAvailableAttribute(): bool
    {
        return $this->sisa_kuota > 0;
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'slot_id');
    }
}
