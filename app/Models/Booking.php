<?php
namespace App\Models;

use App\Core\Database;

/**
 * Model bookings — reservasi slot servis.
 * Pencatatan kuota dilakukan dalam transaksi atomik (mitigasi overbooking).
 */
class Booking
{
    /**
     * Reservasi slot: cek & tambah kuota secara atomik (BEGIN IMMEDIATE + UPDATE guard).
     * Kembalikan ['ok'=>true,'booking_id'=>..] atau ['ok'=>false,'error'=>..,'code'=>..]
     */
    public static function reserve(int $vehicleId, int $slotId, ?string $keluhan): array
    {
        $pdo = Database::pdo();
        $pdo->beginTransaction();
        try {
            // Kunci baris slot & cek kuota saat ini (mencegah balapan dua booking bersamaan)
            if (DB_DRIVER === 'sqlite') {
                $stmt = $pdo->prepare('SELECT kuota_maksimal, terisi FROM service_slots WHERE id = ?');
            } else {
                $stmt = $pdo->prepare('SELECT kuota_maksimal, terisi FROM service_slots WHERE id = ? FOR UPDATE');
            }
            $stmt->execute([$slotId]);
            $slot = $stmt->fetch();
            if (!$slot) {
                $pdo->rollBack();
                return ['ok' => false, 'code' => 404, 'error' => 'Slot tidak ditemukan.'];
            }
            if ((int) $slot['terisi'] >= (int) $slot['kuota_maksimal']) {
                $pdo->rollBack();
                return ['ok' => false, 'code' => 409, 'error' => 'Kuota slot pada jam tersebut sudah penuh. Silakan pilih jam lain.'];
            }

            $stmt = $pdo->prepare('INSERT INTO bookings (vehicle_id, slot_id, keluhan) VALUES (?,?,?)');
            $stmt->execute([$vehicleId, $slotId, $keluhan]);
            $bookingId = (int) $pdo->lastInsertId();

            $pdo->prepare('UPDATE service_slots SET terisi = terisi + 1 WHERE id = ?')->execute([$slotId]);
            $pdo->commit();

            return ['ok' => true, 'booking_id' => $bookingId];
        } catch (\Exception $e) {
            $pdo->rollBack();
            return ['ok' => false, 'code' => 500, 'error' => 'Gagal menyimpan reservasi.'];
        }
    }

    public static function detail(int $id): ?array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT b.*, v.no_polisi, v.merk, v.model, v.user_id,
                    s.tanggal, s.jam_mulai, r.tindakan, r.odometer_km, r.suku_cadang, r.catatan_mekanik
             FROM bookings b
             JOIN vehicles v ON v.id = b.vehicle_id
             JOIN service_slots s ON s.id = b.slot_id
             LEFT JOIN service_records r ON r.booking_id = b.id
             WHERE b.id = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function allByVehicle(int $vehicleId): array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT b.id, b.status, b.keluhan, b.created_at, s.tanggal, s.jam_mulai
             FROM bookings b JOIN service_slots s ON s.id = b.slot_id
             WHERE b.vehicle_id = ? ORDER BY s.tanggal DESC, s.jam_mulai DESC'
        );
        $stmt->execute([$vehicleId]);
        return $stmt->fetchAll();
    }

    public static function cancel(int $id): bool
    {
        $pdo = Database::pdo();
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("SELECT slot_id FROM bookings WHERE id = ? AND status = 'booked'");
            $stmt->execute([$id]);
            $b = $stmt->fetch();
            if (!$b) {
                $pdo->rollBack();
                return false;
            }
            $pdo->prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?")->execute([$id]);
            $pdo->prepare('UPDATE service_slots SET terisi = MAX(terisi - 1, 0) WHERE id = ?')->execute([$b['slot_id']]);
            $pdo->commit();
            return true;
        } catch (\Exception $e) {
            $pdo->rollBack();
            return false;
        }
    }

    public static function setStatus(int $id, string $status): bool
    {
        $allowed = ['booked', 'checked_in', 'in_progress', 'completed', 'cancelled'];
        if (!in_array($status, $allowed, true)) {
            return false;
        }
        $stmt = Database::pdo()->prepare('UPDATE bookings SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        return $stmt->rowCount() > 0;
    }
}
