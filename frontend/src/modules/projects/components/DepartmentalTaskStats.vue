<template>
  <div class="departmental-task-stats bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Stats</h4>

    <div class="grid grid-cols-2 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats?.in_progress_tasks || 0 }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">In Progress</div>
      </div>

      <div class="text-center">
        <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ stats?.overdue_tasks || 0 }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">Overdue</div>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Completion Rate: <span class="font-medium">{{ Math.round(stats?.completion_rate || 0) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectPhaseEntity, DepartmentalTaskStats } from '../types'

interface Props {
  stats?: DepartmentalTaskStats
  projectPhase?: ProjectPhaseEntity | null
}

defineProps<Props>()
</script>
