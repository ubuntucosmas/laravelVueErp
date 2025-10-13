<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filters & Views</h3>
      <button
        @click="resetFilters"
        class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
      >
        Reset all
      </button>
    </div>

    <div class="space-y-4">
      <!-- Search Bar -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Projects</label>
        <div class="relative">
          <input
            v-model="filters.searchQuery"
            type="text"
            placeholder="Search by project name, client, or ID..."
            class="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
          <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Date Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
          <div>
            <input
              v-model="filters.dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Status</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            @click="toggleStatus(status.value)"
            :class="[
              'px-3 py-1 text-xs font-medium rounded-full transition-colors',
              filters.status.includes(status.value)
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <!-- Priority Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority Level</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="priority in priorityOptions"
            :key="priority.value"
            @click="togglePriority(priority.value)"
            :class="[
              'px-3 py-1 text-xs font-medium rounded-full transition-colors',
              filters.priority.includes(priority.value)
                ? getPriorityActiveClass(priority.value)
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            {{ priority.label }}
          </button>
        </div>
      </div>

      <!-- Budget Range Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget Range</label>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <input
              v-model.number="filters.budgetRange.min"
              type="number"
              placeholder="Min"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
          <div>
            <input
              v-model.number="filters.budgetRange.max"
              type="number"
              placeholder="Max"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Department Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
        <select
          v-model="filters.department"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
        >
          <option value="">All Departments</option>
          <option v-for="dept in departmentOptions" :key="dept.value" :value="dept.value">
            {{ dept.label }}
          </option>
        </select>
      </div>

      <!-- View Options -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">View Options</label>
        <div class="space-y-2">
          <label class="flex items-center">
            <input
              v-model="filters.showCharts"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Show charts</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="filters.showMetrics"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Show detailed metrics</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="filters.showActivities"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Show activity feed</span>
          </label>
        </div>
      </div>

      <!-- Export Options -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Data</label>
        <div class="flex gap-2">
          <button
            @click="exportToPDF"
            class="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium text-sm"
          >
            PDF
          </button>
          <button
            @click="exportToExcel"
            class="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium text-sm"
          >
            Excel
          </button>
        </div>
      </div>

      <!-- Apply Filters Button -->
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="applyFilters"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Filters {
  searchQuery: string
  dateFrom: string
  dateTo: string
  status: string[]
  priority: string[]
  department: string
  budgetRange: {
    min: number
    max: number
  }
  showCharts: boolean
  showMetrics: boolean
  showActivities: boolean
}

const filters = reactive<Filters>({
  searchQuery: '',
  dateFrom: '',
  dateTo: '',
  status: [],
  priority: [],
  department: '',
  budgetRange: {
    min: 0,
    max: 1000000
  },
  showCharts: true,
  showMetrics: true,
  showActivities: true
})

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
]

const departmentOptions = [
  { value: 'design', label: 'Design' },
  { value: 'projects', label: 'Projects' },
  { value: 'client_service', label: 'Client Service' },
  { value: 'hr', label: 'HR' }
]

const emit = defineEmits<{
  filter: [filters: Filters]
  export: [data: { type: string; filters: Filters }]
}>()

const toggleStatus = (status: string) => {
  const index = filters.status.indexOf(status)
  if (index > -1) {
    filters.status.splice(index, 1)
  } else {
    filters.status.push(status)
  }
}

const togglePriority = (priority: string) => {
  const index = filters.priority.indexOf(priority)
  if (index > -1) {
    filters.priority.splice(index, 1)
  } else {
    filters.priority.push(priority)
  }
}

const getPriorityActiveClass = (priority: string) => {
  const classes: Record<string, string> = {
    'low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[priority] || 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
}

const resetFilters = () => {
  filters.searchQuery = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  filters.status = []
  filters.priority = []
  filters.department = ''
  filters.budgetRange.min = 0
  filters.budgetRange.max = 1000000
  filters.showCharts = true
  filters.showMetrics = true
  filters.showActivities = true
  applyFilters()
}

const applyFilters = () => {
  emit('filter', { ...filters })
}

const exportToPDF = () => {
  emit('export', { type: 'pdf', filters: { ...filters } })
}

const exportToExcel = () => {
  emit('export', { type: 'excel', filters: { ...filters } })
}
</script>
