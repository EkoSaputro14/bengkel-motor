<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Vehicle::with('user:id,nama,email,no_hp');

        if ($user->role === 'CUSTOMER') {
            $query->where('user_id', $user->id);
        } elseif ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('no_polisi', 'like', "%{$search}%")
                  ->orWhere('merk', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
            });
        }

        $vehicles = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar kendaraan berhasil diambil.',
            'data' => $vehicles,
        ], 200);
    }

    public function store(StoreVehicleRequest $request): JsonResponse
    {
        $user = $request->user();
        $targetUserId = ($user->role === 'ADMIN' && $request->filled('user_id'))
            ? $request->user_id
            : $user->id;

        $vehicle = Vehicle::create([
            'user_id' => $targetUserId,
            'no_polisi' => strtoupper(trim($request->no_polisi)),
            'merk' => trim($request->merk),
            'model' => trim($request->model),
            'tahun' => (int) $request->tahun,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kendaraan berhasil didaftarkan.',
            'data' => $vehicle->load('user:id,nama,email,no_hp'),
        ], 201);
    }

    public function show(Request $request, Vehicle $vehicle): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'CUSTOMER' && $vehicle->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Anda bukan pemilik kendaraan ini.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Detail kendaraan berhasil diambil.',
            'data' => $vehicle->load(['user:id,nama,email,no_hp', 'bookings.slot', 'bookings.serviceRecord']),
        ], 200);
    }

    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'CUSTOMER' && $vehicle->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Anda bukan pemilik kendaraan ini.',
            ], 403);
        }

        $vehicle->update([
            'no_polisi' => strtoupper(trim($request->no_polisi)),
            'merk' => trim($request->merk),
            'model' => trim($request->model),
            'tahun' => (int) $request->tahun,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kendaraan berhasil diperbarui.',
            'data' => $vehicle->fresh()->load('user:id,nama,email,no_hp'),
        ], 200);
    }

    public function destroy(Request $request, Vehicle $vehicle): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'CUSTOMER' && $vehicle->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Anda bukan pemilik kendaraan ini.',
            ], 403);
        }

        // Check if vehicle has active confirmed bookings
        $hasActiveBooking = $vehicle->bookings()->where('status', 'CONFIRMED')->exists();
        if ($hasActiveBooking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kendaraan tidak dapat dihapus karena memiliki jadwal booking aktif yang belum selesai.',
            ], 409);
        }

        $vehicle->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kendaraan berhasil dihapus.',
            'data' => null,
        ], 200);
    }
}
