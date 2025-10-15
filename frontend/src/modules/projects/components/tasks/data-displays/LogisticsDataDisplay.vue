<template>
  <div class="logistics-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <span>Logistics & Transportation</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Transport Company" :value="taskData.transport_company" />
        <DataField label="Vehicle Type" :value="taskData.vehicle_type" />
        <DataField label="Driver Name" :value="taskData.driver_name" />
        <DataField label="Driver Contact" :value="taskData.driver_contact" />
        <DataField label="Pickup Date" :value="formatDate(taskData.pickup_date)" />
        <DataField label="Delivery Date" :value="formatDate(taskData.delivery_date)" />
        <DataField label="Pickup Location" :value="taskData.pickup_location" />
        <DataField label="Delivery Location" :value="taskData.delivery_location" />
        <DataField label="Cargo Description" :value="taskData.cargo_description" type="textarea" />
        <DataField label="Weight" :value="taskData.weight" />
        <DataField label="Dimensions" :value="taskData.dimensions" />
        <DataField label="Transport Cost" :value="formatCurrency(taskData.transport_cost)" />
        <DataField label="Tracking Number" :value="taskData.tracking_number" />
        <DataField label="Delivery Status" :value="taskData.delivery_status" />
        <DataField label="Special Instructions" :value="taskData.special_instructions" type="textarea" />
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
.logistics-data-display {
  max-width: none;
}
</style>
