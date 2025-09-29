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
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Approved Projects</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Status Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="flex space-x-1">
        <button
          v-for="status in statusTabs"
          :key="status.key"
          @click="activeTab = status.key"
          :class="activeTab === status.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {{ status.label }} ({{ status.count }})
        </button>
      </div>
    </div>

    <!-- Projects Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading projects...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Project
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Project ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Budget
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
            <tr v-for="project in paginatedProjects" :key="project.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-sm font-medium text-white">{{ project.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ project.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ project.created_at.split('T')[0] }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ project.enquiry?.client.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                  {{ project.project_id || 'Pending' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusClass(project.status)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ project.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                KES {{ project.budget.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {{ completedPhases(project) }}/{{ project.phases.length }} phases
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        :style="{ width: progressPercentage(project) + '%' }"
                        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {{ progressPercentage(project) }}%
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewProjectDetails(project)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                >
                  View
                </button>
                <button
                  @click="viewDepartmentalTasks(project)"
                  class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3"
                >
                  Tasks
                </button>
                <button
                  v-if="canAdvancePhase(project)"
                  @click="advancePhase(project)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Advance
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="filteredProjects.length > itemsPerPage"
        :current-page="currentPage"
        :total-items="filteredProjects.length"
        :items-per-page="itemsPerPage"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Empty State -->
    <div v-if="projects.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by converting an approved enquiry to a project.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Project } from '../types'
import type { DepartmentalTaskStats } from '../types/departmentalTask'
import { useProjects } from '../composables/useProjects'
import Pagination from '../../../components/Pagination.vue'

const router = useRouter()

const { projects, loading, error, fetchProjects, updateProjectPhase, getDepartmentalTaskStats } = useProjects()

// Filters and tabs
const filters = ref({ search: '', status: '' })
const activeTab = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Store departmental task stats for each project
const projectTaskStats = ref<Record<number, DepartmentalTaskStats>>({})

// Status tabs
const statusTabs = computed(() => [
  { key: 'all', label: 'All', count: projects.value.length },
  { key: 'planning', label: 'Planning', count: projects.value.filter(p => p.status === 'planning').length },
  { key: 'in_progress', label: 'In Progress', count: projects.value.filter(p => p.status === 'in_progress').length },
  { key: 'completed', label: 'Completed', count: projects.value.filter(p => p.status === 'completed').length }
])

// Filtered projects
const filteredProjects = computed(() => {
  let filtered = projects.value

  if (activeTab.value !== 'all') {
    filtered = projects.value.filter(project => project.status === activeTab.value)
  }

  return filtered
})

// Paginated projects
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProjects.value.slice(start, end)
})

// Pagination handlers
const handlePageChange = (page: number) => {
  currentPage.value = page
}

// Function to get stats for a project (with caching)
const getProjectTaskStats = async (project: Project): Promise<DepartmentalTaskStats> => {
  if (!projectTaskStats.value[project.id]) {
    projectTaskStats.value[project.id] = await getDepartmentalTaskStats(project.id)
  }
  return projectTaskStats.value[project.id]
}

// Computed property for template use (returns cached stats or default)
const getDepartmentalTaskStatsForProject = (project: Project): DepartmentalTaskStats => {
  return projectTaskStats.value[project.id] || {
    total_tasks: 0,
    completed_tasks: 0,
    in_progress_tasks: 0,
    pending_tasks: 0,
    overdue_tasks: 0,
    completion_rate: 0,
    average_completion_time: 0,
    department_breakdown: []
  }
}

// Load stats for all projects
const loadProjectTaskStats = async () => {
  for (const project of projects.value) {
    await getProjectTaskStats(project)
  }
}

const getStatusClass = (status: string) => {
  const classes = {
    planning: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || classes.planning
}

const completedPhases = (project: Project) => {
  return project.phases.filter(phase => phase.status === 'Completed').length
}

const progressPercentage = (project: Project) => {
  const completed = completedPhases(project)
  return Math.round((completed / project.phases.length) * 100)
}

const canAdvancePhase = (project: Project) => {
  const currentPhase = project.phases[project.current_phase]
  return currentPhase && currentPhase.status !== 'Completed'
}

const advancePhase = async (project: Project) => {
  const currentPhaseIndex = project.current_phase
  const currentPhase = project.phases[currentPhaseIndex]

  if (currentPhase.status === 'Not Started') {
    await updateProjectPhase(project.id, currentPhaseIndex, 'In Progress')
  } else if (currentPhase.status === 'In Progress') {
    await updateProjectPhase(project.id, currentPhaseIndex, 'Completed')
  }

  // Refresh projects
  await fetchProjects()
}

const viewProjectDetails = (project: Project) => {
  console.log('View project details:', project.name)
  // Could navigate to project detail view
}

const viewDepartmentalTasks = (project: Project) => {
  console.log('View departmental tasks for project:', project.name)
  router.push(`/projects/projects/${project.id}/tasks`)
}

// Generate project ID in format WNG-YYYYMM-JOB_NUMBER(001)
const generateProjectId = async (): Promise<string> => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // getMonth() returns 0-11
  const datePrefix = `${year}${month}`

  // Get the last project created this month to determine the next job number
  const thisMonthProjects = projects.value.filter(project => {
    if (!project.created_at) return false
    const projectDate = new Date(project.created_at)
    const projectYear = projectDate.getFullYear()
    const projectMonth = projectDate.getMonth() + 1
    return projectYear === year && projectMonth === parseInt(month)
  })

  // Find the highest job number for this month
  let maxJobNumber = 0
  thisMonthProjects.forEach(project => {
    if (project.project_id && project.project_id.startsWith(`WNG-${datePrefix}-`)) {
      const jobNumberPart = project.project_id.split('-')[2]
      if (jobNumberPart) {
        const jobNumber = parseInt(jobNumberPart.replace('(', '').replace(')', ''))
        if (jobNumber > maxJobNumber) {
          maxJobNumber = jobNumber
        }
      }
    }
  })

  // Increment job number
  const nextJobNumber = maxJobNumber + 1
  const formattedJobNumber = String(nextJobNumber).padStart(3, '0')

  return `WNG-${datePrefix}-${formattedJobNumber}`
}

// Approve project when quote is approved
const approveProject = async (enquiryId: number) => {
  try {
    // Generate project ID
    const projectId = await generateProjectId()

    // Create project data
    const projectData = {
      enquiry_id: enquiryId,
      name: `Project for Enquiry ${enquiryId}`, // This should be populated from enquiry data
      description: 'Project created from approved quote',
      start_date: new Date().toISOString().split('T')[0],
      budget: 0, // This should be populated from quote data
      assigned_users: [],
      project_id: projectId
    }

    // Here you would call an API to create the project
    console.log('Creating project:', projectData)

    // Refresh projects list
    await fetchProjects()
  } catch (error) {
    console.error('Error approving project:', error)
  }
}

onMounted(async () => {
   await fetchProjects()
   await loadProjectTaskStats()
})
</script>
