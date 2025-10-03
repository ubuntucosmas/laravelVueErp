<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      :class="{ 'text-primary': unreadCount > 0 }"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7v5l-5 5V7a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9"/>
      </svg>

      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
        <div class="flex space-x-2">
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-sm text-primary hover:text-primary-light"
          >
            Mark all read
          </button>
          <button
            @click="closeDropdown"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-4 text-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading notifications...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 text-center text-red-600 dark:text-red-400">
        {{ error }}
      </div>

      <!-- Notifications List -->
      <div v-else class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
          No notifications
        </div>

        <div v-else>
          <div
            v-for="notification in notifications.slice(0, 10)"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notification.is_read }"
          >
            <div class="flex items-start space-x-3">
              <!-- Notification Icon -->
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="getNotificationIconClass(notification.type)"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path :d="getNotificationIcon(notification.type)"/>
                  </svg>
                </div>
              </div>

              <!-- Notification Content -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ notification.title }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {{ formatRelativeTime(notification.created_at) }}
                </p>
              </div>

              <!-- Unread Indicator -->
              <div v-if="!notification.is_read" class="flex-shrink-0">
                <div class="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="notifications.length > 10" class="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <button class="text-sm text-primary hover:text-primary-light">
          View all notifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Notification } from '../composables/useNotifications'
import { useNotifications } from '../composables/useNotifications'

const { notifications, loading, error, fetchNotifications, markAsRead, markAllAsRead, unreadCount } = useNotifications()

const showDropdown = ref(false)
const pollingInterval = ref<number | null>(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    fetchNotifications()
  }
}

const closeDropdown = () => {
  showDropdown.value = false
}

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.is_read) {
    await markAsRead(notification.id)
  }
  // Handle navigation or other actions based on notification type
  closeDropdown()
}

const getNotificationIcon = (type: string) => {
  const icons: Record<string, string> = {
    'task_assigned': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'task_completed': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'task_overdue': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
    'default': 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[type] || icons.default
}

const getNotificationIconClass = (type: string) => {
  const classes: Record<string, string> = {
    'task_assigned': 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    'task_completed': 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    'task_overdue': 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
    'default': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  }
  return classes[type] || classes.default
}

const formatRelativeTime = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString()
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

// Polling for new notifications
const startPolling = () => {
  pollingInterval.value = setInterval(() => {
    if (!showDropdown.value) {
      fetchNotifications()
    }
  }, 30000) // Poll every 30 seconds
}

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

onMounted(() => {
  fetchNotifications()
  startPolling()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  stopPolling()
  document.removeEventListener('click', handleClickOutside)
})
</script>
