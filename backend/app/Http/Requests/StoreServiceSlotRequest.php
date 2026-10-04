<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceSlotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal' => 'required|date_format:Y-m-d',
            'jam_mulai' => 'required|string|max:10',
            'kuota_maksimal' => 'required|integer|min:1|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'tanggal.required' => 'Tanggal slot wajib diisi.',
            'tanggal.date_format' => 'Format tanggal harus YYYY-MM-DD (contoh: 2026-10-06).',
            'jam_mulai.required' => 'Jam mulai servis wajib diisi.',
            'kuota_maksimal.required' => 'Kuota maksimal kendaraan wajib ditentukan.',
        ];
    }
}
