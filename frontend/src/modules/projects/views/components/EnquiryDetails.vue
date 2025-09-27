<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ selectedProject ? 'Project Workflow' : 'Enquiry Workflow' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ selectedProject ? selectedProject.name : enquiry?.title }}
        </p>
        <div v-if="selectedProject" class="flex items-center space-x-4 mt-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Phase {{ currentPhaseIndex + 1 }} of {{ selectedProject.phases.length }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ projectCompletedPhases }}/{{ selectedProject.phases.length }} phases completed
          </span>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <div class="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            <span v-if="workflowOffset === -100 && !selectedProject">Creating Project...</span>
            <span v-else-if="selectedProject">{{ Math.round(projectProgressPercentage) }}%</span>
            <span v-else>{{ overallProgress }}%</span>
          </div>
        </div>
        <!-- Information Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-2 mb-3">
              <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Enquiry Information</h5>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                <span :class="getPriorityClass(enquiry?.priority)" class="text-sm font-medium px-2 py-1 rounded">
                  {{ enquiry?.priority }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry?.status?.replace('_', ' ') }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry?.created_at ? formatDate(enquiry.created_at) : 'N/A' }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-2 mb-3">
              <div class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <svg class="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Client Information</h5>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry?.client?.name }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry?.client?.email }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Contact:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry?.client?.email }}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          @click="$router.push('/projects/enquiries')"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          ← Back to Enquiries
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { ref } from 'vue'
import type { Enquiry, Project } from '../../types'

interface Props {
  enquiry: Enquiry | null
  selectedProject: Project | null
  overallProgress: number
  projectProgressPercentage: number
  projectCompletedPhases: number
  currentPhaseIndex: number
}

const props = defineProps<Props>()

const workflowOffset = ref(0)

const getPriorityClass = (priority?: string) => {
  const classes = {
    low: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
    medium: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs',
    high: 'text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs',
    urgent: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs'
  }
  return classes[priority as keyof typeof classes] || classes.medium
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>
