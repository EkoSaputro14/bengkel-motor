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
        Schema::create('service_slots', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('jam_mulai', 10); // e.g. "08:00", "09:00"
            $table->integer('kuota_maksimal')->default(4);
            $table->integer('terisi')->default(0);
            $table->timestamps();

            $table->unique(['tanggal', 'jam_mulai'], 'uk_slot_waktu');
            $table->index('tanggal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_slots');
    }
};
