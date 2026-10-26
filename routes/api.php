<?php
/**
 * Tabel routing API.
 * Di Laravel: routes/api.php + Route::middleware('auth:sanctum')...
 */
$routes = [
    // Autentikasi (publik)
    ['POST',   '#^/api/auth/register$#',            [App\Controllers\AuthController::class, 'register']],
    ['POST',   '#^/api/auth/login$#',               [App\Controllers\AuthController::class, 'login']],
    // Autentikasi (token)
    ['GET',    '#^/api/auth/me$#',                  [App\Controllers\AuthController::class, 'me']],
    ['POST',   '#^/api/auth/logout$#',              [App\Controllers\AuthController::class, 'logout']],

    // CRUD kendaraan pelanggan
    ['GET',    '#^/api/vehicles$#',                 [App\Controllers\VehicleController::class, 'index']],
    ['POST',   '#^/api/vehicles$#',                 [App\Controllers\VehicleController::class, 'store']],
    ['PUT',    '#^/api/vehicles/(\d+)$#',           [App\Controllers\VehicleController::class, 'update']],
    ['DELETE', '#^/api/vehicles/(\d+)$#',           [App\Controllers\VehicleController::class, 'destroy']],

    // Kuota slot servis
    ['GET',    '#^/api/slots/available$#',          [App\Controllers\SlotController::class, 'available']],
    ['GET',    '#^/api/slots$#',                    [App\Controllers\SlotController::class, 'index']],
    ['POST',   '#^/api/slots$#',                    [App\Controllers\SlotController::class, 'store']],

    // Reservasi & pembatalan booking
    ['GET',    '#^/api/bookings$#',                 [App\Controllers\BookingController::class, 'index']],
    ['POST',   '#^/api/bookings$#',                 [App\Controllers\BookingController::class, 'store']],
    ['GET',    '#^/api/bookings/(\d+)$#',           [App\Controllers\BookingController::class, 'show']],
    ['DELETE', '#^/api/bookings/(\d+)$#',           [App\Controllers\BookingController::class, 'cancel']],
    ['PUT',    '#^/api/bookings/(\d+)/status$#',    [App\Controllers\BookingController::class, 'updateStatus']],

    // Logbook servis & riwayat
    ['POST',   '#^/api/service-records$#',          [App\Controllers\ServiceRecordController::class, 'store']],
    ['GET',    '#^/api/history$#',                  [App\Controllers\ServiceRecordController::class, 'history']],
];

return $routes;
