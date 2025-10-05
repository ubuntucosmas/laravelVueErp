<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/projects" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Projects
          </router-link>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Tasks</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ enquiryId ? `Tasks for "${enquiryTitle}"` : 'Project Tasks' }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ enquiryId ? 'Manage tasks for this specific enquiry' : 'Manage and track all project tasks' }}
        </p>
        <p v-if="enquiryId" class="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Showing tasks filtered by enquiry. <router-link to="/projects/tasks" class="underline hover:text-blue-800">View all tasks</router-link>
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'"
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Grid
          </button>
          <button
            @click="viewMode = 'table'"
            :class="viewMode === 'table' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'"
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Table
          </button>
        </div>
        <button
          @click="openTaskAssignment()"
          class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Assign New Task
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search tasks..."
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          v-model="filters.priority"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button
          @click="applyFilters"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Filter
        </button>
      </div>
    </div>

    <!-- Tasks Grid -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading tasks...</p>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
        No tasks found matching your criteria
      </div>

      <div v-else class="p-6">
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
            @click="openTaskModal(task)"
          >
            <!-- Task Header -->
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div :class="getTaskTypeIcon(task.type)" class="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {{ getTaskTypeInitial(task.type) }}
                  </div>
                  <div>
                    <h5 class="font-semibold text-gray-900 dark:text-white text-sm">{{ task.title }}</h5>
                    <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ task.type }} Task</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full font-medium">
                    {{ getStatusLabel(task.status) }}
                  </span>
                  <span v-if="task.priority && task.priority !== 'medium'" :class="getPriorityColor(task.priority)" class="px-2 py-1 text-xs rounded-full font-medium">
                    {{ task.priority.toUpperCase() }}
                  </span>
                </div>
              </div>

              <!-- Enquiry Info -->
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span class="font-medium">Enquiry:</span> {{ task.enquiry?.title || 'Unknown Enquiry' }}
              </div>

              <!-- Task Meta Info -->
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ task.assignedBy?.name || 'Unassigned' }}</span>
                  </div>
                  <div v-if="task.due_date" class="flex items-center space-x-1" :class="isOverdue(task.due_date) ? 'text-red-600 dark:text-red-400' : ''">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ formatDate(task.due_date) }}</span>
                    <span v-if="isOverdue(task.due_date)" class="font-medium">(Overdue)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Task Summary -->
            <div class="p-6">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Click to view and manage task details
              </p>
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {{ formatDate(task.updated_at || task.created_at) }}
                </div>
                <div class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  View Details →
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assigned By</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="task in filteredTasks"
                :key="task.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                @click="openTaskModal(task)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ task.title }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ task.enquiry?.title || 'Unknown Enquiry' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div :class="getTaskTypeIcon(task.type)" class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-2">
                      {{ getTaskTypeInitial(task.type) }}
                    </div>
                    <span class="text-sm text-gray-900 dark:text-white capitalize">{{ task.type }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full font-medium">
                    {{ getStatusLabel(task.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="task.priority && task.priority !== 'medium'" :class="getPriorityColor(task.priority)" class="px-2 py-1 text-xs rounded-full font-medium">
                    {{ task.priority.toUpperCase() }}
                  </span>
                  <span v-else class="text-sm text-gray-500 dark:text-gray-400">Medium</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ task.assignedBy?.name || 'Unassigned' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div v-if="task.due_date" :class="isOverdue(task.due_date) ? 'text-red-600 dark:text-red-400' : ''">
                    {{ formatDate(task.due_date) }}
                    <span v-if="isOverdue(task.due_date)" class="font-medium">(Overdue)</span>
                  </div>
                  <div v-else class="text-gray-500 dark:text-gray-400">No due date</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Task Assignment Modal -->
    <TaskAssignmentModal
      :show="showTaskAssignmentModal"
      :enquiry-id="0"
      :enquiry="undefined"
      @close="closeTaskAssignmentModal"
      @task-assigned="handleTaskAssigned"
    />

    <!-- Task Modal -->
    <TaskModal
      :show="showTaskModal"
      :task="selectedTask"
      @close="closeTaskModal"
      @update-status="handleTaskModalStatusUpdate"
      @complete="handleTaskModalComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { EnquiryTask } from '../types/enquiry'
import { useTaskAssignment } from '../composables/useTaskAssignment'
import TaskAssignmentModal from '../components/TaskAssignmentModal.vue'
import TaskModal from '../components/TaskModal.vue'

const route = useRoute()
const { enquiryTasks, fetchAllTasks, updateTask, loading } = useTaskAssignment()

const enquiryId = ref<number | null>(null)
const enquiryTitle = ref<string>('')

const filters = ref({
  search: '',
  status: '',
  priority: ''
})

const showTaskAssignmentModal = ref(false)
const showTaskModal = ref(false)
const selectedTask = ref<EnquiryTask | null>(null)
const viewMode = ref<'grid' | 'table'>('grid')

const filteredTasks = computed(() => {
  let tasks = enquiryTasks.value

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.enquiry?.title?.toLowerCase().includes(searchTerm) ||
      task.assignedBy?.name?.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.value.status) {
    tasks = tasks.filter(task => task.status === filters.value.status)
  }

  if (filters.value.priority) {
    tasks = tasks.filter(task => task.priority === filters.value.priority)
  }

  return tasks
})

const applyFilters = () => {
  // Fetch tasks with current filters
  fetchAllTasks({
    search: filters.value.search,
    status: filters.value.status,
    priority: filters.value.priority,
    enquiry_id: enquiryId.value || undefined
  })
}

const openTaskAssignment = () => {
  showTaskAssignmentModal.value = true
}

const closeTaskAssignmentModal = () => {
  showTaskAssignmentModal.value = false
}

const updateTaskStatus = async (task: EnquiryTask, status: EnquiryTask['status']) => {
  try {
    await updateTask(task.id, { status })
    // Update local state
    const taskIndex = enquiryTasks.value.findIndex(t => t.id === task.id)
    if (taskIndex > -1) {
      enquiryTasks.value[taskIndex] = { ...enquiryTasks.value[taskIndex], status }
    }
  } catch (error) {
    console.error('Error updating task status:', error)
  }
}

const handleTaskAssigned = () => {
  // Refresh tasks
  fetchAllTasks()
}

const openTaskModal = (task: EnquiryTask) => {
  selectedTask.value = task
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
  selectedTask.value = null
}

const handleTaskModalStatusUpdate = async (status: EnquiryTask['status']) => {
  if (selectedTask.value) {
    await updateTaskStatus(selectedTask.value, status)
  }
}

const handleTaskModalComplete = () => {
  if (selectedTask.value) {
    updateTaskStatus(selectedTask.value, 'completed')
  }
  closeTaskModal()
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
    'quote': 'bg-indigo-500'
  }
  return icons[type] || 'bg-gray-500'
}

const getTaskTypeInitial = (type: string) => {
  const initials: Record<string, string> = {
    'survey': 'S',
    'design': 'D',
    'materials': 'M',
    'budget': 'B',
    'quote': 'Q'
  }
  return initials[type] || 'T'
}

onMounted(async () => {
  // Check if enquiry_id is provided in query params
  const enquiryIdParam = route.query.enquiry_id as string
  if (enquiryIdParam) {
    enquiryId.value = parseInt(enquiryIdParam)
  }

  await fetchAllTasks({
    enquiry_id: enquiryId.value || undefined
  })

  // Set enquiry title from the first task if available
  if (enquiryId.value && enquiryTasks.value.length > 0) {
    enquiryTitle.value = enquiryTasks.value[0].enquiry?.title || 'Unknown Enquiry'
  }
})
</script>
