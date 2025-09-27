<template>
  <div class="relative overflow-hidden">
    <div class="w-full px-4">
      <!-- Project Phases (Available when quotation is approved) -->
      <div v-if="selectedQuotation && selectedQuotation.status === 'approved'" class="mt-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Project Execution Phases</h3>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Track progress through all project stages
          </div>
        </div>

        <!-- Phase Progress Overview -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white">Overall Progress</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ completedPhases }} of {{ selectedProject.phases.length }} phases completed</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ Math.round(projectProgressPercentage) }}%</div>
              <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div class="bg-blue-600 h-2 rounded-full" :style="{ width: projectProgressPercentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Phase Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <!-- Phase Cards -->
          <div
            v-for="(phase, index) in selectedProject.phases.slice(0, 8)"
            :key="phase.id"
            class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 cursor-pointer overflow-hidden"
            :class="{
              'border-blue-500 bg-blue-50 dark:bg-blue-900/20': currentPhaseIndex === index,
              'border-green-500 bg-green-50 dark:bg-green-900/20': phase.status === 'Completed',
              'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20': phase.status === 'In Progress',
              'border-gray-300 dark:border-gray-600': phase.status === 'Not Started'
            }"
            @click="handlePhaseClick(index)">
            <!-- Prominent Top Section -->
            <div class="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                       :class="getPhaseIconClass(phase.status)">
                    <svg v-if="phase.status === 'Completed'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <svg v-else-if="phase.status === 'In Progress'" class="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <svg v-else-if="phase.status === 'Not Started'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span v-else class="text-lg font-bold text-white">{{ index + 1 }}</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ phase.name }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ getPhaseSummary(phase) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span :class="getPhaseStatusBadgeClass(phase.status)" class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold">
                    {{ getPhaseStatusText(phase.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Content Area -->
            <div class="p-4">
              <div class="space-y-4">
                <!-- Additional Information -->
                <div class="grid grid-cols-1 gap-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                    <span class="text-sm text-gray-900 dark:text-white">{{ phase.estimatedDuration }} days</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned:</span>
                    <span class="text-sm text-gray-900 dark:text-white">{{ phase.assignedRole }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                    <span class="text-sm text-green-600 dark:text-green-400">{{ getPhaseStatusDescription(phase) }}</span>
                  </div>
                </div>

                <!-- Departmental Tasks Overview -->
                <div v-if="phase.departmental_tasks && phase.departmental_tasks.length > 0" class="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Departmental Tasks</h5>
                  <div class="space-y-2">
                    <div v-for="task in phase.departmental_tasks.slice(0, 2)" :key="task.id" class="flex items-center justify-between text-xs">
                      <span class="text-gray-600 dark:text-gray-400 truncate">{{ task.task_name }}</span>
                      <span :class="getTaskStatusClass(task.status)" class="px-2 py-1 rounded text-xs">
                        {{ task.status.replace('_', ' ') }}
                      </span>
                    </div>
                    <div v-if="phase.departmental_tasks.length > 2" class="text-xs text-gray-500 dark:text-gray-500">
                      +{{ phase.departmental_tasks.length - 2 }} more tasks
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Project, Quotation } from '../../types'

interface Props {
  selectedProject: Project
  currentPhaseIndex: number
  selectedQuotation: Quotation | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  phaseClick: [index: number]
  previousPhase: []
  nextPhase: []
}>()

const completedPhases = props.selectedProject.phases.filter(phase => phase.status === 'Completed').length
const projectProgressPercentage = (completedPhases / props.selectedProject.phases.length) * 100

const getPhaseIconClass = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-500'
    case 'In Progress': return 'bg-blue-500'
    case 'Not Started': return 'bg-gray-400'
    default: return 'bg-gray-400'
  }
}

const getPhaseStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Not Started':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getPhaseStatusText = (status: string) => {
  switch (status) {
    case 'Completed': return 'Completed'
    case 'In Progress': return 'In Progress'
    case 'Not Started': return 'Not Started'
    default: return 'Unknown'
  }
}

const getTaskStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'pending':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getPhaseSummary = (phase: any) => {
  const summaries: Record<string, string> = {
    'procurement': 'Source and acquire all required materials',
    'production': 'Manufacturing and assembly of components',
    'logistics': 'Coordination of transportation and delivery',
    'event-setup': 'On-site setup and implementation',
    'client-handover': 'Final delivery to client',
    'set-down-return': 'Post-event cleanup and equipment return',
    'archival-reporting': 'Final documentation and reporting'
  }
  return summaries[phase.id] || phase.summary || 'Phase execution'
}

const getPhaseStatusDescription = (phase: any) => {
  switch (phase.status) {
    case 'Completed': return 'Phase foundation completed'
    case 'In Progress': return 'Currently in progress'
    case 'Not Started': return 'Waiting to begin'
    default: return 'Status unknown'
  }
}

const handlePhaseClick = (index: number) => {
  emit('phaseClick', index)
}
</script>
