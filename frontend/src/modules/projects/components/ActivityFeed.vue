<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Live feed</span>
        </div>
      </div>
    </div>
    <div class="p-6">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading activities...</p>
      </div>
      <div v-else-if="!activities?.length" class="text-center py-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-50 dark:bg-gray-900/20 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400 font-medium">No recent activities</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Activities will appear here as they happen</p>
      </div>
      <div v-else class="space-y-4">
        <div v-for="activity in activities" :key="activity.timestamp"
             class="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full flex items-center justify-center"
                 :class="getActivityIconBg(activity.type)">
              <svg class="w-5 h-5" :class="getActivityIconColor(activity.type)" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="activity.type === 'enquiry_created'" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                <path v-else-if="activity.type === 'task_updated'" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path v-else-if="activity.type === 'project_completed'" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path v-else-if="activity.type === 'phase_updated'" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                <path v-else d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ activity.title }}</p>
              <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                </svg>
                {{ formatTime(activity.timestamp) }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ activity.description }}</p>
            <div v-if="activity.metadata" class="mt-2 flex items-center space-x-4">
              <span v-if="activity.metadata.user" class="text-xs text-gray-500 dark:text-gray-400">
                by {{ activity.metadata.user }}
              </span>
              <span v-if="activity.metadata.project" class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {{ activity.metadata.project }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activities?.length" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button class="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
          View all activities
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activities?: any[]
  loading?: boolean
}

defineProps<Props>()

const getActivityIconBg = (type: string) => {
  const colors: Record<string, string> = {
    'enquiry_created': 'bg-blue-100 dark:bg-blue-900/20',
    'task_updated': 'bg-green-100 dark:bg-green-900/20',
    'project_completed': 'bg-emerald-100 dark:bg-emerald-900/20',
    'phase_updated': 'bg-purple-100 dark:bg-purple-900/20',
    'user_action': 'bg-gray-100 dark:bg-gray-900/20'
  }
  return colors[type] || colors.user_action
}

const getActivityIconColor = (type: string) => {
  const colors: Record<string, string> = {
    'enquiry_created': 'text-blue-600 dark:text-blue-400',
    'task_updated': 'text-green-600 dark:text-green-400',
    'project_completed': 'text-emerald-600 dark:text-emerald-400',
    'phase_updated': 'text-purple-600 dark:text-purple-400',
    'user_action': 'text-gray-600 dark:text-gray-400'
  }
  return colors[type] || colors.user_action
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>
