<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'booking_id' => 'required|integer|exists:bookings,id',
            'odometer_km' => 'required|integer|min:0',
            'tindakan' => 'required|string|min:5',
            'suku_cadang' => 'nullable|array',
            'suku_cadang.*.nama' => 'required_with:suku_cadang|string|max:100',
            'suku_cadang.*.qty' => 'required_with:suku_cadang|integer|min:1',
            'suku_cadang.*.keterangan' => 'nullable|string|max:255',
            'catatan_mekanik' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'booking_id.required' => 'ID Booking wajib disertakan.',
            'booking_id.exists' => 'Data Booking tidak ditemukan.',
            'odometer_km.required' => 'Angka kilometer odometer wajib diisi.',
            'tindakan.required' => 'Tindakan perbaikan yang dilakukan wajib dicatat.',
        ];
    }
}
