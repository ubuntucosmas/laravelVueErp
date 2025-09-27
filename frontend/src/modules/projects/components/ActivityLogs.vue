<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Activity Logs</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Handover and assignment history</p>
    </div>

    <div v-if="logs.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No activity logs</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Activity logs will appear here when tasks are assigned or handed over.
      </p>
    </div>

    <div v-else class="overflow-x-auto">
      <div class="flex space-x-4 p-4 min-w-max">
        <div
          v-for="log in logs"
          :key="log.id"
          class="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  getActionIconClass(log.action)
                ]"
              >
                <svg
                  :class="[
                    'w-5 h-5',
                    getActionIconColor(log.action)
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="log.action === 'assigned'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                  <path
                    v-else-if="log.action === 'handover'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                  <path
                    v-else-if="log.action === 'completed'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    v-else-if="log.action === 'started'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H13m-3 3h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 14H13m-3 3h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 17H13M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                <span class="font-medium">{{ log.user_name }}</span>
                <span class="text-gray-600 dark:text-gray-400">
                  {{ getActionText(log) }}
                </span>
              </p>
              <p v-if="log.notes" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ log.notes }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {{ formatDate(log.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityLog } from '../types'

interface Props {
  logs: ActivityLog[]
}

defineProps<Props>()

const getActionIconClass = (action: ActivityLog['action']): string => {
  const classes = {
    assigned: 'bg-blue-100 dark:bg-blue-900/30',
    handover: 'bg-green-100 dark:bg-green-900/30',
    completed: 'bg-green-100 dark:bg-green-900/30',
    started: 'bg-yellow-100 dark:bg-yellow-900/30',
    updated: 'bg-gray-100 dark:bg-gray-700'
  }
  return classes[action] || classes.updated
}

const getActionIconColor = (action: ActivityLog['action']): string => {
  const colors = {
    assigned: 'text-blue-600 dark:text-blue-400',
    handover: 'text-green-600 dark:text-green-400',
    completed: 'text-green-600 dark:text-green-400',
    started: 'text-yellow-600 dark:text-yellow-400',
    updated: 'text-gray-600 dark:text-gray-400'
  }
  return colors[action] || colors.updated
}

const getActionText = (log: ActivityLog): string => {
  switch (log.action) {
    case 'assigned':
      if (log.from_department && log.to_department && log.assigned_by_name) {
        return ` assigned handover from ${log.from_department} to ${log.to_department} by ${log.assigned_by_name}`
      } else if (log.task_name) {
        return ` assigned task "${log.task_name}"`
      }
      return ' assigned a task'
    case 'handover':
      if (log.from_department && log.to_department) {
        return ` handed over from ${log.from_department} to ${log.to_department}`
      }
      return ' performed a handover'
    case 'completed':
      return log.task_name ? ` completed task "${log.task_name}"` : ' completed a task'
    case 'started':
      return log.task_name ? ` started task "${log.task_name}"` : ' started a task'
    case 'updated':
      return log.task_name ? ` updated task "${log.task_name}"` : ' updated a task'
    default:
      return ' performed an action'
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}
</script>
