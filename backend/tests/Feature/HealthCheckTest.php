<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    /**
     * Test health check endpoint returns 200 and standard JSON envelope.
     */
    public function test_health_check_returns_successful_response(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'api_version',
                    'framework',
                    'timestamp',
                ]
            ])
            ->assertJson([
                'status' => 'success',
            ]);
    }
}
