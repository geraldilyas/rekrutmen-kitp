<?php

namespace App\Console\Commands;

use App\Models\Application;
use App\Notifications\ApplicationReminder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendApplicationReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-application-reminders {--days=7 : Minimum days without a status update before reminding}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Email applicants whose application has been stuck in pending/seleksi with no status update for a while, so they remember it is still being processed.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');
        $threshold = now()->subDays($days);

        $applications = Application::with(['user', 'job', 'stageResults.stage'])
            ->whereIn('status', ['pending', 'seleksi'])
            ->where('updated_at', '<=', $threshold)
            ->where(function ($q) use ($threshold) {
                $q->whereNull('last_reminder_at')
                  ->orWhere('last_reminder_at', '<=', $threshold);
            })
            ->get();

        $sent = 0;

        foreach ($applications as $application) {
            if (!$application->user) {
                continue;
            }

            try {
                $daysSinceUpdate = $application->updated_at->diffInDays(now());
                $application->user->notify(new ApplicationReminder($application, $daysSinceUpdate));
                $application->update(['last_reminder_at' => now()]);
                $sent++;
            } catch (\Exception $e) {
                Log::error('Gagal mengirim email pengingat lamaran #' . $application->id . ': ' . $e->getMessage());
            }
        }

        $this->info("Reminder terkirim ke {$sent} dari {$applications->count()} lamaran yang memenuhi kriteria.");

        return self::SUCCESS;
    }
}
