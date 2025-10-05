<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button
      @click="toggleNotificationPanel"
      class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      :class="{ 'text-blue-600 dark:text-blue-400': hasUnreadNotifications }"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 2.5a2.121 2.121 0 013 3L6 9l-4 1 1-4 5.5-5.5z"/>
      </svg>
      <!-- Notification Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Notification Panel -->
    <div
      v-if="showPanel"
      class="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden"
    >
      <!-- Panel Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
        <div class="flex items-center space-x-2">
          <button
            v-if="unreadCount > 0"
            @click="handleMarkAllAsRead"
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Mark all read
          </button>
          <button
            @click="closePanel"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Notification List -->
      <div class="max-h-80 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 2.5a2.121 2.121 0 013 3L6 9l-4 1 1-4 5.5-5.5z"/>
          </svg>
          <p>No notifications yet</p>
        </div>

        <div v-else>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notification.is_read }"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="getNotificationIconClass(notification.type)"
                >
                  <svg v-if="notification.type === 'task_assigned'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <svg v-else-if="notification.type === 'task_completed'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="notification.type === 'deadline_approaching'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ notification.title }}
                  </p>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTime(notification.created_at) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {{ notification.message }}
                </p>
                <div v-if="notification.data" class="mt-2 flex flex-wrap gap-1">
                  <span
                    v-for="tag in getNotificationTags(notification)"
                    :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getTagClass(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <div v-if="!notification.is_read" class="flex-shrink-0">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          @click="viewAllNotifications"
          class="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          View all notifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '../../projects/composables/useNotifications'

// Use the notifications composable
const {
  notifications,
  loading,
  error,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  unreadCount
} = useNotifications()

// Reactive data
const showPanel = ref(false)
const pollingInterval = ref<number | null>(null)

// Computed properties
const hasUnreadNotifications = computed(() => {
  return unreadCount.value > 0
})

// Methods
const toggleNotificationPanel = () => {
  showPanel.value = !showPanel.value
  if (showPanel.value) {
    // Refresh notifications when opening panel
    fetchNotifications()
  }
}

const closePanel = () => {
  showPanel.value = false
}

const handleMarkAllAsRead = async () => {
  try {
    await markAllAsRead()
  } catch (err) {
    console.error('Failed to mark all notifications as read:', err)
  }
}

const handleNotificationClick = async (notification: any) => {
  try {
    // Mark as read
    await markAsRead(notification.id)

    // Handle task notifications specially - check for enquiry_id in data first
    if (notification.type === 'task_assigned' && notification.data?.enquiry_id) {
      // Navigate to the enquiry page and open the task dashboard
      const enquiryId = notification.data.enquiry_id
      const taskId = notification.data.task_id

      // Navigate to enquiries management page with task dashboard open
      router.push({
        path: '/projects/enquiries',
        query: {
          open_tasks: String(enquiryId),
          highlight_task: String(taskId)
        }
      })
      closePanel()
    } else if (notification.type === 'task_assigned') {
      // Fallback for task notifications without proper data - navigate to enquiries page
      router.push('/projects/enquiries')
      closePanel()
    }
  } catch (err) {
    console.error('Failed to mark notification as read:', err)
  }
}

const getNotificationTags = (notification: any): string[] => {
  const tags: string[] = []

  if (notification.data?.priority) {
    tags.push(notification.data.priority as string)
  }

  if (notification.type === 'task_due_soon' && notification.data?.days_remaining) {
    const days = notification.data.days_remaining as number
    if (days <= 1) tags.push('urgent')
    else if (days <= 3) tags.push('soon')
  }

  return tags
}

const viewAllNotifications = () => {
  router.push('/notifications')
  closePanel()
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return date.toLocaleDateString()
}

const getNotificationIconClass = (type: string): string => {
  const classes: Record<string, string> = {
    task_assigned: 'bg-blue-500',
    task_completed: 'bg-green-500',
    deadline_approaching: 'bg-orange-500',
    system: 'bg-purple-500',
    info: 'bg-gray-500'
  }
  return classes[type] || classes.info
}

const getTagClass = (tag: string): string => {
  const classes: Record<string, string> = {
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    soon: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  return classes[tag] || classes.low
}

// Router
const router = useRouter()

// Lifecycle
onMounted(async () => {
  // Fetch notifications on mount
  try {
    await fetchNotifications()
  } catch (err) {
    console.error('Failed to fetch notifications on mount:', err)
  }

  // Start polling for new notifications every 30 seconds
  pollingInterval.value = setInterval(async () => {
    try {
      await fetchNotifications()
    } catch (err) {
      console.error('Failed to poll notifications:', err)
    }
  }, 30000)

  // Listen for clicks outside to close panel
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.notification-center')) {
      showPanel.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    // Clear polling interval
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
    }
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-center {
  position: relative;
}
</style>
