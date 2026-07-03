<?php

namespace App\Notifications;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Dikirim secara berkala ke pelamar yang lamarannya belum bergerak
 * (masih "pending" atau "seleksi") selama beberapa hari, supaya pelamar
 * tetap ingat bahwa lamarannya sedang diproses.
 *
 * Sengaja TIDAK implements ShouldQueue, lihat App\Notifications\ApplicationSubmitted
 * untuk alasannya (tabel antrian bawaan Laravel belum tersedia di proyek ini).
 */
class ApplicationReminder extends Notification
{
    use Queueable;

    public function __construct(protected Application $application, protected int $daysSinceUpdate)
    {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $jobTitle = $this->application->job->title ?? 'Lowongan';
        $stageName = $this->application->status === 'seleksi'
            ? $this->application->stageResults->firstWhere('status', 'pending')?->stage?->name
            : null;
        $trackingUrl = rtrim(config('app.frontend_url'), '/') . '/status';

        $mail = (new MailMessage)
            ->subject('Pengingat: Lamaran Anda Masih Diproses - ' . $jobTitle)
            ->level('info')
            ->greeting('Halo, ' . ($notifiable->name ?? 'Pelamar') . '!')
            ->line('Ini pengingat bahwa lamaran Anda pada posisi **' . $jobTitle . '** masih dalam proses seleksi dan belum ada pembaruan selama ' . $this->daysSinceUpdate . ' hari terakhir.');

        if ($stageName) {
            $mail->line('**Tahap saat ini:** ' . $stageName);
        }

        $mail->line('Tidak perlu melakukan apa pun — tim rekrutmen sedang meninjau lamaran Anda. Kami akan segera mengabari begitu ada perkembangan.')
            ->action('Pantau Status Lamaran', $trackingUrl)
            ->salutation('Salam, Tim Rekrutmen');

        return $mail;
    }
}
