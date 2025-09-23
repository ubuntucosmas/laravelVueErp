<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
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
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/client-service" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Client Service
            </router-link>
          </div>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/client-service/enquiries" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Enquiries
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
              {{ enquiry?.title || 'Enquiry Details' }}
            </span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-400">Loading enquiry details...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Enquiry</h3>
          <p class="text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Enquiry Details -->
    <div v-else-if="enquiry" class="space-y-6">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ enquiry.title }}</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">{{ enquiry.client?.name }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <span :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              getStatusColor(enquiry.status)
            ]">
              {{ getStatusLabel(enquiry.status) }}
            </span>
            <span :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              getPriorityColor(enquiry.priority)
            ]">
              {{ enquiry.priority.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Enquiry Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Information -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ enquiry.client?.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ enquiry.client?.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ enquiry.priority.toUpperCase() }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Budget</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ enquiry.estimated_budget ? `KES ${enquiry.estimated_budget.toLocaleString()}` : 'Not specified' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Created By</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ enquiry.created_by_user?.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Created Date</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ new Date(enquiry.created_at).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>

        <!-- Project Scope -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Project Scope</h3>
          </div>
          <div class="p-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <p class="text-sm text-gray-900 dark:text-white">{{ enquiry.description }}</p>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Scope Details</label>
              <p class="text-sm text-gray-900 dark:text-white">{{ enquiry.project_scope }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Timeline -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Status Timeline</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="status in statusOptions" :key="status.value"
                 class="flex items-center space-x-3">
              <div :class="[
                'w-4 h-4 rounded-full',
                enquiry.status === status.value ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              ]"></div>
              <span :class="[
                'text-sm',
                enquiry.status === status.value ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              ]">
                {{ status.label }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Actions</h3>
        </div>
        <div class="p-6">
          <div class="flex flex-wrap gap-3">
            <router-link
              :to="`/client-service/enquiries/${enquiry.id}/edit`"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Enquiry
            </router-link>
            <button
              @click="updateStatus"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Update Status
            </button>
            <router-link
              to="/client-service/enquiries"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Enquiries
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <div>
          <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-200">Enquiry Not Found</h3>
          <p class="text-yellow-700 dark:text-yellow-300 mt-1">The enquiry you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Enquiry } from '../types/enquiry'
import { useEnquiries } from '../composables/useEnquiries'

const route = useRoute()
const { getEnquiry } = useEnquiries()

const enquiry = ref<Enquiry | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const statusOptions = [
  { value: 'client_registered', label: 'Client Registered' },
  { value: 'enquiry_logged', label: 'Enquiry Logged' },
  { value: 'site_survey_completed', label: 'Site Survey Completed' },
  { value: 'design_completed', label: 'Design Completed' },
  { value: 'design_approved', label: 'Design Approved' },
  { value: 'materials_specified', label: 'Materials Specified' },
  { value: 'budget_created', label: 'Budget Created' },
  { value: 'quote_prepared', label: 'Quote Prepared' },
  { value: 'quote_approved', label: 'Quote Approved' },
  { value: 'converted_to_project', label: 'Converted to Project' },
  { value: 'cancelled', label: 'Cancelled' }
]

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'client_registered': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'enquiry_logged': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'site_survey_completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'design_completed': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'design_approved': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'materials_specified': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'budget_created': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'quote_prepared': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    'quote_approved': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    'converted_to_project': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'client_registered': 'Client Registered',
    'enquiry_logged': 'Enquiry Logged',
    'site_survey_completed': 'Site Survey Done',
    'design_completed': 'Design Completed',
    'design_approved': 'Design Approved',
    'materials_specified': 'Materials Specified',
    'budget_created': 'Budget Created',
    'quote_prepared': 'Quote Prepared',
    'quote_approved': 'Quote Approved',
    'converted_to_project': 'Converted to Project',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const updateStatus = () => {
  // Placeholder for status update functionality
  console.log('Update status clicked')
}

onMounted(async () => {
  const enquiryId = parseInt(route.params.id as string)

  if (enquiryId) {
    try {
      const foundEnquiry = getEnquiry(enquiryId)
      if (foundEnquiry) {
        enquiry.value = foundEnquiry
      } else {
        error.value = 'Enquiry not found'
      }
    } catch (err) {
      error.value = 'Failed to load enquiry details'
      console.error('Error loading enquiry:', err)
    }
  } else {
    error.value = 'Invalid enquiry ID'
  }

  loading.value = false
})
</script>
