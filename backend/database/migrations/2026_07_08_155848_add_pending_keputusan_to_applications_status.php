<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah nilai 'pending_keputusan' ke enum status di tabel applications.
     * Status ini digunakan saat pelamar sudah menyelesaikan semua tahap seleksi
     * namun belum ditentukan apakah masuk kuota atau tidak.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('applications', function (Blueprint $table) {
                $table->string('status')->default('pending')->change();
            });
        } else {
            DB::statement("ALTER TABLE applications MODIFY COLUMN status ENUM('pending','seleksi','Lulus','Tidak Lulus','pending_keputusan') DEFAULT 'pending'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('applications', function (Blueprint $table) {
                $table->string('status')->default('pending')->change();
            });
        } else {
            // Kembalikan ke enum semula (data pending_keputusan akan di-reset ke pending dulu)
            DB::statement("UPDATE applications SET status = 'pending' WHERE status = 'pending_keputusan'");
            DB::statement("ALTER TABLE applications MODIFY COLUMN status ENUM('pending','seleksi','Lulus','Tidak Lulus') DEFAULT 'pending'");
        }
    }
};
