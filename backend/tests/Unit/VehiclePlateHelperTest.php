<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Helpers\VehiclePlateHelper;

class VehiclePlateHelperTest extends TestCase
{
    public function test_it_normalizes_plate_number(): void
    {
        $this->assertEquals('G 1234 ABC', VehiclePlateHelper::normalize('g 1234 abc'));
        $this->assertEquals('B 999 XY', VehiclePlateHelper::normalize('  b999xy '));
        $this->assertEquals('AB 12 Z', VehiclePlateHelper::normalize('ab 12 z'));
    }

    public function test_it_validates_plate_number(): void
    {
        $this->assertTrue(VehiclePlateHelper::isValid('G 1234 ABC'));
        $this->assertTrue(VehiclePlateHelper::isValid('b 123 x'));
        $this->assertFalse(VehiclePlateHelper::isValid('INVALID123'));
        $this->assertFalse(VehiclePlateHelper::isValid('1234 ABC'));
    }
}
