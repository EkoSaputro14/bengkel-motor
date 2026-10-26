<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Core\Response;
use App\Models\Vehicle;

/**
 * Endpoint CRUD data kendaraan pelanggan.
 * Otorisasi: pelanggan hanya dapat melihat/mengubah kendaraannya sendiri.
 * Di Laravel: VehicleController + VehiclePolicy
 */
class VehicleController
{
    /** GET /api/vehicles */
    public function index(): void
    {
        $user = Auth::requireUser();
        Response::json(['data' => Vehicle::allByUser((int) $user['id'])]);
    }

    /** POST /api/vehicles */
    public function store(): void
    {
        $user = Auth::requireUser();
        $d = Response::input();
        $errors = [];

        if (empty($d['no_polisi'])) $errors['no_polisi'] = 'Nomor polisi wajib diisi.';
        elseif (!preg_match('/^[A-Z0-9\s]{4,12}$/i', $d['no_polisi'])) $errors['no_polisi'] = 'Format nomor polisi tidak valid.';
        if (empty($d['merk'])) $errors['merk'] = 'Merk wajib diisi.';
        if (empty($d['model'])) $errors['model'] = 'Model wajib diisi.';
        if (empty($d['tahun'])) $errors['tahun'] = 'Tahun wajib diisi.';
        elseif (!ctype_digit((string) $d['tahun']) || (int) $d['tahun'] < 1970 || (int) $d['tahun'] > (int) date('Y') + 1) {
            $errors['tahun'] = 'Tahun tidak valid.';
        }
        if ($errors) {
            Response::error(422, 'Validasi gagal.', $errors);
        }
        if (Vehicle::noPolisiExists(strtoupper($d['no_polisi']))) {
            Response::error(409, 'Nomor polisi sudah terdaftar.');
        }

        $d['no_polisi'] = strtoupper($d['no_polisi']);
        $d['user_id'] = (int) $user['id'];
        $id = Vehicle::create($d);
        Response::json(['message' => 'Kendaraan berhasil ditambahkan.', 'data' => Vehicle::find($id)], 201);
    }

    /** PUT /api/vehicles/{id} */
    public function update(int $id): void
    {
        $user = Auth::requireUser();
        $vehicle = Vehicle::findOwned($id, (int) $user['id']);
        if (!$vehicle) {
            Response::error(404, 'Kendaraan tidak ditemukan.');
        }

        $d = Response::input();
        $errors = [];
        if (empty($d['merk'])) $errors['merk'] = 'Merk wajib diisi.';
        if (empty($d['model'])) $errors['model'] = 'Model wajib diisi.';
        if (empty($d['tahun'])) $errors['tahun'] = 'Tahun wajib diisi.';
        elseif (!ctype_digit((string) $d['tahun']) || (int) $d['tahun'] < 1970 || (int) $d['tahun'] > (int) date('Y') + 1) {
            $errors['tahun'] = 'Tahun tidak valid.';
        }
        if ($errors) {
            Response::error(422, 'Validasi gagal.', $errors);
        }

        Vehicle::update($id, $d);
        Response::json(['message' => 'Kendaraan berhasil diperbarui.', 'data' => Vehicle::find($id)]);
    }

    /** DELETE /api/vehicles/{id} */
    public function destroy(int $id): void
    {
        $user = Auth::requireUser();
        $vehicle = Vehicle::findOwned($id, (int) $user['id']);
        if (!$vehicle) {
            Response::error(404, 'Kendaraan tidak ditemukan.');
        }
        Vehicle::delete($id);
        Response::json(['message' => 'Kendaraan berhasil dihapus.']);
    }
}
