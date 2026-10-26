<?php
namespace App\Models;

use App\Core\Database;

/**
 * Model vehicles — manajemen profil kendaraan pelanggan.
 */
class Vehicle
{
    public static function allByUser(int $userId): array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM vehicles WHERE user_id = ? ORDER BY id DESC');
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public static function findOwned(int $id, int $userId): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM vehicles WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->fetch() ?: null;
    }

    public static function find(int $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM vehicles WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function noPolisiExists(string $no): bool
    {
        $stmt = Database::pdo()->prepare('SELECT COUNT(*) FROM vehicles WHERE no_polisi = ?');
        $stmt->execute([$no]);
        return (bool) $stmt->fetchColumn();
    }

    public static function create(array $d): int
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare('INSERT INTO vehicles (user_id, no_polisi, merk, model, tahun) VALUES (?,?,?,?,?)');
        $stmt->execute([$d['user_id'], $d['no_polisi'], $d['merk'], $d['model'], $d['tahun']]);
        return (int) $pdo->lastInsertId();
    }

    public static function update(int $id, array $d): void
    {
        $stmt = Database::pdo()->prepare('UPDATE vehicles SET merk = ?, model = ?, tahun = ? WHERE id = ?');
        $stmt->execute([$d['merk'], $d['model'], $d['tahun'], $id]);
    }

    public static function delete(int $id): void
    {
        Database::pdo()->prepare('DELETE FROM vehicles WHERE id = ?')->execute([$id]);
    }
}
