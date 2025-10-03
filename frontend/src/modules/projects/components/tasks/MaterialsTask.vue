<template>
  <div class="materials-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Material Name *</label>
          <input
            v-model="formData.material_name"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="e.g., Steel beams, Concrete"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            v-model="formData.category"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select category</option>
            <option value="structural">Structural</option>
            <option value="finishing">Finishing</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="mechanical">Mechanical</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity *</label>
          <input
            v-model="formData.quantity"
            type="number"
            step="0.01"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0.00"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit *</label>
          <select
            v-model="formData.unit"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select unit</option>
            <option value="pieces">Pieces</option>
            <option value="kg">Kilograms</option>
            <option value="m">Meters</option>
            <option value="m2">Square Meters</option>
            <option value="m3">Cubic Meters</option>
            <option value="liters">Liters</option>
            <option value="tons">Tons</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Cost</label>
          <input
            v-model="formData.estimated_cost"
            type="number"
            step="0.01"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</label>
        <input
          v-model="formData.supplier"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Supplier name or contact"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Specifications</label>
        <textarea
          v-model="formData.specifications"
          rows="3"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Material specifications, quality requirements, etc."
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
        <textarea
          v-model="formData.notes"
          rows="2"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Additional notes about the material"
        ></textarea>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Materials Spec
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Materials Spec
          </button>
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          Save Materials Data
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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
  material_name: '',
  category: '',
  quantity: null as number | null,
  unit: '',
  estimated_cost: null as number | null,
  supplier: '',
  specifications: '',
  notes: ''
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const handleSubmit = () => {
  // Here you would typically save the form data
  console.log('Materials data:', formData.value)
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset form if needed
watch(() => props.task.id, () => {
  // Reset form for new task
  formData.value = {
    material_name: '',
    category: '',
    quantity: null,
    unit: '',
    estimated_cost: null,
    supplier: '',
    specifications: '',
    notes: ''
  }
})
</script>
