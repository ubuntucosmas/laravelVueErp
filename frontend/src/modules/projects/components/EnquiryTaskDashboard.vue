<template>
  <div class="enquiry-task-dashboard">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Tasks for {{ enquiry?.title || 'Enquiry' }}
      </h3>
      <div class="flex space-x-2">
        <button
          @click="$emit('assign-tasks')"
          class="px-3 py-2 text-sm bg-primary hover:bg-primary-light text-white rounded-lg transition-colors"
        >
          Assign Tasks
        </button>
      </div>
    </div>

    <!-- Tasks List -->
    <div v-if="enquiryTasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      No tasks available for this enquiry
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="task in enquiryTasks"
        :key="task.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <h4 class="font-medium text-gray-900 dark:text-white">{{ task.title }}</h4>
              <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full font-medium">
                {{ getStatusLabel(task.status) }}
              </span>
              <span v-if="task.priority && task.priority !== 'medium'" :class="getPriorityColor(task.priority)" class="px-2 py-1 text-xs rounded-full font-medium">
                {{ task.priority.toUpperCase() }}
              </span>
            </div>

            <div class="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span v-if="task.assignedBy">
                Assigned to {{ task.assignedBy.name }}
              </span>
              <span v-else class="text-amber-600 dark:text-amber-400">Unassigned</span>

              <span v-if="task.due_date" :class="isOverdue(task.due_date) ? 'text-red-600 dark:text-red-400 font-medium' : ''">
                Due {{ formatDate(task.due_date) }}
                <span v-if="isOverdue(task.due_date)"> (Overdue)</span>
              </span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button
              v-if="task.status === 'pending'"
              @click="updateTaskStatus(task, 'in_progress')"
              :disabled="updatingTask === task.id"
              class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50"
            >
              Start
            </button>
            <button
              v-if="task.status === 'in_progress'"
              @click="updateTaskStatus(task, 'completed')"
              :disabled="updatingTask === task.id"
              class="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { EnquiryTask } from '../types/enquiry'
import { useTaskAssignment } from '../composables/useTaskAssignment'

interface Props {
  enquiryId: number
  enquiry?: {
    id: number
    title: string
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'assign-tasks': []
  'task-updated': [task: EnquiryTask]
}>()

const { enquiryTasks, fetchEnquiryTasks, updateTask } = useTaskAssignment()
const updatingTask = ref<number | null>(null)


const updateTaskStatus = async (task: EnquiryTask, status: EnquiryTask['status']) => {
  try {
    updatingTask.value = task.id
    const updatedTask = await updateTask(task.id, { status })
    emit('task-updated', updatedTask)
  } catch (err) {
    console.error('Error updating task status:', err)
  } finally {
    updatingTask.value = null
  }
}


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date()
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

const getPriorityColor = (priority?: string) => {
  const colors: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[priority || 'medium'] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

onMounted(async () => {
  if (props.enquiryId) {
    await fetchEnquiryTasks(props.enquiryId)
  }
})
</script>
