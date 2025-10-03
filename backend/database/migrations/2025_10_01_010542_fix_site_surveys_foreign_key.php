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
            // Drop the old foreign key constraint
            $table->dropForeign(['enquiry_id']);

            // Add the correct foreign key constraint
            $table->foreign('enquiry_id')->references('id')->on('project_enquiries')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_surveys', function (Blueprint $table) {
            // Drop the new foreign key constraint
            $table->dropForeign(['enquiry_id']);

            // Add back the old foreign key constraint
            $table->foreign('enquiry_id')->references('id')->on('enquiries')->onDelete('cascade');
        });
    }
};
