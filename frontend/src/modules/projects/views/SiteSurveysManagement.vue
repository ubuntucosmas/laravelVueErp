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
            <router-link to="/projects" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Projects
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Site Surveys</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Site Surveys</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Conduct and record site surveys for enquiries</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        New Site Survey
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search site surveys..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Site Surveys List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Site Surveys</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Manage and track site survey assessments</p>
      </div>

      <div class="p-4">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading site surveys...</p>
        </div>

        <div v-else-if="filteredSurveys.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No site surveys found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ searchQuery || statusFilter ? 'Try adjusting your filters' : 'Get started by creating your first site survey' }}
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="survey in filteredSurveys"
            :key="survey.id"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ survey.client_name }}
                  </h4>
                  <span :class="getStatusBadgeClass(survey.status)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                    {{ survey.status.replace('_', ' ') }}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span class="font-medium">Location:</span> {{ survey.location }}
                  </div>
                  <div>
                    <span class="font-medium">Date:</span> {{ formatDate(survey.site_visit_date) }}
                  </div>
                  <div>
                    <span class="font-medium">Enquiry:</span>
                    <router-link
                      :to="`/projects/enquiries/${survey.enquiry_id}`"
                      class="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {{ survey.enquiry?.title || `Enquiry #${survey.enquiry_id}` }}
                    </router-link>
                  </div>
                  <div>
                    <span class="font-medium">Client:</span> {{ survey.enquiry?.client?.name || 'Unknown' }}
                  </div>
                </div>

                <div v-if="survey.objectives" class="mt-3">
                  <span class="font-medium text-sm text-gray-700 dark:text-gray-300">Objectives:</span>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ survey.objectives }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="viewSurvey(survey)"
                  class="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <span>View</span>
                </button>
                <button
                  @click="editSurvey(survey)"
                  class="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Site Survey Modal -->
    <SiteSurveyModal
      :is-visible="showSurveyModal"
      :enquiry="selectedSurvey?.enquiry"
      :survey="selectedSurvey"
      @close="showSurveyModal = false"
      @save="handleSurveySave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { SiteSurvey, Enquiry } from '../types'
import { useSiteSurveys } from '../composables/useSiteSurveys'
import SiteSurveyModal from '../components/SiteSurveyModal.vue'

const router = useRouter()
const { siteSurveys, loading, fetchSiteSurveys } = useSiteSurveys()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)
const selectedSurvey = ref<SiteSurvey | null>(null)
const showSurveyModal = ref(false)

// Computed properties
const filteredSurveys = computed(() => {
  let filtered = siteSurveys.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(survey =>
      survey.client_name.toLowerCase().includes(query) ||
      survey.location.toLowerCase().includes(query) ||
      survey.enquiry?.title?.toLowerCase().includes(query) ||
      survey.enquiry?.client?.name?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(survey => survey.status === statusFilter.value)
  }

  return filtered
})

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const viewSurvey = (survey: SiteSurvey) => {
  router.push(`/projects/enquiries/${survey.enquiry_id}`)
}

const editSurvey = (survey: SiteSurvey) => {
  selectedSurvey.value = survey
  showSurveyModal.value = true
}

const handleSurveySave = (survey: SiteSurvey) => {
  console.log('Survey saved:', survey)
  showSurveyModal.value = false
  selectedSurvey.value = null
  // Refresh the list
  fetchSiteSurveys()
}

// Lifecycle
onMounted(() => {
  fetchSiteSurveys()
})
</script>
