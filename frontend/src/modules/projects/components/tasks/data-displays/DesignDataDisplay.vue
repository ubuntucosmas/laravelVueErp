<template>
  <div class="design-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
        </svg>
        <span>Design & Concept Development</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Design Concept" :value="taskData.design_concept" type="textarea" />
        <DataField label="Design Files" :value="taskData.design_files" type="textarea" />
        <DataField label="Color Palette" :value="taskData.color_palette" />
        <DataField label="Design Software" :value="taskData.design_software" />
        <DataField label="Mockup Links" :value="taskData.mockup_links" type="textarea" />
        <DataField label="Client Feedback" :value="taskData.client_feedback" type="textarea" />
        <DataField label="Revisions Count" :value="taskData.revisions_count" />
        <DataField label="Final Approval Date" :value="formatDate(taskData.final_approval_date)" />
        <DataField label="Designer Notes" :value="taskData.designer_notes" type="textarea" />
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
</script>

<style scoped>
.design-data-display {
  max-width: none;
}
</style>
