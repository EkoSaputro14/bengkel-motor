<?php
namespace App\Core;

/**
 * Autentikasi berbasis token (mirip Laravel Sanctum).
 * Token dikirim pada header: Authorization: Bearer <token>
 */
class Auth
{
    public static function user(): ?array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
            $stmt = Database::pdo()->prepare('SELECT id, nama, no_hp, email, role, api_token FROM users WHERE api_token = ?');
            $stmt->execute([trim($m[1])]);
            $user = $stmt->fetch();
            return $user ?: null;
        }
        return null;
    }

    /** Wajib login, jika gagal kirim 401 dan hentikan. */
    public static function requireUser(): array
    {
        $user = self::user();
        if (!$user) {
            Response::error(401, 'Tidak terautentikasi. Sertakan header Authorization: Bearer <token>.');
        }
        return $user;
    }

    /** Wajib peran tertentu (mekanik/admin), jika gagal kirim 403. */
    public static function requireRole(array $user, array $roles): void
    {
        if (!in_array($user['role'], $roles, true)) {
            Response::error(403, 'Akses ditolak. Peran diperlukan: ' . implode(' / ', $roles) . '.');
        }
    }
}
