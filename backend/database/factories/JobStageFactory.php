<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\JobStage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobStage>
 */
class JobStageFactory extends Factory
{
    protected $model = JobStage::class;

    public function definition(): array
    {
        return [
            'job_id' => Job::factory(),
            'name' => $this->faker->randomElement(['Seleksi Administrasi', 'Tes Kompetensi', 'Wawancara']),
            'stage_order' => 1,
            'weight' => 100,
            'start_date' => now()->subWeek(),
            'end_date' => now()->addWeek(),
            'grading_end_date' => now()->addWeek(),
            'info' => null,
        ];
    }

    /**
     * The document-checking stage (weight is 0 here — set explicitly per job).
     */
    public function administrasi(): static
    {
        return $this->state(fn () => ['name' => 'Seleksi Administrasi']);
    }

    /**
     * A stage whose grading window has already closed.
     */
    public function gradingClosed(): static
    {
        return $this->state(fn () => [
            'start_date' => now()->subMonth(),
            'end_date' => now()->subWeeks(2),
            'grading_end_date' => now()->subWeek(),
        ]);
    }

    /**
     * A stage that has not opened for grading yet.
     */
    public function notStartedYet(): static
    {
        return $this->state(fn () => [
            'start_date' => now()->addWeek(),
            'end_date' => now()->addMonth(),
            'grading_end_date' => now()->addMonth(),
        ]);
    }
}
