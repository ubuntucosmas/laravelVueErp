<template>
  <div class="design-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          ]"
        >
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Style & Colors Tab -->
      <div v-if="activeTab === 'style'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Design Style *</label>
          <select
            v-model="formData.design_style"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select design style</option>
            <option value="modern">Modern</option>
            <option value="traditional">Traditional</option>
            <option value="contemporary">Contemporary</option>
            <option value="minimalist">Minimalist</option>
            <option value="industrial">Industrial</option>
            <option value="rustic">Rustic</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Color</label>
            <input
              v-model="formData.primary_color"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Blue, White"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Secondary Color</label>
            <input
              v-model="formData.secondary_color"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Gray, Black"
            />
          </div>
        </div>
      </div>

      <!-- Requirements Tab -->
      <div v-if="activeTab === 'requirements'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Design Requirements</label>
          <textarea
            v-model="formData.requirements"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Specific design requirements, preferences, or constraints"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Reference Materials</label>
          <textarea
            v-model="formData.references"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Links to inspiration, images, or reference materials"
          ></textarea>
        </div>
      </div>

      <!-- Notes Tab -->
      <div v-if="activeTab === 'notes'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Design Notes</label>
          <textarea
            v-model="formData.notes"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Additional design notes or comments"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Design
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Design
          </button>
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          Save Design Data
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

const activeTab = ref('style')

const tabs = [
  { id: 'style', label: 'Style & Colors', icon: '🎨' },
  { id: 'requirements', label: 'Requirements', icon: '📋' },
  { id: 'notes', label: 'Notes', icon: '📝' }
]

const formData = ref({
  design_style: '',
  primary_color: '',
  secondary_color: '',
  requirements: '',
  references: '',
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
  console.log('Design data:', formData.value)
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset form if needed
watch(() => props.task.id, () => {
  // Reset form for new task
  formData.value = {
    design_style: '',
    primary_color: '',
    secondary_color: '',
    requirements: '',
    references: '',
    notes: ''
  }
})
</script>
