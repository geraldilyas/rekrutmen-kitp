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
        Schema::table('jobs', function (Blueprint $table) {
            // Menambahkan kolom kuota tipe integer, boleh null (nullable), ditaruh setelah kolom deskripsi/tertentu
            $table->integer('kuota')->nullable()->default(0)->after('description'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            // Menghapus kembali kolom kuota jika migration di-rollback
            $table->dropColumn('kuota');
        });
    }
};