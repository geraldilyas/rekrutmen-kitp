<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Repurpose job_stages.test_link (a short URL field) into a free-text
     * "info" field describing the stage, shown to applicants and printed
     * on the stage's announcement PDF.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('ALTER TABLE job_stages RENAME COLUMN test_link TO info');
        } else {
            DB::statement('ALTER TABLE job_stages CHANGE test_link info TEXT NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('ALTER TABLE job_stages RENAME COLUMN info TO test_link');
        } else {
            DB::statement('ALTER TABLE job_stages CHANGE info test_link VARCHAR(255) NULL');
        }
    }
};
