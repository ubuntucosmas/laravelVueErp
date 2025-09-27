<template>
  <div class="phase-progress-visualization bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Phase Progress</h3>

    <div class="space-y-4">
      <!-- Overall Progress -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Completion</span>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ Math.round(overallProgress) }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            class="bg-blue-500 h-3 rounded-full transition-all duration-300"
            :style="{ width: overallProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Department Progress -->
      <div v-if="departmentBreakdown.length > 0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Department Progress</h4>
        <div class="space-y-2">
          <div
            v-for="dept in departmentBreakdown"
            :key="dept.department_id"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ dept.department_name }}</span>
            <div class="flex items-center space-x-2">
              <div class="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full"
                  :style="{ width: dept.completion_rate + '%' }"
                ></div>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 w-8">{{ dept.completion_rate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectPhaseEntity, DepartmentalTask, DepartmentalTaskStats } from '../types'

interface Props {
  projectPhase?: ProjectPhaseEntity | null
  tasks: DepartmentalTask[]
  stats?: DepartmentalTaskStats
}

const props = defineProps<Props>()

const overallProgress = computed(() => {
  if (!props.stats) return 0
  return props.stats.completion_rate
})

const departmentBreakdown = computed(() => {
  return props.stats?.department_breakdown || []
})
</script>
