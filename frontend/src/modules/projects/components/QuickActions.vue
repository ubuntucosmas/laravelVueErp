<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
      <div class="text-sm text-gray-600 dark:text-gray-400">
        {{ activeProjectsCount }} active projects
      </div>
    </div>

    <!-- Action Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <!-- Enquiries -->
      <div class="group relative">
        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-200 cursor-pointer"
             @click="$router.push('/projects/enquiries')">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ enquiriesCount }}</div>
              <div class="text-xs text-yellow-600 dark:text-yellow-400">Active Enquiries</div>
            </div>
          </div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-1">Enquiries</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">Manage client enquiries and requests</p>
          <div class="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
        </div>
      </div>

      <!-- Site Surveys -->
      <div class="group relative">
        <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-200 cursor-pointer"
             @click="$router.push('/projects/site-surveys')">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ surveysCount }}</div>
              <div class="text-xs text-green-600 dark:text-green-400">Site Surveys</div>
            </div>
          </div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-1">Site Surveys</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">Conduct and record site surveys</p>
          <div class="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
        </div>
      </div>

      <!-- Materials & Quotation -->
      <div class="group relative">
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-200 cursor-pointer"
             @click="$router.push('/projects/materials')">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ materialsCount }}</div>
              <div class="text-xs text-purple-600 dark:text-purple-400">Material Lists</div>
            </div>
          </div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-1">Materials & Quotation</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">Create material lists and quotations</p>
          <div class="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
        </div>
      </div>

      <!-- Approved Projects -->
      <div class="group relative">
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-all duration-200 cursor-pointer"
             @click="$router.push('/projects/projects')">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ projectsCount }}</div>
              <div class="text-xs text-indigo-600 dark:text-indigo-400">Active Projects</div>
            </div>
          </div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-1">Approved Projects</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">Track project progress through phases</p>
          <div class="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
        </div>
      </div>

      <!-- Workflow Overview -->
      <div class="group relative">
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
             @click="$router.push('/projects')">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-600 dark:text-gray-400">{{ Math.round(overallProgress) }}%</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Avg Progress</div>
            </div>
          </div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-1">Workflow Overview</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">View all projects and their progress</p>
          <div class="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h4>
      <div class="space-y-2">
        <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-3 text-sm">
          <div class="w-2 h-2 rounded-full" :class="getActivityColor(activity.type)"></div>
          <span class="text-gray-600 dark:text-gray-400">{{ activity.description }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-500 ml-auto">{{ activity.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEnquiries } from '../composables/useEnquiries'
import { useProjects } from '../composables/useProjects'

const { enquiries } = useEnquiries()
const { projects } = useProjects()

// Computed properties for counts
const enquiriesCount = computed(() => enquiries.value.filter(e => e.status !== 'converted_to_project').length)
const surveysCount = computed(() => enquiries.value.filter(e => e.status === 'site_survey_completed').length)
const materialsCount = computed(() => enquiries.value.filter(e => e.status === 'materials_created' || e.status === 'quoted').length)
const projectsCount = computed(() => projects.value.filter(p => p.status === 'in_progress' || p.status === 'planning').length)
const activeProjectsCount = computed(() => projects.value.filter(p => p.status !== 'completed').length)

// Overall progress calculation
const overallProgress = computed(() => {
  if (projects.value.length === 0) return 0

  const totalProgress = projects.value.reduce((sum, project) => {
    const completedPhases = project.phases.filter(phase => phase.status === 'Completed').length
    return sum + (completedPhases / project.phases.length) * 100
  }, 0)

  return totalProgress / projects.value.length
})

// Recent activities (dummy data for now)
const recentActivities = ref([
  {
    id: 1,
    description: 'New enquiry submitted for ABC Corporation',
    type: 'enquiry',
    time: '2 min ago'
  },
  {
    id: 2,
    description: 'Site survey completed for XYZ Events',
    type: 'survey',
    time: '15 min ago'
  },
  {
    id: 3,
    description: 'Material list created for Product Launch',
    type: 'materials',
    time: '1 hour ago'
  },
  {
    id: 4,
    description: 'Project ABC Product Launch moved to production',
    type: 'project',
    time: '2 hours ago'
  }
])

const getActivityColor = (type: string) => {
  const colors = {
    enquiry: 'bg-blue-500',
    survey: 'bg-green-500',
    materials: 'bg-purple-500',
    project: 'bg-indigo-500',
    client: 'bg-yellow-500'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-500'
}
</script>
