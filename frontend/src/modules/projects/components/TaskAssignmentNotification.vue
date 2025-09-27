<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 2.5a2.121 2.121 0 013 3L6 9l-4 1 1-4 5.5-5.5z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Task Assignment Notifications
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ notifications.length }} notification{{ notifications.length !== 1 ? 's' : '' }} sent
            </p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <div class="space-y-4">
          <!-- Success Message -->
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                  Tasks Successfully Assigned
                </h3>
                <p class="text-sm text-green-700 dark:text-green-300 mt-1">
                  All selected users have been notified of their task assignments.
                </p>
              </div>
            </div>
          </div>

          <!-- Notification Details -->
          <div class="space-y-3">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">Notification Summary</h4>

            <div v-for="notification in notifications" :key="notification.userId" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h5 class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ notification.userName }}
                    </h5>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {{ notification.taskCount }} task{{ notification.taskCount !== 1 ? 's' : '' }} assigned
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ notification.userEmail }}
                  </p>

                  <!-- Task List -->
                  <div class="mt-3 space-y-2">
                    <div v-for="task in notification.tasks" :key="task.id" class="bg-white dark:bg-gray-700 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                      <div class="flex items-center justify-between">
                        <div class="flex-1">
                          <h6 class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ task.task_name }}
                          </h6>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Priority: {{ task.priority }} • Due: {{ formatDate(task.due_date) }}
                          </p>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span :class="getPriorityBadgeClass(task.priority)" class="px-2 py-1 rounded-full text-xs font-medium">
                            {{ task.priority }}
                          </span>
                        </div>
                      </div>
                      <p class="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        {{ task.task_description }}
                      </p>
                    </div>
                  </div>

                  <!-- Notification Message -->
                  <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                    <div class="flex items-start space-x-2">
                      <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-blue-800 dark:text-blue-200">Notification Sent</p>
                        <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          {{ getNotificationMessage(notification) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DepartmentalTask } from '../types'

// Props
interface Props {
  isVisible: boolean
  notifications: Array<{
    userId: number
    userName: string
    userEmail: string
    taskCount: number
    tasks: DepartmentalTask[]
  }>
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Methods
const closeModal = () => {
  emit('close')
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'No due date'
  return new Date(dateString).toLocaleDateString()
}

const getPriorityBadgeClass = (priority: string) => {
  const classes: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[priority] || classes.medium
}

const getNotificationMessage = (notification: any): string => {
  const taskNames = notification.tasks.map((task: DepartmentalTask) => task.task_name).join(', ')
  return `You have been assigned ${notification.taskCount} task${notification.taskCount !== 1 ? 's' : ''}: ${taskNames}. Please review the details and begin working on them according to the specified priorities and due dates.`
}
</script>
