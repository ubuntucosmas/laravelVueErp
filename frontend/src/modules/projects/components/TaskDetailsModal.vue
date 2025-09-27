<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Task Submission Details
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ task?.task_name }} - Completed on {{ formatDate(task?.completed_at) }}
          </p>
        </div>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
        <!-- Task Overview -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Task Information</h3>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Task Name:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ task?.task_name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Department:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ task?.department?.display_name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Priority:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ task?.priority }}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Completion Details</h3>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Status:</span>
                  <span class="font-medium text-green-600 dark:text-green-400">Completed</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Assigned to:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ task?.assigned_user?.name || 'Unassigned' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Completed:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(task?.completed_at) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Time Spent:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ task?.actual_hours || task?.estimated_hours }}h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Task-Specific Content -->
        <div v-if="task?.task_name === 'Conduct Site Survey'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Site Survey Details</h3>

          <!-- Survey Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Survey Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Survey Date:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white ml-2">{{ formatDate(getSurveyData()?.site_visit_date) }}</span>
              </div>
              <div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Survey Status:</span>
                <span class="text-sm font-medium text-green-600 dark:text-green-400 ml-2">Completed</span>
              </div>
              <div class="md:col-span-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">Survey Notes:</span>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ getSurveyData()?.notes || 'No additional notes provided' }}</p>
              </div>
            </div>
          </div>

          <!-- Survey Assessment -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Site Assessment</h4>
            <div class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Project Description:</span>
                  <p class="text-sm text-gray-900 dark:text-white mt-1">{{ getSurveyData()?.project_description || 'Not specified' }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Current Conditions:</span>
                  <p class="text-sm text-gray-900 dark:text-white mt-1">{{ getSurveyData()?.current_conditions || 'Not specified' }}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Access & Logistics:</span>
                  <p class="text-sm text-gray-900 dark:text-white mt-1">{{ getSurveyData()?.access_logistics || 'Not specified' }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Requirements:</span>
                  <p class="text-sm text-gray-900 dark:text-white mt-1">{{ getSurveyData()?.requirements || 'Not specified' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="task?.task_name === 'Design Assets and Material Specification'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Design Assets and Material Specification Details</h3>

          <!-- Materials Summary -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Materials Summary</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ getMaterialsData()?.length || 0 }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Elements</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-green-600 dark:text-green-400">{{ getTotalMaterialItems() }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Components</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-purple-600 dark:text-purple-400">{{ getProductionItemsCount() }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Production</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">KES {{ getTotalMaterialCost().toLocaleString() }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Total Cost</div>
              </div>
            </div>
          </div>

          <!-- Material Elements -->
          <div v-if="getMaterialsData()?.length" class="space-y-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Material Elements</h4>
            <div v-for="element in getMaterialsData()" :key="element.id" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h5 class="font-medium text-gray-900 dark:text-white">{{ element.elementName }}</h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ element.description }}</p>
                </div>
                <span :class="element.category === 'production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'"
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ element.category }}
                </span>
              </div>

              <!-- Sub-items -->
              <div class="space-y-2">
                <div v-for="subItem in element.subItems" :key="subItem.id" class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ subItem.name }}</span>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                      Qty: {{ subItem.quantity }} {{ subItem.unit }} • KES {{ subItem.unitPrice.toLocaleString() }} each
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">KES {{ (subItem.quantity * subItem.unitPrice).toLocaleString() }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">{{ subItem.category }}</div>
                  </div>
                </div>
              </div>

              <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div class="flex justify-between text-sm">
                  <span class="font-medium text-gray-900 dark:text-white">Element Total:</span>
                  <span class="font-medium text-green-600 dark:text-green-400">KES {{ getElementTotalCost(element).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Design Notes -->
          <div v-if="getMaterialsNotes()" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Design Notes</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ getMaterialsNotes() }}</p>
          </div>
        </div>

        <div v-else-if="task?.task_name === 'Prepare Budget & Costing'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Budget & Costing Details</h3>

          <!-- Budget Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Budget Breakdown</h4>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Material Costs:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">KES {{ getBudgetData()?.materialSubtotal?.toLocaleString() || '0' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Labor Costs:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">KES {{ getBudgetData()?.laborSubtotal?.toLocaleString() || '0' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Logistics:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">KES {{ getBudgetData()?.logisticsSubtotal?.toLocaleString() || '0' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Miscellaneous:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">KES {{ getBudgetData()?.miscSubtotal?.toLocaleString() || '0' }}</span>
              </div>
              <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
                <div class="flex justify-between font-medium">
                  <span class="text-gray-900 dark:text-white">Total Budget:</span>
                  <span class="text-green-600 dark:text-green-400">KES {{ getBudgetData()?.totalBudget?.toLocaleString() || '0' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quotation Information -->
          <div v-if="getQuotationData()" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Generated Quotation</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Quote Status:</span>
                <span :class="getQuotationStatusClass(getQuotationData()?.status)" class="text-sm font-medium px-2 py-1 rounded">
                  {{ getQuotationData()?.status }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
                <span class="text-sm font-medium text-green-600 dark:text-green-400">KES {{ getQuotationData()?.total_amount?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Valid Until:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(getQuotationData()?.valid_until) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Generic Task Details (for other tasks) -->
        <div v-else class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Task Completion Details</h3>

          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Task Information</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ task?.task_description }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Estimated Hours:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ task?.estimated_hours }}h</span>
              </div>
              <div v-if="task?.actual_hours" class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Actual Hours:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ task?.actual_hours }}h</span>
              </div>
              <div v-if="task?.notes" class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Notes:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ task?.notes }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          @click="closeModal"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DepartmentalTask } from '../types'

// Props
interface Props {
  isVisible: boolean
  task: DepartmentalTask | null
  enquiry?: any // Enquiry data for context
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Methods
const closeModal = () => {
  emit('close')
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

// Task-specific data getters
const getSurveyData = () => {
  // In a real implementation, this would fetch the actual survey data
  // For now, return mock data based on the task
  return {
    site_visit_date: props.task?.completed_at || new Date().toISOString(),
    status: 'completed',
    notes: 'Site survey completed successfully. All access points identified and logistics planned.',
    project_description: 'Exhibition booth setup for corporate event',
    current_conditions: 'Indoor venue with good access. Electrical outlets available.',
    access_logistics: 'Main entrance access. Loading dock available for equipment.',
    requirements: 'Power requirements: 5x 13A sockets. Space: 3x3m booth area.'
  }
}

const getMaterialsData = () => {
  // In a real implementation, this would fetch the actual materials data
  // For now, return mock data
  return [
    {
      id: '1',
      elementName: 'Exhibition Booth 3x3m',
      description: 'Complete exhibition booth setup with all components',
      category: 'production',
      subItems: [
        {
          id: '1-1',
          name: 'Aluminum Frame 2x3m',
          quantity: 4,
          unit: 'pcs',
          unitPrice: 15000,
          category: 'hire'
        },
        {
          id: '1-2',
          name: 'LED Panel 50"',
          quantity: 2,
          unit: 'pcs',
          unitPrice: 25000,
          category: 'hire'
        }
      ]
    }
  ]
}

const getMaterialsNotes = () => {
  return 'Materials specification completed with focus on high-quality components for professional presentation.'
}

const getBudgetData = () => {
  return {
    materialSubtotal: 250000,
    laborSubtotal: 50000,
    logisticsSubtotal: 25000,
    miscSubtotal: 10000,
    totalBudget: 335000
  }
}

const getQuotationData = () => {
  return {
    status: 'draft',
    total_amount: 290000,
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
}

// Computed helpers
const getTotalMaterialItems = () => {
  const materials = getMaterialsData()
  return materials?.reduce((total, element) => total + element.subItems.length, 0) || 0
}

const getProductionItemsCount = () => {
  const materials = getMaterialsData()
  return materials?.filter(element => element.category === 'production').length || 0
}

const getTotalMaterialCost = () => {
  const materials = getMaterialsData()
  return materials?.reduce((total, element) => {
    return total + element.subItems.reduce((subTotal, subItem) => {
      return subTotal + (subItem.quantity * subItem.unitPrice)
    }, 0)
  }, 0) || 0
}

const getElementTotalCost = (element: any) => {
  return element.subItems.reduce((total: number, subItem: any) => {
    return total + (subItem.quantity * subItem.unitPrice)
  }, 0)
}

const getQuotationStatusClass = (status?: string) => {
  const classes: Record<string, string> = {
    draft: 'text-gray-600 bg-gray-100',
    sent: 'text-blue-600 bg-blue-100',
    approved: 'text-green-600 bg-green-100',
    rejected: 'text-red-600 bg-red-100',
    expired: 'text-orange-600 bg-orange-100'
  }
  return classes[status || 'draft'] || classes.draft
}
</script>
