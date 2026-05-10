<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('risk_scores', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('score')->default(50);

            $table->enum('level', [
                'excellent',
                'low',
                'medium',
                'high',
            ])->default('medium');

            $table->unsignedTinyInteger('identity_score')->default(0);
            $table->unsignedTinyInteger('security_score')->default(0);
            $table->unsignedTinyInteger('transaction_score')->default(0);
            $table->unsignedTinyInteger('loan_score')->default(0);
            $table->unsignedTinyInteger('saving_score')->default(0);

            $table->json('flags')->nullable();
            $table->json('recommendations')->nullable();

            $table->timestamp('calculated_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('risk_scores');
    }
};