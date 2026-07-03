<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\ApplicationStageResult;
use App\Models\JobStage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApplicationStageResult>
 */
class ApplicationStageResultFactory extends Factory
{
    protected $model = ApplicationStageResult::class;

    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'job_stage_id' => JobStage::factory(),
            'status' => 'pending',
            'score' => null,
            'notes' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ];
    }

    /**
     * Awaiting a reviewer, not scored yet.
     */
    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => 'pending',
            'score' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ]);
    }

    /**
     * Graded and passed.
     */
    public function lulus(int $score = 85, ?User $reviewer = null, ?string $notes = null): static
    {
        return $this->state(fn () => [
            'status' => 'lulus',
            'score' => $score,
            'notes' => $notes,
            'reviewed_by' => $reviewer?->id ?? User::factory()->admin(),
            'reviewed_at' => now(),
        ]);
    }

    /**
     * Graded and rejected.
     */
    public function tidakLulus(int $score = 40, ?User $reviewer = null, ?string $notes = null): static
    {
        return $this->state(fn () => [
            'status' => 'tidak_lulus',
            'score' => $score,
            'notes' => $notes,
            'reviewed_by' => $reviewer?->id ?? User::factory()->admin(),
            'reviewed_at' => now(),
        ]);
    }
}
