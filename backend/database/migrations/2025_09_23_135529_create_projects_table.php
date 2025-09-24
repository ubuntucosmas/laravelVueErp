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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->uuid('project_id')->unique();
            $table->date('date_received');
            $table->date('expected_delivery_date')->nullable();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('project_scope')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['initiated', 'in_progress', 'completed', 'cancelled'])->default('initiated');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->string('assigned_department')->nullable();
            $table->decimal('estimated_budget', 15, 2)->nullable();
            $table->text('project_deliverables')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('assigned_po')->nullable();
            $table->text('follow_up_notes')->nullable();
            $table->string('venue')->nullable();
            $table->foreignId('enquiry_id')->constrained('enquiries')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
