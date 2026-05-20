<?php

namespace Database\Factories;

use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    protected $model = Job::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->jobTitle(),
            'category' => $this->faker->randomElement(['tenaga_pendukung', 'konsultan_individu']),
            'description' => $this->faker->paragraph(),
            'requirements' => $this->faker->paragraph(),
            'deadline' => $this->faker->dateTimeBetween('now', '+1 month'),
        ];
    }
}
