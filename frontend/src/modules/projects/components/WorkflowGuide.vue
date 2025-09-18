<template>
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
    <div class="flex items-start space-x-4">
      <!-- Guide Icon -->
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>

      <!-- Guide Content -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ currentStep.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ currentStep.description }}
        </p>

        <!-- Step Progress -->
        <div class="mb-4">
          <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Step {{ currentStepIndex + 1 }} of {{ workflowSteps.length }}</span>
            <span>{{ Math.round(((currentStepIndex + 1) / workflowSteps.length) * 100) }}% Complete</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((currentStepIndex + 1) / workflowSteps.length) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Action Items -->
        <div class="space-y-3 mb-4">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ currentStep.primaryAction }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ currentStep.primaryDescription }}</p>
            </div>
          </div>

          <div v-if="currentStep.secondaryAction" class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ currentStep.secondaryAction }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ currentStep.secondaryDescription }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between">
          <button
            v-if="currentStepIndex > 0"
            @click="goToPreviousStep"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Previous Step
          </button>

          <div class="flex space-x-2">
            <button
              v-if="currentStep.primaryRoute"
              @click="navigateToAction(currentStep.primaryRoute)"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {{ currentStep.primaryButtonText || 'Go to Action' }}
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <button
              v-if="currentStepIndex < workflowSteps.length - 1"
              @click="goToNextStep"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Next Step
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Workflow steps with guidance
const workflowSteps = ref([
  {
    title: 'Register New Client',
    description: 'Start by registering the client information in the system.',
    primaryAction: 'Create Client Profile',
    primaryDescription: 'Add client details including contact information, company details, and preferences.',
    primaryRoute: '/projects/clients',
    primaryButtonText: 'Add Client',
    secondaryAction: 'Import Existing Clients',
    secondaryDescription: 'If you have client data from another system, you can import it here.'
  },
  {
    title: 'Create Client Enquiry',
    description: 'Document the client\'s project requirements and specifications.',
    primaryAction: 'Submit New Enquiry',
    primaryDescription: 'Record the client\'s project needs, budget expectations, and timeline requirements.',
    primaryRoute: '/projects/enquiries',
    primaryButtonText: 'Create Enquiry',
    secondaryAction: 'Review Enquiry Templates',
    secondaryDescription: 'Use pre-built templates for common enquiry types to speed up the process.'
  },
  {
    title: 'Conduct Site Survey (Optional)',
    description: 'Visit the project location to assess requirements and conditions.',
    primaryAction: 'Schedule Site Survey',
    primaryDescription: 'Plan and conduct a site visit to gather essential information about the project location.',
    primaryRoute: '/projects/site-surveys',
    primaryButtonText: 'Schedule Survey',
    secondaryAction: 'Skip if Not Required',
    secondaryDescription: 'Some projects may not require a physical site survey depending on the scope.'
  },
  {
    title: 'Create Materials List',
    description: 'Compile a comprehensive list of all materials needed for the project.',
    primaryAction: 'Build Materials List',
    primaryDescription: 'Create a detailed inventory of all materials, quantities, and specifications required.',
    primaryRoute: '/projects/materials',
    primaryButtonText: 'Create Materials',
    secondaryAction: 'Use Material Templates',
    secondaryDescription: 'Leverage pre-configured material lists for similar project types.'
  },
  {
    title: 'Prepare Budget & Quotation',
    description: 'Calculate project costs and prepare a professional quotation for the client.',
    primaryAction: 'Generate Quotation',
    primaryDescription: 'Calculate total costs including materials, labor, and overheads, then create a quotation.',
    primaryRoute: '/projects/materials',
    primaryButtonText: 'Create Quotation',
    secondaryAction: 'Request Approvals',
    secondaryDescription: 'Get necessary approvals from management before sending to client.'
  },
  {
    title: 'Client Approval & Project Conversion',
    description: 'Present quotation to client and convert approved enquiries to active projects.',
    primaryAction: 'Convert to Project',
    primaryDescription: 'Once client approves the quotation, convert the enquiry into an active project.',
    primaryRoute: '/projects/projects',
    primaryButtonText: 'Convert to Project',
    secondaryAction: 'Send Follow-up',
    secondaryDescription: 'Contact client for any clarifications or additional requirements.'
  },
  {
    title: 'Project Kickoff & Planning',
    description: 'Initialize the project and begin detailed planning and resource allocation.',
    primaryAction: 'Start Project Execution',
    primaryDescription: 'Begin production phase with assigned team members and timeline.',
    primaryRoute: '/projects/projects',
    primaryButtonText: 'Start Project',
    secondaryAction: 'Assign Team Members',
    secondaryDescription: 'Allocate project team members and define their responsibilities.'
  }
])

const currentStepIndex = ref(0)

const currentStep = computed(() => workflowSteps.value[currentStepIndex.value])

const goToNextStep = () => {
  if (currentStepIndex.value < workflowSteps.value.length - 1) {
    currentStepIndex.value++
  }
}

const goToPreviousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

const navigateToAction = (route: string) => {
  router.push(route)
}

// Auto-advance based on user progress (simplified logic)
const checkProgressAndAdvance = () => {
  // This would be more sophisticated in a real app
  // For now, just provide guidance based on current step
}

onMounted(() => {
  checkProgressAndAdvance()
})
</script>