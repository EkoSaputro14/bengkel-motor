<?php
namespace App\Models;

use App\Core\Database;

/**
 * Model service_slots — kuota slot pengerjaan harian.
 */
class ServiceSlot
{
    public static function byDate(string $tanggal): array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT id, tanggal, jam_mulai, kuota_maksimal, terisi, (kuota_maksimal - terisi) AS sisa_kuota
             FROM service_slots WHERE tanggal = ? ORDER BY jam_mulai'
        );
        $stmt->execute([$tanggal]);
        return $stmt->fetchAll();
    }

    /** Daftar tanggal yang memiliki slot tersedia (untuk kalender pemesanan). */
    public static function availableDates(int $days = 14): array
    {
        $rows = Database::pdo()->query(
            "SELECT tanggal, SUM(kuota_maksimal - terisi) AS sisa FROM service_slots
             WHERE tanggal >= date('now') GROUP BY tanggal HAVING sisa > 0 ORDER BY tanggal LIMIT $days"
        )->fetchAll();
        return $rows;
    }

    public static function find(int $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM service_slots WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    /** Membuat slot (admin). Kembalikan false jika tanggal+jam sudah ada. */
    public static function create(string $tanggal, string $jam, int $kuota): bool
    {
        $pdo = Database::pdo();
        try {
            $stmt = $pdo->prepare('INSERT INTO service_slots (tanggal, jam_mulai, kuota_maksimal) VALUES (?,?,?)');
            $stmt->execute([$tanggal, $jam, $kuota]);
            return true;
        } catch (\PDOException $e) {
            return false; // UNIQUE(tanggal, jam_mulai) → slot ganda
        }
    }
}
