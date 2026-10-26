<?php
/**
 * Konfigurasi aplikasi.
 * Pada Laravel ini menjadi file .env + config/database.php
 */
define('APP_NAME', 'Bengkel Motor API');

// Driver database: 'sqlite' (default, tanpa instalasi) atau 'mysql'
define('DB_DRIVER', 'sqlite');

// Konfigurasi MySQL (dipakai bila DB_DRIVER = 'mysql')
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'bengkel_api');
define('DB_USER', 'root');
define('DB_PASS', '');

// Path file SQLite
define('DB_SQLITE_PATH', __DIR__ . '/../database/bengkel.sqlite');
