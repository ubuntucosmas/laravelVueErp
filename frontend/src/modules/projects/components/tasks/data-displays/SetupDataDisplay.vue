<template>
  <div class="setup-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
        </svg>
        <span>Event Setup & Execution</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Setup Date" :value="formatDate(taskData.setup_date)" />
        <DataField label="Event Start Time" :value="formatDateTime(taskData.event_start_time)" />
        <DataField label="Event End Time" :value="formatDateTime(taskData.event_end_time)" />
        <DataField label="Setup Location" :value="taskData.setup_location" />
        <DataField label="Setup Team" :value="taskData.setup_team" type="textarea" />
        <DataField label="Equipment Setup" :value="taskData.equipment_setup" type="textarea" />
        <DataField label="Layout Plan" :value="taskData.layout_plan" type="textarea" />
        <DataField label="Safety Checks" :value="taskData.safety_checks" type="textarea" />
        <DataField label="Client Requirements" :value="taskData.client_requirements" type="textarea" />
        <DataField label="Technical Setup" :value="taskData.technical_setup" type="textarea" />
        <DataField label="Setup Notes" :value="taskData.setup_notes" type="textarea" />
        <DataField label="Execution Status" :value="taskData.execution_status" />
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

const formatDateTime = (dateTimeString: unknown) => {
  if (!dateTimeString || typeof dateTimeString !== 'string') return null
  try {
    return new Date(dateTimeString).toLocaleString()
  } catch {
    return dateTimeString
  }
}
</script>

<style scoped>
.setup-data-display {
  max-width: none;
}
</style>
