<?php

namespace App\Notifications;

use App\Models\Application;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Dikirim ke pelamar sesaat setelah lamaran berhasil disimpan ke sistem.
 *
 * Catatan: sengaja TIDAK implements ShouldQueue. Project ini memakai
 * QUEUE_CONNECTION=database, namun tabel "jobs" sudah dipakai untuk data
 * lowongan kerja (bukan tabel antrian bawaan Laravel) dan migration untuk
 * tabel antrian (jobs/failed_jobs versi queue) belum ada. Kalau notifikasi
 * di-queue, pengiriman akan gagal diam-diam. Jadi email dikirim langsung
 * (synchronous) supaya pasti terkirim tanpa perlu queue worker.
 */
class ApplicationSubmitted extends Notification
{
    use Queueable;

    public function __construct(protected Application $application)
    {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $jobTitle = $this->application->job->title ?? 'Lowongan';
        $appliedAt = $this->application->applied_at
            ? Carbon::parse($this->application->applied_at)->translatedFormat('d F Y, H:i')
            : now()->translatedFormat('d F Y, H:i');

        $trackingUrl = rtrim(config('app.frontend_url'), '/') . '/status';

        return (new MailMessage)
            ->subject('Lamaran Anda Telah Kami Terima - ' . $jobTitle)
            ->greeting('Halo, ' . ($notifiable->name ?? 'Pelamar') . '!')
            ->line('Terima kasih telah mengajukan lamaran pada posisi **' . $jobTitle . '**.')
            ->line('Lamaran Anda telah berhasil kami terima dan akan segera diproses oleh tim rekrutmen.')
            ->line('**Nomor Lamaran:** #' . $this->application->id)
            ->line('**Tanggal Pengajuan:** ' . $appliedAt . ' WIB')
            ->line('**Status Saat Ini:** Menunggu Verifikasi')
            ->action('Pantau Status Lamaran', $trackingUrl)
            ->line('Kami akan mengirimkan email setiap kali status lamaran Anda berubah, termasuk saat Anda lolos maupun gugur pada setiap tahapan seleksi.')
            ->salutation('Salam, Tim Rekrutmen');
    }
}