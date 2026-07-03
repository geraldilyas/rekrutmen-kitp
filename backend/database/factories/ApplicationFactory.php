<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['role' => 'user']),
            'job_id' => Job::factory(),
            'status' => 'pending',
            'applied_at' => now(),
        ];
    }

    /**
     * Newly submitted application, not yet touched by any reviewer.
     */
    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'pending']);
    }

    /**
     * Application currently mid-way through the selection stages.
     */
    public function inSeleksi(): static
    {
        return $this->state(fn () => ['status' => 'seleksi']);
    }

    /**
     * Application that passed every stage.
     */
    public function lulus(): static
    {
        return $this->state(fn () => ['status' => 'Lulus']);
    }

    /**
     * Application rejected at some stage.
     */
    public function tidakLulus(): static
    {
        return $this->state(fn () => ['status' => 'Tidak Lulus']);
    }
}
