<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center space-x-3 mb-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                Workflow Bottleneck Detected
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Immediate attention required</p>
            </div>
          </div>

          <!-- Bottleneck Details -->
          <div class="space-y-4">
            <div v-for="bottleneck in bottlenecks" :key="bottleneck.id" class="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getSeverityClass(bottleneck.severity)">
                      {{ bottleneck.severity.toUpperCase() }}
                    </span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ bottleneck.phase }}</span>
                  </div>

                  <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">{{ bottleneck.description }}</p>

                  <!-- Metrics -->
                  <div class="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span class="text-gray-500 dark:text-gray-400">Delay:</span>
                      <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ bottleneck.delay }} days</span>
                    </div>
                    <div>
                      <span class="text-gray-500 dark:text-gray-400">Impact:</span>
                      <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ bottleneck.impact }}</span>
                    </div>
                  </div>

                  <!-- Assigned Users -->
                  <div v-if="bottleneck.assignedUsers && bottleneck.assignedUsers.length > 0" class="mt-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Assigned to:</p>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="user in bottleneck.assignedUsers" :key="user.id"
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {{ user.name }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Action Button -->
                <button
                  @click="$emit('resolve', bottleneck)"
                  class="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Overall Impact</h4>
            <div class="grid grid-cols-3 gap-4 text-sm">
              <div class="text-center">
                <div class="text-lg font-bold text-red-600">{{ totalDelay }} days</div>
                <div class="text-gray-500 dark:text-gray-400">Total Delay</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-orange-600">{{ affectedPhases }}</div>
                <div class="text-gray-500 dark:text-gray-400">Affected Phases</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-blue-600">{{ Math.round(projectDelayPercentage) }}%</div>
                <div class="text-gray-500 dark:text-gray-400">Project Delay</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="$emit('close')"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Acknowledge
          </button>
          <button
            type="button"
            @click="$emit('view-details')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Bottleneck {
  id: string
  phase: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  delay: number
  impact: string
  assignedUsers?: Array<{ id: number; name: string }>
}

interface Props {
  isVisible: boolean
  bottlenecks: Bottleneck[]
  projectDelayPercentage: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  resolve: [bottleneck: Bottleneck]
  'view-details': []
}>()

const totalDelay = computed(() => {
  return props.bottlenecks.reduce((sum, bottleneck) => sum + bottleneck.delay, 0)
})

const affectedPhases = computed(() => {
  return props.bottlenecks.length
})

const getSeverityClass = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}
</script>
