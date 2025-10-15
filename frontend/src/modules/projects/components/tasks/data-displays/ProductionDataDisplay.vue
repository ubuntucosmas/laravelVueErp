<template>
  <div class="production-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <span>Production</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Production Start Date" :value="formatDate(taskData.production_start_date)" />
        <DataField label="Production End Date" :value="formatDate(taskData.production_end_date)" />
        <DataField label="Production Manager" :value="taskData.production_manager" />
        <DataField label="Production Team" :value="taskData.production_team" type="textarea" />
        <DataField label="Production Facility" :value="taskData.production_facility" />
        <DataField label="Equipment Used" :value="taskData.equipment_used" type="textarea" />
        <DataField label="Materials Consumed" :value="taskData.materials_consumed" type="textarea" />
        <DataField label="Quality Control Checks" :value="taskData.quality_control_checks" type="textarea" />
        <DataField label="Production Notes" :value="taskData.production_notes" type="textarea" />
        <DataField label="Completion Status" :value="taskData.completion_status" />
        <DataField label="Quality Rating" :value="taskData.quality_rating" />
        <DataField label="Issues Encountered" :value="taskData.issues_encountered" type="textarea" />
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
.production-data-display {
  max-width: none;
}
</style>
