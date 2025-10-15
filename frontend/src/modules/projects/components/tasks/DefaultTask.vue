<template>
  <div class="task-content">
    <div class="mb-4">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ task.title }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ getTaskDescription(task.type) }}
      </p>
    </div>

    <!-- Task Status -->
    <div class="mb-4">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
        <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full font-medium">
          {{ getStatusLabel(task.status) }}
        </span>
      </div>
    </div>

    <!-- Task Notes -->
    <div v-if="task.notes" class="mb-4">
      <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes:</h5>
      <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        {{ task.notes }}
      </p>
    </div>

    <!-- Task Actions -->
    <div class="flex space-x-3">
      <button
        v-if="task.status === 'pending'"
        @click="$emit('update-status', 'in_progress')"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
      >
        Start Task
      </button>

      <button
        v-if="task.status === 'in_progress'"
        @click="$emit('update-status', 'completed')"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
      >
        Mark Complete
      </button>

      <button
        v-if="task.status !== 'completed' && task.status !== 'cancelled'"
        @click="$emit('update-status', 'cancelled')"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
      >
        Cancel Task
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnquiryTask } from '../../types/enquiry'

interface Props {
  task: EnquiryTask
}

defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const getTaskDescription = (type: string) => {
  const descriptions: Record<string, string> = {
    'site-survey': 'Conduct site survey for the enquiry',
    'design': 'Create design concepts and mockups',
    'materials': 'Specify and source materials for the project',
    'budget': 'Create budget for the project',
    'quote': 'Prepare final quote for the project',
    'quote_approval': 'Approve the prepared quote',
    'procurement': 'Manage procurement and inventory',
    'conversion': 'Convert enquiry to project',
    'production': 'Handle production activities',
    'logistics': 'Manage logistics and transportation',
    'setup': 'Set up event and execute',
    'handover': 'Hand over to client',
    'setdown': 'Set down and return equipment',
    'report': 'Archive and generate reports',
  }

  return descriptions[type] || 'Complete this task'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
  }
  return labels[status] || status
}
</script>
