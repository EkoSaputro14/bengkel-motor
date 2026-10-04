<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_as_customer(): void
    {
        $payload = [
            'nama' => 'Ahmad Fauzi',
            'email' => 'ahmad@example.com',
            'no_hp' => '081234567890',
            'password' => 'secret123',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'user' => ['id', 'nama', 'email', 'role'],
                    'token',
                    'token_type'
                ]
            ])
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'user' => [
                        'email' => 'ahmad@example.com',
                        'role' => 'CUSTOMER'
                    ]
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'ahmad@example.com',
            'role' => 'CUSTOMER',
        ]);
    }

    public function test_registration_fails_with_invalid_data(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'nama' => '',
            'email' => 'invalid-email',
            'password' => '123',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'status',
                'message',
                'errors' => ['nama', 'email', 'no_hp', 'password']
            ])
            ->assertJson(['status' => 'error']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::create([
            'nama' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'no_hp' => '081299998888',
            'password' => bcrypt('password123'),
            'role' => 'CUSTOMER',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'budi@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'user',
                    'token',
                    'token_type'
                ]
            ])
            ->assertJson(['status' => 'success']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::create([
            'nama' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'no_hp' => '081299998888',
            'password' => bcrypt('password123'),
            'role' => 'CUSTOMER',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'budi@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'status' => 'error',
                'message' => 'Email atau password yang Anda masukkan salah.',
            ]);
    }

    public function test_authenticated_user_can_access_profile_and_logout(): void
    {
        $user = User::create([
            'nama' => 'Eko Saputro',
            'email' => 'eko@example.com',
            'no_hp' => '081234567890',
            'password' => bcrypt('password123'),
            'role' => 'CUSTOMER',
        ]);

        $token = $user->createToken('test_token')->plainTextToken;

        // Test GET /auth/me
        $meResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/auth/me');

        $meResponse->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'id' => $user->id,
                    'email' => 'eko@example.com',
                ]
            ]);

        // Test POST /auth/logout
        $logoutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/auth/logout');

        $logoutResponse->assertStatus(200)
            ->assertJson(['status' => 'success']);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401)
            ->assertJson([
                'status' => 'error',
            ]);
    }
}
