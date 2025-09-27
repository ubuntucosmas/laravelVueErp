<template>
  <span
    :class="badgeClasses"
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
  >
    {{ priorityText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  priority: 'low' | 'medium' | 'high'
}

const props = defineProps<Props>()

const badgeClasses = computed(() => {
  switch (props.priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
})

const priorityText = computed(() => {
  return props.priority.charAt(0).toUpperCase() + props.priority.slice(1)
})
</script>
