<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {{ user?.name }}!
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Here's an overview of your accessible modules and recent activity.
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500 dark:text-gray-400">Role</p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ user?.roles?.join(', ') || 'User' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Access Modules -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Projects Module -->
      <PermissionGuard permission="project.read">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
             @click="navigateTo('/projects')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Projects</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Manage project enquiries and workflows</p>
            </div>
          </div>
        </div>
      </PermissionGuard>

      <!-- Client Service Module -->
      <PermissionGuard permission="client.read">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
             @click="navigateTo('/client-service')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Client Service</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Manage clients and enquiries</p>
            </div>
          </div>
        </div>
      </PermissionGuard>

      <!-- Creatives Module -->
      <PermissionGuard permission="creatives.view">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
             @click="navigateTo('/creatives/design')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Creatives</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Design and creative management</p>
            </div>
          </div>
        </div>
      </PermissionGuard>

      <!-- Finance Module -->
      <PermissionGuard permission="finance.view">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
             @click="navigateTo('/finance')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Finance</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Budgeting and financial management</p>
            </div>
          </div>
        </div>
      </PermissionGuard>

      <!-- Procurement Module -->
      <PermissionGuard permission="procurement.view">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
             @click="navigateTo('/procurement')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Procurement</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Vendor and purchase management</p>
            </div>
          </div>
        </div>
      </PermissionGuard>

      <!-- HR Module -->
      <PermissionGuard permission="hr.view">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
             @click="navigateTo('/hr')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Human Resources</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Employee and HR management</p>
            </div>
          </div>
        </div>
      </PermissionGuard>
    </div>

    <!-- Recent Activity / Quick Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Quick Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Stats</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Accessible Departments</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ accessibleDepartments.length }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Active Permissions</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ effectivePermissions.length }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">User Roles</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ user?.roles?.length || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- System Info -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">System Information</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(user?.last_login_at) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Active
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Department</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ user?.department?.name || 'Not Assigned' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- No Access Message (shown when user has no module access) -->
    <div v-if="accessibleModules.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">
            Limited Access
          </h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>Your account currently has limited access to system modules. Please contact your administrator if you believe this is an error.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { permissionCache } from '../services/PermissionCache'
import PermissionGuard from '../components/PermissionGuard.vue'

const router = useRouter()
const { user } = useAuth()

const accessibleDepartments = ref<number[]>([])
const effectivePermissions = ref<string[]>([])

const accessibleModules = computed(() => {
  const modules = []
  if (effectivePermissions.value.includes('project.read')) modules.push('projects')
  if (effectivePermissions.value.includes('client.read')) modules.push('client-service')
  if (effectivePermissions.value.includes('creatives.view')) modules.push('creatives')
  if (effectivePermissions.value.includes('finance.view')) modules.push('finance')
  if (effectivePermissions.value.includes('procurement.view')) modules.push('procurement')
  if (effectivePermissions.value.includes('hr.view')) modules.push('hr')
  return modules
})

const navigateTo = (path: string) => {
  router.push(path)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString()
}

onMounted(async () => {
  // Load user permissions and accessible departments
  accessibleDepartments.value = await permissionCache.getAccessibleDepartments()
  const permissions = await permissionCache.getPermissions()
  effectivePermissions.value = permissions?.effective_permissions || []
})
</script>
