<!-- src/modules/production/views/work-orders/Index.vue -->
<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 018 0v2M5 10a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z"/></svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">Total Enquiries</div>
          <div class="text-2xl font-bold text-blue-600">{{ enquiries.length }}</div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">In Progress</div>
          <div class="text-2xl font-bold text-yellow-600">{{ enquiries.filter(e => [
  'site_survey_completed', 'design_completed', 'design_approved', 'materials_specified', 'budget_created', 'quote_prepared'
].includes(e.status)).length }}</div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">Converted</div>
          <div class="text-2xl font-bold text-green-600">{{ enquiries.filter(e => e.status === 'converted_to_project').length }}</div>
        </div>
      </div>
    </div>
    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
      <div class="flex-1 flex gap-4">
        <select v-model="filters.status" class="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option value="">All Status</option>
          <option value="client_registered">Client Registered</option>
          <option value="enquiry_logged">Enquiry Logged</option>
          <option value="site_survey_completed">Site Survey Done</option>
          <option value="design_completed">Design Completed</option>
          <option value="design_approved">Design Approved</option>
          <option value="materials_specified">Materials Specified</option>
          <option value="budget_created">Budget Created</option>
          <option value="quote_prepared">Quote Prepared</option>
          <option value="quote_approved">Quote Approved</option>
          <option value="converted_to_project">Converted to Project</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select v-model="filters.priority" class="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button @click="applyFilters" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Apply</button>
        <button v-if="filters.status || filters.priority" @click="resetFilters" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Reset</button>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Production Orders</h1>
        <p class="text-sm text-gray-600">Create work orders from client enquiries</p>
      </div>
    </div>

    <!-- Enquiries Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading enquiries...</p>
      </div>
      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>
      <div v-else-if="enquiries.length === 0" class="p-8 text-center text-gray-500">
        No enquiries found. Please check with Client Service.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enquiry</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="enquiry in paginatedEnquiries" :key="enquiry.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry.title }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ enquiry.description?.substring(0, 50) }}...</div>
                <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ new Date(enquiry.created_at).toLocaleDateString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ enquiry.client?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{{ enquiry.priority }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">{{ enquiry.status }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openCreateOrder(enquiry)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3 bg-green-100 dark:bg-green-900 px-3 py-1 rounded"
                >
                  Create Order
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-between items-center mt-4">
      <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white disabled:opacity-50">Previous</button>
      <span class="text-sm text-gray-600 dark:text-gray-300">Page {{ page }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages" class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white disabled:opacity-50">Next</button>
    </div>

    <!-- Create Order Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Work Order</h2>
        <CreateWorkOrderModal :enquiry="selectedEnquiry" @close="closeCreateModal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEnquiries } from '@/modules/projects/composables/useEnquiries'
import CreateWorkOrderModal from './Create.vue'

const { enquiries, loading, error, fetchEnquiries, inProgressEnquiries, convertedEnquiries, totalEnquiries } = useEnquiries()
const showCreateModal = ref(false)
const selectedEnquiry = ref(null)

// Filters
const filters = ref({ status: '', priority: '' })
const filteredEnquiries = computed(() => {
  return enquiries.value.filter(e => {
    const matchStatus = !filters.value.status || e.status === filters.value.status
    const matchPriority = !filters.value.priority || e.priority === filters.value.priority
    return matchStatus && matchPriority
  })
})
const applyFilters = () => {}
const resetFilters = () => { filters.value = { status: '', priority: '' } }

// Pagination
const page = ref(1)
const perPage = 10
const totalPages = computed(() => Math.ceil(filteredEnquiries.value.length / perPage))
const paginatedEnquiries = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredEnquiries.value.slice(start, start + perPage)
})
const nextPage = () => { if (page.value < totalPages.value) page.value++ }
const prevPage = () => { if (page.value > 1) page.value-- }

const openCreateOrder = (enquiry: any) => {
  selectedEnquiry.value = enquiry
  showCreateModal.value = true
}
const closeCreateModal = () => {
  showCreateModal.value = false
  selectedEnquiry.value = null
}

onMounted(() => {
  fetchEnquiries()
})
</script>

