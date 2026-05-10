<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropUnique('appointments_date_time_unique');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->unique(
                ['agent_id', 'date', 'time'],
                'appointments_agent_date_time_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropUnique('appointments_agent_date_time_unique');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->unique(['date', 'time'], 'appointments_date_time_unique');
        });
    }
};
