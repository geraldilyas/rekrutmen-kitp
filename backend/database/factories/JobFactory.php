<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    protected $model = Job::class;

    /**
     * Define the model's default state — an "active" job (already open, not yet closed).
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-2 weeks', '-1 days');

        return [
            'title' => $this->faker->jobTitle(),
            'category' => $this->faker->randomElement(['tenaga_pendukung', 'konsultan_individu']),
            'description' => $this->faker->paragraph(),
            'qualification' => $this->faker->sentence(),
            'requirements' => $this->faker->paragraph(),
            'duration' => $this->faker->randomElement(['3 Bulan', '6 Bulan', '1 Tahun']),
            'location' => $this->faker->city(),
            'unit_kerja' => $this->faker->randomElement(['BBWS Mesuji Sekampung', 'SNVT PB', 'Satker OPSDAMS']),
            'recruiter_name' => $this->faker->name(),
            'kuota' => $this->faker->numberBetween(1, 10),
            'start_date' => $start,
            'end_date' => $this->faker->dateTimeBetween('+2 weeks', '+2 months'),
            'deadline' => $this->faker->dateTimeBetween('+1 week', '+1 month'),
            'created_by' => User::factory()->state(['role' => 'admin']),
        ];
    }

    /**
     * Job that has not opened yet ("Akan Datang").
     */
    public function comingSoon(): static
    {
        return $this->state(fn () => [
            'start_date' => now()->addWeeks(2),
            'end_date' => now()->addMonths(2),
            'deadline' => now()->addMonths(1),
        ]);
    }

    /**
     * Job currently open for applications ("Berlangsung").
     */
    public function active(): static
    {
        return $this->state(fn () => [
            'start_date' => now()->subWeek(),
            'end_date' => now()->addMonth(),
            'deadline' => now()->addWeeks(2),
        ]);
    }

    /**
     * Job whose deadline and every stage has already passed ("Selesai").
     */
    public function finished(): static
    {
        return $this->state(fn () => [
            'start_date' => now()->subMonths(2),
            'end_date' => now()->subDays(3),
            'deadline' => now()->subWeek(),
        ]);
    }

    /**
     * Job with an explicit applicant quota.
     */
    public function withKuota(int $kuota = 5): static
    {
        return $this->state(fn () => ['kuota' => $kuota]);
    }

    /**
     * Job with no quota limit set.
     */
    public function noKuota(): static
    {
        return $this->state(fn () => ['kuota' => null]);
    }
}
