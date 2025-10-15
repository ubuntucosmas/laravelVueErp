<template>
  <div class="default-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Task Data Display</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Data display for task type "{{ task.type }}" is not yet implemented.
        </p>
        <div class="mt-4 text-left">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Available Data:</h4>
          <pre class="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded overflow-auto max-h-40">{{ JSON.stringify(taskData, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnquiryTask } from '../../../types/enquiry'

interface Props {
  task: EnquiryTask
  taskData: Record<string, unknown>
}

defineProps<Props>()
</script>

<style scoped>
.default-data-display {
  max-width: none;
}
</style>
