<template>
  <div class="task-management">
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Creative Tasks</h1>
          <p class="text-gray-600">Manage design, mockup, render, and material list tasks</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="showCreateTaskModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            disabled
            title="Modal component not yet implemented"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>New Task</span>
          </button>
          <button
            @click="fetchTasks()"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Task Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Total Tasks</div>
        <div class="text-2xl font-bold text-gray-900">{{ taskStats.total || 0 }}</div>
      </div>
      <div class="bg-yellow-50 rounded-lg shadow p-4">
        <div class="text-sm text-yellow-700">Pending</div>
        <div class="text-2xl font-bold text-yellow-800">{{ taskStats.pending || 0 }}</div>
      </div>
      <div class="bg-blue-50 rounded-lg shadow p-4">
        <div class="text-sm text-blue-700">In Progress</div>
        <div class="text-2xl font-bold text-blue-800">{{ taskStats.in_progress || 0 }}</div>
      </div>
      <div class="bg-orange-50 rounded-lg shadow p-4">
        <div class="text-sm text-orange-700">Review</div>
        <div class="text-2xl font-bold text-orange-800">{{ taskStats.review || 0 }}</div>
      </div>
      <div class="bg-green-50 rounded-lg shadow p-4">
        <div class="text-sm text-green-700">Completed</div>
        <div class="text-2xl font-bold text-green-800">{{ taskStats.completed || 0 }}</div>
      </div>
      <div class="bg-purple-50 rounded-lg shadow p-4">
        <div class="text-sm text-purple-700">Designs</div>
        <div class="text-2xl font-bold text-purple-800">{{ designTasks.length }}</div>
      </div>
      <div class="bg-red-50 rounded-lg shadow p-4">
        <div class="text-sm text-red-700">Overdue</div>
        <div class="text-2xl font-bold text-red-800">{{ taskStats.overdue || 0 }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
          <select
            v-model="filters.task_type"
            @change="applyFilters"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="design">Design</option>
            <option value="mockup">Mockup</option>
            <option value="render">Render</option>
            <option value="material_list">Material List</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            v-model="filters.priority"
            @change="applyFilters"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          <select
            v-model="filters.assigned_to"
            @change="applyFilters"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Designers</option>
            <option v-for="designer in designers" :key="designer.id" :value="designer.id">
              {{ designer.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading tasks...</p>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="p-8 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-gray-600">No tasks found</p>
        <p class="text-sm text-gray-500">Create a new task to get started</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-medium text-gray-900">{{ task.title }}</h3>
                <span :class="getTaskTypeColor(task.task_type)" class="px-2 py-1 text-xs rounded-full">
                  {{ task.task_type.replace('_', ' ').toUpperCase() }}
                </span>
                <span :class="getPriorityColor(task.priority)" class="px-2 py-1 text-xs rounded-full">
                  {{ task.priority.toUpperCase() }}
                </span>
                <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ task.status.replace('_', ' ').toUpperCase() }}
                </span>
              </div>

              <p v-if="task.description" class="text-gray-600 mb-3">{{ task.description }}</p>

              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span>Enquiry: {{ task.enquiry?.title || 'N/A' }}</span>
                <span v-if="task.assigned_user">Assigned to: {{ task.assigned_user.name }}</span>
                <span v-if="task.due_date">Due: {{ formatDate(task.due_date) }}</span>
                <span>Progress: {{ task.progress_percentage }}%</span>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="openTaskDetail(task)"
                class="text-blue-600 hover:text-blue-800 p-2"
                title="View Details"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>

              <button
                v-if="canAssignTask(task)"
                @click="openAssignModal(task)"
                class="text-green-600 hover:text-green-800 p-2"
                title="Assign Task (Modal not yet implemented)"
                disabled
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>

              <button
                v-if="canUpdateProgress(task)"
                @click="openProgressModal(task)"
                class="text-purple-600 hover:text-purple-800 p-2"
                title="Update Progress (Modal not yet implemented)"
                disabled
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{{ task.progress_percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="getProgressBarColor(task.status)"
                class="h-2 rounded-full transition-all duration-300"
                :style="{ width: `${task.progress_percentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TODO: Create Task Modal -->
    <!-- <CreateTaskModal
      v-if="showCreateTaskModal"
      @close="showCreateTaskModal = false"
      @created="handleTaskCreated"
    /> -->

    <!-- TODO: Task Detail Modal -->
    <!-- <TaskDetailModal
      v-if="selectedTask"
      :task="selectedTask"
      @close="selectedTask = null"
      @updated="handleTaskUpdated"
    /> -->

    <!-- TODO: Assign Task Modal -->
    <!-- <AssignTaskModal
      v-if="taskToAssign"
      :task="taskToAssign"
      :designers="designers"
      @close="taskToAssign = null"
      @assigned="handleTaskAssigned"
    /> -->

    <!-- TODO: Progress Update Modal -->
    <!-- <ProgressUpdateModal
      v-if="taskToUpdate"
      :task="taskToUpdate"
      @close="taskToUpdate = null"
      @updated="handleProgressUpdated"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTasks } from '../composables/useTasks'
import { useAuth } from '@/composables/useAuth'
import type { CreativeTask } from '../types'
// TODO: Create these modal components
// import CreateTaskModal from '../components/CreateTaskModal.vue'
// import TaskDetailModal from '../components/TaskDetailModal.vue'
// import AssignTaskModal from '../components/AssignTaskModal.vue'
// import ProgressUpdateModal from '../components/ProgressUpdateModal.vue'

// Composables
const {
  tasks,
  loading,
  fetchTasks,
  fetchTaskStats,
  // assignTask, // TODO: Use when modal components are created
  // updateProgress, // TODO: Use when modal components are created
  designTasks
} = useTasks()
const { user } = useAuth()

// State
const showCreateTaskModal = ref(false)
const selectedTask = ref<CreativeTask | null>(null)
const taskToAssign = ref<CreativeTask | null>(null)
const taskToUpdate = ref<CreativeTask | null>(null)
const filters = ref({
  status: '',
  task_type: '',
  priority: '',
  assigned_to: ''
})
const designers = ref([
  { id: 1, name: 'John Designer', email: 'john@company.com' },
  { id: 2, name: 'Sarah Creative', email: 'sarah@company.com' },
  { id: 3, name: 'Mike Artist', email: 'mike@company.com' }
])

// Computed
const filteredTasks = computed(() => {
  let filtered = [...tasks.value]

  if (filters.value.status) {
    filtered = filtered.filter(t => t.status === filters.value.status)
  }
  if (filters.value.task_type) {
    filtered = filtered.filter(t => t.task_type === filters.value.task_type)
  }
  if (filters.value.priority) {
    filtered = filtered.filter(t => t.priority === filters.value.priority)
  }
  if (filters.value.assigned_to) {
    filtered = filtered.filter(t => t.assigned_to === parseInt(filters.value.assigned_to))
  }

  return filtered
})

const taskStats = ref({
  total: 0,
  pending: 0,
  assigned: 0,
  in_progress: 0,
  review: 0,
  approved: 0,
  completed: 0,
  overdue: 0
})

// Methods
const applyFilters = () => {
  // Filters are applied automatically through computed property
}

const openTaskDetail = (task: CreativeTask) => {
  selectedTask.value = task
}

const openAssignModal = (task: CreativeTask) => {
  taskToAssign.value = task
}

const openProgressModal = (task: CreativeTask) => {
  taskToUpdate.value = task
}

// TODO: Use when modal components are created
// const handleTaskCreated = () => {
//   showCreateTaskModal.value = false
//   fetchTasks()
// }

// const handleTaskUpdated = () => {
//   selectedTask.value = null
//   fetchTasks()
// }

// const handleTaskAssigned = () => {
//   taskToAssign.value = null
//   fetchTasks()
// }

// const handleProgressUpdated = () => {
//   taskToUpdate.value = null
//   fetchTasks()
// }

const canAssignTask = (task: CreativeTask) => {
  // Design leads can assign tasks
  return user.value?.roles?.includes('Designer') && task.status === 'pending'
}

const canUpdateProgress = (task: CreativeTask) => {
  // Assigned designers can update progress
  return task.assigned_to === user.value?.id || user.value?.roles?.includes('Designer')
}

const getTaskTypeColor = (type: string) => {
  const colors = {
    design: 'bg-purple-100 text-purple-800',
    mockup: 'bg-blue-100 text-blue-800',
    render: 'bg-green-100 text-green-800',
    material_list: 'bg-orange-100 text-orange-800'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-gray-100 text-gray-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    review: 'bg-purple-100 text-purple-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getProgressBarColor = (status: string) => {
  const colors = {
    pending: 'bg-gray-400',
    assigned: 'bg-blue-500',
    in_progress: 'bg-yellow-500',
    review: 'bg-purple-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
    completed: 'bg-green-500'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Load data on mount
onMounted(async () => {
  try {
    await Promise.all([
      fetchTasks(),
      fetchTaskStats().then(stats => taskStats.value = stats)
    ])
  } catch (error) {
    console.error('Error loading task data:', error)
  }
})
</script>
