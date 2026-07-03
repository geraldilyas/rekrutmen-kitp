<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'nik' => $this->faker->numerify('################'),
            'phone' => $this->faker->numerify('08##########'),
            'role' => 'user',
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * A pelamar/applicant account (default role, kept for readability).
     */
    public function pelamar(): static
    {
        return $this->state(fn () => ['role' => 'user']);
    }

    /**
     * An admin account. Pass a level (1-3) to mirror the hierarchy used by
     * AdminUserController — L1 is the top-level admin, L3 the most restricted.
     */
    public function admin(int $level = 1): static
    {
        return $this->state(fn () => [
            'role' => 'admin',
            'admin_level' => $level,
            'nik' => null,
        ]);
    }

    /**
     * A penyeleksi (selection committee) account.
     */
    public function penyeleksi(): static
    {
        return $this->state(fn () => [
            'role' => 'penyeleksi',
            'nik' => null,
        ]);
    }
}
