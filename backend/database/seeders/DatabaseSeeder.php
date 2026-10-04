<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\ServiceRecord;
use App\Models\ServiceSlot;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users
        $admin = User::create([
            'nama' => 'Budi Santoso (Admin Bengkel)',
            'email' => 'admin@bengkelmotor.test',
            'no_hp' => '081211112222',
            'password' => Hash::make('password123'),
            'role' => 'ADMIN',
        ]);

        $mechanic = User::create([
            'nama' => 'Agus Prasetyo (Mekanik)',
            'email' => 'mechanic@bengkelmotor.test',
            'no_hp' => '081233334444',
            'password' => Hash::make('password123'),
            'role' => 'MECHANIC',
        ]);

        $customer1 = User::create([
            'nama' => 'Eko Saputro',
            'email' => 'eko@bengkelmotor.test',
            'no_hp' => '081234567890',
            'password' => Hash::make('password123'),
            'role' => 'CUSTOMER',
        ]);

        $customer2 = User::create([
            'nama' => 'Siti Rahma',
            'email' => 'siti@bengkelmotor.test',
            'no_hp' => '081987654321',
            'password' => Hash::make('password123'),
            'role' => 'CUSTOMER',
        ]);

        // 2. Seed Vehicles
        $vehicle1 = Vehicle::create([
            'user_id' => $customer1->id,
            'no_polisi' => 'G 1234 ABC',
            'merk' => 'Honda',
            'model' => 'Vario 160 ABS',
            'tahun' => 2023,
        ]);

        $vehicle2 = Vehicle::create([
            'user_id' => $customer1->id,
            'no_polisi' => 'G 5678 XYZ',
            'merk' => 'Yamaha',
            'model' => 'NMAX 155 Connected',
            'tahun' => 2022,
        ]);

        $vehicle3 = Vehicle::create([
            'user_id' => $customer2->id,
            'no_polisi' => 'B 9999 KKK',
            'merk' => 'Honda',
            'model' => 'Beat Deluxe 110',
            'tahun' => 2021,
        ]);

        // 3. Seed Service Slots (Today and Next 7 Days)
        $jamList = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
        $today = Carbon::today();
        $seededSlots = [];

        for ($d = 0; $d <= 7; $d++) {
            $dateStr = $today->copy()->addDays($d)->format('Y-m-d');
            foreach ($jamList as $jam) {
                $slot = ServiceSlot::create([
                    'tanggal' => $dateStr,
                    'jam_mulai' => $jam,
                    'kuota_maksimal' => 4,
                    'terisi' => 0,
                ]);
                $seededSlots[$dateStr][$jam] = $slot;
            }
        }

        // 4. Seed Past Completed Booking & Record (History)
        $pastDate = $today->copy()->subDays(10)->format('Y-m-d');
        $pastSlot = ServiceSlot::create([
            'tanggal' => $pastDate,
            'jam_mulai' => '09:00',
            'kuota_maksimal' => 4,
            'terisi' => 1,
        ]);

        $pastBooking = Booking::create([
            'booking_code' => 'BK-' . str_replace('-', '', $pastDate) . '-00101',
            'user_id' => $customer1->id,
            'vehicle_id' => $vehicle1->id,
            'slot_id' => $pastSlot->id,
            'keluhan' => 'Servis berkala 8.000 KM dan ganti oli gardan',
            'status' => 'COMPLETED',
            'created_at' => $pastDate . ' 08:30:00',
        ]);

        ServiceRecord::create([
            'booking_id' => $pastBooking->id,
            'mechanic_id' => $mechanic->id,
            'odometer_km' => 8450,
            'tindakan' => 'Pembersihan filter udara, penyetelan celah katup, ganti oli mesin dan oli gardan.',
            'suku_cadang' => [
                [
                    'nama' => 'Oli Mesin MPX2 0.8L',
                    'qty' => 1,
                    'keterangan' => 'Penggantian rutin',
                ],
                [
                    'nama' => 'Oli Gardan Scooter Gear Oil',
                    'qty' => 1,
                    'keterangan' => 'Penggantian berkala',
                ],
                [
                    'nama' => 'Busi NGK CPR9EA-9',
                    'qty' => 1,
                    'keterangan' => 'Penggantian busi baru',
                ],
            ],
            'catatan_mekanik' => 'Kondisi kampas rem depan masih 70%, v-belt dalam batas toleransi aman.',
            'created_at' => $pastDate . ' 10:15:00',
        ]);

        // 5. Seed Active Confirmed Booking for Today (For Mechanic Queue)
        $todayStr = $today->format('Y-m-d');
        $activeSlot = $seededSlots[$todayStr]['08:00'];
        $activeSlot->increment('terisi');

        Booking::create([
            'booking_code' => 'BK-' . str_replace('-', '', $todayStr) . '-00201',
            'user_id' => $customer1->id,
            'vehicle_id' => $vehicle2->id,
            'slot_id' => $activeSlot->id,
            'keluhan' => 'Tarikan motor gredek di RPM rendah saat akselerasi awal',
            'status' => 'CONFIRMED',
            'created_at' => now(),
        ]);
    }
}
