<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ubah start_date, end_date, dan grading_end_date pada tabel job_stages dari
     * DATE menjadi DATETIME, supaya tiap tahapan seleksi juga bisa punya jam
     * mulai & jam selesai sendiri (bukan cuma tanggal).
     *
     * Model JobStage sudah lama meng-cast kolom ini sebagai 'datetime', tapi
     * kolom di database masih bertipe DATE sehingga jamnya selalu terpotong
     * jadi 00:00:00. Migration ini menyamakan tipe kolom dengan cast model.
     */
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE job_stages MODIFY start_date DATETIME NULL');
            DB::statement('ALTER TABLE job_stages MODIFY end_date DATETIME NULL');
            DB::statement('ALTER TABLE job_stages MODIFY grading_end_date DATETIME NULL');
        }
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE job_stages MODIFY start_date DATE NULL');
            DB::statement('ALTER TABLE job_stages MODIFY end_date DATE NULL');
            DB::statement('ALTER TABLE job_stages MODIFY grading_end_date DATE NULL');
        }
    }
};