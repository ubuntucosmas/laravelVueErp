<template>
  <div class="survey-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Location *</label>
          <input
            v-model="formData.site_location"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter site location"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Survey Date</label>
          <input
            v-model="formData.survey_date"
            type="date"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Length (m)</label>
          <input
            v-model="formData.length"
            type="number"
            step="0.01"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0.00"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Width (m)</label>
          <input
            v-model="formData.width"
            type="number"
            step="0.01"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0.00"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (m)</label>
          <input
            v-model="formData.height"
            type="number"
            step="0.01"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Conditions</label>
        <textarea
          v-model="formData.site_conditions"
          rows="3"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Describe site conditions, access, obstacles, etc."
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Survey Notes</label>
        <textarea
          v-model="formData.notes"
          rows="2"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Additional survey notes"
        ></textarea>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Survey
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Survey
          </button>
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          Save Survey Data
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
  site_location: '',
  survey_date: '',
  length: null as number | null,
  width: null as number | null,
  height: null as number | null,
  site_conditions: '',
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
  console.log('Survey data:', formData.value)
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset form if needed
watch(() => props.task.id, () => {
  // Reset form for new task
  formData.value = {
    site_location: '',
    survey_date: '',
    length: null,
    width: null,
    height: null,
    site_conditions: '',
    notes: ''
  }
})
</script>
