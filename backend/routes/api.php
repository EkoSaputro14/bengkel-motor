<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceRecordController;
use App\Http\Controllers\ServiceSlotController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| REST API Routes - Bengkel Motor (/api/v1)
|--------------------------------------------------------------------------
*/

// Global Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Bengkel Motor REST API is healthy and operational.',
        'data' => [
            'app_name' => config('app.name', 'Bengkel Motor API'),
            'framework' => 'Laravel ' . app()->version(),
            'php_version' => PHP_VERSION,
            'timestamp' => now()->toIso8601String(),
        ]
    ], 200);
});

// Version 1 API Routes
Route::prefix('v1')->group(function () {

    // 01. Health Check v1
    Route::get('/health', function () {
        return response()->json([
            'status' => 'success',
            'message' => 'Bengkel Motor REST API v1 is operational.',
            'data' => [
                'api_version' => 'v1',
                'framework' => 'Laravel ' . app()->version(),
                'timestamp' => now()->toIso8601String(),
            ]
        ], 200);
    });

    // 02. Public Authentication Endpoints
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // 03. Public/Protected Service Slot Query
    Route::get('/service-slots', [ServiceSlotController::class, 'index']);

    // 04. Authenticated Endpoints (Bearer Token Required)
    Route::middleware('auth:sanctum')->group(function () {

        // User Auth Profile & Logout
        Route::prefix('auth')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });

        // Vehicles Resource
        Route::apiResource('vehicles', VehicleController::class);

        // Service History Lookup by no_polisi
        Route::get('/service-history', [ServiceRecordController::class, 'history']);
        Route::get('/service-records/{serviceRecord}', [ServiceRecordController::class, 'show']);

        // Booking Show & Cancel
        Route::get('/bookings/{booking}', [BookingController::class, 'show']);
        Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

        // Customer Specific Routes
        Route::middleware('role:CUSTOMER,ADMIN')->group(function () {
            Route::post('/bookings', [BookingController::class, 'store']);
            Route::get('/customer/bookings', [BookingController::class, 'customerBookings']);
        });

        // Mechanic Specific Routes
        Route::middleware('role:MECHANIC,ADMIN')->group(function () {
            Route::get('/mechanic/bookings', [BookingController::class, 'mechanicQueue']);
            Route::post('/service-records', [ServiceRecordController::class, 'store']);
        });

        // Admin Specific Routes
        Route::middleware('role:ADMIN')->prefix('admin')->group(function () {
            Route::get('/stats', [AdminController::class, 'dashboardStats']);
            Route::get('/users', [AdminController::class, 'usersList']);
            Route::get('/bookings', [BookingController::class, 'index']);
            Route::post('/service-slots', [ServiceSlotController::class, 'store']);
            Route::put('/service-slots/{serviceSlot}', [ServiceSlotController::class, 'update']);
            Route::post('/service-slots/batch', [ServiceSlotController::class, 'generateBatch']);
        });
    });
});
