<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\ServiceRecord;
use App\Models\ServiceSlot;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboardStats(): JsonResponse
    {
        $today = Carbon::today()->format('Y-m-d');

        $totalUsers = User::where('role', 'CUSTOMER')->count();
        $totalMechanics = User::where('role', 'MECHANIC')->count();
        $totalVehicles = Vehicle::count();
        $totalBookings = Booking::count();
        $confirmedBookings = Booking::where('status', 'CONFIRMED')->count();
        $completedBookings = Booking::where('status', 'COMPLETED')->count();
        $cancelledBookings = Booking::where('status', 'CANCELLED')->count();

        $todaySlots = ServiceSlot::where('tanggal', $today)->get();
        $todayCapacity = $todaySlots->sum('kuota_maksimal');
        $todayOccupied = $todaySlots->sum('terisi');

        $recentBookings = Booking::with(['user:id,nama,no_hp', 'vehicle', 'slot'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Statistik dashboard admin berhasil diambil.',
            'data' => [
                'counts' => [
                    'total_customers' => $totalUsers,
                    'total_mechanics' => $totalMechanics,
                    'total_vehicles' => $totalVehicles,
                    'total_bookings' => $totalBookings,
                    'confirmed_bookings' => $confirmedBookings,
                    'completed_bookings' => $completedBookings,
                    'cancelled_bookings' => $cancelledBookings,
                ],
                'today_occupancy' => [
                    'date' => $today,
                    'total_capacity' => $todayCapacity,
                    'total_occupied' => $todayOccupied,
                    'occupancy_rate' => $todayCapacity > 0 ? round(($todayOccupied / $todayCapacity) * 100, 1) : 0,
                ],
                'recent_bookings' => $recentBookings,
            ]
        ], 200);
    }

    public function usersList(Request $request): JsonResponse
    {
        $query = User::withCount(['vehicles', 'bookings']);

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar pengguna berhasil diambil.',
            'data' => $users,
        ], 200);
    }
}
