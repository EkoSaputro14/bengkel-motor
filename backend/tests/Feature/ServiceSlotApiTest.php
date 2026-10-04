<?php

namespace Tests\Feature;

use App\Models\ServiceSlot;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ServiceSlotApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_query_service_slots_for_date(): void
    {
        ServiceSlot::create([
            'tanggal' => '2026-10-06',
            'jam_mulai' => '08:00',
            'kuota_maksimal' => 4,
            'terisi' => 1,
        ]);

        ServiceSlot::create([
            'tanggal' => '2026-10-06',
            'jam_mulai' => '09:00',
            'kuota_maksimal' => 4,
            'terisi' => 4,
        ]);

        $response = $this->getJson('/api/v1/service-slots?tanggal=2026-10-06');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'meta' => [
                    'tanggal' => '2026-10-06',
                    'total_slots' => 2,
                    'available_slots' => 1,
                ]
            ])
            ->assertJsonPath('data.0.sisa_kuota', 3)
            ->assertJsonPath('data.0.is_available', true)
            ->assertJsonPath('data.1.sisa_kuota', 0)
            ->assertJsonPath('data.1.is_available', false);
    }

    public function test_invalid_date_query_parameter_returns_422_error(): void
    {
        // Praktikum C - Error testing with invalid format
        $response = $this->getJson('/api/v1/service-slots?tanggal=besok-pagi');

        $response->assertStatus(422)
            ->assertJsonStructure([
                'status',
                'message',
                'errors' => ['tanggal']
            ])
            ->assertJson(['status' => 'error']);
    }

    public function test_customer_cannot_create_slot_returns_forbidden(): void
    {
        $customer = User::create([
            'nama' => 'Customer',
            'email' => 'cust@example.com',
            'no_hp' => '081233334444',
            'password' => bcrypt('password123'),
            'role' => 'CUSTOMER',
        ]);

        Sanctum::actingAs($customer);

        $response = $this->postJson('/api/v1/admin/service-slots', [
            'tanggal' => '2026-10-10',
            'jam_mulai' => '08:00',
            'kuota_maksimal' => 4,
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_new_slot(): void
    {
        $admin = User::create([
            'nama' => 'Admin Bengkel',
            'email' => 'admin@example.com',
            'no_hp' => '081211112222',
            'password' => bcrypt('password123'),
            'role' => 'ADMIN',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/v1/admin/service-slots', [
            'tanggal' => '2026-10-10',
            'jam_mulai' => '08:00',
            'kuota_maksimal' => 5,
        ]);

        $response->assertStatus(201)
            ->assertJson(['status' => 'success']);
    }
}
