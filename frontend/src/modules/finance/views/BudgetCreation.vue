<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Dashboard
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/finance" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Finance
            </router-link>
          </div>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/finance/budgeting" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Budgeting
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Create Budget</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Budget</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Create comprehensive budget for {{ enquiry?.title }}</p>
      </div>
      <router-link
        to="/finance/budgeting"
        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Back to Budgets
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-400">Loading enquiry data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <span class="text-sm font-medium text-red-800 dark:text-red-200">Error</span>
      </div>
      <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
    </div>

    <!-- Budget Creation Interface -->
    <div v-else-if="enquiry" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enquiry Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ enquiry.client?.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <span :class="getPriorityClass(enquiry.priority || 'medium')" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ enquiry.priority || 'medium' }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Budget</label>
            <p class="text-sm text-gray-900 dark:text-white">
              {{ enquiry.estimated_budget ? 'KES ' + enquiry.estimated_budget.toLocaleString() : 'Not set' }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <span :class="getStatusClass(enquiry.status)" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ enquiry.status.replace('_', ' ') }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          @click="openBudgetModal"
          class="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg"
        >
          Open Budget Preparation Tool
        </button>
      </div>
    </div>

    <!-- Budget Modal -->
    <BudgetModal
      :is-visible="showBudgetModal"
      :enquiry="enquiry"
      :material-elements="materialElements"
      @close="showBudgetModal = false"
      @save="handleBudgetSave"
      @generateQuote="handleGenerateQuote"
      @generateAdditionalsQuote="handleGenerateAdditionalsQuote"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BudgetModal from '../../projects/components/BudgetModal.vue'
import { useEnquiries } from '../../projects/composables/useEnquiries'
import type { Enquiry } from '../../projects/types/enquiry'
import type { DetailedBudgetData } from '../types/budget'

const route = useRoute()
const router = useRouter()

const { getEnquiry, fetchEnquiries } = useEnquiries()

const enquiry = ref<Enquiry | null>(null)
const materialElements = ref<any[]>([])
const showBudgetModal = ref(false)
const loading = ref(false)
const error = ref('')

const openBudgetModal = () => {
  showBudgetModal.value = true
}

const handleBudgetSave = (budgetData: DetailedBudgetData) => {
  console.log('Budget saved:', budgetData)
  // Handle budget save logic
  router.push('/finance/budgeting')
}

const handleGenerateQuote = (materialElements: any[]) => {
  console.log('Generate main quote:', materialElements)
  // Handle quote generation logic
}

const handleGenerateAdditionalsQuote = (additionals: any[]) => {
  console.log('Generate additionals quote:', additionals)
  // Handle additionals quote generation logic
}

const getPriorityClass = (priority: string) => {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return classes[priority as keyof typeof classes] || classes.medium
}

const getStatusClass = (status: string) => {
  const classes = {
    new: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    site_survey_completed: 'bg-green-100 text-green-800',
    design_completed: 'bg-pink-100 text-pink-800',
    materials_created: 'bg-purple-100 text-purple-800',
    quoted: 'bg-indigo-100 text-indigo-800',
    approved: 'bg-green-100 text-green-800',
    converted_to_project: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || classes.new
}

onMounted(async () => {
  const enquiryId = route.query.enquiry as string
  if (enquiryId) {
    loading.value = true
    try {
      // First fetch enquiries to populate the data
      await fetchEnquiries()

      const enquiryData = getEnquiry(parseInt(enquiryId))
      if (!enquiryData) {
        // Create mock enquiry for testing
        enquiry.value = {
          id: parseInt(enquiryId),
          date_received: '2024-09-01',
          client_name: 'Test Client',
          project_name: 'Mock Enquiry for Testing',
          project_deliverables: 'This is a mock enquiry for testing the budget modal',
          contact_person: 'Test Contact',
          status: 'materials_specified',
          enquiry_number: `ENQ-TEST-${enquiryId}`,
          venue: 'Test Venue',
          site_survey_skipped: false,
          created_by: 1,
          created_at: '2024-09-01T10:00:00Z',
          updated_at: '2024-09-01T10:00:00Z',
          // Legacy fields
          title: 'Mock Enquiry for Testing',
          description: 'This is a mock enquiry for testing the budget modal',
          client: { name: 'Test Client' },
          priority: 'medium',
          estimated_budget: 100000
        } as Enquiry
      } else {
        enquiry.value = enquiryData
      }

      // Mock material elements - in real app, fetch from API
      materialElements.value = [
        {
          id: 1,
          elementName: 'Main Signage',
          category: 'production',
          subItems: [
            { id: 1, name: 'Aluminum Composite Panel', quantity: 10, unit: 'sqm', unitPrice: 2500 },
            { id: 2, name: 'LED Lighting', quantity: 5, unit: 'pcs', unitPrice: 1500 }
          ]
        }
      ]
    } catch (err) {
      error.value = 'Failed to load enquiry data'
      console.error('Error loading enquiry:', err)
    } finally {
      loading.value = false
    }
  } else {
    error.value = 'No enquiry ID provided'
  }
})
</script>

<style scoped>
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>
