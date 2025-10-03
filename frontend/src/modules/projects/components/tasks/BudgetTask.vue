<template>
  <div class="budget-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Material Costs</label>
          <input
            v-model="formData.material_costs"
            type="number"
            step="0.01"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0.00"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Labor Costs</label>
          <input
            v-model="formData.labor_costs"
            type="number"
            step="0.01"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0.00"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Equipment Costs</label>
          <input
            v-model="formData.equipment_costs"
            type="number"
            step="0.01"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0.00"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Overhead Costs</label>
          <input
            v-model="formData.overhead_costs"
            type="number"
            step="0.01"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0.00"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contingency (%)</label>
          <input
            v-model="formData.contingency_percentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="10.00"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Profit Margin (%)</label>
          <input
            v-model="formData.profit_margin"
            type="number"
            step="0.01"
            min="0"
            max="100"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="15.00"
          />
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Budget:</span>
          <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalBudget) }}</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget Breakdown</label>
        <textarea
          v-model="formData.breakdown"
          rows="4"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Detailed breakdown of costs..."
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget Notes</label>
        <textarea
          v-model="formData.notes"
          rows="2"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Additional budget notes or assumptions"
        ></textarea>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Budget Creation
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Budget
          </button>
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          Save Budget Data
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const formData = ref({
  material_costs: null as number | null,
  labor_costs: null as number | null,
  equipment_costs: null as number | null,
  overhead_costs: null as number | null,
  contingency_percentage: null as number | null,
  profit_margin: null as number | null,
  breakdown: '',
  notes: ''
})

const subtotal = computed(() => {
  return (formData.value.material_costs || 0) +
         (formData.value.labor_costs || 0) +
         (formData.value.equipment_costs || 0) +
         (formData.value.overhead_costs || 0)
})

const totalBudget = computed(() => {
  const sub = subtotal.value
  const contingency = sub * ((formData.value.contingency_percentage || 0) / 100)
  const profit = (sub + contingency) * ((formData.value.profit_margin || 0) / 100)
  return sub + contingency + profit
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const handleSubmit = () => {
  // Here you would typically save the form data
  console.log('Budget data:', { ...formData.value, total_budget: totalBudget.value })
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset form if needed
watch(() => props.task.id, () => {
  // Reset form for new task
  formData.value = {
    material_costs: null,
    labor_costs: null,
    equipment_costs: null,
    overhead_costs: null,
    contingency_percentage: null,
    profit_margin: null,
    breakdown: '',
    notes: ''
  }
})
</script>
