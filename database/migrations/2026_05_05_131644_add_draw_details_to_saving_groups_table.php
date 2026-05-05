<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('saving_groups', function (Blueprint $table) {
            $table->date('start_date')->nullable();
            $table->integer('cycle_days')->default(15);
            $table->foreignId('current_winner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('next_draw_date')->nullable();
            $table->string('status')->default('waiting'); // waiting | active | completed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('saving_groups', function (Blueprint $table) {
            //
        });
    }
};
