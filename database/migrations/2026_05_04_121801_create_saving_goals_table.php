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
        Schema::create('saving_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('target_amount', 10, 2);
            $table->decimal('saved_amount', 10, 2)->default(0);
            $table->decimal('daily_amount', 10, 2)->default(0);
            $table->string('saving_type')->default('auto_saving'); // auto_saving | challenge | smart_suggestion | group_saving
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status')->default('active'); // active | paused | completed
            $table->string('color')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saving_goals');
    }
};
