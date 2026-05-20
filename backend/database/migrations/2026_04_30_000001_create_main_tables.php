<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('category', ['tenaga_pendukung', 'konsultan_individu']);
            $table->string('type')->nullable();
            $table->text('description')->nullable();
            $table->text('qualification')->nullable();
            $table->string('duration')->nullable();
            $table->string('location')->nullable();
            $table->string('unit_kerja')->nullable();
            $table->string('recruiter_name')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });

        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('type');
            $table->boolean('is_required')->default(false);
            $table->json('options')->nullable();
            $table->enum('category', ['data_diri', 'berkas', 'tahapan']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_fields');
        Schema::dropIfExists('jobs');
    }
};
