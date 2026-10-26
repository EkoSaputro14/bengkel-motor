<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Response;
use App\Models\Booking;
use App\Models\ServiceRecord;

/**
 * Endpoint pencatatan tindakan servis dan penggantian suku cadang oleh mekanik,
 * serta riwayat servis per kendaraan (digital service logbook berbasis nomor polisi).
 */
class ServiceRecordController
{
    /** POST /api/service-records — mekanik mencatat tindakan servis */
    public function store(): void
    {
        $user = Auth::requireUser();
        Auth::requireRole($user, ['mekanik', 'admin']);

        $d = Response::input();
        $errors = [];
        if (empty($d['booking_id']) || !ctype_digit((string) $d['booking_id'])) {
            $errors['booking_id'] = 'booking_id wajib diisi.';
        }
        if (empty($d['odometer_km']) || !ctype_digit((string) $d['odometer_km'])) {
            $errors['odometer_km'] = 'odometer_km wajib diisi (angka).';
        }
        if (empty($d['tindakan'])) {
            $errors['tindakan'] = 'Tindakan servis wajib diisi.';
        }
        if ($errors) {
            Response::error(422, 'Validasi gagal.', $errors);
        }

        $booking = Booking::detail((int) $d['booking_id']);
        if (!$booking) {
            Response::error(404, 'Booking tidak ditemukan.');
        }
        if (ServiceRecord::existsForBooking((int) $d['booking_id'])) {
            Response::error(409, 'Booking ini sudah memiliki catatan servis.');
        }

        // Catat + tandai booking selesai dalam satu transaksi
        $pdo = Database::pdo();
        $pdo->beginTransaction();
        try {
            $recordId = ServiceRecord::create($d);
            Booking::setStatus((int) $d['booking_id'], 'completed');
            $pdo->commit();
        } catch (\Exception $e) {
            $pdo->rollBack();
            Response::error(500, 'Gagal menyimpan catatan servis.');
        }

        Response::json(['message' => 'Catatan servis berhasil disimpan.', 'data' => $booking], 201);
    }

    /**
     * GET /api/history?no_polisi=B1234XYZ
     * Pencarian riwayat servis berdasarkan nomor polisi motor.
     */
    public function history(): void
    {
        $user = Auth::requireUser();
        $no = strtoupper(trim($_GET['no_polisi'] ?? ''));
        if ($no === '') {
            Response::error(422, 'Validasi gagal.', ['no_polisi' => 'Parameter no_polisi wajib diisi. Contoh: ?no_polisi=B1234XYZ']);
        }

        $stmt = Database::pdo()->prepare(
            'SELECT v.id, v.no_polisi, v.merk, v.model, v.tahun, v.user_id
             FROM vehicles v WHERE UPPER(v.no_polisi) = ?'
        );
        $stmt->execute([$no]);
        $vehicle = $stmt->fetch();

        if (!$vehicle) {
            Response::error(404, 'Kendaraan dengan nomor polisi tersebut tidak ditemukan.');
        }
        // Otorisasi: pelanggan hanya boleh melihat riwayat kendaraannya sendiri
        if ($user['role'] === 'pelanggan' && (int) $vehicle['user_id'] !== (int) $user['id']) {
            Response::error(403, 'Anda tidak berhak melihat riwayat kendaraan ini.');
        }

        Response::json([
            'kendaraan' => [
                'no_polisi' => $vehicle['no_polisi'],
                'merk' => $vehicle['merk'],
                'model' => $vehicle['model'],
                'tahun' => $vehicle['tahun'],
            ],
            'jumlah_riwayat' => count(ServiceRecord::historyByVehicle((int) $vehicle['id'])),
            'data' => ServiceRecord::historyByVehicle((int) $vehicle['id']),
        ]);
    }
}
