<?php

namespace Database\Factories;

use App\Models\FormField;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FormField>
 */
class FormFieldFactory extends Factory
{
    protected $model = FormField::class;

    public function definition(): array
    {
        return [
            'label' => $this->faker->unique()->words(2, true),
            'type' => 'text',
            'is_required' => true,
            'category' => 'data_diri',
        ];
    }

    /**
     * A required-document field (category = berkas), e.g. "SKCK", "Sertifikat Vaksin".
     */
    public function dokumen(string $label): static
    {
        return $this->state(fn () => [
            'label' => $label,
            'type' => 'url',
            'category' => 'berkas',
            'is_required' => true,
        ]);
    }
}
