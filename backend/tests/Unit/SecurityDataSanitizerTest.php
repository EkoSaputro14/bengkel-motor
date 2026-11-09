<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Helpers\SecurityDataSanitizer;

class SecurityDataSanitizerTest extends TestCase
{
    public function test_it_masks_email_correctly(): void
    {
        $this->assertEquals('b***o@example.com', SecurityDataSanitizer::maskEmail('budi.santoso@example.com'));
        $this->assertEquals('a*@b.com', SecurityDataSanitizer::maskEmail('ab@b.com'));
        $this->assertEquals('***', SecurityDataSanitizer::maskEmail('invalid-email'));
    }

    public function test_it_masks_phone_number_correctly(): void
    {
        $this->assertEquals('0812*****890', SecurityDataSanitizer::maskPhone('081234567890'));
        $this->assertEquals('****', SecurityDataSanitizer::maskPhone('1234'));
        $this->assertEquals('***', SecurityDataSanitizer::maskPhone(''));
    }

    public function test_it_sanitizes_nested_payloads(): void
    {
        $payload = [
            'name' => 'Eko',
            'password' => 'secret123',
            'meta' => [
                'token' => 'jwt_secret_token',
                'device' => 'Android'
            ]
        ];

        $sanitized = SecurityDataSanitizer::sanitizePayload($payload);

        $this->assertEquals('[REDACTED]', $sanitized['password']);
        $this->assertEquals('[REDACTED]', $sanitized['meta']['token']);
        $this->assertEquals('Eko', $sanitized['name']);
        $this->assertEquals('Android', $sanitized['meta']['device']);
    }
}
