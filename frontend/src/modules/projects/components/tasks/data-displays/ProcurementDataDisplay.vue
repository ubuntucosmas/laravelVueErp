<template>
  <div class="procurement-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <span>Procurement & Inventory Management</span>
      </h3>

      <div class="space-y-4">
        <DataField label="Supplier Name" :value="taskData.supplier_name" />
        <DataField label="Supplier Contact" :value="taskData.supplier_contact" />
        <DataField label="Purchase Order Number" :value="taskData.purchase_order_number" />
        <DataField label="Order Date" :value="formatDate(taskData.order_date)" />
        <DataField label="Expected Delivery Date" :value="formatDate(taskData.expected_delivery_date)" />
        <DataField label="Actual Delivery Date" :value="formatDate(taskData.actual_delivery_date)" />
        <DataField label="Items Ordered" :value="taskData.items_ordered" type="textarea" />
        <DataField label="Quantity Ordered" :value="taskData.quantity_ordered" />
        <DataField label="Unit Cost" :value="formatCurrency(taskData.unit_cost)" />
        <DataField label="Total Cost" :value="formatCurrency(taskData.total_cost)" />
        <DataField label="Payment Status" :value="taskData.payment_status" />
        <DataField label="Inventory Location" :value="taskData.inventory_location" />
        <DataField label="Quality Check Status" :value="taskData.quality_check_status" />
        <DataField label="Procurement Notes" :value="taskData.procurement_notes" type="textarea" />
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
.procurement-data-display {
  max-width: none;
}
</style>
