<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('saving_groups', function (Blueprint $table) {
            $table->string('visibility')->default('private')->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('saving_groups', function (Blueprint $table) {
            $table->dropColumn('visibility');
        });
    }
};
