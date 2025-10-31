<template>
  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
          <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Logistics & Transportation</h3>
      </div>
      <button
        @click="addLogisticsItem"
        type="button"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
      >
        Add Logistics
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Description</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Qty</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit Price (KES)</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Amount (KES)</th>
            <th class="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in formData.logistics"
            :key="item.id"
            class="border-t border-gray-200 dark:border-gray-700"
          >
            <td class="py-3 px-4">
              <select
                v-model="item.description"
                @change="updateUnitForDescription(item)"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select logistics item...</option>
                <option value="Items delivery set up">Items delivery set up</option>
                <option value="Items collection set down">Items collection set down</option>
                <option value="Team transport set up">Team transport set up</option>
                <option value="Team transport set down">Team transport set down</option>
                <option value="Material collection">Material collection</option>
              </select>
            </td>
            <td class="py-3 px-4">
              <input
                v-model="item.unit"
                type="text"
                readonly
                class="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
              />
            </td>
            <td class="py-3 px-4">
              <input
                v-model.number="item.quantity"
                @input="calculateLogisticsTotal(item)"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                class="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td class="py-3 px-4">
              <input
                v-model.number="item.unitRate"
                @input="calculateLogisticsTotal(item)"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                class="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td class="py-3 px-4">
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(item.amount) }}
              </span>
            </td>
            <td class="py-3 px-4 text-center">
              <button
                @click="removeLogisticsItem(index)"
                type="button"
                class="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogisticsItem } from '../../services/budgetService'

interface Props {
  formData: {
    logistics: LogisticsItem[]
  }
}

interface Emits {
  (e: 'add-logistics-item'): void
  (e: 'remove-logistics-item', index: number): void
  (e: 'calculate-logistics-total', item: LogisticsItem): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const addLogisticsItem = () => {
  emit('add-logistics-item')
}

const removeLogisticsItem = (index: number) => {
  emit('remove-logistics-item', index)
}

const calculateLogisticsTotal = (item: LogisticsItem) => {
  emit('calculate-logistics-total', item)
}

const updateUnitForDescription = (item: LogisticsItem) => {
  // Auto-set unit to "trips" for all logistics items
  item.unit = 'trips'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>
