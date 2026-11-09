<?php

namespace App\Helpers;

class SecurityDataSanitizer
{
    /**
     * Mask email address for logging and partial public display.
     * Example: budi.santoso@example.com -> b***o@example.com
     */
    public static function maskEmail(?string $email): string
    {
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return '***';
        }

        [$username, $domain] = explode('@', $email);
        $len = strlen($username);

        if ($len <= 2) {
            $maskedUsername = substr($username, 0, 1) . '*';
        } else {
            $maskedUsername = substr($username, 0, 1) . '***' . substr($username, -1);
        }

        return $maskedUsername . '@' . $domain;
    }

    /**
     * Mask phone number for logging and privacy protection.
     * Example: 081234567890 -> 0812****7890
     */
    public static function maskPhone(?string $phone): string
    {
        if (empty($phone)) {
            return '***';
        }

        $clean = preg_replace('/[^\d+]/', '', $phone);
        $len = strlen($clean);

        if ($len <= 4) {
            return str_repeat('*', $len);
        }

        $start = substr($clean, 0, 4);
        $end = substr($clean, -3);
        $maskedMiddle = str_repeat('*', max(2, $len - 7));

        return $start . $maskedMiddle . $end;
    }

    /**
     * Sanitize array payload from sensitive key credentials.
     */
    public static function sanitizePayload(array $payload): array
    {
        $sensitiveKeys = ['password', 'password_confirmation', 'token', 'access_token', 'api_key', 'secret'];

        foreach ($payload as $key => $value) {
            if (in_array(strtolower($key), $sensitiveKeys, true)) {
                $payload[$key] = '[REDACTED]';
            } elseif (is_array($value)) {
                $payload[$key] = self::sanitizePayload($value);
            }
        }

        return $payload;
    }
}
