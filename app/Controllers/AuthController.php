<?php
namespace App\Controllers;

use App\Core\Response;
use App\Models\User;

/**
 * Endpoint autentikasi: Register, Login, Me.
 * Di Laravel: app/Http/Controllers/AuthController.php
 */
class AuthController
{
    /** POST /api/auth/register */
    public function register(): void
    {
        $d = Response::input();
        $errors = [];

        if (empty($d['nama'])) $errors['nama'] = 'Nama wajib diisi.';
        if (empty($d['no_hp'])) $errors['no_hp'] = 'Nomor HP wajib diisi.';
        elseif (!preg_match('/^[0-9+\-\s]{8,20}$/', $d['no_hp'])) $errors['no_hp'] = 'Format nomor HP tidak valid.';
        if (empty($d['email'])) $errors['email'] = 'Email wajib diisi.';
        elseif (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Format email tidak valid.';
        if (empty($d['password'])) $errors['password'] = 'Password wajib diisi.';
        elseif (strlen($d['password']) < 8) $errors['password'] = 'Password minimal 8 karakter.';

        if ($errors) {
            Response::error(422, 'Validasi gagal.', $errors);
        }
        if (User::findByEmail($d['email'])) {
            Response::error(409, 'Email sudah terdaftar.');
        }

        $id = User::create($d);
        $token = User::issueToken($id);
        Response::json([
            'message' => 'Registrasi berhasil.',
            'user' => User::find($id),
            'token' => $token,
        ], 201);
    }

    /** POST /api/auth/login */
    public function login(): void
    {
        $d = Response::input();
        if (empty($d['email']) || empty($d['password'])) {
            Response::error(422, 'Validasi gagal.', ['email' => 'Email dan password wajib diisi.']);
        }

        $user = User::findByEmail($d['email']);
        if (!$user || !password_verify($d['password'], $user['password'])) {
            Response::error(401, 'Email atau password salah.');
        }

        $token = User::issueToken((int) $user['id']);
        Response::json([
            'message' => 'Login berhasil.',
            'user' => User::find((int) $user['id']),
            'token' => $token,
        ]);
    }

    /** GET /api/auth/me (Bearer token) */
    public function me(): void
    {
        $user = \App\Core\Auth::requireUser();
        Response::json(['user' => $user]);
    }

    /** POST /api/auth/logout — cabut token */
    public function logout(): void
    {
        $user = \App\Core\Auth::requireUser();
        \App\Core\Database::pdo()
            ->prepare('UPDATE users SET api_token = NULL WHERE id = ?')
            ->execute([$user['id']]);
        Response::json(['message' => 'Logout berhasil.']);
    }
}
