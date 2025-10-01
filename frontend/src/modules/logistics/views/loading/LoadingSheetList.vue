<!-- frontend/src/modules/logistics/views/loading-sheets/LoadingSheetList.vue -->
<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Sheets</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">Track items loaded to and from project sites</p>
        </div>
        <div class="flex space-x-2">
          <RouterLink
            to="/logistics/loading-sheets/new/outbound"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            New Outbound
          </RouterLink>
          <RouterLink
            to="/logistics/loading-sheets/new/return"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            New Return
          </RouterLink>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              v-model="filters.type"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="outbound">Outbound</option>
              <option value="return">Return</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              v-model="filters.status"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
  
      <!-- Loading Sheets Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Loading sheets...</p>
        </div>
        <div v-else-if="error" class="p-4 text-center text-red-600 dark:text-red-400">
          {{ error }}
        </div>
        <div v-else-if="filteredSheets.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          No loading sheets found. Create a new one to get started.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Loading Sheet #
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Project
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vehicle
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Driver
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="sheet in paginatedSheets"
                :key="sheet.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">#{{ sheet.id }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ sheet.items.length }} items
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ sheet.projectName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'px-2 py-1 text-xs font-semibold rounded-full': true,
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': sheet.type === 'outbound',
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': sheet.type === 'return'
                    }"
                  >
                    {{ sheet.type === 'outbound' ? 'Outbound' : 'Return' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ sheet.vehicleName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ sheet.driverName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(sheet.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'px-2 py-1 text-xs font-semibold rounded-full': true,
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': sheet.status === 'draft',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': sheet.status === 'in_progress',
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': sheet.status === 'completed'
                    }"
                  >
                    {{ formatStatus(sheet.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <RouterLink
                    :to="`/logistics/loading-sheets/${sheet.id}`"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    View
                  </RouterLink>
                  <button
                    @click="duplicateSheet(sheet)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                  >
                    Duplicate
                  </button>
                  <button
                    v-if="sheet.status === 'draft'"
                    @click="deleteSheet(sheet)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-between items-center mt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { mockLoadingSheets } from '../../mock/loadingSheetMockData'
  import type { LoadingSheet } from '../../types/loadingSheet'
  
  const router = useRouter()
  
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sheets = ref<LoadingSheet[]>([])
  
  // Filters
  const filters = ref({
    type: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  })
  
  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  // Computed
  const filteredSheets = computed(() => {
    return sheets.value.filter(sheet => {
      const matchesType = !filters.value.type || sheet.type === filters.value.type
      const matchesStatus = !filters.value.status || sheet.status === filters.value.status
      const matchesDateFrom = !filters.value.dateFrom || new Date(sheet.date) >= new Date(filters.value.dateFrom)
      const matchesDateTo = !filters.value.dateTo || new Date(sheet.date) <= new Date(filters.value.dateTo + 'T23:59:59')
      
      return matchesType && matchesStatus && matchesDateFrom && matchesDateTo
    })
  })
  
  const totalPages = computed(() => Math.ceil(filteredSheets.value.length / itemsPerPage))
  
  const paginatedSheets = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredSheets.value.slice(start, start + itemsPerPage)
  })
  
  // Methods
  const fetchLoadingSheets = async () => {
    loading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      sheets.value = [...mockLoadingSheets]
    } catch (err) {
      error.value = 'Failed to load loading sheets'
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'Draft',
      in_progress: 'In Progress',
      completed: 'Completed'
    }
    return statusMap[status] || status
  }
  
  const duplicateSheet = (sheet: LoadingSheet) => {
    // In a real app, this would navigate to a new loading sheet with the same data
    router.push({
      path: `/logistics/loading-sheets/new/${sheet.type}`,
      query: { duplicate: sheet.id.toString() }
    })
  }
  
  const deleteSheet = (sheet: LoadingSheet) => {
    if (confirm(`Are you sure you want to delete loading sheet #${sheet.id}?`)) {
      sheets.value = sheets.value.filter(s => s.id !== sheet.id)
    }
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }
  
  // Lifecycle
  onMounted(() => {
    fetchLoadingSheets()
  })
  </script>