<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Remind applicants once a day whose application has been stuck without a
// status update for 7+ days (email deduplicated via last_reminder_at).
Schedule::command('app:send-application-reminders')->daily();

// Rilis hasil penilaian tahapan seleksi secara otomatis ke pelamar dan kirim email
// notifikasi secara serentak ketika tanggal tahapan telah berakhir.
Schedule::command('app:release-stage-results')->hourly();

// Terbitkan otomatis pengumuman PDF hasil setiap tahapan (NIK, skor, status,
// diurutkan skor tertinggi) begitu masa penilaian tahapan tersebut berakhir.
Schedule::command('app:publish-stage-announcements')->hourly();

