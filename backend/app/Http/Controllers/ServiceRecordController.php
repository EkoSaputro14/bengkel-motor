<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRecordRequest;
use App\Models\Booking;
use App\Models\ServiceRecord;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceRecordController extends Controller
{
    public function store(StoreServiceRecordRequest $request): JsonResponse
    {
        $mechanic = $request->user();

        $booking = Booking::with('vehicle')->find($request->booking_id);

        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data booking tidak ditemukan.',
            ], 404);
        }

        if ($booking->status !== 'CONFIRMED') {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya booking berstatus CONFIRMED yang dapat dicatat pengerjaan servisnya. Status saat ini: ' . $booking->status,
            ], 409);
        }

        if ($booking->serviceRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking ini sudah memiliki catatan rekam servis.',
            ], 409);
        }

        $record = DB::transaction(function () use ($mechanic, $booking, $request) {
            $newRecord = ServiceRecord::create([
                'booking_id' => $booking->id,
                'mechanic_id' => $mechanic->id,
                'odometer_km' => (int) $request->odometer_km,
                'tindakan' => trim($request->tindakan),
                'suku_cadang' => $request->input('suku_cadang', []),
                'catatan_mekanik' => $request->filled('catatan_mekanik') ? trim($request->catatan_mekanik) : null,
            ]);

            // Update status booking menjadi COMPLETED
            $booking->update(['status' => 'COMPLETED']);

            return $newRecord;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Rekam servis berhasil dicatat dan status booking telah diselesaikan (COMPLETED).',
            'data' => $record->load(['booking.vehicle', 'mechanic:id,nama']),
        ], 201);
    }

    public function history(Request $request): JsonResponse
    {
        $query = ServiceRecord::with([
            'booking.vehicle.user:id,nama,email,no_hp',
            'booking.slot',
            'mechanic:id,nama,email'
        ]);

        if ($request->filled('no_polisi')) {
            $noPolisi = strtoupper(trim($request->no_polisi));
            $query->whereHas('booking.vehicle', function ($q) use ($noPolisi) {
                $q->where('no_polisi', $noPolisi);
            });
        } elseif ($request->filled('vehicle_id')) {
            $query->whereHas('booking', function ($q) use ($request) {
                $q->where('vehicle_id', $request->vehicle_id);
            });
        }

        $records = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Riwayat servis kendaraan berhasil diambil.',
            'data' => $records,
            'meta' => [
                'total_records' => $records->count(),
                'filter_no_polisi' => $request->no_polisi ?? null,
            ]
        ], 200);
    }

    public function show(ServiceRecord $serviceRecord): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Detail rekam servis berhasil diambil.',
            'data' => $serviceRecord->load([
                'booking.vehicle.user:id,nama,email,no_hp',
                'booking.slot',
                'mechanic:id,nama,email'
            ]),
        ], 200);
    }
}
