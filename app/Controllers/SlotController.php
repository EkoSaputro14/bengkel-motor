<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Core\Response;
use App\Models\ServiceSlot;

/**
 * Endpoint pengecekan ketersediaan kuota slot tanggal dan jam servis.
 */
class SlotController
{
    /** GET /api/slots?tanggal=YYYY-MM-DD — daftar slot pada tanggal tertentu */
    public function index(): void
    {
        $tanggal = $_GET['tanggal'] ?? date('Y-m-d');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) {
            Response::error(422, 'Validasi gagal.', ['tanggal' => 'Format tanggal harus YYYY-MM-DD.']);
        }
        Response::json([
            'tanggal' => $tanggal,
            'data' => ServiceSlot::byDate($tanggal),
        ]);
    }

    /** GET /api/slots/available — daftar 14 tanggal ke depan yang masih tersedia */
    public function available(): void
    {
        Response::json(['data' => ServiceSlot::availableDates()]);
    }

    /** POST /api/slots — admin menambah slot harian */
    public function store(): void
    {
        $user = Auth::requireUser();
        Auth::requireRole($user, ['admin']);

        $d = Response::input();
        $errors = [];
        if (empty($d['tanggal']) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $d['tanggal'])) {
            $errors['tanggal'] = 'Format tanggal harus YYYY-MM-DD.';
        }
        if (empty($d['jam_mulai']) || !preg_match('/^\d{2}:\d{2}$/', $d['jam_mulai'])) {
            $errors['jam_mulai'] = 'Format jam harus HH:MM.';
        }
        if (empty($d['kuota_maksimal']) || !ctype_digit((string) $d['kuota_maksimal']) || (int) $d['kuota_maksimal'] < 1) {
            $errors['kuota_maksimal'] = 'Kuota maksimal minimal 1.';
        }
        if ($errors) {
            Response::error(422, 'Validasi gagal.', $errors);
        }

        $ok = ServiceSlot::create($d['tanggal'], $d['jam_mulai'] . ':00', (int) $d['kuota_maksimal']);
        if (!$ok) {
            Response::error(409, 'Slot pada tanggal dan jam tersebut sudah ada.');
        }
        Response::json(['message' => 'Slot berhasil dibuat.'], 201);
    }
}
