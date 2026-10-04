<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ErrorHandlingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_nonexistent_endpoint_returns_404(): void
    {
        // Praktikum C: Endpoint tidak tersedia
        $response = $this->getJson('/api/v1/slot-kosong-tidak-ada');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
            ]);
    }

    public function test_unsupported_method_returns_405(): void
    {
        // Praktikum C: Method tidak didukung (PUT to /service-slots)
        $response = $this->putJson('/api/v1/service-slots', [
            'foo' => 'bar'
        ]);

        $response->assertStatus(405)
            ->assertJson([
                'status' => 'error',
            ]);
    }

    public function test_missing_required_fields_returns_422(): void
    {
        $user = User::create([
            'nama' => 'Eko Saputro',
            'email' => 'eko@example.com',
            'no_hp' => '081234567890',
            'password' => bcrypt('password123'),
            'role' => 'CUSTOMER',
        ]);
        $token = $user->createToken('token')->plainTextToken;

        // Praktikum C: Hilangkan field wajib pada request POST
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/bookings', [
                // vehicle_id and slot_id missing
                'keluhan' => 'Servis tanpa kendaraan',
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'status',
                'message',
                'errors' => ['vehicle_id', 'slot_id']
            ])
            ->assertJson(['status' => 'error']);
    }
}
