<template>
  <div class="departmental-task-list">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        Departmental Tasks
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
          ({{ filteredTasks.length }} of {{ tasks.length }} {{ tasks.length === 1 ? 'task' : 'tasks' }})
        </span>
      </h2>

      <div class="flex items-center space-x-2">
        <!-- Filter Toggle -->
        <button
          @click="showFilters = !showFilters"
          :class="[
            'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors',
            showFilters
              ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
          </svg>
          Filters
          <span v-if="activeFilterCount > 0" class="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full min-w-[1.25rem] h-4">
            {{ activeFilterCount }}
          </span>
        </button>

        <!-- View Toggle -->
        <div class="flex rounded-md shadow-sm">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-l-md border',
              viewMode === 'grid'
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b',
              viewMode === 'list'
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <!-- Refresh Button -->
        <button
          @click="$emit('refresh')"
          :disabled="loading"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Filters Section -->
    <div v-if="showFilters" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Tasks
          </label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by name or description..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <select
            v-model="filters.priority"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <!-- Due Date Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date
          </label>
          <select
            v-model="filters.dueDate"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="week">Due This Week</option>
            <option value="month">Due This Month</option>
          </select>
        </div>
      </div>

      <!-- Additional Filters Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <!-- Department Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Department
          </label>
          <select
            v-model="filters.department"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Departments</option>
            <option value="projects">Projects</option>
            <option value="creatives">Creatives</option>
            <option value="finance">Finance</option>
            <option value="procurement">Procurement</option>
            <option value="hr">HR</option>
          </select>
        </div>

        <!-- Assigned User Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assigned User
          </label>
          <select
            v-model="filters.assignedUser"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Users</option>
            <option value="unassigned">Unassigned</option>
            <option v-for="user in getUniqueAssignedUsers()" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          @click="clearFilters"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Clear All Filters
        </button>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ activeFilterCount }} filter{{ activeFilterCount !== 1 ? 's' : '' }} active
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-400">Loading tasks...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error loading tasks</h3>
          <p class="mt-1 text-sm text-red-700 dark:text-red-300">{{ error }}</p>
          <button
            @click="$emit('refresh')"
            class="mt-2 text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-600 dark:hover:text-red-100"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ tasks.length === 0 ? 'No departmental tasks have been assigned yet.' : 'Try adjusting your filters.' }}
      </p>
    </div>

    <!-- Task Grid/List -->
    <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'">
      <DepartmentalTaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        :view-mode="viewMode"
        @click="$emit('task-click', task)"
        @viewDetails="$emit('view-details', task)"
      />
    </div>

    <!-- Load More (if pagination is needed) -->
    <div v-if="hasMore && !loading" class="mt-6 text-center">
      <button
        @click="loadMore"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Load More Tasks
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DepartmentalTask } from '../types'
import DepartmentalTaskCard from './DepartmentalTaskCard.vue'

// Props
interface Props {
  tasks: DepartmentalTask[]
  loading: boolean
  error: string | null
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  'task-click': [task: DepartmentalTask]
  'view-details': [task: DepartmentalTask]
  'refresh': []
}>()

// Local state
const viewMode = ref<'grid' | 'list'>('grid')
const showFilters = ref(false)
const hasMore = ref(false) // For pagination

// Filter state
const filters = ref({
  search: '',
  status: '',
  priority: '',
  dueDate: '',
  department: '',
  assignedUser: ''
})

// Computed filtered tasks
const filteredTasks = computed(() => {
  let filtered = [...props.tasks]

  // Search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(task =>
      task.task_name.toLowerCase().includes(searchTerm) ||
      task.task_description.toLowerCase().includes(searchTerm) ||
      (task.assigned_user?.name.toLowerCase().includes(searchTerm))
    )
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(task => task.status === filters.value.status)
  }

  // Priority filter
  if (filters.value.priority) {
    filtered = filtered.filter(task => task.priority === filters.value.priority)
  }

  // Due date filter
  if (filters.value.dueDate) {
    const now = new Date()
    filtered = filtered.filter(task => {
      if (!task.due_date) return false

      const dueDate = new Date(task.due_date)
      const diffTime = dueDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (filters.value.dueDate) {
        case 'overdue':
          return diffDays < 0
        case 'today':
          return diffDays === 0
        case 'week':
          return diffDays >= 0 && diffDays <= 7
        case 'month':
          return diffDays >= 0 && diffDays <= 30
        default:
          return true
      }
    })
  }

  // Department filter
  if (filters.value.department) {
    filtered = filtered.filter(task => {
      if (!task.department) return false
      return task.department.name.toLowerCase().includes(filters.value.department.toLowerCase())
    })
  }

  // Assigned user filter
  if (filters.value.assignedUser) {
    if (filters.value.assignedUser === 'unassigned') {
      filtered = filtered.filter(task => !task.assigned_user_id)
    } else {
      const userId = parseInt(filters.value.assignedUser)
      filtered = filtered.filter(task => task.assigned_user_id === userId)
    }
  }

  return filtered
})

// Computed active filter count
const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.search) count++
  if (filters.value.status) count++
  if (filters.value.priority) count++
  if (filters.value.dueDate) count++
  if (filters.value.department) count++
  if (filters.value.assignedUser) count++
  return count
})

// Get unique assigned users for filter dropdown
const getUniqueAssignedUsers = () => {
  const users = new Map()
  props.tasks.forEach(task => {
    if (task.assigned_user && task.assigned_user_id) {
      users.set(task.assigned_user_id, task.assigned_user)
    }
  })
  return Array.from(users.values())
}

// Methods
const loadMore = () => {
  // TODO: Implement pagination
  console.log('Loading more tasks...')
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    priority: '',
    dueDate: '',
    department: '',
    assignedUser: ''
  }
}
</script>

<style scoped>
.departmental-task-list {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6;
}
</style>
