<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity Logs</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Project handovers, assignments, and task updates</p>
        </div>
        <div class="flex items-center space-x-3">
          <select
            v-model="selectedFilter"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Activities</option>
            <option value="handover">Handovers</option>
            <option value="assigned">Assignments</option>
            <option value="completed">Completions</option>
            <option value="started">Started Tasks</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="filteredLogs.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No activity logs</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Activity logs will appear here when tasks are assigned or handed over.
      </p>
    </div>

    <div v-else class="timeline px-6 py-4">
      <div
        v-for="(log, index) in filteredLogs"
        :key="log.id"
        class="timeline-item flex items-start space-x-4 mb-8 last:mb-0"
      >
        <div class="timeline-marker flex-shrink-0 relative">
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-600',
              getActionIconClass(log.action)
            ]"
          >
            <svg
              :class="[
                'w-6 h-6',
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
          <!-- Connecting line -->
          <div v-if="index < filteredLogs.length - 1" class="timeline-line absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
        </div>

        <div class="timeline-content flex-1 min-w-0">
          <div class="flex items-center space-x-2 mb-2">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ log.user_name }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ getActionText(log) }}
            </span>
            <span
              :class="[
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                getActionBadgeClass(log.action)
              ]"
            >
              {{ log.action }}
            </span>
          </div>

          <div v-if="log.task_name" class="mb-2">
            <span class="text-sm font-medium text-blue-600 dark:text-blue-400">{{ log.task_name }}</span>
          </div>

          <div v-if="log.notes" class="mb-3">
            <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
              {{ log.notes }}
            </p>
          </div>

          <!-- Additional Details for Handovers -->
          <div v-if="log.action === 'handover' && log.from_department && log.to_department" class="mb-3">
            <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-1">
                <span class="font-medium">From:</span>
                <span class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">{{ log.from_department }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <span class="font-medium">To:</span>
                <span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">{{ log.to_department }}</span>
              </div>
              <div v-if="log.assigned_by_name" class="flex items-center space-x-1">
                <span class="font-medium">By:</span>
                <span>{{ log.assigned_by_name }}</span>
              </div>
            </div>
          </div>

          <!-- Timestamp -->
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDate(log.created_at) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="filteredLogs.length >= 10" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="loadMore"
        class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
      >
        Load More Activities
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ActivityLog } from '../types'

interface Props {
  logs: ActivityLog[]
}

const props = defineProps<Props>()

const selectedFilter = ref('all')

const filteredLogs = computed(() => {
  const logs = selectedFilter.value === 'all' ? props.logs : props.logs.filter(log => log.action === selectedFilter.value)
  return logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

const getActionIconClass = (action: ActivityLog['action']): string => {
  const classes = {
    assigned: 'bg-blue-100 dark:bg-blue-900/30',
    handover: 'bg-purple-100 dark:bg-purple-900/30',
    completed: 'bg-green-100 dark:bg-green-900/30',
    started: 'bg-yellow-100 dark:bg-yellow-900/30',
    updated: 'bg-gray-100 dark:bg-gray-700'
  }
  return classes[action] || classes.updated
}

const getActionIconColor = (action: ActivityLog['action']): string => {
  const colors = {
    assigned: 'text-blue-600 dark:text-blue-400',
    handover: 'text-purple-600 dark:text-purple-400',
    completed: 'text-green-600 dark:text-green-400',
    started: 'text-yellow-600 dark:text-yellow-400',
    updated: 'text-gray-600 dark:text-gray-400'
  }
  return colors[action] || colors.updated
}

const getActionBadgeClass = (action: ActivityLog['action']): string => {
  const classes = {
    assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    handover: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    started: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    updated: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
  return classes[action] || classes.updated
}

const getActionText = (log: ActivityLog): string => {
  switch (log.action) {
    case 'assigned':
      if (log.from_department && log.to_department && log.assigned_by_name) {
        return `assigned handover from ${log.from_department} to ${log.to_department} by ${log.assigned_by_name}`
      } else if (log.task_name) {
        return `was assigned task`
      }
      return 'was assigned a task'
    case 'handover':
      if (log.from_department && log.to_department) {
        return `completed handover from ${log.from_department} to ${log.to_department}`
      }
      return 'completed a handover'
    case 'completed':
      return log.task_name ? `completed task` : 'completed a task'
    case 'started':
      return log.task_name ? `started working on task` : 'started a task'
    case 'updated':
      return log.task_name ? `updated task` : 'updated a task'
    default:
      return 'performed an action'
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
  } else if (diffInHours < 24 * 7) {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

const loadMore = () => {
  // In a real app, this would load more logs from the API
  console.log('Loading more activity logs...')
}
</script>
