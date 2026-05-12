<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('category', ['tenaga_pendukung', 'konsultan_individu']);
            $table->string('type')->nullable();
            $table->text('description')->nullable();
            $table->text('qualification')->nullable();
            $table->text('requirements')->nullable();
            $table->string('duration')->nullable();
            $table->string('location')->nullable();
            $table->string('unit_kerja')->nullable();
            $table->string('recruiter_name')->nullable();
            $table->json('form_fields')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('deadline')->nullable();
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

        Schema::create('archives', function (Blueprint $table) {
            $table->id();
            $table->string('file');
            $table->string('title');
            $table->timestamps();
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('file_path');
            $table->timestamp('published_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('archives');
        Schema::dropIfExists('form_fields');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('personal_access_tokens');
    }
};
