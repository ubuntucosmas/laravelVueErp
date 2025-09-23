<template>
  <div class="creatives-dashboard space-y-6">
    <!-- Breadcrumb Navigation -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Dashboard
          </router-link>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Creatives & Design</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Creatives & Design Department</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage designs, mockups, renders, and material specifications</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="refreshData"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <svg v-if="loading" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Department Access Error -->
    <div v-if="accessError" class="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Access Restricted</h3>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">{{ accessError }}</p>
          </div>
        </div>
        <button @click="clearWorkflowError" class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- General Error Display -->
    <div v-if="error" class="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">{{ getErrorTitle() }}</h3>
            <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            v-if="errorType === 'network'"
            @click="retryLastOperation"
            class="text-red-600 hover:text-red-800 dark:text-red-400 text-sm font-medium"
          >
            Retry
          </button>
          <button @click="clearDashboardError" class="text-red-600 hover:text-red-800 dark:text-red-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Enquiries Table Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Available Enquiries</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Enquiries assigned to the Creatives department</p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ filteredEnquiries.length }} of {{ enquiries.length }} enquiries
            </div>
          </div>
        </div>
      </div>

      <!-- Enquiries Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Enquiry
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Priority
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Progress
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="enquiry in filteredEnquiries" :key="enquiry.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                      <span class="text-sm font-medium text-white">{{ enquiry.title.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry.title }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(enquiry.created_at) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ enquiry.client?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPriorityClass(enquiry.priority)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ enquiry.priority }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(enquiry.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ enquiry.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-1 mr-2">
                    <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div class="bg-purple-600 h-2 rounded-full" :style="{ width: getEnquiryProgress(enquiry) + '%' }"></div>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ getEnquiryProgress(enquiry) }}%</span>
                </div>
                <!-- Workflow Phase Indicator -->
                <div class="mt-1">
                  <span class="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {{ getCurrentWorkflowPhase(enquiry) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewEnquiryDetails(enquiry)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                >
                  View Details
                </button>
                <button
                  v-if="canAccessTasks(enquiry)"
                  @click="navigateToTasks(enquiry)"
                  class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3"
                >
                  Tasks
                </button>
                <button
                  @click="openMaterialsModal(enquiry)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                >
                  Materials
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredEnquiries.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No enquiries available</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No enquiries are currently assigned to the Creatives department.</p>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Designs Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Designs</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ designStats.total || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Mockups Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Mockups</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ mockupStats.total || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Renders Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Renders</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ renderStats.total || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Materials Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Material Lists</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ materialLists.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Designs -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Designs</h3>
            <router-link to="/creatives/designs" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
              View All
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div v-if="designLoading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
          <div v-else-if="recentDesigns.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            No designs found
          </div>
          <div v-else class="space-y-4">
            <div v-for="design in recentDesigns.slice(0, 3)" :key="design.id"
                 class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ design.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ design.design_type }} • {{ design.status }}</p>
              </div>
              <span :class="getStatusColor(design.status)" class="px-2 py-1 text-xs rounded-full">
                {{ design.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Mockups -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Mockups</h3>
            <router-link to="/creatives/mockups" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
              View All
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div v-if="mockupLoading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
          <div v-else-if="recentMockups.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            No mockups found
          </div>
          <div v-else class="space-y-4">
            <div v-for="mockup in recentMockups.slice(0, 3)" :key="mockup.id"
                 class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ mockup.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ mockup.mockup_type }} • {{ mockup.status }}</p>
              </div>
              <span :class="getStatusColor(mockup.status)" class="px-2 py-1 text-xs rounded-full">
                {{ mockup.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Materials Modal -->
    <MaterialsModal
      :is-visible="showMaterialsModal"
      :enquiry="selectedEnquiry"
      :department="'creatives'"
      @close="showMaterialsModal = false"
      @save="handleMaterialsSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDesigns } from '../composables/useDesigns'
import { useMockups } from '../composables/useMockups'
import { useRenders } from '../composables/useRenders'
import { useMaterials } from '../composables/useMaterials'
import { useEnquiries } from '../../projects/composables/useEnquiries'
import { useDepartmentWorkflow } from '../../projects/composables/useDepartmentWorkflow'
import type { Enquiry } from '../../projects/types'
import MaterialsModal from '../../projects/components/MaterialsModal.vue'

const router = useRouter()

// Composables
const {
  designs: allDesigns,
  loading: designLoading,
  fetchDesigns,
  fetchDesignStats
} = useDesigns()

const {
  mockups: allMockups,
  loading: mockupLoading,
  fetchMockups,
  fetchMockupStats
} = useMockups()

const {
  renders: allRenders,
  loading: renderLoading,
  fetchRenders,
  fetchRenderStats
} = useRenders()

const {
  materialLists,
  loading: materialLoading,
  fetchMaterialLists
} = useMaterials()

const { enquiries, loading: enquiryLoading, fetchEnquiries } = useEnquiries()
const { accessError, clearError, getAvailablePhases, getNextAvailablePhase } = useDepartmentWorkflow()

// Reactive data
const loading = ref(false)
const showMaterialsModal = ref(false)
const selectedEnquiry = ref<Enquiry | null>(null)
const error = ref('')
const errorType = ref<'network' | 'permission' | 'validation' | 'general'>('general')

// Stats
const designStats = ref({ total: 0, draft: 0, in_review: 0, approved: 0, rejected: 0, revision_requested: 0 })
const mockupStats = ref({ total: 0, draft: 0, in_review: 0, approved: 0, rejected: 0, revision_requested: 0 })
const renderStats = ref({ total: 0, draft: 0, processing: 0, in_review: 0, approved: 0, rejected: 0, revision_requested: 0 })

// Computed properties
const filteredEnquiries = computed(() => {
  return enquiries.value.filter(enquiry =>
    enquiry.department?.name?.toLowerCase().includes('creative') ||
    enquiry.assigned_department?.toLowerCase().includes('creative')
  )
})

const recentDesigns = computed(() => {
  const sorted = [...allDesigns.value].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  return sorted
})

const recentMockups = computed(() => {
  const sorted = [...allMockups.value].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  return sorted
})

// Methods
const refreshData = async () => {
  loading.value = true
  error.value = ''
  errorType.value = 'general'

  try {
    await Promise.all([
      fetchEnquiries(),
      fetchDesigns(),
      fetchDesignStats().then(stats => designStats.value = stats),
      fetchMockups(),
      fetchMockupStats().then(stats => mockupStats.value = stats),
      fetchRenders(),
      fetchRenderStats().then(stats => renderStats.value = stats),
      fetchMaterialLists()
    ])
  } catch (error: any) {
    console.error('Error refreshing dashboard data:', error)

    // Determine error type and set appropriate message
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      errorType.value = 'network'
      error.value = 'Unable to connect to the server. Please check your internet connection and try again.'
    } else if (error?.status === 403 || error?.message?.includes('permission')) {
      errorType.value = 'permission'
      error.value = 'You do not have permission to access this data. Please contact your administrator.'
    } else if (error?.status === 400 || error?.message?.includes('validation')) {
      errorType.value = 'validation'
      error.value = 'Invalid data provided. Please check your input and try again.'
    } else {
      errorType.value = 'general'
      error.value = 'An unexpected error occurred while loading the dashboard. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const retryLastOperation = async () => {
  if (errorType.value === 'network') {
    await refreshData()
  }
}

const clearDashboardError = () => {
  error.value = ''
  errorType.value = 'general'
}

const getErrorTitle = () => {
  switch (errorType.value) {
    case 'network':
      return 'Connection Error'
    case 'permission':
      return 'Access Denied'
    case 'validation':
      return 'Data Error'
    default:
      return 'Error'
  }
}

const clearWorkflowError = () => {
  clearError()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getPriorityClass = (priority: string) => {
  const classes = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[priority as keyof typeof classes] || classes.medium
}

const getStatusClass = (status: string) => {
  const classes = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    site_survey_completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    design_completed: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    materials_specified: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    budget_created: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    quote_approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    converted_to_project: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status as keyof typeof classes] || classes.new
}

const getStatusColor = (status: string) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    in_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    revision_requested: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const viewEnquiryDetails = (enquiry: Enquiry) => {
  router.push(`/projects/enquiries/${enquiry.id}?department=creatives&phase=design_concept`)
}

const canAccessTasks = (enquiry: Enquiry) => {
  return enquiry.department?.name?.toLowerCase().includes('creative') ||
         enquiry.assigned_department?.toLowerCase().includes('creative')
}

const navigateToTasks = (enquiry: Enquiry) => {
  router.push(`/projects/enquiries/${enquiry.id}?department=creatives&phase=design_concept`)
}

const openMaterialsModal = (enquiry: Enquiry) => {
  selectedEnquiry.value = enquiry
  showMaterialsModal.value = true
}

const handleMaterialsSave = (materials: any[], files: any[], notes: string) => {
  console.log('Materials saved for enquiry:', selectedEnquiry.value?.id, { materials, files, notes })
  showMaterialsModal.value = false
  selectedEnquiry.value = null
}

// Simple progress calculation for enquiries
const getEnquiryProgress = (enquiry: Enquiry): number => {
  const statusProgress: Record<string, number> = {
    'enquiry_logged': 10,
    'site_survey_completed': 25,
    'design_completed': 50,
    'materials_specified': 75,
    'budget_created': 85,
    'quote_approved': 95,
    'converted_to_project': 100
  }
  return statusProgress[enquiry.status] || 0
}

// Get current workflow phase for an enquiry
const getCurrentWorkflowPhase = (enquiry: Enquiry): string => {
  const availablePhases = getAvailablePhases(enquiry)
  const nextPhase = getNextAvailablePhase(enquiry)

  if (nextPhase) {
    return `${nextPhase.title} (Next)`
  }

  // If no next phase, find the current phase based on enquiry status
  const currentPhase = availablePhases.find(phase =>
    phase.department === 'creatives' && enquiry.status === 'design_completed'
  )

  return currentPhase?.title || 'Design Concept Development'
}

// Load data on mount
onMounted(async () => {
  await refreshData()
})
</script>
