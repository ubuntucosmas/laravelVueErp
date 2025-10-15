<template>
  <div class="setdown-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
        <span>Set Down & Return</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Setdown Date" :value="formatDate(taskData.setdown_date)" />
        <DataField label="Setdown Location" :value="taskData.setdown_location" />
        <DataField label="Equipment Returned" :value="taskData.equipment_returned" type="textarea" />
        <DataField label="Return Condition" :value="taskData.return_condition" />
        <DataField label="Damage Assessment" :value="taskData.damage_assessment" type="textarea" />
        <DataField label="Cleaning Required" :value="taskData.cleaning_required" />
        <DataField label="Storage Location" :value="taskData.storage_location" />
        <DataField label="Responsible Person" :value="taskData.responsible_person" />
        <DataField label="Inventory Check" :value="taskData.inventory_check" type="textarea" />
        <DataField label="Setdown Notes" :value="taskData.setdown_notes" type="textarea" />
        <DataField label="Completion Status" :value="taskData.completion_status" />
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
.setdown-data-display {
  max-width: none;
}
</style>
