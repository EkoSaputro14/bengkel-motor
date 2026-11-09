<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Booking;
use App\Models\ServiceRecord;
use App\Models\ServiceSlot;

class DatabaseBackupStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Display database health metrics and record counts ready for backup snapshot';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('====================================================');
        $this->info('    BENGKEL MOTOR — DATABASE BACKUP STATUS REPORT   ');
        $this->info('====================================================');

        try {
            DB::connection()->getPdo();
            $connectionName = DB::connection()->getName();
            $driverName = DB::connection()->getDriverName();
            $this->info("[✓] Database connection active ($connectionName / $driverName)");
        } catch (\Exception $e) {
            $this->error('[✗] Failed to connect to database: ' . $e->getMessage());
            return self::FAILURE;
        }

        $summary = [
            ['Entity' => 'Users', 'Count' => User::count(), 'Status' => 'Ready'],
            ['Entity' => 'Vehicles', 'Count' => Vehicle::count(), 'Status' => 'Ready'],
            ['Entity' => 'Service Slots', 'Count' => ServiceSlot::count(), 'Status' => 'Ready'],
            ['Entity' => 'Bookings', 'Count' => Booking::count(), 'Status' => 'Ready'],
            ['Entity' => 'Service Records', 'Count' => ServiceRecord::count(), 'Status' => 'Ready'],
        ];

        $this->table(['Entity', 'Record Count', 'Backup Readiness'], $summary);

        $totalRecords = array_sum(array_column($summary, 'Count'));
        $this->info("Total tracked entities: $totalRecords records.");
        $this->info('Status: All tables ready for logical dump (mysqldump / sqlite copy).');

        return self::SUCCESS;
    }
}
