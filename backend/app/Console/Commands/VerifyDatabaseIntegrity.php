<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\ServiceSlot;
use App\Models\Booking;
use App\Models\ServiceRecord;

class VerifyDatabaseIntegrity extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:verify-integrity';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Audit relational data integrity across the 5 core entities of Bengkel Motor';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('====================================================');
        $this->info('  BENGKEL MOTOR — RELATIONAL DATA INTEGRITY AUDIT   ');
        $this->info('====================================================');

        $errors = 0;
        $tableData = [];

        // 1. Audit Users Table
        $userCount = User::count();
        $customerCount = User::where('role', 'CUSTOMER')->count();
        $mechanicCount = User::where('role', 'MECHANIC')->count();
        $adminCount = User::where('role', 'ADMIN')->count();

        $tableData[] = [
            'Entity' => 'Users',
            'Records' => $userCount,
            'Check' => 'Role Distribution',
            'Details' => "Cust: $customerCount | Mech: $mechanicCount | Admin: $adminCount",
            'Status' => $userCount > 0 ? 'VALID' : 'WARNING (Empty)'
        ];

        // 2. Audit Vehicles Orphan Check
        $vehicleCount = Vehicle::count();
        $orphanVehicles = Vehicle::whereNotIn('user_id', User::select('id'))->count();
        if ($orphanVehicles > 0) $errors++;

        $tableData[] = [
            'Entity' => 'Vehicles',
            'Records' => $vehicleCount,
            'Check' => 'Foreign Key (user_id)',
            'Details' => $orphanVehicles === 0 ? 'Zero orphan records' : "$orphanVehicles orphan vehicles found",
            'Status' => $orphanVehicles === 0 ? 'VALID' : 'CORRUPTED'
        ];

        // 3. Audit Service Slots Capacity
        $slotCount = ServiceSlot::count();
        $overflowSlots = ServiceSlot::whereColumn('terisi', '>', 'kuota_maksimal')->count();
        if ($overflowSlots > 0) $errors++;

        $tableData[] = [
            'Entity' => 'Service Slots',
            'Records' => $slotCount,
            'Check' => 'Capacity Consistency',
            'Details' => $overflowSlots === 0 ? 'terisi <= kuota_maksimal across all slots' : "$overflowSlots slots exceeded quota",
            'Status' => $overflowSlots === 0 ? 'VALID' : 'CORRUPTED'
        ];

        // 4. Audit Bookings Foreign Keys
        $bookingCount = Booking::count();
        $orphanBookingsVeh = Booking::whereNotIn('vehicle_id', Vehicle::select('id'))->count();
        $orphanBookingsSlot = Booking::whereNotIn('slot_id', ServiceSlot::select('id'))->count();
        $bookingOrphans = $orphanBookingsVeh + $orphanBookingsSlot;
        if ($bookingOrphans > 0) $errors++;

        $tableData[] = [
            'Entity' => 'Bookings',
            'Records' => $bookingCount,
            'Check' => 'FK (vehicle_id & slot_id)',
            'Details' => $bookingOrphans === 0 ? 'All FK references intact' : "Orphans: Veh($orphanBookingsVeh) Slot($orphanBookingsSlot)",
            'Status' => $bookingOrphans === 0 ? 'VALID' : 'CORRUPTED'
        ];

        // 5. Audit Service Records Foreign Keys
        $recordCount = ServiceRecord::count();
        $orphanRecords = ServiceRecord::whereNotIn('booking_id', Booking::select('id'))->count();
        if ($orphanRecords > 0) $errors++;

        $tableData[] = [
            'Entity' => 'Service Records',
            'Records' => $recordCount,
            'Check' => 'FK (booking_id)',
            'Details' => $orphanRecords === 0 ? 'All records tied to valid booking' : "$orphanRecords orphan service records",
            'Status' => $orphanRecords === 0 ? 'VALID' : 'CORRUPTED'
        ];

        // 6. Quota Non-Negative Check
        $negativeSlots = ServiceSlot::where('terisi', '<', 0)->count();
        if ($negativeSlots > 0) $errors++;

        $tableData[] = [
            'Entity' => 'Slot Guard',
            'Records' => $slotCount,
            'Check' => 'Non-negative Quota Guard',
            'Details' => $negativeSlots === 0 ? 'All slot terisi >= 0' : "$negativeSlots slots with negative count",
            'Status' => $negativeSlots === 0 ? 'VALID' : 'CORRUPTED'
        ];

        $this->table(['Entity', 'Records', 'Check', 'Details', 'Status'], $tableData);

        if ($errors === 0) {
            $this->info("\n[SUCCESS] All relational integrity checks passed. Database is consistent and clean.\n");
            return Command::SUCCESS;
        }

        $this->error("\n[FAILED] Found $errors integrity error(s). Please review the corrupted entities.\n");
        return Command::FAILURE;
    }
}
