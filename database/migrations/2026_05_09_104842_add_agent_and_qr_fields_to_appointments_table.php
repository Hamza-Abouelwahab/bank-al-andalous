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
        Schema::table('appointments', function (Blueprint $table) {
            $table->foreignId('agent_id')
                ->nullable()
                ->after('user_id')
                ->constrained('users')
                ->nullOnDelete();

            $table->string('qr_token')
                ->nullable()
                ->unique()
                ->after('status');

            $table->timestamp('checked_in_at')
                ->nullable()
                ->after('qr_token');

            $table->text('notes')
                ->nullable()
                ->after('checked_in_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['agent_id']);
            $table->dropColumn([
                'agent_id',
                'qr_token',
                'checked_in_at',
                'notes',
            ]);
        });
        }
};
