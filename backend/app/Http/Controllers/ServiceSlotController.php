<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceSlotRequest;
use App\Models\ServiceSlot;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceSlotController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($request->has('tanggal')) {
            $validator = Validator::make($request->all(), [
                'tanggal' => 'date_format:Y-m-d',
            ], [
                'tanggal.date_format' => 'Parameter tanggal harus berformat YYYY-MM-DD (contoh: ' . now()->format('Y-m-d') . ').',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Format parameter tanggal tidak valid.',
                    'errors' => $validator->errors(),
                ], 422);
            }
        }

        $tanggal = $request->query('tanggal', Carbon::today()->format('Y-m-d'));

        $slots = ServiceSlot::where('tanggal', $tanggal)
            ->orderBy('jam_mulai', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Data slot servis berhasil diambil.',
            'data' => $slots,
            'meta' => [
                'tanggal' => $tanggal,
                'total_slots' => $slots->count(),
                'available_slots' => $slots->where('is_available', true)->count(),
            ]
        ], 200);
    }

    public function store(StoreServiceSlotRequest $request): JsonResponse
    {
        $existing = ServiceSlot::where('tanggal', $request->tanggal)
            ->where('jam_mulai', $request->jam_mulai)
            ->first();

        if ($existing) {
            return response()->json([
                'status' => 'error',
                'message' => 'Slot servis untuk tanggal dan jam tersebut sudah ada.',
                'errors' => [
                    'slot' => ['Kombinasi tanggal dan jam mulai sudah terdaftar.']
                ]
            ], 409);
        }

        $slot = ServiceSlot::create([
            'tanggal' => $request->tanggal,
            'jam_mulai' => $request->jam_mulai,
            'kuota_maksimal' => (int) $request->kuota_maksimal,
            'terisi' => 0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Slot servis baru berhasil ditambahkan.',
            'data' => $slot,
        ], 201);
    }

    public function update(Request $request, ServiceSlot $serviceSlot): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'kuota_maksimal' => 'required|integer|min:' . $serviceSlot->terisi,
        ], [
            'kuota_maksimal.min' => 'Kuota maksimal tidak boleh lebih kecil dari jumlah kuota yang sudah terisi (' . $serviceSlot->terisi . ').',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $serviceSlot->update([
            'kuota_maksimal' => (int) $request->kuota_maksimal,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kuota slot servis berhasil diperbarui.',
            'data' => $serviceSlot->fresh(),
        ], 200);
    }

    public function generateBatch(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date_format:Y-m-d',
            'days' => 'required|integer|min:1|max:30',
            'kuota_per_slot' => 'nullable|integer|min:1|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi generate batch gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $startDate = Carbon::createFromFormat('Y-m-d', $request->start_date);
        $days = (int) $request->days;
        $kuota = (int) ($request->kuota_per_slot ?? 4);
        $jamList = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

        $createdCount = 0;

        for ($d = 0; $d < $days; $d++) {
            $currentDate = $startDate->copy()->addDays($d)->format('Y-m-d');
            foreach ($jamList as $jam) {
                $exists = ServiceSlot::where('tanggal', $currentDate)
                    ->where('jam_mulai', $jam)
                    ->exists();

                if (!$exists) {
                    ServiceSlot::create([
                        'tanggal' => $currentDate,
                        'jam_mulai' => $jam,
                        'kuota_maksimal' => $kuota,
                        'terisi' => 0,
                    ]);
                    $createdCount++;
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => "Berhasil men-generate {$createdCount} slot servis baru.",
            'data' => [
                'created_count' => $createdCount,
                'start_date' => $request->start_date,
                'days' => $days,
            ]
        ], 200);
    }
}
