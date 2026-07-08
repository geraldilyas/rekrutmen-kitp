<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ubah start_date, end_date, dan deadline pada tabel jobs dari DATE menjadi
     * DATETIME, supaya admin bisa menentukan jam buka & jam tutup lowongan
     * (tidak cuma tanggalnya saja).
     *
     * Catatan: SQLite tidak punya tipe kolom yang ketat (semua kolom tanggal
     * disimpan sebagai TEXT di baliknya), jadi kolom lama sudah otomatis bisa
     * menyimpan jam tanpa perlu ALTER TABLE. Perintah ALTER di bawah hanya
     * dijalankan untuk driver yang benar-benar menegakkan tipe kolom (MySQL).
     */
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE jobs MODIFY start_date DATETIME NULL');
            DB::statement('ALTER TABLE jobs MODIFY end_date DATETIME NULL');
            DB::statement('ALTER TABLE jobs MODIFY deadline DATETIME NULL');
        }
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE jobs MODIFY start_date DATE NULL');
            DB::statement('ALTER TABLE jobs MODIFY end_date DATE NULL');
            DB::statement('ALTER TABLE jobs MODIFY deadline DATE NULL');
        }
    }
};