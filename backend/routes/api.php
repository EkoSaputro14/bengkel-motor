<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Bengkel Motor API (/api/v1)
|--------------------------------------------------------------------------
*/

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

Route::prefix('v1')->group(function () {
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

    // Auth & Protected Routes will be registered in subsequent phases
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', function (Request $request) {
            return response()->json([
                'status' => 'success',
                'message' => 'User profile retrieved successfully.',
                'data' => $request->user()
            ]);
        });
    });
});
