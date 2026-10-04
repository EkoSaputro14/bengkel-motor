<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'no_polisi' => 'required|string|max:20|unique:vehicles,no_polisi',
            'merk' => 'required|string|max:50',
            'model' => 'required|string|max:100',
            'tahun' => 'required|integer|min:1990|max:' . (date('Y') + 1),
        ];
    }

    public function messages(): array
    {
        return [
            'no_polisi.required' => 'Nomor polisi kendaraan wajib diisi.',
            'no_polisi.unique' => 'Nomor polisi sudah terdaftar dalam sistem.',
            'merk.required' => 'Merk motor (contoh: Honda, Yamaha) wajib diisi.',
            'model.required' => 'Model/tipe motor (contoh: Vario 160) wajib diisi.',
            'tahun.required' => 'Tahun pembuatan motor wajib diisi.',
        ];
    }
}
