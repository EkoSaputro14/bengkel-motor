<?php
namespace App\Models;

use App\Core\Database;

/**
 * Model service_records — digital service logbook per kendaraan.
 */
class ServiceRecord
{
    public static function create(array $d): int
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare(
            'INSERT INTO service_records (booking_id, odometer_km, tindakan, suku_cadang, catatan_mekanik) VALUES (?,?,?,?,?)'
        );
        $stmt->execute([$d['booking_id'], $d['odometer_km'], $d['tindakan'], $d['suku_cadang'] ?? null, $d['catatan_mekanik'] ?? null]);
        return (int) $pdo->lastInsertId();
    }

    /** Riwayat servis per kendaraan (pencarian berdasarkan nomor polisi). */
    public static function historyByVehicle(int $vehicleId): array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT r.id, r.odometer_km, r.tindakan, r.suku_cadang, r.catatan_mekanik, r.created_at,
                    s.tanggal, s.jam_mulai, b.keluhan
             FROM service_records r
             JOIN bookings b ON b.id = r.booking_id
             JOIN service_slots s ON s.id = b.slot_id
             WHERE b.vehicle_id = ? ORDER BY s.tanggal DESC'
        );
        $stmt->execute([$vehicleId]);
        return $stmt->fetchAll();
    }

    public static function existsForBooking(int $bookingId): bool
    {
        $stmt = Database::pdo()->prepare('SELECT COUNT(*) FROM service_records WHERE booking_id = ?');
        $stmt->execute([$bookingId]);
        return (bool) $stmt->fetchColumn();
    }
}
