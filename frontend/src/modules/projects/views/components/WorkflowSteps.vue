<template>
  <div class="relative overflow-hidden">
    <div class="w-full px-4">
      <!-- Enquiry Workflow Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Step 1: Enquiry & Site Survey -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 overflow-hidden"
             :class="getStepBorderClass(1)">
          <!-- Prominent Top Section -->
          <div class="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                     :class="getStepIconClass(1)">
                  <svg v-if="getStepStatus(1) === 'completed'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="getStepStatus(1) === 'in_progress'" class="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <svg v-else-if="getStepStatus(1) === 'pending'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span v-else class="text-lg font-bold text-white">1</span>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Enquiry & Site Survey</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Project request & assessment</p>
                </div>
              </div>
              <div class="text-right">
                <span :class="getStatusBadgeClass(getStepStatus(1))" class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold">
                  {{ getStepStatusText(1) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Material Specification -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 overflow-hidden"
             :class="getStepBorderClass(2)">
          <!-- Prominent Top Section -->
          <div class="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                     :class="getStepIconClass(2)">
                  <svg v-if="getStepStatus(2) === 'completed'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="getStepStatus(2) === 'in_progress'" class="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <svg v-else-if="getStepStatus(2) === 'pending'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span v-else class="text-lg font-bold text-white">2</span>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Design Concept and Material Specification</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Creative work & requirements</p>
                </div>
              </div>
              <div class="text-right">
                <span :class="getStatusBadgeClass(getStepStatus(2))" class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold">
                  {{ getStepStatusText(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Budget & Quote Preparation -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 overflow-hidden"
             :class="getStepBorderClass(3)">
          <!-- Prominent Top Section -->
          <div class="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                     :class="getStepIconClass(3)">
                  <svg v-if="getStepStatus(3) === 'completed'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="getStepStatus(3) === 'in_progress'" class="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <svg v-else-if="getStepStatus(3) === 'pending'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span v-else class="text-lg font-bold text-white">3</span>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Budget & Quote Preparation</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Cost calculation & quotation</p>
                </div>
              </div>
              <div class="text-right">
                <span :class="getStatusBadgeClass(getStepStatus(3))" class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold">
                  {{ getStepStatusText(3) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Project Conversion -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 overflow-hidden"
             :class="getStepBorderClass(4)">
          <!-- Prominent Top Section -->
          <div class="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                     :class="getStepIconClass(4)">
                  <svg v-if="getStepStatus(4) === 'completed'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="getStepStatus(4) === 'in_progress'" class="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <svg v-else-if="getStepStatus(4) === 'pending'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span v-else class="text-lg font-bold text-white">4</span>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Project Conversion</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Production ready</p>
                </div>
              </div>
              <div class="text-right">
                <span :class="getStatusBadgeClass(getStepStatus(4))" class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold">
                  {{ getStepStatusText(4) }}
                </span>
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
import type { Enquiry } from '../../types'

interface Props {
  enquiry: Enquiry | null
  currentDetailStep: number
  stepStatuses: Record<number, string>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  stepClick: [step: number]
}>()

const getStepStatus = (step: number) => {
  return props.stepStatuses[step as keyof typeof props.stepStatuses] || 'pending'
}

const getStepStatusText = (step: number) => {
  const status = getStepStatus(step)
  switch (status) {
    case 'completed': return 'Completed'
    case 'in_progress': return 'In Progress'
    case 'pending': return 'Pending'
    default: return 'Unknown'
  }
}

const getStepBorderClass = (step: number) => {
  const status = getStepStatus(step)
  if (props.currentDetailStep === step) {
    return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
  } else if (status === 'completed') {
    return 'border-green-500 bg-green-50 dark:bg-green-900/20'
  } else if (status === 'in_progress') {
    return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
  } else {
    return 'border-gray-300 dark:border-gray-600'
  }
}

const getStepIconClass = (step: number) => {
  const status = getStepStatus(step)
  if (status === 'completed') {
    return 'bg-green-500'
  } else if (status === 'in_progress') {
    return 'bg-blue-500'
  } else if (status === 'pending') {
    return 'bg-yellow-500'
  } else {
    return 'bg-gray-400'
  }
}

const getStatusBadgeClass = (status: string) => {
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

const handleStepClick = (step: number) => {
  emit('stepClick', step)
}
</script>
