<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordCode extends Notification
{
    protected $code;

    public function __construct(string $code)
    {
        $this->code = $code;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Kode Verifikasi Reset Kata Sandi')
            ->greeting('Halo, ' . $notifiable->name)
            ->line('Anda menerima email ini karena kami menerima permintaan reset kata sandi untuk akun Anda.')
            ->line('Gunakan kode verifikasi berikut untuk melanjutkan proses reset kata sandi:')
            ->line('**' . $this->code . '**')
            ->line('Kode ini hanya berlaku selama 15 menit.')
            ->line('Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini.');
    }
}
