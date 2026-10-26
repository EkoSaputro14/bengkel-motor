<?php
namespace App\Core;

/**
 * Helper respons JSON standar (kode status HTTP).
 */
class Response
{
    public static function json($data, int $code = 200): void
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function error(int $code, string $message, array $detail = []): void
    {
        self::json(['error' => $message, 'detail' => $detail], $code);
    }

    /** Baca body request (JSON atau form-urlencoded). */
    public static function input(): array
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (is_array($data)) {
            return $data;
        }
        return $_POST ?: [];
    }
}
