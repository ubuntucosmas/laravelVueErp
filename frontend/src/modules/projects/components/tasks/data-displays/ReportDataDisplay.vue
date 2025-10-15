<template>
  <div class="report-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span>Archival & Reporting</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Report Type" :value="taskData.report_type" />
        <DataField label="Report Date" :value="formatDate(taskData.report_date)" />
        <DataField label="Prepared By" :value="taskData.prepared_by" />
        <DataField label="Project Summary" :value="taskData.project_summary" type="textarea" />
        <DataField label="Key Achievements" :value="taskData.key_achievements" type="textarea" />
        <DataField label="Challenges Faced" :value="taskData.challenges_faced" type="textarea" />
        <DataField label="Lessons Learned" :value="taskData.lessons_learned" type="textarea" />
        <DataField label="Client Feedback" :value="taskData.client_feedback" type="textarea" />
        <DataField label="Final Cost" :value="formatCurrency(taskData.final_cost)" />
        <DataField label="Timeline Summary" :value="taskData.timeline_summary" type="textarea" />
        <DataField label="Recommendations" :value="taskData.recommendations" type="textarea" />
        <DataField label="Archive Location" :value="taskData.archive_location" />
        <DataField label="Report Status" :value="taskData.report_status" />
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
.report-data-display {
  max-width: none;
}
</style>
