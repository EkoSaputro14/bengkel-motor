<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $vehicleId = $this->route('vehicle') ? $this->route('vehicle')->id : null;

        return [
            'no_polisi' => [
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles', 'no_polisi')->ignore($vehicleId),
            ],
            'merk' => 'required|string|max:50',
            'model' => 'required|string|max:100',
            'tahun' => 'required|integer|min:1990|max:' . (date('Y') + 1),
        ];
    }

    public function messages(): array
    {
        return [
            'no_polisi.required' => 'Nomor polisi kendaraan wajib diisi.',
            'no_polisi.unique' => 'Nomor polisi sudah terdaftar pada motor lain.',
            'merk.required' => 'Merk motor wajib diisi.',
            'model.required' => 'Model motor wajib diisi.',
            'tahun.required' => 'Tahun pembuatan motor wajib diisi.',
        ];
    }
}
