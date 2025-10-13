<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Alerts & Notifications</h3>
        <div class="flex items-center space-x-2">
          <div v-if="alerts?.length" class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ alerts?.length || 0 }} active</span>
        </div>
      </div>
    </div>
    <div class="p-6">
      <div v-if="!alerts?.length" class="text-center py-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400 font-medium">All systems operational</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">No alerts at this time</p>
      </div>
      <div v-else class="space-y-4">
        <div v-for="alert in alerts" :key="alert.id || alert.type"
             class="p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md"
             :class="getAlertStyles(alert.severity)">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center"
                   :class="getAlertIconBg(alert.severity)">
                <svg class="w-4 h-4" :class="getAlertIconColor(alert.severity)" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ alert.title }}</h4>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(alert.timestamp || new Date().toISOString()) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ alert.message }}</p>
              <div v-if="alert.action" class="mt-3">
                <button class="text-xs font-medium px-3 py-1 rounded-md transition-colors"
                        :class="getActionButtonStyles(alert.severity)">
                  {{ alert.action }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alerts?: any[]
}

defineProps<Props>()

const getAlertStyles = (severity: string) => {
  const styles: Record<string, string> = {
    'high': 'border-l-red-500 bg-red-50 dark:bg-red-900/10',
    'medium': 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
    'low': 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10',
    'info': 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10'
  }
  return styles[severity] || styles.info
}

const getAlertIconBg = (severity: string) => {
  const styles: Record<string, string> = {
    'high': 'bg-red-100 dark:bg-red-900/20',
    'medium': 'bg-yellow-100 dark:bg-yellow-900/20',
    'low': 'bg-blue-100 dark:bg-blue-900/20',
    'info': 'bg-gray-100 dark:bg-gray-900/20'
  }
  return styles[severity] || styles.info
}

const getAlertIconColor = (severity: string) => {
  const styles: Record<string, string> = {
    'high': 'text-red-600 dark:text-red-400',
    'medium': 'text-yellow-600 dark:text-yellow-400',
    'low': 'text-blue-600 dark:text-blue-400',
    'info': 'text-gray-600 dark:text-gray-400'
  }
  return styles[severity] || styles.info
}

const getActionButtonStyles = (severity: string) => {
  const styles: Record<string, string> = {
    'high': 'text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900/30 dark:hover:bg-red-900/50',
    'medium': 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50',
    'low': 'text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-900/50',
    'info': 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-900/30 dark:hover:bg-gray-900/50'
  }
  return styles[severity] || styles.info
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
