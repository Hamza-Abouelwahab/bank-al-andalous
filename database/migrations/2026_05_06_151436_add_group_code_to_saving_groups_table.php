<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('saving_groups', function (Blueprint $table) {
            $table->string('group_code', 6)->unique()->nullable()->after('visibility');
        });
    }

    public function down(): void
    {
        Schema::table('saving_groups', function (Blueprint $table) {
            $table->dropColumn('group_code');
        });
    }
};
