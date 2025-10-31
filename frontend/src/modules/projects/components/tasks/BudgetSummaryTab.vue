<template>
  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
    <div class="flex items-center space-x-2 mb-4">
      <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
        <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Budget Summary</h3>
    </div>

    <div class="space-y-3">
      <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
        <span class="text-sm text-gray-600 dark:text-gray-400">Materials Total:</span>
        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(materialsTotal) }}</span>
      </div>
      <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
        <span class="text-sm text-gray-600 dark:text-gray-400">Labour Total:</span>
        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(labourTotal) }}</span>
      </div>
      <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
        <span class="text-sm text-gray-600 dark:text-gray-400">Expenses Total:</span>
        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(expensesTotal) }}</span>
      </div>
      <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
        <span class="text-sm text-gray-600 dark:text-gray-400">Logistics Total:</span>
        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(logisticsTotal) }}</span>
      </div>
      <div class="flex justify-between items-center py-3 border-t-2 border-gray-300 dark:border-gray-500">
        <span class="text-base font-semibold text-gray-900 dark:text-white">Grand Total:</span>
        <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(grandTotal) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  materialsTotal: number
  labourTotal: number
  expensesTotal: number
  logisticsTotal: number
  grandTotal: number
}

defineProps<Props>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>
