<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Assignment History - {{ task?.title || 'Task' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading assignment history...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <!-- History List -->
      <div v-else>
        <div v-if="assignmentHistory.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          No assignment history available
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="history in assignmentHistory"
            :key="history.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  Assigned to {{ history.assignedTo?.name || 'Unknown User' }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  by {{ history.assignedBy?.name || 'Unknown User' }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatDate(history.assigned_at) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatTime(history.assigned_at) }}
                </div>
              </div>
            </div>

            <div v-if="history.notes" class="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                <strong>Notes:</strong> {{ history.notes }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { EnquiryTask } from '../types/enquiry'
import { useTaskAssignment } from '../composables/useTaskAssignment'

interface Props {
  show: boolean
  task?: EnquiryTask | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { assignmentHistory, loading, error, fetchAssignmentHistory } = useTaskAssignment()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

watch(() => props.show, async (newShow) => {
  if (newShow && props.task?.id) {
    await fetchAssignmentHistory(props.task.id)
  }
})

watch(() => props.task, async (newTask) => {
  if (props.show && newTask?.id) {
    await fetchAssignmentHistory(newTask.id)
  }
})
</script>
