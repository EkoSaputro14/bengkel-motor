<?php
namespace App\Core;

use PDO;

/**
 * Koneksi database (singleton PDO, prepared statement).
 * Di Laravel: digantikan oleh Eloquent + config/database.php
 */
class Database
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo === null) {
            if (DB_DRIVER === 'sqlite') {
                self::$pdo = new PDO('sqlite:' . DB_SQLITE_PATH);
            } else {
                $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
                self::$pdo = new PDO($dsn, DB_USER, DB_PASS);
            }
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            if (DB_DRIVER === 'sqlite') {
                self::$pdo->exec('PRAGMA foreign_keys = ON');
            }
        }
        return self::$pdo;
    }
}
