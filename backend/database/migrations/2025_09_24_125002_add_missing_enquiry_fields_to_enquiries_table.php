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
        Schema::table('enquiries', function (Blueprint $table) {
            $table->string('client_name')->after('expected_delivery_date');
            $table->renameColumn('title', 'project_name');
            $table->foreignId('client_id')->nullable()->change();
            // project_deliverables already exists, no need to rename description
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enquiries', function (Blueprint $table) {
            $table->dropColumn('client_name');
            $table->renameColumn('project_name', 'title');
            $table->foreignId('client_id')->nullable(false)->change();
            // project_deliverables stays as is
        });
    }
};
