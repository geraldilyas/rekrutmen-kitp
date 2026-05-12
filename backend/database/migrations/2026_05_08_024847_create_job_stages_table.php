<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_stages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('job_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');

            // urutan tahapan
            $table->integer('stage_order');

            // tanggal mulai tahapan
            $table->date('start_date');

            // tanggal selesai tahapan
            $table->date('end_date');

            // tipe tahapan
            $table->enum('type', [
                'registration',
                'selection',
                'test',
                'interview',
                'announcement'
            ]);

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_stages');
    }
};