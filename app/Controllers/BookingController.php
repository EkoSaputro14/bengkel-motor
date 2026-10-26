<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Core\Response;
use App\Models\Booking;
use App\Models\ServiceSlot;
use App\Models\Vehicle;

/**
 * Endpoint reservasi dan pembatalan booking servis.
 * Status booking: booked -> checked_in -> in_progress -> completed (atau cancelled).
 */
class BookingController
{
    /** POST /api/bookings — pelanggan memesan slot servis */
    public function store(): void
    {
        $user = Auth::requireUser();
        $d = Response::input();

        $errors = [];
        if (empty($d['vehicle_id']) || !ctype_digit((string) $d['vehicle_id'])) {
            $errors['vehicle_id'] = 'vehicle_id wajib diisi.';
        }
        if (empty($d['slot_id']) || !ctype_digit((string) $d['slot_id'])) {
            $errors['slot_id'] = 'slot_id wajib diisi.';
        }
        if ($errors) {
            Response::error(422, 'Validasi gagal.', $errors);
        }

        // Otorisasi: kendaraan harus milik pelanggan yang login
        $vehicle = Vehicle::findOwned((int) $d['vehicle_id'], (int) $user['id']);
        if (!$vehicle) {
            Response::error(404, 'Kendaraan tidak ditemukan atau bukan milik Anda.');
        }

        // Slot tidak boleh di masa lalu
        $slot = ServiceSlot::find((int) $d['slot_id']);
        if ($slot && $slot['tanggal'] < date('Y-m-d')) {
            Response::error(422, 'Validasi gagal.', ['slot_id' => 'Tidak dapat memesan slot pada tanggal yang sudah lewat.']);
        }

        // Validasi + pengisian kuota dilakukan atomik (mitigasi overbooking)
        $result = Booking::reserve((int) $d['vehicle_id'], (int) $d['slot_id'], $d['keluhan'] ?? null);
        if (!$result['ok']) {
            Response::error($result['code'], $result['error']);
        }

        Response::json([
            'message' => 'Reservasi berhasil dibuat.',
            'data' => Booking::detail($result['booking_id']),
        ], 201);
    }

    /** GET /api/bookings — daftar booking milik pelanggan (atau semua bagi admin) */
    public function index(): void
    {
        $user = Auth::requireUser();

        if ($user['role'] === 'admin') {
            $rows = \App\Core\Database::pdo()->query(
                'SELECT b.id, b.status, b.keluhan, v.no_polisi, v.merk, v.model, s.tanggal, s.jam_mulai
                 FROM bookings b
                 JOIN vehicles v ON v.id = b.vehicle_id
                 JOIN service_slots s ON s.id = b.slot_id
                 ORDER BY s.tanggal, s.jam_mulai'
            )->fetchAll();
            Response::json(['data' => $rows]);
        }

        // Pelanggan: hanya booking dari kendaraannya sendiri
        $vehicles = Vehicle::allByUser((int) $user['id']);
        $data = [];
        foreach ($vehicles as $v) {
            foreach (Booking::allByVehicle((int) $v['id']) as $b) {
                $b['no_polisi'] = $v['no_polisi'];
                $data[] = $b;
            }
        }
        Response::json(['data' => $data]);
    }

    /** GET /api/bookings/{id} */
    public function show(int $id): void
    {
        $user = Auth::requireUser();
        $booking = Booking::detail($id);
        if (!$booking) {
            Response::error(404, 'Booking tidak ditemukan.');
        }
        // Otorisasi: pemilik kendaraan, atau mekanik/admin
        if ($user['role'] === 'pelanggan' && (int) $booking['user_id'] !== (int) $user['id']) {
            Response::error(403, 'Anda tidak berhak melihat booking ini.');
        }
        Response::json(['data' => $booking]);
    }

    /** DELETE /api/bookings/{id} — pembatalan oleh pemilik (kuota dikembalikan) */
    public function cancel(int $id): void
    {
        $user = Auth::requireUser();
        $booking = Booking::detail($id);
        if (!$booking) {
            Response::error(404, 'Booking tidak ditemukan.');
        }
        if ($user['role'] === 'pelanggan' && (int) $booking['user_id'] !== (int) $user['id']) {
            Response::error(403, 'Anda tidak berhak membatalkan booking ini.');
        }
        if (!Booking::cancel($id)) {
            Response::error(409, 'Booking tidak dapat dibatalkan (sudah diproses atau sudah selesai).');
        }
        Response::json(['message' => 'Booking berhasil dibatalkan, kuota slot dikembalikan.']);
    }

    /** PUT /api/bookings/{id}/status — mekanik/admin memperbarui status pengerjaan */
    public function updateStatus(int $id): void
    {
        $user = Auth::requireUser();
        Auth::requireRole($user, ['mekanik', 'admin']);

        $d = Response::input();
        if (empty($d['status'])) {
            Response::error(422, 'Validasi gagal.', ['status' => 'Status wajib diisi.']);
        }
        if (!Booking::setStatus($id, $d['status'])) {
            Response::error(422, 'Status tidak valid atau booking tidak ditemukan.',
                ['status' => 'Nilai yang diizinkan: booked, checked_in, in_progress, completed, cancelled.']);
        }
        Response::json(['message' => 'Status diperbarui.', 'data' => Booking::detail($id)]);
    }
}
