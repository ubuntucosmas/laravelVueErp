<template>
  <div class="design-dashboard space-y-6">
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
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Design Department</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Design Department</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage material specifications, technical drawings, and production planning</p>
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
        <button @click="clearAccessError" class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Enquiries Table Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Available Enquiries</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Enquiries assigned to the Design department</p>
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
                    <div class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
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
                      <div class="bg-indigo-600 h-2 rounded-full" :style="{ width: getEnquiryProgress(enquiry) + '%' }"></div>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ getEnquiryProgress(enquiry) }}%</span>
                </div>
                <!-- Workflow Phase Indicator -->
                <div class="mt-1">
                  <span class="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
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
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No enquiries are currently assigned to the Design department.</p>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Technical Drawings Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Technical Drawings</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ technicalDrawings.length }}</p>
          </div>
        </div>
      </div>

      <!-- Material Specs Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Material Specs</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ materialSpecs.length }}</p>
          </div>
        </div>
      </div>

      <!-- Production Plans Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Production Plans</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ productionPlans.length }}</p>
          </div>
        </div>
      </div>

      <!-- Quality Standards Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Quality Standards</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ qualityStandards.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Technical Drawings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Technical Drawings</h3>
            <router-link to="/creatives/designs" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
              View All
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div v-if="technicalDrawings.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            No technical drawings found
          </div>
          <div v-else class="space-y-4">
            <div v-for="drawing in technicalDrawings.slice(0, 3)" :key="drawing.id"
                 class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ drawing.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ drawing.drawing_type }} • {{ drawing.status }}</p>
              </div>
              <span :class="getStatusColor(drawing.status)" class="px-2 py-1 text-xs rounded-full">
                {{ drawing.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Material Specifications -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Material Specs</h3>
            <router-link to="/creatives/materials" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
              View All
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div v-if="materialSpecs.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            No material specifications found
          </div>
          <div v-else class="space-y-4">
            <div v-for="spec in materialSpecs.slice(0, 3)" :key="spec.id"
                 class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ spec.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ spec.items.length }} items • ${{ spec.totalCost.toFixed(2) }}
                </p>
              </div>
              <span :class="getStatusColor(spec.status)" class="px-2 py-1 text-xs rounded-full">
                {{ spec.status }}
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
      :department="'design'"
      @close="showMaterialsModal = false"
      @save="handleMaterialsSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEnquiries } from '../../projects/composables/useEnquiries'
import { useDepartmentWorkflow } from '../../projects/composables/useDepartmentWorkflow'
import type { Enquiry } from '../../projects/types'
import MaterialsModal from '../../projects/components/MaterialsModal.vue'

const router = useRouter()

// Composables
const { enquiries, loading: enquiryLoading, fetchEnquiries } = useEnquiries()
const { accessError, clearError, getAvailablePhases, getNextAvailablePhase } = useDepartmentWorkflow()

// Reactive data
const loading = ref(false)
const showMaterialsModal = ref(false)
const selectedEnquiry = ref<Enquiry | null>(null)

// Mock data for design department
const technicalDrawings = ref([
  { id: 1, title: 'Main Stage Layout', drawing_type: 'Floor Plan', status: 'approved' },
  { id: 2, title: 'Lighting Rig Design', drawing_type: 'Technical', status: 'in_review' },
  { id: 3, title: 'Booth Structure', drawing_type: '3D Model', status: 'draft' }
])

const materialSpecs = ref([
  {
    id: 1,
    title: 'Exhibition Materials',
    items: [
      { name: 'Aluminum Frame', quantity: 4, unitPrice: 15000 },
      { name: 'LED Panel', quantity: 2, unitPrice: 25000 }
    ],
    totalCost: 110000,
    status: 'approved'
  },
  {
    id: 2,
    title: 'Installation Equipment',
    items: [
      { name: 'Power Cables', quantity: 10, unitPrice: 5000 },
      { name: 'Mounting Hardware', quantity: 1, unitPrice: 15000 }
    ],
    totalCost: 65000,
    status: 'in_review'
  }
])

const productionPlans = ref([
  { id: 1, title: 'Event Setup Schedule', status: 'approved' },
  { id: 2, title: 'Quality Control Checklist', status: 'draft' }
])

const qualityStandards = ref([
  { id: 1, title: 'Material Quality Standards', status: 'approved' },
  { id: 2, title: 'Installation Guidelines', status: 'in_review' }
])

// Computed properties
const filteredEnquiries = computed(() => {
  return enquiries.value.filter(enquiry =>
    enquiry.department?.name?.toLowerCase().includes('design') ||
    enquiry.assigned_department?.toLowerCase().includes('design')
  )
})

// Methods
const refreshData = async () => {
  loading.value = true
  try {
    await fetchEnquiries()
  } catch (error) {
    console.error('Error refreshing dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const clearAccessError = () => {
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
    revision_requested: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
    phase.department === 'design' && enquiry.status === 'materials_specified'
  )

  return currentPhase?.title || 'Material Specification & Planning'
}

const viewEnquiryDetails = (enquiry: Enquiry) => {
  router.push(`/projects/enquiries/${enquiry.id}?department=design&phase=material_specification`)
}

const canAccessTasks = (enquiry: Enquiry) => {
  return enquiry.department?.name?.toLowerCase().includes('design') ||
         enquiry.assigned_department?.toLowerCase().includes('design')
}

const navigateToTasks = (enquiry: Enquiry) => {
  router.push(`/projects/enquiries/${enquiry.id}?department=design&phase=material_specification`)
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

// Load data on mount
onMounted(async () => {
  await refreshData()
})
</script>
