<template>
  <div class="budget-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
        </svg>
        <span>Budget Information</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Total Budget" :value="formatCurrency(taskData.total_budget)" />
        <DataField label="Estimated Cost" :value="formatCurrency(taskData.estimated_cost)" />
        <DataField label="Labor Cost" :value="formatCurrency(taskData.labor_cost)" />
        <DataField label="Material Cost" :value="formatCurrency(taskData.material_cost)" />
        <DataField label="Overhead Cost" :value="formatCurrency(taskData.overhead_cost)" />
        <DataField label="Contingency Amount" :value="formatCurrency(taskData.contingency_amount)" />
        <DataField label="Profit Margin" :value="taskData.profit_margin ? `${taskData.profit_margin}%` : null" />
        <DataField label="Budget Notes" :value="taskData.budget_notes" type="textarea" />
        <DataField label="Approval Status" :value="taskData.approval_status" />
        <DataField label="Created Date" :value="formatDate(taskData.created_at)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnquiryTask } from '../../../types/enquiry'

// Reusable Data Field Component
const DataField = {
  props: {
    label: String,
    value: [String, Number],
    type: { type: String, default: 'text' }
  },
  template: `
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {{ label }}
      </label>
      <div v-if="type === 'textarea'" class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
        {{ value || 'Not specified' }}
      </div>
      <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
        {{ value || 'Not specified' }}
      </div>
    </div>
  `
}

interface Props {
  task: EnquiryTask
  taskData: Record<string, unknown>
}

defineProps<Props>()

// Utility functions
const formatDate = (dateString: unknown) => {
  if (!dateString || typeof dateString !== 'string') return null
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

const formatCurrency = (amount: unknown) => {
  if (!amount) return null
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (typeof numAmount !== 'number' || isNaN(numAmount)) return amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numAmount)
}
</script>

<style scoped>
.budget-data-display {
  max-width: none;
}
</style>
