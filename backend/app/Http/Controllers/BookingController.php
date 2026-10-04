<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\ServiceSlot;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $user = $request->user();

        // 1. Verifikasi kepemilikan kendaraan (Customer)
        $vehicle = Vehicle::find($request->vehicle_id);

        if (!$vehicle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kendaraan tidak ditemukan.',
            ], 404);
        }

        if ($user->role === 'CUSTOMER' && $vehicle->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Anda tidak berhak melakukan booking untuk kendaraan milik orang lain.',
            ], 403);
        }

        // 2. Cek apakah kendaraan ini sudah memiliki booking aktif (CONFIRMED) pada slot yang sama
        $duplicateBooking = Booking::where('vehicle_id', $vehicle->id)
            ->where('slot_id', $request->slot_id)
            ->where('status', 'CONFIRMED')
            ->exists();

        if ($duplicateBooking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kendaraan ini sudah memiliki reservasi aktif pada slot waktu yang dipilih.',
                'errors' => [
                    'vehicle_id' => ['Kendaraan sudah terdaftar pada jadwal ini.']
                ]
            ], 409);
        }

        // 3. Eksekusi transaksi atomik dengan Pessimistic Row Locking
        try {
            $booking = DB::transaction(function () use ($user, $vehicle, $request) {
                // Lock baris slot servis untuk mencegah race condition (overbooking)
                $slot = ServiceSlot::where('id', $request->slot_id)
                    ->lockForUpdate()
                    ->first();

                if (!$slot) {
                    throw new \Exception('Slot waktu tidak ditemukan.', 404);
                }

                // Evaluasi kapasitas aktual
                if ($slot->terisi >= $slot->kuota_maksimal) {
                    throw new \Exception('Kuota slot servis pada jam tersebut telah penuh.', 409);
                }

                // Format kode booking unik: BK-YYYYMMDD-XXXXX
                $datePrefix = str_replace('-', '', $slot->tanggal->format('Y-m-d'));
                $randomSuffix = strtoupper(Str::random(5));
                $bookingCode = "BK-{$datePrefix}-{$randomSuffix}";

                // Buat record booking dengan status AUTO-CONFIRM
                $newBooking = Booking::create([
                    'booking_code' => $bookingCode,
                    'user_id' => $vehicle->user_id,
                    'vehicle_id' => $vehicle->id,
                    'slot_id' => $slot->id,
                    'keluhan' => trim($request->keluhan),
                    'status' => 'CONFIRMED',
                ]);

                // Naikkan counter slot secara atomik
                $slot->increment('terisi');

                return $newBooking;
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Reservasi servis berhasil dibuat dan terkonfirmasi otomatis (Auto-Confirmed).',
                'data' => $booking->load(['vehicle', 'slot', 'user:id,nama,email,no_hp']),
            ], 201);

        } catch (\Exception $e) {
            $statusCode = $e->getCode();
            if (!in_array($statusCode, [400, 404, 409, 422], true)) {
                $statusCode = 409;
            }

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'errors' => [
                    'slot_id' => [$e->getMessage()]
                ]
            ], $statusCode);
        }
    }

    public function show(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'CUSTOMER' && $booking->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Anda bukan pemilik booking ini.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Detail booking berhasil diambil.',
            'data' => $booking->load(['user:id,nama,email,no_hp', 'vehicle', 'slot', 'serviceRecord.mechanic:id,nama']),
        ], 200);
    }

    public function cancel(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'CUSTOMER' && $booking->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Anda tidak berhak membatalkan booking ini.',
            ], 403);
        }

        if ($booking->status === 'COMPLETED') {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking yang sudah selesai diservis (COMPLETED) tidak dapat dibatalkan.',
            ], 409);
        }

        if ($booking->status === 'CANCELLED') {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking ini sudah dibatalkan sebelumnya.',
            ], 400);
        }

        DB::transaction(function () use ($booking) {
            $booking->update(['status' => 'CANCELLED']);

            // Kurangi kuota terisi pada slot jika masih ada
            $slot = ServiceSlot::where('id', $booking->slot_id)->lockForUpdate()->first();
            if ($slot && $slot->terisi > 0) {
                $slot->decrement('terisi');
            }
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Reservasi booking berhasil dibatalkan.',
            'data' => $booking->fresh()->load(['vehicle', 'slot']),
        ], 200);
    }

    public function customerBookings(Request $request): JsonResponse
    {
        $user = $request->user();

        $bookings = Booking::where('user_id', $user->id)
            ->with(['vehicle', 'slot', 'serviceRecord.mechanic:id,nama'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Riwayat booking pelanggan berhasil diambil.',
            'data' => $bookings,
        ], 200);
    }

    public function mechanicQueue(Request $request): JsonResponse
    {
        $bookings = Booking::where('status', 'CONFIRMED')
            ->with(['vehicle.user:id,nama,no_hp', 'slot'])
            ->join('service_slots', 'bookings.slot_id', '=', 'service_slots.id')
            ->orderBy('service_slots.tanggal', 'asc')
            ->orderBy('service_slots.jam_mulai', 'asc')
            ->select('bookings.*')
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Antrean servis aktif mekanik berhasil diambil.',
            'data' => $bookings,
        ], 200);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Booking::with(['user:id,nama,email,no_hp', 'vehicle', 'slot', 'serviceRecord']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tanggal')) {
            $query->whereHas('slot', function ($q) use ($request) {
                $q->where('tanggal', $request->tanggal);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                  ->orWhereHas('vehicle', function ($vq) use ($search) {
                      $vq->where('no_polisi', 'like', "%{$search}%");
                  })
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('nama', 'like', "%{$search}%");
                  });
            });
        }

        $bookings = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar semua booking berhasil diambil.',
            'data' => $bookings,
        ], 200);
    }
}
