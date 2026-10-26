<?php
/**
 * Front controller — semua request HTTP masuk lewat file ini.
 * Di Laravel: public/index.php + Router Kernel.
 *
 * Jalankan lokal:  php -S localhost:8000 -t public
 */
declare(strict_types=1);

require __DIR__ . '/../config/config.php';
require __DIR__ . '/../app/Core/Database.php';
require __DIR__ . '/../app/Core/Response.php';
require __DIR__ . '/../app/Core/Auth.php';
require __DIR__ . '/../app/Models/User.php';
require __DIR__ . '/../app/Models/Vehicle.php';
require __DIR__ . '/../app/Models/ServiceSlot.php';
require __DIR__ . '/../app/Models/Booking.php';
require __DIR__ . '/../app/Models/ServiceRecord.php';
require __DIR__ . '/../app/Controllers/AuthController.php';
require __DIR__ . '/../app/Controllers/VehicleController.php';
require __DIR__ . '/../app/Controllers/SlotController.php';
require __DIR__ . '/../app/Controllers/BookingController.php';
require __DIR__ . '/../app/Controllers/ServiceRecordController.php';

use App\Core\Response;

// ---- Inisialisasi database (SQLite) saat pertama kali dijalankan ----
if (DB_DRIVER === 'sqlite' && !file_exists(DB_SQLITE_PATH)) {
    require __DIR__ . '/../database/init_sqlite.php';
}

// ---- Routing sederhana ----
$routes = require __DIR__ . '/../routes/api.php';

$method = $_SERVER['REQUEST_METHOD'];
// Izinkan override method (PUT/DELETE) lewat header X-HTTP-Method-Override atau _method
$override = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? ($_POST['_method'] ?? null);
if ($override) {
    $method = strtoupper($override);
}
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// CORS sederhana untuk pengujian antarmuka
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-HTTP-Method-Override');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

foreach ($routes as [$routeMethod, $pattern, $handler]) {
    if ($method !== $routeMethod) {
        continue;
    }
    if (preg_match($pattern, $uri, $matches)) {
        array_shift($matches);
        [$class, $action] = $handler;
        (new $class())->$action(...array_map('intval', $matches));
        return;
    }
}


// ---- Halaman web sederhana (di Laravel: routes/web.php + Blade views) ----
$pages = [
    '/'         => ['home.php',      'Beranda — Bengkel Motor API', 'home'],
    '/pelanggan' => ['pelanggan.php', 'Portal Pelanggan — Bengkel Motor API', 'pelanggan'],
    '/mekanik'   => ['mekanik.php',   'Layar Mekanik — Bengkel Motor API', 'mekanik'],
    '/admin'     => ['admin.php',     'Panel Admin — Bengkel Motor API', 'admin'],
    '/login'     => ['login.php',     'Masuk — Bengkel Motor API', 'login'],
    '/register'  => ['register.php',  'Daftar — Bengkel Motor API', 'register'],
    '/api-docs'  => ['api-docs.php',  'Dokumentasi API — Bengkel Motor API', 'home'],
];
if ($method === 'GET' && isset($pages[$uri])) {
    [$view, $title, $pageScript] = $pages[$uri];
    require __DIR__ . '/../views/' . $view;
    return;
}

// Dokumen API publik
if ($method === 'GET' && $uri === '/openapi.yaml') {
    header('Content-Type: text/yaml; charset=utf-8');
    readfile(__DIR__ . '/../docs/openapi.yaml');
    return;
}
if ($method === 'GET' && $uri === '/postman_collection.json') {
    header('Content-Type: application/json; charset=utf-8');
    readfile(__DIR__ . '/../docs/postman_collection.json');
    return;
}

// Rute tidak ditemukan
Response::error(404, 'Endpoint tidak ditemukan: ' . $method . ' ' . $uri);

