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
        Schema::create('service_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->unique()->constrained('bookings')->onDelete('restrict');
            $table->foreignId('mechanic_id')->constrained('users')->onDelete('restrict');
            $table->integer('odometer_km');
            $table->text('tindakan');
            $table->json('suku_cadang')->nullable();
            $table->text('catatan_mekanik')->nullable();
            $table->timestamps();

            $table->index('booking_id');
            $table->index('mechanic_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_records');
    }
};
