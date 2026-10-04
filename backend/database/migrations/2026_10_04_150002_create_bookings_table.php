<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code', 30)->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('vehicle_id')->constrained('vehicles')->onDelete('restrict');
            $table->foreignId('slot_id')->constrained('service_slots')->onDelete('restrict');
            $table->text('keluhan');
            $table->enum('status', ['CONFIRMED', 'CANCELLED', 'COMPLETED'])->default('CONFIRMED');
            $table->timestamps();

            $table->index('user_id');
            $table->index('vehicle_id');
            $table->index('slot_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
