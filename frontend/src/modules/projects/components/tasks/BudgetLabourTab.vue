<template>
  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
          <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Labour Costs</h3>
      </div>
      <button
        @click="addLabourItem"
        type="button"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
      >
        Add Labour
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Type</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Category</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Qty</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Rate (KES)</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Total (KES)</th>
            <th class="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="labour in formData.labour"
            :key="labour.id"
            class="border-t border-gray-200 dark:border-gray-700"
          >
            <td class="py-3 px-4">
              <input
                v-model="labour.type"
                type="text"
                placeholder="e.g., Carpenter"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td class="py-3 px-4">
              <select
                v-model="labour.category"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Production">Production</option>
                <option value="Installation">Installation</option>
                <option value="Technical">Technical</option>
                <option value="Supervision">Supervision</option>
                <option value="Other">Other</option>
              </select>
            </td>
            <td class="py-3 px-4">
              <select
                v-model="labour.unit"
                class="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="PAX">PAX</option>
                <option value="days">days</option>
                <option value="hours">hours</option>
              </select>
            </td>
            <td class="py-3 px-4">
              <input
                v-model.number="labour.quantity"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                class="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                @input="calculateLabourTotal(labour)"
              />
            </td>
            <td class="py-3 px-4">
              <input
                v-model.number="labour.unitRate"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                @input="calculateLabourTotal(labour)"
              />
            </td>
            <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ formatCurrency(labour.amount) }}</td>
            <td class="py-3 px-4 text-center">
              <button
                @click="removeLabourItem(labour.id)"
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
import type { LabourType } from '../../services/budgetService'

interface Props {
  formData: {
    labour: LabourType[]
  }
}

interface Emits {
  (e: 'add-labour-item'): void
  (e: 'calculate-labour-total', labour: LabourType): void
  (e: 'remove-labour-item', id: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const addLabourItem = () => {
  emit('add-labour-item')
}

const calculateLabourTotal = (labour: LabourType) => {
  emit('calculate-labour-total', labour)
}

const removeLabourItem = (id: string) => {
  emit('remove-labour-item', id)
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
