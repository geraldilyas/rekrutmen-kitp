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
        Schema::create('blacklisted_niks', function (Blueprint $table) {
            $table->id();
            $table->string('nik', 16)->unique();
            $table->string('name')->nullable();
            $table->text('reason')->nullable();
            $table->foreignId('blacklisted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blacklisted_niks');
    }
};
