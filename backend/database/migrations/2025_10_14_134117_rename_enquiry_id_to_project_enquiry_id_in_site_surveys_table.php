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
        Schema::table('site_surveys', function (Blueprint $table) {
            $table->renameColumn('enquiry_id', 'project_enquiry_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_surveys', function (Blueprint $table) {
            $table->renameColumn('project_enquiry_id', 'enquiry_id');
        });
    }
};
