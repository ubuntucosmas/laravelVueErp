<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="flex">
      <!-- Sidebar -->
      <DynamicSidebar
        v-model:collapsed="sidebarCollapsed"
        :navigation-items="navigationItems"
        :title="sidebarTitle"
        :subtitle="sidebarSubtitle"
        @update:collapsed="handleSidebarToggle"
      />

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-h-screen">
        <!-- Top Header -->
        <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Sidebar Toggle Button -->
                <button
                  @click="sidebarCollapsed = !sidebarCollapsed"
                  class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ pageTitle }}</h1>
              </div>

              <div class="flex items-center space-x-4">
                <!-- User Info -->
                <div v-if="user" class="flex items-center space-x-3">
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ user.roles?.join(', ') || 'No Role' }}
                    </p>
                  </div>
                  <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span class="text-sm font-medium text-white">
                      {{ user.name?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                </div>

                <!-- Notification Center -->
                <NotificationCenter ref="notificationCenter" class="notification-center" />

                <!-- Theme Toggle Button -->
                <button
                  @click="toggleTheme"
                  class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  :title="theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
                >
                  <svg v-if="theme === 'light'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </button>

                <!-- Logout Button -->
                <button
                  @click="handleLogout"
                  class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Logout"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-6">
          <router-view @taskAssigned="handleGlobalTaskAssigned" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DynamicSidebar from '../components/DynamicSidebar.vue'
import NotificationCenter from '../modules/shared/components/NotificationCenter.vue'
import { useAuth } from '../composables/useAuth'
import { useRouteGuard } from '../composables/useRouteGuard'
import { useTheme } from '../composables/useTheme'

const { user, logout } = useAuth()
const { getAllowedRoutes } = useRouteGuard()
const { theme, toggleTheme } = useTheme()
const router = useRouter()
const route = useRoute()

const sidebarCollapsed = ref(false)
const notificationCenter = ref()

const navigationItems = computed(() => {
  return getAllowedRoutes()
})

const sidebarTitle = computed(() => {
  if (!user.value) return 'ERP System'

  const userRoles = user.value.roles || []

  if (userRoles.includes('Super Admin')) {
    return 'Super Admin Panel'
  }

  if (userRoles.includes('Admin')) {
    return 'Admin Panel'
  }

  if (userRoles.includes('HR')) {
    return 'HR Panel'
  }

  if (userRoles.includes('Designer')) {
    return 'Creatives Panel'
  }

  return 'ERP System'
})

const sidebarSubtitle = computed(() => {
  if (!user.value) return 'Management Dashboard'

  const userRoles = user.value.roles || []

  if (userRoles.includes('Super Admin')) {
    return 'Full System Access'
  }

  if (userRoles.includes('Admin')) {
    return 'System Administration'
  }

  if (userRoles.includes('HR')) {
    return 'Human Resources'
  }

  if (userRoles.includes('Designer')) {
    return 'Design & Production'
  }

  return 'Management Dashboard'
})

const pageTitle = computed(() => {
  return route.meta?.title as string || 'Dashboard'
})

const handleSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

const handleTaskAssigned = (data: {
  userId: number
  userName: string
  userEmail: string
  taskCount: number
  taskNames: string
  message: string
  tasks: any[]
}) => {
  // Add notification to the notification center
  if (notificationCenter.value) {
    // Extract enquiry_id and task_id from the first task (assuming all tasks are from the same enquiry)
    const enquiryId = data.tasks[0]?.enquiry_id
    const taskId = data.tasks[0]?.id

    notificationCenter.value.addNotification({
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: data.message,
      metadata: {
        taskCount: data.taskCount,
        taskNames: data.taskNames,
        assignedBy: user.value?.name || 'System',
        enquiry_id: enquiryId,
        task_id: taskId
      }
    })
  }
}

onMounted(() => {
  // Initialize sidebar state
})

// Listen for task assignment events from child components
const handleGlobalTaskAssigned = (data: {
  userId: number
  userName: string
  userEmail: string
  taskCount: number
  taskNames: string
  message: string
  tasks: any[]
}) => {
  handleTaskAssigned(data)
}
</script>
