<?php
namespace App\Models;

use App\Core\Database;

/**
 * Model users — di Laravel: class User extends Model
 */
class User
{
    public static function findByEmail(string $email): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $d): int
    {
        $pdo = Database::pdo();
        $stmt = $pdo->prepare('INSERT INTO users (nama, no_hp, email, password, role) VALUES (?,?,?,?,?)');
        $stmt->execute([
            $d['nama'], $d['no_hp'], $d['email'],
            password_hash($d['password'], PASSWORD_DEFAULT),
            $d['role'] ?? 'pelanggan',
        ]);
        return (int) $pdo->lastInsertId();
    }

    public static function issueToken(int $id): string
    {
        $token = bin2hex(random_bytes(32)); // 64 hex chars, pengganti personal_access_token Sanctum
        $stmt = Database::pdo()->prepare('UPDATE users SET api_token = ? WHERE id = ?');
        $stmt->execute([$token, $id]);
        return $token;
    }

    public static function find(int $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT id, nama, no_hp, email, role FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }
}
