<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('saving_groups', function (Blueprint $table) {
            $table->boolean('bank_sponsored')->default(false)->after('status');
            $table->decimal('bank_fee_percent', 5, 2)->default(0)->after('bank_sponsored');
        });
    }

    public function down(): void
    {
        Schema::table('saving_groups', function (Blueprint $table) {
            $table->dropColumn(['bank_sponsored', 'bank_fee_percent']);
        });
    }
};
