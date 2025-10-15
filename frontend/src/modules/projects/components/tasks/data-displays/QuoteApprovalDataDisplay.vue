<template>
  <div class="quote-approval-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Quote Approval</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Quote Reference Number" :value="taskData.quote_reference_number" />
        <DataField label="Quote Amount" :value="formatCurrency(taskData.quote_amount)" />
        <DataField label="Approval Date" :value="formatDate(taskData.approval_date)" />
        <DataField label="Approved By" :value="taskData.approved_by" />
        <DataField label="Approval Level" :value="taskData.approval_level" />
        <DataField label="Client Approval Required" :value="taskData.client_approval_required" />
        <DataField label="Client Approval Date" :value="formatDate(taskData.client_approval_date)" />
        <DataField label="Approval Conditions" :value="taskData.approval_conditions" type="textarea" />
        <DataField label="Payment Terms" :value="taskData.payment_terms" type="textarea" />
        <DataField label="Validity Period" :value="taskData.validity_period" />
        <DataField label="Approval Notes" :value="taskData.approval_notes" type="textarea" />
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
.quote-approval-data-display {
  max-width: none;
}
</style>
