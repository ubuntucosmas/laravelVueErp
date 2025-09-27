<template>
  <div class="departmental-task-notifications bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Notifications</h4>

    <div class="space-y-2">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        No new notifications
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  projectId?: number
  phaseId?: number
}

defineProps<Props>()
</script>
