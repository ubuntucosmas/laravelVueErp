<?php

namespace App\Console\Commands;

use App\Models\Enquiry;
use App\Modules\Projects\Services\EnquiryWorkflowService;
use Illuminate\Console\Command;

class CreateTasksForExistingEnquiries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-tasks-for-existing-enquiries';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create departmental tasks for existing enquiries that don\'t have them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $enquiriesWithoutTasks = Enquiry::whereDoesntHave('departmentalTasks')->get();

        if ($enquiriesWithoutTasks->isEmpty()) {
            $this->info('All enquiries already have tasks created.');
            return;
        }

        $this->info("Found {$enquiriesWithoutTasks->count()} enquiries without tasks.");

        $service = app(EnquiryWorkflowService::class);
        $created = 0;

        foreach ($enquiriesWithoutTasks as $enquiry) {
            try {
                $service->createWorkflowTasksForEnquiry($enquiry);
                $created += 16; // 16 tasks per enquiry
                $this->info("Created tasks for enquiry ID: {$enquiry->id}");
            } catch (\Exception $e) {
                $this->error("Failed to create tasks for enquiry ID: {$enquiry->id} - {$e->getMessage()}");
            }
        }

        $this->info("Successfully created {$created} tasks for {$enquiriesWithoutTasks->count()} enquiries.");
    }
}
