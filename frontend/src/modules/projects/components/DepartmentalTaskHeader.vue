<template>
  <div class="departmental-task-header bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ project?.name || 'Project Tasks' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ phase?.phase?.name || 'All Phases' }} • {{ departmentName || 'All Departments' }}
        </p>
      </div>

      <div class="flex items-center space-x-4">
        <div class="text-right">
          <div class="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.total_tasks || 0 }}</div>
        </div>

        <div class="text-right">
          <div class="text-sm text-gray-500 dark:text-gray-400">Completed</div>
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats?.completed_tasks || 0 }}</div>
        </div>

        <div class="text-right">
          <div class="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats?.in_progress_tasks || 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectEntity, ProjectPhaseEntity, DepartmentalTaskStats } from '../types'

interface Props {
  project?: ProjectEntity | null
  phase?: ProjectPhaseEntity | null
  stats?: DepartmentalTaskStats
  departmentName?: string
}

defineProps<Props>()
</script>
