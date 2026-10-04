<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vehicle_id' => 'required|integer|exists:vehicles,id',
            'slot_id' => 'required|integer|exists:service_slots,id',
            'keluhan' => 'required|string|min:5|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'vehicle_id.required' => 'Kendaraan wajib dipilih.',
            'vehicle_id.exists' => 'Kendaraan yang dipilih tidak terdaftar.',
            'slot_id.required' => 'Slot waktu servis wajib dipilih.',
            'slot_id.exists' => 'Slot waktu servis yang dipilih tidak valid.',
            'keluhan.required' => 'Keluhan atau rincian servis yang diinginkan wajib diisi.',
            'keluhan.min' => 'Keluhan minimal 5 karakter.',
        ];
    }
}
