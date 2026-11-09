<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ServiceSlot;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingApiTest extends TestCase
{
    use RefreshDatabase;

    private User $customer1;
    private User $customer2;
    private string $token1;
    private string $token2;
    private Vehicle $vehicle1;
    private Vehicle $vehicle2;
    private ServiceSlot $slot;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer1 = User::create([
            'nama' => 'Eko Saputro',
            'email' => 'eko@example.com',
            'no_hp' => '081234567890',
            'password' => bcrypt('password123'),
            'role' => 'CUSTOMER',
        ]);
        $this->token1 = $this->customer1->createToken('token1')->plainTextToken;

        $this->customer2 = User::create([
            'nama' => 'Siti Rahma',
            'email' => 'siti@example.com',
            'no_hp' => '081987654321',
            'password' => bcrypt('password123'),
            'role' => 'CUSTOMER',
        ]);
        $this->token2 = $this->customer2->createToken('token2')->plainTextToken;

        $this->vehicle1 = Vehicle::create([
            'user_id' => $this->customer1->id,
            'no_polisi' => 'G 1234 ABC',
            'merk' => 'Honda',
            'model' => 'Vario 160',
            'tahun' => 2023,
        ]);

        $this->vehicle2 = Vehicle::create([
            'user_id' => $this->customer2->id,
            'no_polisi' => 'B 9999 KKK',
            'merk' => 'Honda',
            'model' => 'Beat',
            'tahun' => 2021,
        ]);

        $this->slot = ServiceSlot::create([
            'tanggal' => '2026-10-06',
            'jam_mulai' => '08:00',
            'kuota_maksimal' => 2,
            'terisi' => 0,
        ]);
    }

    public function test_customer_can_create_auto_confirmed_booking(): void
    {
        $payload = [
            'vehicle_id' => $this->vehicle1->id,
            'slot_id' => $this->slot->id,
            'keluhan' => 'Ganti oli mesin MPX2 dan servis berkala',
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token1)
            ->postJson('/api/v1/bookings', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'status' => 'CONFIRMED',
                    'vehicle_id' => $this->vehicle1->id,
                    'slot_id' => $this->slot->id,
                ]
            ]);

        // Verify slot terisi is incremented
        $this->assertEquals(1, $this->slot->fresh()->terisi);
    }

    public function test_customer_cannot_book_with_unowned_vehicle(): void
    {
        // Customer 2 attempts to use Customer 1's vehicle
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token2)
            ->postJson('/api/v1/bookings', [
                'vehicle_id' => $this->vehicle1->id,
                'slot_id' => $this->slot->id,
                'keluhan' => 'Servis ilegal',
            ]);

        $response->assertStatus(403)
            ->assertJson(['status' => 'error']);

        $this->assertEquals(0, $this->slot->fresh()->terisi);
    }

    public function test_booking_rejected_when_slot_capacity_is_full(): void
    {
        // Fill the slot to max capacity (2)
        $this->slot->update(['terisi' => 2]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token1)
            ->postJson('/api/v1/bookings', [
                'vehicle_id' => $this->vehicle1->id,
                'slot_id' => $this->slot->id,
                'keluhan' => 'Ganti oli',
            ]);

        $response->assertStatus(409)
            ->assertJson([
                'status' => 'error',
            ]);
    }

    public function test_customer_can_cancel_booking_and_slot_capacity_is_restored(): void
    {
        // Create booking
        $booking = Booking::create([
            'booking_code' => 'BK-20261006-TEST1',
            'user_id' => $this->customer1->id,
            'vehicle_id' => $this->vehicle1->id,
            'slot_id' => $this->slot->id,
            'keluhan' => 'Cek rem',
            'status' => 'CONFIRMED',
        ]);
        $this->slot->increment('terisi');
        $this->assertEquals(1, $this->slot->fresh()->terisi);

        // Cancel booking
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token1)
            ->patchJson("/api/v1/bookings/{$booking->id}/cancel");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'status' => 'CANCELLED',
                ]
            ]);

        // Slot terisi must be decremented back to 0
        $this->assertEquals(0, $this->slot->fresh()->terisi);
    }

    public function test_admin_and_mechanic_can_update_booking_status(): void
    {
        $admin = User::create([
            'nama' => 'Admin Bengkel',
            'email' => 'admin@example.com',
            'no_hp' => '081299990000',
            'password' => bcrypt('password123'),
            'role' => 'ADMIN',
        ]);
        $adminToken = $admin->createToken('admin')->plainTextToken;

        $mechanic = User::create([
            'nama' => 'Joko Mekanik',
            'email' => 'joko@example.com',
            'no_hp' => '081299990001',
            'password' => bcrypt('password123'),
            'role' => 'MECHANIC',
        ]);
        $mechanicToken = $mechanic->createToken('mechanic')->plainTextToken;

        $booking = Booking::create([
            'booking_code' => 'BK-STATUS-TEST-1',
            'user_id' => $this->customer1->id,
            'vehicle_id' => $this->vehicle1->id,
            'slot_id' => $this->slot->id,
            'keluhan' => 'Servis CVT',
            'status' => 'CONFIRMED',
        ]);

        // 1. Admin updates status to in_progress (supports lowercase 'in_progress')
        $resAdmin = $this->withHeader('Authorization', 'Bearer ' . $adminToken)
            ->patchJson("/api/v1/bookings/{$booking->id}/status", [
                'status' => 'in_progress',
            ]);

        $resAdmin->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'status' => 'IN_PROGRESS',
                ]
            ]);

        $this->assertEquals('IN_PROGRESS', $booking->fresh()->status);

        // 2. Mechanic updates status to completed
        $resMech = $this->withHeader('Authorization', 'Bearer ' . $mechanicToken)
            ->patchJson("/api/v1/bookings/{$booking->id}/status", [
                'status' => 'completed',
            ]);

        $resMech->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'status' => 'COMPLETED',
                ]
            ]);

        $this->assertEquals('COMPLETED', $booking->fresh()->status);
    }

    public function test_customer_cannot_update_booking_status(): void
    {
        $booking = Booking::create([
            'booking_code' => 'BK-STATUS-TEST-2',
            'user_id' => $this->customer1->id,
            'vehicle_id' => $this->vehicle1->id,
            'slot_id' => $this->slot->id,
            'keluhan' => 'Cek rem',
            'status' => 'CONFIRMED',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token1)
            ->patchJson("/api/v1/bookings/{$booking->id}/status", [
                'status' => 'COMPLETED',
            ]);

        $response->assertStatus(403)
            ->assertJson(['status' => 'error']);
    }

    public function test_update_booking_status_validation_and_transitions(): void
    {
        $admin = User::create([
            'nama' => 'Admin Bengkel 2',
            'email' => 'admin2@example.com',
            'no_hp' => '081299990002',
            'password' => bcrypt('password123'),
            'role' => 'ADMIN',
        ]);
        $adminToken = $admin->createToken('admin2')->plainTextToken;

        $booking = Booking::create([
            'booking_code' => 'BK-STATUS-TEST-3',
            'user_id' => $this->customer1->id,
            'vehicle_id' => $this->vehicle1->id,
            'slot_id' => $this->slot->id,
            'keluhan' => 'Ganti oli',
            'status' => 'COMPLETED',
        ]);

        // 1. Cannot cancel completed booking (409 Conflict)
        $resCancelCompleted = $this->withHeader('Authorization', 'Bearer ' . $adminToken)
            ->patchJson("/api/v1/bookings/{$booking->id}/status", [
                'status' => 'CANCELLED',
            ]);

        $resCancelCompleted->assertStatus(409)
            ->assertJson(['status' => 'error']);

        // 2. Invalid status returns 422
        $resInvalid = $this->withHeader('Authorization', 'Bearer ' . $adminToken)
            ->patchJson("/api/v1/bookings/{$booking->id}/status", [
                'status' => 'invalid_status_xyz',
            ]);

        $resInvalid->assertStatus(422)
            ->assertJson(['status' => 'error']);
    }
}
