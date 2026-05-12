<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FormFieldSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fields = [
            ['label' => 'Nama Lengkap', 'type' => 'text', 'category' => 'data_diri'],
            ['label' => 'Email', 'type' => 'email', 'category' => 'data_diri'],
            ['label' => 'Nomor HP', 'type' => 'text', 'category' => 'data_diri'],
            ['label' => 'CV', 'type' => 'link', 'category' => 'berkas'],
            ['label' => 'Portofolio', 'type' => 'link', 'category' => 'berkas'],
            ['label' => 'KTP', 'type' => 'link', 'category' => 'berkas'],
        ];

        foreach ($fields as $field) {
            FormField::create($field);
        }
    }
}
