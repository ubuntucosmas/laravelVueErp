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

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Approved Projects</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Track project progress through all phases</p>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6"
      >
        <!-- Project Header -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ project.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ project.enquiry?.client.name }}</p>
          </div>
          <span
            :class="getStatusClass(project.status)"
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ project.status.replace('_', ' ') }}
          </span>
        </div>

        <!-- Project Info -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Budget</p>
            <p class="font-semibold text-gray-900 dark:text-white">KES {{ project.budget.toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ project.start_date }}</p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{{ completedPhases(project) }}/{{ project.phases.length }} phases</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              :style="{ width: progressPercentage(project) + '%' }"
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            ></div>
          </div>
        </div>

        <!-- Current Phase -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Phase</p>
          <div class="flex items-center">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
              <i :class="project.phases[project.current_phase]?.icon" class="text-blue-600 dark:text-blue-400 text-sm"></i>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ project.phases[project.current_phase]?.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ project.phases[project.current_phase]?.summary }}</p>
            </div>
          </div>
        </div>

        <!-- Departmental Tasks Overview -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Departmental Tasks</p>
          <div class="grid grid-cols-2 gap-2">
            <div class="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p class="text-lg font-semibold text-green-600 dark:text-green-400">{{ getDepartmentalTaskStatsForProject(project).completed_tasks }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Completed</p>
            </div>
            <div class="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ getDepartmentalTaskStatsForProject(project).in_progress_tasks }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
            </div>
          </div>
          <div class="mt-2">
            <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Task Completion</span>
              <span>{{ Math.round(getDepartmentalTaskStatsForProject(project).completion_rate) }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div
                :style="{ width: getDepartmentalTaskStatsForProject(project).completion_rate + '%' }"
                class="bg-green-600 h-1 rounded-full transition-all duration-300"
              ></div>
            </div>
          </div>
        </div>

        <!-- Phase Actions -->
        <div class="flex space-x-2">
          <button
            @click="viewProjectDetails(project)"
            class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </button>
          <button
            @click="viewDepartmentalTasks(project)"
            class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Tasks
          </button>
          <button
            v-if="canAdvancePhase(project)"
            @click="advancePhase(project)"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Advance Phase
          </button>
        </div>
      </div>
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

const router = useRouter()

const { projects, loading, error, fetchProjects, updateProjectPhase, getDepartmentalTaskStats } = useProjects()

// Store departmental task stats for each project
const projectTaskStats = ref<Record<number, DepartmentalTaskStats>>({})

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

onMounted(async () => {
   await fetchProjects()
   await loadProjectTaskStats()
})
</script>
