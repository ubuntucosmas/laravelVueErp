<template>
  <div class="quote-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
        <span>Quote Preparation</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Quote Number" :value="taskData.quote_number" />
        <DataField label="Quote Date" :value="formatDate(taskData.quote_date)" />
        <DataField label="Valid Until" :value="formatDate(taskData.valid_until)" />
        <DataField label="Prepared By" :value="taskData.prepared_by" />
        <DataField label="Client Name" :value="taskData.client_name" />
        <DataField label="Project Description" :value="taskData.project_description" type="textarea" />
        <DataField label="Total Amount" :value="formatCurrency(taskData.total_amount)" />
        <DataField label="Currency" :value="taskData.currency" />
        <DataField label="Payment Terms" :value="taskData.payment_terms" type="textarea" />
        <DataField label="Delivery Terms" :value="taskData.delivery_terms" type="textarea" />
        <DataField label="Warranty Terms" :value="taskData.warranty_terms" type="textarea" />
        <DataField label="Exclusions" :value="taskData.exclusions" type="textarea" />
        <DataField label="Quote Notes" :value="taskData.quote_notes" type="textarea" />
        <DataField label="Status" :value="taskData.status" />
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
.quote-data-display {
  max-width: none;
}
</style>
