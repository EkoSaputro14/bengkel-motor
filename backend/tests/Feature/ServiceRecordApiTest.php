<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ServiceRecord;
use App\Models\ServiceSlot;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceRecordApiTest extends TestCase
{
    use RefreshDatabase;

    private User $mechanic;
    private User $customer;
    private string $mechanicToken;
    private string $customerToken;
    private Vehicle $vehicle;
    private Booking $booking;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mechanic = User::create([
            'nama' => 'Agus Mekanik',
            'email' => 'agus@example.com',
            'no_hp' => '081299991111',
            'password' => bcrypt('password123'),
            'role' => 'MECHANIC',
        ]);
        $this->mechanicToken = $this->mechanic->createToken('mech')->plainTextToken;

        $this->customer = User::create([
            'nama' => 'Eko Saputro',
            'email' => 'eko@example.com',
            'no_hp' => '081234567890',
            'password' => bcrypt('password123'),
            'role' => 'CUSTOMER',
        ]);
        $this->customerToken = $this->customer->createToken('cust')->plainTextToken;

        $this->vehicle = Vehicle::create([
            'user_id' => $this->customer->id,
            'no_polisi' => 'G 1234 ABC',
            'merk' => 'Honda',
            'model' => 'Vario 160',
            'tahun' => 2023,
        ]);

        $slot = ServiceSlot::create([
            'tanggal' => '2026-10-06',
            'jam_mulai' => '08:00',
            'kuota_maksimal' => 4,
            'terisi' => 1,
        ]);

        $this->booking = Booking::create([
            'booking_code' => 'BK-20261006-00001',
            'user_id' => $this->customer->id,
            'vehicle_id' => $this->vehicle->id,
            'slot_id' => $slot->id,
            'keluhan' => 'Ganti oli mesin dan setel rantai roda',
            'status' => 'CONFIRMED',
        ]);
    }

    public function test_mechanic_can_submit_service_record_and_complete_booking(): void
    {
        $payload = [
            'booking_id' => $this->booking->id,
            'odometer_km' => 10250,
            'tindakan' => 'Penggantian oli mesin MPX2, pembersihan CVT, penyetelan rantai roda.',
            'suku_cadang' => [
                [
                    'nama' => 'Oli Mesin MPX2 0.8L',
                    'qty' => 1,
                    'keterangan' => 'Penggantian rutin',
                ],
                [
                    'nama' => 'Roller Set Vario 160',
                    'qty' => 1,
                    'keterangan' => 'Penggantian aus',
                ]
            ],
            'catatan_mekanik' => 'V-belt masih bagus, disarankan servis CVT lagi di 18.000 KM.',
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->mechanicToken)
            ->postJson('/api/v1/service-records', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'odometer_km' => 10250,
                    'mechanic_id' => $this->mechanic->id,
                ]
            ]);

        // Booking status must now be COMPLETED
        $this->assertEquals('COMPLETED', $this->booking->fresh()->status);
    }

    public function test_customer_cannot_submit_service_record(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->customerToken)
            ->postJson('/api/v1/service-records', [
                'booking_id' => $this->booking->id,
                'odometer_km' => 5000,
                'tindakan' => 'Coba manipulasi data',
            ]);

        $response->assertStatus(403)
            ->assertJson(['status' => 'error']);
    }

    public function test_can_query_service_history_by_license_plate(): void
    {
        // Create a completed service record first
        ServiceRecord::create([
            'booking_id' => $this->booking->id,
            'mechanic_id' => $this->mechanic->id,
            'odometer_km' => 10250,
            'tindakan' => 'Servis berkala',
            'suku_cadang' => [['nama' => 'Oli Mesin', 'qty' => 1]],
            'catatan_mekanik' => 'Kondisi baik',
        ]);
        $this->booking->update(['status' => 'COMPLETED']);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->customerToken)
            ->getJson('/api/v1/service-history?no_polisi=G 1234 ABC');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'meta' => [
                    'total_records' => 1,
                    'filter_no_polisi' => 'G 1234 ABC',
                ]
            ])
            ->assertJsonPath('data.0.odometer_km', 10250);
    }
}
