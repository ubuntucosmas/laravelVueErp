<template>
  <div class="handover-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
        <span>Client Handover</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Handover Date" :value="formatDate(taskData.handover_date)" />
        <DataField label="Client Representative" :value="taskData.client_representative" />
        <DataField label="Project Manager" :value="taskData.project_manager" />
        <DataField label="Handover Checklist" :value="taskData.handover_checklist" type="textarea" />
        <DataField label="Client Signature" :value="taskData.client_signature" />
        <DataField label="Final Payment Received" :value="taskData.final_payment_received" />
        <DataField label="Outstanding Issues" :value="taskData.outstanding_issues" type="textarea" />
        <DataField label="Client Feedback" :value="taskData.client_feedback" type="textarea" />
        <DataField label="Warranty Information" :value="taskData.warranty_information" type="textarea" />
        <DataField label="Contact Information" :value="taskData.contact_information" type="textarea" />
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
</script>

<style scoped>
.handover-data-display {
  max-width: none;
}
</style>
