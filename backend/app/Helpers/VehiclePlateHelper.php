<?php

namespace App\Helpers;

class VehiclePlateHelper
{
    /**
     * Normalize license plate format (e.g., 'g 1234 abc' -> 'G 1234 ABC').
     */
    public static function normalize(string $plate): string
    {
        $cleaned = strtoupper(trim($plate));
        // Remove excessive inner spaces
        $cleaned = preg_replace('/\s+/', ' ', $cleaned);

        // Pattern: [A-Z]{1,2} [0-9]{1,4} [A-Z]{1,3}
        if (preg_match('/^([A-Z]{1,2})\s*([0-9]{1,4})\s*([A-Z]{1,3})$/', $cleaned, $matches)) {
            return "{$matches[1]} {$matches[2]} {$matches[3]}";
        }

        return $cleaned;
    }

    /**
     * Validate standard Indonesian police plate format.
     */
    public static function isValid(string $plate): bool
    {
        $normalized = self::normalize($plate);
        return (bool) preg_match('/^[A-Z]{1,2}\s[0-9]{1,4}\s[A-Z]{1,3}$/', $normalized);
    }
}
