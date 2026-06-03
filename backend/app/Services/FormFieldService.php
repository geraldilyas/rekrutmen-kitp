<?php

namespace App\Services;

use App\Models\FormField;

class FormFieldService
{
    /**
     * Get all form fields.
     */
    public function getAllFields()
    {
        return FormField::all();
    }

    /**
     * Create a new form field.
     */
    public function createField(array $data)
    {
        return FormField::create([
            'label' => strip_tags($data['label']),
            'type' => $data['type'],
            'options' => $data['options'] ?? null,
            'is_required' => $data['is_required'] ?? false,
            'category' => $data['category']
        ]);
    }
}
