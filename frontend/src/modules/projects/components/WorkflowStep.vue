<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 cursor-pointer"
    :class="stepClasses"
    @click="$emit('click')"
  >
    <!-- Step Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            :class="stepNumberClasses"
          >
            {{ step }}
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ title }}</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ description }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            :class="statusBadgeClasses"
          >
            {{ statusText }}
          </span>
          <div v-if="!canAccess" class="w-2 h-2 bg-gray-400 rounded-full" title="Prerequisites not met"></div>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="p-4">
      <slot />
    </div>

    <!-- Step Footer -->
    <div v-if="isActive" class="px-4 pb-4">
      <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>Current Step</span>
        <span>{{ stepCompletion }}% Complete</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
        <div
          class="bg-blue-500 h-1 rounded-full transition-all duration-300"
          :style="{ width: `${stepCompletion}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  step: number
  title: string
  description: string
  status: string
  isActive: boolean
  canAccess: boolean
  stepCompletion?: number
}

const props = withDefaults(defineProps<Props>(), {
  stepCompletion: 0
})

defineEmits<{
  click: []
}>()

const stepClasses = computed(() => {
  let classes = 'hover:shadow-lg '

  if (!props.canAccess) {
    classes += 'border-gray-300 dark:border-gray-600 opacity-60 cursor-not-allowed '
  } else if (props.isActive) {
    classes += 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 '
  } else if (props.status === 'completed') {
    classes += 'border-green-500 bg-green-50 dark:bg-green-900/20 '
  } else if (props.status === 'in_progress') {
    classes += 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 '
  } else {
    classes += 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 '
  }

  return classes
})

const stepNumberClasses = computed(() => {
  if (!props.canAccess) {
    return 'bg-gray-400 text-white'
  } else if (props.isActive) {
    return 'bg-blue-500 text-white'
  } else if (props.status === 'completed') {
    return 'bg-green-500 text-white'
  } else if (props.status === 'in_progress') {
    return 'bg-yellow-500 text-white'
  } else {
    return 'bg-gray-400 text-white'
  }
})

const statusBadgeClasses = computed(() => {
  switch (props.status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'pending':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'completed':
      return 'Completed'
    case 'in_progress':
      return 'In Progress'
    case 'pending':
      return 'Pending'
    default:
      return props.status.replace('_', ' ')
  }
})
</script>