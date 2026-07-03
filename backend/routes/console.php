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
