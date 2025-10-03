<template>
  <div class="sliding-task-dashboard">


    <!-- Sliding Sidebar -->
    <div
      v-if="isOpen"
      class="fixed top-50 right-0 h-full w-full max-w-xl bg-white dark:bg-gray-800 shadow-4xl z-1000 overflow-y-auto"
      tabindex="0"
      @keydown.escape="closeSidebar"
    >
      <div class="p-6">
        <!-- Genius Header Design -->
        <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-6 -mx-6 px-6 py-4">
          <!-- Background Gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-10"></div>

          <!-- Header Content -->
          <div class="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <!-- Top Row -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ enquiry?.title || 'Project Enquiry' }}</h2>
                  <div class="flex items-center space-x-4 mt-1">
                    <span v-if="enquiry?.enquiry_number" class="text-sm text-gray-600 dark:text-gray-400">
                      #{{ enquiry.enquiry_number }}
                    </span>
                    <span v-if="enquiry?.status" :class="getStatusColor(enquiry.status)" class="px-2 py-1 text-xs rounded-full font-medium">
                      {{ getStatusLabel(enquiry.status) }}
                    </span>
                  </div>
                </div>
              </div>
              <button
                @click="closeSidebar"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Close sidebar"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
            </div>

            <!-- Project Info -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div v-if="enquiry?.client" class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ enquiry.client.full_name || enquiry.client.FullName }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ enquiryTasks.length }} tasks</span>
              </div>
            </div>

            <!-- Progress Overview -->
            <div class="mb-4">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-gray-600 dark:text-gray-400">Overall Progress</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ Math.round((enquiryTasks.filter(t => t.status === 'completed').length / Math.max(enquiryTasks.length, 1)) * 100) }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  :style="{ width: Math.round((enquiryTasks.filter(t => t.status === 'completed').length / Math.max(enquiryTasks.length, 1)) * 100) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-3">
              <button
                @click="$emit('assign-tasks')"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Task
              </button>
              <button
                @click="viewMode = viewMode === 'cards' ? 'list' : 'cards'"
                class="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                :title="viewMode === 'cards' ? 'Switch to list view' : 'Switch to card view'"
              >
                <svg v-if="viewMode === 'cards'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center space-x-3 mb-6">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tasks..."
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <select
            v-model="statusFilter"
            class="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <!-- Folder Contents -->
        <!-- Empty State -->
        <div v-if="enquiryTasks.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p class="text-gray-500 dark:text-gray-400 text-lg mb-2">No tasks in this project</p>
          <p class="text-gray-400 dark:text-gray-500 text-sm">Click "Add Task" to get started</p>
        </div>

        <!-- Tasks as Files -->
        <!-- Cards View -->
        <div v-if="viewMode === 'cards'" class="space-y-3">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="task-file bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Task Header -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-3 flex-1">
                <div :class="getTaskIcon(task)" class="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md">
                  {{ getTaskIconEmoji(task) }}
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white text-lg leading-tight">{{ task.title }}</h4>
                  <div class="flex items-center space-x-2 mt-1">
                    <span :class="getStatusColor(task.status)" class="px-3 py-1 text-xs rounded-full font-medium shadow-sm">
                      {{ getStatusLabel(task.status) }}
                    </span>
                    <span v-if="task.priority && task.priority !== 'medium'" :class="getPriorityColor(task.priority)" class="px-3 py-1 text-xs rounded-full font-medium shadow-sm">
                      {{ task.priority.toUpperCase() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Task Details -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span v-if="task.assignedBy">
                  Assigned to {{ task.assignedBy.name }}
                </span>
                <span v-else class="text-amber-600 dark:text-amber-400 font-medium">Unassigned</span>
              </div>

              <div v-if="task.due_date" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="font-medium">
                  Due {{ formatDate(task.due_date) }}
                  <span v-if="isOverdue(task.due_date)"> (Overdue)</span>
                </span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{{ getProgressPercentage(task.status) }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  :class="getProgressColor(task.status)"
                  class="h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: getProgressPercentage(task.status) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <button
                v-if="task.status === 'pending'"
                @click="updateTaskStatus(task, 'in_progress')"
                :disabled="updatingTask === task.id"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m-3-3h3m-6 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Start
              </button>
              <button
                v-if="task.status === 'in_progress'"
                @click="updateTaskStatus(task, 'completed')"
                :disabled="updatingTask === task.id"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Complete
              </button>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="space-y-2">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <div class="flex items-center space-x-3 flex-1">
              <div :class="getTaskIcon(task)" class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm">
                {{ getTaskIconEmoji(task) }}
              </div>
              <div class="flex-1">
                <h5 class="font-medium text-gray-900 dark:text-white">{{ task.title }}</h5>
                <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span :class="getStatusColor(task.status)" class="px-2 py-1 rounded-full">
                    {{ getStatusLabel(task.status) }}
                  </span>
                  <span v-if="task.assignedBy">• {{ task.assignedBy.name }}</span>
                  <span v-if="task.due_date" :class="isOverdue(task.due_date) ? 'text-red-500' : ''">
                    • Due {{ formatDate(task.due_date) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex space-x-1">
              <button
                v-if="task.status === 'pending'"
                @click="updateTaskStatus(task, 'in_progress')"
                :disabled="updatingTask === task.id"
                class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors disabled:opacity-50"
              >
                Start
              </button>
              <button
                v-if="task.status === 'in_progress'"
                @click="updateTaskStatus(task, 'completed')"
                :disabled="updatingTask === task.id"
                class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors disabled:opacity-50"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { EnquiryTask, ProjectEnquiry } from '../types/enquiry'
import { useTaskAssignment } from '../composables/useTaskAssignment'

interface Props {
  enquiryId?: number
  enquiry?: ProjectEnquiry
  isOpen?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'assign-tasks': []
  'task-updated': [task: EnquiryTask]
  'close': []
}>()

const { enquiryTasks, fetchEnquiryTasks, updateTask } = useTaskAssignment()
const updatingTask = ref<number | null>(null)
const viewMode = ref<'cards' | 'list'>('cards')
const searchQuery = ref('')
const statusFilter = ref('')

const filteredTasks = computed(() => {
  let tasks = enquiryTasks.value
  if (searchQuery.value) {
    tasks = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  if (statusFilter.value) {
    tasks = tasks.filter(t => t.status === statusFilter.value)
  }
  return tasks
})

watch(() => props.enquiryId, async (newId) => {
  if (newId) {
    await fetchEnquiryTasks(newId)
  }
})

const closeSidebar = () => {
  emit('close')
}

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

const getProgressPercentage = (status: string) => {
  const percentages: Record<string, number> = {
    'pending': 0,
    'in_progress': 50,
    'completed': 100,
    'cancelled': 0,
  }
  return percentages[status] || 0
}

const getProgressColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-400',
    'in_progress': 'bg-blue-500',
    'completed': 'bg-green-500',
    'cancelled': 'bg-red-400',
  }
  return colors[status] || 'bg-gray-400'
}

const getTaskIcon = (task: EnquiryTask) => {
  // Assuming task has a type or we can infer from title
  const title = task.title.toLowerCase()
  if (title.includes('survey')) return 'bg-blue-500'
  if (title.includes('design')) return 'bg-purple-500'
  if (title.includes('budget') || title.includes('quote')) return 'bg-green-500'
  if (title.includes('materials')) return 'bg-orange-500'
  return 'bg-gray-500'
}

const getTaskIconEmoji = (task: EnquiryTask) => {
  const title = task.title.toLowerCase()
  if (title.includes('survey')) return '📋'
  if (title.includes('design')) return '🎨'
  if (title.includes('budget') || title.includes('quote')) return '💰'
  if (title.includes('materials')) return '🔧'
  return '📝'
}

onMounted(async () => {
  if (props.enquiryId) {
    await fetchEnquiryTasks(props.enquiryId)
  }
})
</script>

<style scoped>
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-out-right {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out forwards;
}

.animate-slide-out-right {
  animation: slide-out-right 0.3s ease-in forwards;
}

.task-card {
  animation-fill-mode: both;
}
</style>
