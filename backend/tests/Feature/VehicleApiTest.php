<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehicleApiTest extends TestCase
{
    use RefreshDatabase;

    private User $customer1;
    private User $customer2;
    private string $token1;
    private string $token2;

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
    }

    public function test_customer_can_create_and_list_vehicles(): void
    {
        $payload = [
            'no_polisi' => 'G 1234 ABC',
            'merk' => 'Honda',
            'model' => 'Vario 160',
            'tahun' => 2023,
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token1)
            ->postJson('/api/v1/vehicles', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'no_polisi' => 'G 1234 ABC',
                    'merk' => 'Honda',
                    'model' => 'Vario 160',
                    'tahun' => 2023,
                    'user_id' => $this->customer1->id,
                ]
            ]);

        // List vehicles - should contain 1 vehicle
        $listResponse = $this->withHeader('Authorization', 'Bearer ' . $this->token1)
            ->getJson('/api/v1/vehicles');

        $listResponse->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.no_polisi', 'G 1234 ABC');
    }

    public function test_customer_cannot_view_or_update_other_customers_vehicle(): void
    {
        $vehicle1 = Vehicle::create([
            'user_id' => $this->customer1->id,
            'no_polisi' => 'G 1111 AAA',
            'merk' => 'Honda',
            'model' => 'Beat',
            'tahun' => 2020,
        ]);

        // Customer 2 tries to view Vehicle 1
        $viewResponse = $this->withHeader('Authorization', 'Bearer ' . $this->token2)
            ->getJson("/api/v1/vehicles/{$vehicle1->id}");

        $viewResponse->assertStatus(403)
            ->assertJson(['status' => 'error']);

        // Customer 2 tries to update Vehicle 1
        $updateResponse = $this->withHeader('Authorization', 'Bearer ' . $this->token2)
            ->putJson("/api/v1/vehicles/{$vehicle1->id}", [
                'no_polisi' => 'G 9999 HACK',
                'merk' => 'Yamaha',
                'model' => 'Mio',
                'tahun' => 2020,
            ]);

        $updateResponse->assertStatus(403)
            ->assertJson(['status' => 'error']);
    }

    public function test_duplicate_license_plate_is_rejected(): void
    {
        Vehicle::create([
            'user_id' => $this->customer1->id,
            'no_polisi' => 'G 1234 DUP',
            'merk' => 'Honda',
            'model' => 'PCX 160',
            'tahun' => 2022,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token2)
            ->postJson('/api/v1/vehicles', [
                'no_polisi' => 'G 1234 DUP',
                'merk' => 'Yamaha',
                'model' => 'Aerox',
                'tahun' => 2021,
            ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'status',
                'errors' => ['no_polisi']
            ]);
    }
}
