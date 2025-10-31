<template>
  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Expenses & Overheads</h3>
      </div>
      <button
        @click="addExpense"
        type="button"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
      >
        Add Expense
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Description</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Category</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Amount (KES)</th>
            <th class="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(expense, index) in formData.expenses"
            :key="expense.id"
            class="border-t border-gray-200 dark:border-gray-700"
          >
            <td class="py-3 px-4">
              <input
                v-model="expense.description"
                type="text"
                placeholder="e.g., Transportation"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td class="py-3 px-4">
              <select
                v-model="expense.category"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                <option value="transport">Transportation</option>
                <option value="accommodation">Accommodation</option>
                <option value="meals">Meals & Refreshments</option>
                <option value="utilities">Utilities</option>
                <option value="permits">Permits & Licenses</option>
                <option value="miscellaneous">Miscellaneous</option>
              </select>
            </td>
            <td class="py-3 px-4">
              <input
                v-model.number="expense.amount"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td class="py-3 px-4 text-center">
              <button
                @click="removeExpense(index)"
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
import type { ExpenseItem } from '../../services/budgetService'

interface Props {
  formData: {
    expenses: ExpenseItem[]
  }
}

interface Emits {
  (e: 'add-expense'): void
  (e: 'remove-expense', index: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const addExpense = () => {
  emit('add-expense')
}

const removeExpense = (index: number) => {
  emit('remove-expense', index)
}
</script>
