<template>
    <div v-if="show && task" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
      <div class="relative top-4 mx-auto p-5 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="mt-2">
  <!-- Compact Task Header -->
  <div class="flex items-center justify-between py-2">
    <!-- Left: Task title + meta -->
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[250px]">
          {{ task.title }}
        </h2>
        <span
          :class="[
            'text-xs font-medium px-2 py-0.5 rounded-full',
            getStatusColor(task.status)
          ]"
        >
          {{ getStatusLabel(task.status) }}
        </span>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
        {{ task.type }} • {{ task.enquiry?.title || 'No Enquiry' }}
      </p>
    </div>

    <!-- Right: Meta Info -->
    <div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
      <div>
        <span class="text-gray-400">By:</span>
        <span class="ml-1">{{ task.assignedBy?.name || 'Unassigned' }}</span>
      </div>
      <div v-if="task.due_date">
        <span class="text-gray-400">Due:</span>
        <span
          :class="isOverdue(task.due_date)
            ? 'text-red-600 dark:text-red-400 font-medium'
            : 'text-gray-700 dark:text-gray-200'"
          class="ml-1"
        >
          {{ formatDate(task.due_date) }}
        </span>
      </div>
      <button
        @click="closeModal"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>

        <!-- Task Content via TaskRenderer -->
        <div class="task-content">
          <TaskRenderer
            :task="task"
            @update-status="handleStatusUpdate"
            @complete="handleComplete"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EnquiryTask } from '../types/enquiry'
import TaskRenderer from './tasks/TaskRenderer.vue'

interface Props {
  show: boolean
  task: EnquiryTask | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const closeModal = () => {
  emit('close')
}

const handleStatusUpdate = (status: EnquiryTask['status']) => {
  emit('update-status', status)
}

const handleComplete = () => {
  emit('complete')
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

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getTaskTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'survey': 'bg-blue-500',
    'design': 'bg-purple-500',
    'materials': 'bg-green-500',
    'budget': 'bg-yellow-500',
    'quote': 'bg-indigo-500',
    'quote_approval': 'bg-pink-500',
    'procurement': 'bg-orange-500',
    'conversion': 'bg-teal-500',
    'production': 'bg-cyan-500',
    'logistics': 'bg-lime-500',
    'setup': 'bg-emerald-500',
    'handover': 'bg-violet-500',
    'setdown': 'bg-rose-500',
    'report': 'bg-amber-500'
  }
  return icons[type] || 'bg-gray-500'
}

const getTaskTypeInitial = (type: string) => {
  const initials: Record<string, string> = {
    'survey': 'S',
    'design': 'D',
    'materials': 'M',
    'budget': 'B',
    'quote': 'Q',
    'quote_approval': 'A',
    'procurement': 'P',
    'conversion': 'C',
    'production': 'P',
    'logistics': 'L',
    'setup': 'S',
    'handover': 'H',
    'setdown': 'S',
    'report': 'R'
  }
  return initials[type] || 'T'
}
</script>
