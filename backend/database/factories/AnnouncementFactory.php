<?php

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    public function definition(): array
    {
        return [
            'job_id' => Job::factory()->finished(),
            'title' => 'Hasil Akhir Seleksi',
            'file_path' => 'announcements/dummy-' . $this->faker->uuid() . '.pdf',
            'published_at' => now()->subDays(2),
        ];
    }
}
