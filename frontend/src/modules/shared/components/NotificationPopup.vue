<template>
  <TransitionGroup
    name="notification-popup"
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2"
  >
    <div
      v-for="popup in activePopups"
      :key="popup.id"
      class="max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 transform transition-all duration-300 ease-in-out"
      :class="{ 'translate-x-full opacity-0': popup.exiting }"
    >
      <div class="flex items-start space-x-3">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="getIconClass(popup.type)"
          >
            <svg v-if="popup.type === 'task_assigned'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ popup.title }}
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ popup.message }}
          </p>
          <div v-if="popup.data?.priority" class="mt-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="getPriorityClass(popup.data.priority as string)"
            >
              {{ popup.data.priority }}
            </span>
          </div>
        </div>

        <!-- Close button -->
        <button
          @click="dismissPopup(popup.id)"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Action buttons -->
      <div class="mt-3 flex space-x-2">
        <button
          @click="handleViewAction(popup)"
          class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          View Task
        </button>
        <button
          @click="dismissPopup(popup.id)"
          class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

interface NotificationPopup {
  id: number
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  exiting?: boolean
}

const activePopups = ref<NotificationPopup[]>([])
const router = useRouter()

// Auto-dismiss timer
const dismissTimers = ref<Map<number, number>>(new Map())

const showPopup = (notification: Omit<NotificationPopup, 'id' | 'exiting'>) => {
  const popup: NotificationPopup = {
    ...notification,
    id: Date.now(),
    exiting: false
  }

  activePopups.value.unshift(popup)

  // Limit to 3 concurrent popups
  if (activePopups.value.length > 3) {
    const oldest = activePopups.value.pop()
    if (oldest) {
      const timer = dismissTimers.value.get(oldest.id)
      if (timer) {
        clearTimeout(timer)
        dismissTimers.value.delete(oldest.id)
      }
    }
  }

  // Auto-dismiss after 8 seconds
  const timer = setTimeout(() => {
    dismissPopup(popup.id)
  }, 8000)

  dismissTimers.value.set(popup.id, timer)

  // Play notification sound if supported
  playNotificationSound()
}

const dismissPopup = (id: number) => {
  const popup = activePopups.value.find(p => p.id === id)
  if (popup) {
    popup.exiting = true

    // Remove after animation
    setTimeout(() => {
      const index = activePopups.value.findIndex(p => p.id === id)
      if (index !== -1) {
        activePopups.value.splice(index, 1)
      }
    }, 300)
  }

  // Clear timer
  const timer = dismissTimers.value.get(id)
  if (timer) {
    clearTimeout(timer)
    dismissTimers.value.delete(id)
  }
}

const handleViewAction = (popup: NotificationPopup) => {
  dismissPopup(popup.id)

  // Navigate based on notification type
  if (popup.type === 'task_assigned' && popup.data?.enquiry_id) {
    const enquiryId = popup.data.enquiry_id
    const taskId = popup.data.task_id

    router.push({
      path: '/projects/enquiries',
      query: {
        open_tasks: String(enquiryId),
        highlight_task: String(taskId)
      }
    })
  } else {
    router.push('/projects/enquiries')
  }
}

const getIconClass = (type: string): string => {
  const classes: Record<string, string> = {
    task_assigned: 'bg-blue-500',
    task_completed: 'bg-green-500',
    task_due_soon: 'bg-orange-500',
    task_overdue: 'bg-red-500',
    default: 'bg-gray-500'
  }
  return classes[type] || classes.default
}

const getPriorityClass = (priority: string): string => {
  const classes: Record<string, string> = {
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
  return classes[priority] || classes.medium
}

const playNotificationSound = () => {
  // Create a simple notification sound
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const audioContext = new AudioContextClass()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch {
    // Silently fail if Web Audio API is not supported
    console.debug('Notification sound not supported')
  }
}

// Listen for new task assignment notifications
const handleNewNotification = (event: CustomEvent) => {
  const notification = event.detail
  if (notification.type === 'task_assigned') {
    showPopup({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data
    })
  }
}

onMounted(() => {
  // Listen for custom events from other components
  window.addEventListener('new-notification', handleNewNotification as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('new-notification', handleNewNotification as EventListener)

  // Clear all timers
  dismissTimers.value.forEach(timer => clearTimeout(timer))
  dismissTimers.value.clear()
})

// Expose showPopup method for external use
defineExpose({
  showPopup
})
</script>

<style scoped>
.notification-popup-enter-active,
.notification-popup-leave-active {
  transition: all 0.3s ease;
}

.notification-popup-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-popup-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-popup-move {
  transition: transform 0.3s ease;
}
</style>
