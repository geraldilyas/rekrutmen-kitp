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
        Schema::table('job_stages', function (Blueprint $table) {
            $table->decimal('weight', 5, 2)->default(0)->after('type'); // Bobot %
            $table->string('test_link')->nullable()->after('weight'); // Link tes luar
        });

        Schema::table('application_stage_results', function (Blueprint $table) {
            $table->decimal('score', 8, 2)->nullable()->after('status'); // Skor dari tim penyeleksi
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->decimal('final_score', 8, 2)->nullable()->after('status'); // Hasil kalkulasi sistem
        });
        
        // Ensure NIK is unique
        Schema::table('users', function (Blueprint $table) {
            $table->string('nik')->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_stages', function (Blueprint $table) {
            $table->dropColumn(['weight', 'test_link']);
        });

        Schema::table('application_stage_results', function (Blueprint $table) {
            $table->dropColumn('score');
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn('final_score');
        });
    }
};
