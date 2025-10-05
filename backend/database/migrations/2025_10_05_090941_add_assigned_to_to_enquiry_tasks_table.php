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
        Schema::table('enquiry_tasks', function (Blueprint $table) {
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null')->after('assigned_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enquiry_tasks', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropColumn('assigned_to');
        });
    }
};
