<?php

namespace App\Notifications;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Dikirim ke pelamar setiap kali status lamaran berubah:
 * - lolos suatu tahap (lanjut ke tahap berikutnya / status "seleksi")
 * - gugur/tidak lulus pada suatu tahap (status "Tidak Lulus")
 * - dinyatakan lulus akhir / diterima (status "Lulus")
 * - perubahan status manual oleh admin
 *
 * Catatan: sengaja TIDAK implements ShouldQueue, lihat penjelasan di
 * App\Notifications\ApplicationSubmitted.
 */
class ApplicationStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(
        protected Application $application,
        protected ?string $message = null
    ) {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $status = $this->application->status;
        $jobTitle = $this->application->job->title ?? 'Lowongan';
        $trackingUrl = rtrim(config('app.frontend_url'), '/') . '/status';

        [$subject, $heading, $level] = $this->presentation($status);

        $mail = (new MailMessage)
            ->subject($subject . ' - ' . $jobTitle)
            ->level($level)
            ->greeting('Halo, ' . ($notifiable->name ?? 'Pelamar') . '!')
            ->line($heading)
            ->line('**Posisi yang dilamar:** ' . $jobTitle)
            ->line('**Status terbaru:** ' . $status);

        if ($this->message) {
            $mail->line($this->message);
        }

        $mail->action('Lihat Detail di Website', $trackingUrl)
            ->line('Jika Anda memiliki pertanyaan terkait proses seleksi ini, silakan hubungi panitia rekrutmen.')
            ->salutation('Salam, Tim Rekrutmen');

        return $mail;
    }

    /**
     * @return array{0: string, 1: string, 2: string} [subject, heading, mail level]
     */
    protected function presentation(string $status): array
    {
        return match ($status) {
            'seleksi' => [
                'Anda Lolos ke Tahap Berikutnya',
                'Selamat! Anda dinyatakan **lolos** pada tahap seleksi sebelumnya dan berhak melanjutkan ke tahap berikutnya.',
                'success',
            ],
            'Lulus' => [
                'Selamat, Anda Dinyatakan Lulus',
                'Selamat! Anda dinyatakan **LULUS** pada keseluruhan proses seleksi rekrutmen ini.',
                'success',
            ],
            'Tidak Lulus' => [
                'Informasi Hasil Seleksi',
                'Kami informasikan bahwa Anda dinyatakan **tidak lulus / gugur** pada proses seleksi ini.',
                'error',
            ],
            'pending' => [
                'Lamaran Sedang Ditinjau',
                'Status lamaran Anda saat ini sedang **ditinjau** oleh tim rekrutmen.',
                'info',
            ],
            default => [
                'Update Status Lamaran',
                'Status lamaran Anda telah diperbarui.',
                'info',
            ],
        };
    }
}