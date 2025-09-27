<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Loading State -->
    <div v-if="!enquiry" class="bg-blue-100 dark:bg-blue-900 p-8 rounded-lg text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 class="text-lg font-medium text-blue-800 dark:text-blue-200">Loading Enquiry...</h3>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Enquiry Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ enquiry.title }}</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enquiry #{{ enquiry.id }} • Created {{ formatDate(enquiry.created_at) }}
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <span :class="getPriorityBadgeClass(enquiry.priority || 'medium')" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ enquiry.priority || 'medium' }}
            </span>
            <button @click="$router.push('/projects/enquiries')" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              ← Back to Enquiries
            </button>
          </div>
        </div>
      </div>

      <!-- Departmental Tasks Dashboard -->
      <DepartmentalTaskDashboard
        context="enquiry"
        :context-id="enquiry.id"
        title="Departmental Tasks"
        :enquiry="enquiry"
      />

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            @click="createNewTask"
            class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Create Task</h4>
              <p class="text-xs text-gray-600 dark:text-gray-400">Add new departmental task</p>
            </div>
          </button>

          <button
            v-if="!enquiry.converted_to_project_id"
            @click="convertToProject"
            class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <div class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Convert to Project</h4>
              <p class="text-xs text-gray-600 dark:text-gray-400">Start production project</p>
            </div>
          </button>

          <router-link
            v-else
            :to="`/projects/projects/${enquiry.converted_to_project_id}`"
            class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <div class="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">View Project</h4>
              <p class="text-xs text-gray-600 dark:text-gray-400">Go to production project</p>
            </div>
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Enquiry } from '../types'
import DepartmentalTaskDashboard from '../components/DepartmentalTaskDashboard.vue'
import { useEnquiries } from '../composables/useEnquiries'

const route = useRoute()
const { getEnquiry } = useEnquiries()

const enquiry = ref<Enquiry | null>(null)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getPriorityBadgeClass = (priority: string) => {
  const classes = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[priority as keyof typeof classes] || classes.medium
}

const createNewTask = () => {
  // TODO: Open task creation modal
  console.log('Create new task for enquiry:', enquiry.value.id)
}

const convertToProject = () => {
  // TODO: Implement project conversion
  console.log('Convert enquiry to project:', enquiry.value.id)
}

onMounted(async () => {
  const enquiryId = parseInt(route.params.id as string)
  if (enquiryId) {
    enquiry.value = getEnquiry(enquiryId) || null
  }
})
</script>
