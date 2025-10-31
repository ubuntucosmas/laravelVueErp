<template>
  <ErrorBoundary @error="handleBoundaryError" @retry="handleRetry" @reset="handleReset">
    <div
      class="budget-task bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
    >
    <!-- Editable section - only show when not readonly -->
    <div v-if="!readonly">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

      <!-- Error Display -->
      <div
        v-if="state.error"
        class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      >
        <div class="flex items-center space-x-2">
          <svg
            class="w-5 h-5 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span class="text-sm font-medium text-red-800 dark:text-red-200">Error</span>
        </div>
        <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ state.error }}</p>

        <!-- Recovery Suggestions -->
        <div v-if="state.error.includes('network') || state.error.includes('connection')" class="mt-2 text-xs text-red-600 dark:text-red-400">
          <p class="font-medium">Recovery suggestions:</p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>Check your internet connection</li>
            <li>Try refreshing the page</li>
            <li>Wait a moment and try again</li>
          </ul>
        </div>

        <div v-else-if="state.error.includes('validation')" class="mt-2 text-xs text-red-600 dark:text-red-400">
          <p class="font-medium">Recovery suggestions:</p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>Review all required fields marked with *</li>
            <li>Check that all amounts are valid numbers</li>
            <li>Ensure calculations are correct (quantity × unit price)</li>
          </ul>
        </div>

        <div v-else-if="state.error.includes('permission') || state.error.includes('unauthorized')" class="mt-2 text-xs text-red-600 dark:text-red-400">
          <p class="font-medium">Recovery suggestions:</p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>Log out and log back in</li>
            <li>Contact your administrator for access permissions</li>
            <li>Try using a different browser</li>
          </ul>
        </div>

        <div v-else-if="state.error.includes('data integrity')" class="mt-2 text-xs text-red-600 dark:text-red-400">
          <p class="font-medium">Recovery suggestions:</p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>Review all entered amounts and calculations</li>
            <li>Ensure no items have zero quantity with non-zero costs</li>
            <li>Check that all totals add up correctly</li>
            <li>Remove or correct any invalid entries</li>
          </ul>
        </div>

        <div v-else class="mt-2 text-xs text-red-600 dark:text-red-400">
          <p class="font-medium">General recovery suggestions:</p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>Try refreshing the page</li>
            <li>Clear your browser cache</li>
            <li>Contact support if the problem persists</li>
          </ul>
        </div>
      </div>

      <!-- Success Display -->
      <div
        v-if="state.successMessage"
        class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
      >
        <div class="flex items-center space-x-2">
          <svg
            class="w-5 h-5 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm font-medium text-green-800 dark:text-green-200">Success</span>
        </div>
        <p class="text-sm text-green-700 dark:text-green-300 mt-1">{{ state.successMessage }}</p>
      </div>

      <!-- Loading State -->
      <div
        v-if="state.isLoading"
        class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <div class="flex items-center space-x-2">
          <svg
            class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200"
            >Loading budget data...</span
          >
        </div>
      </div>

      <!-- Progress Indicator -->
      <div
        v-if="progressState.isActive"
        class="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-indigo-800 dark:text-indigo-200">{{ progressState.step }}</span>
          <span class="text-sm text-indigo-600 dark:text-indigo-400">{{ progressState.progress }}%</span>
        </div>
        <div class="w-full bg-indigo-200 dark:bg-indigo-700 rounded-full h-2">
          <div
            class="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full transition-all duration-300"
            :style="{ width: progressState.progress + '%' }"
          ></div>
        </div>
        <p class="text-xs text-indigo-700 dark:text-indigo-300 mt-1">{{ progressState.message }}</p>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="flex flex-wrap gap-2 sm:gap-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Read-only view for completed tasks -->
    <div v-if="readonly" class="space-y-6">
      <div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
      >
        <p class="text-sm text-blue-800 dark:text-blue-200">
          This budget has been completed and is now read-only. Budget data is displayed below.
        </p>
      </div>

      <!-- You can add a read-only display here or use BudgetDataDisplay component -->
      <div class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Budget completed. Use the Budget Data Display component to view details.</p>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit(validateBudget)" class="space-y-6">
      <!-- Tab Content -->
      <BudgetMaterialsTab
        v-show="activeTab === 'materials'"
        :form-data="state.formData"
        :import-status="state.importStatus"
        :materials-update-check="state.materialsUpdateCheck"
        :is-importing="state.isImporting"
        :is-checking-updates="state.isCheckingUpdates"
        @import-materials="importMaterials"
        @check-updates="checkMaterialsUpdates"
        @re-import-materials="reImportMaterials"
        @calculate-material-total="calculateMaterialTotal"
      />

      <BudgetLabourTab
        v-show="activeTab === 'labour'"
        :form-data="state.formData"
        @add-labour-item="addLabourItem"
        @calculate-labour-total="calculateLabourTotal"
        @remove-labour-item="removeLabourItem"
      />

      <BudgetExpensesTab
        v-show="activeTab === 'expenses'"
        :form-data="state.formData"
        @add-expense="addExpense"
        @remove-expense="removeExpense"
      />

      <BudgetLogisticsTab
        v-show="activeTab === 'logistics'"
        :form-data="state.formData"
        @add-logistics-item="addLogisticsItem"
        @remove-logistics-item="removeLogisticsItem"
        @calculate-logistics-total="calculateLogisticsTotal"
      />

      <BudgetSummaryTab
        v-show="activeTab === 'summary'"
        :materials-total="materialsTotal"
        :labour-total="labourTotal"
        :expenses-total="expensesTotal"
        :logistics-total="logisticsTotal"
        :grand-total="grandTotal"
      />

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="saveDraft"
          :disabled="state.isSaving"
          class="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors order-2 sm:order-1"
        >
          {{ state.isSaving ? 'Saving...' : 'Save Draft' }}
        </button>
        <button
          type="submit"
          :disabled="state.isSaving"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg transition-colors order-1 sm:order-2"
        >
          {{ state.isSaving ? 'Submitting...' : 'Submit Budget' }}
        </button>
      </div>
    </form>
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBudgetState } from '../../composables/useBudgetState'
import { useBudgetOperations } from '../../composables/useBudgetOperations'
import { useBudgetValidation } from '../../composables/useBudgetValidation'
import { useBudgetProgress } from '../../composables/useBudgetProgress'
import ErrorBoundary from '../ErrorBoundary.vue'
import BudgetMaterialsTab from './BudgetMaterialsTab.vue'
import BudgetLabourTab from './BudgetLabourTab.vue'
import BudgetExpensesTab from './BudgetExpensesTab.vue'
import BudgetLogisticsTab from './BudgetLogisticsTab.vue'
import BudgetSummaryTab from './BudgetSummaryTab.vue'

interface Task {
  id: number
  title: string
  type: string
  status: string
  project_enquiry_id: number
  project_enquiry?: {
    enquiry_number?: string
    title?: string
    venue?: string
    expected_delivery_date?: string
    client?: {
      name?: string
    }
  }
}

interface Props {
  task: Task
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})

const emit = defineEmits(['task-completed', 'task-updated'])

// Use composables for state management
const { state, materialsTotal, labourTotal, expensesTotal, logisticsTotal, grandTotal } = useBudgetState()

// Use validation composable
const { validateBudget } = useBudgetValidation()

// Use progress composable
const { progressState } = useBudgetProgress()

// Use operations composable
const {
  activeTab,
  tabs,
  loadBudgetData,
  importMaterials,
  checkMaterialsUpdates,
  reImportMaterials,
  calculateMaterialTotal,
  addLabourItem,
  calculateLabourTotal,
  removeLabourItem,
  addExpense,
  removeExpense,
  addLogisticsItem,
  removeLogisticsItem,
  calculateLogisticsTotal,
  saveDraft,
  handleSubmit,
} = useBudgetOperations(state, props.task, emit)

// Error boundary handlers
const handleBoundaryError = (errorData: any) => {
  console.error('BudgetTask error boundary caught error:', errorData)
  state.error = 'An unexpected error occurred in the budget component. Please try refreshing the page.'
}

const handleRetry = () => {
  state.error = null
  loadBudgetData()
}

const handleReset = () => {
  state.error = null
  // Reset form to initial state
  state.formData = {
    projectInfo: {
      projectId: '',
      enquiryTitle: '',
      clientName: '',
      eventVenue: '',
      setupDate: '',
      setDownDate: '',
    },
    materials: [],
    labour: [],
    expenses: [],
    logistics: [],
    status: 'draft',
  }
}

// Initialize
onMounted(() => {
  loadBudgetData()
})
</script>

