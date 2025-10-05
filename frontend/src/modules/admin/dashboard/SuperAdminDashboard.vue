<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete system oversight and department access</p>
      </div>
    </div>

    <!-- System Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-blue-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ systemStats.totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-green-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ systemStats.totalDepartments }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-purple-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ systemStats.activeProjects }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-orange-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
            <p class="text-2xl font-semibold text-green-600">Excellent</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Department Access Cards -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Department Access</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Admin -->
        <router-link
          to="/admin"
          class="block p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-blue-500 rounded-lg mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Administration</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">User & system management</p>
            </div>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">Manage users, roles, departments, and system settings</p>
        </router-link>

        <!-- Projects -->
        <router-link
          to="/projects/dashboard"
          class="block p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-green-500 rounded-lg mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Projects</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Project coordination</p>
            </div>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">Oversee project workflows, task assignments, and progress tracking</p>
        </router-link>

        <!-- Client Service -->
        <router-link
          to="/client-service"
          class="block p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-purple-500 rounded-lg mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Client Service</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Client acquisition</p>
            </div>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">Manage client relationships, enquiries, and service requests</p>
        </router-link>

        <!-- HR -->
        <router-link
          to="/hr"
          class="block p-6 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border border-red-200 dark:border-red-700 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-red-500 rounded-lg mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Human Resources</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Employee management</p>
            </div>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">Handle employee records, payroll, and HR operations</p>
        </router-link>

        <!-- Finance -->
        <router-link
          to="/finance"
          class="block p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-700 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-yellow-500 rounded-lg mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Finance</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Financial management</p>
            </div>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">Budgeting, costing, invoicing, and financial reporting</p>
        </router-link>

        <!-- Creatives -->
        <router-link
          to="/creatives/design"
          class="block p-6 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg border border-pink-200 dark:border-pink-700 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-pink-500 rounded-lg mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Creatives</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Design & production</p>
            </div>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">Creative design, material management, and production oversight</p>
        </router-link>

        <!-- Procurement -->
        <router-link
          to="/procurement"
          class="block p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-indigo-500 rounded-lg mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Procurement</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Supply chain</p>
            </div>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">Material requests, vendor management, and purchase orders</p>
        </router-link>
      </div>
    </div>

    <!-- Quick Admin Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Admin Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/admin/users"
          class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <div class="p-2 bg-blue-500 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Manage Users</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Create, edit, and manage user accounts</p>
          </div>
        </router-link>

        <router-link
          to="/admin/roles"
          class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <div class="p-2 bg-green-500 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Manage Roles</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Configure roles and permissions</p>
          </div>
        </router-link>

        <router-link
          to="/admin/departments"
          class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        >
          <div class="p-2 bg-purple-500 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Manage Departments</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Organize departments and assign users</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent System Activity -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent System Activity</h2>
      <div class="space-y-3">
        <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span class="text-sm text-white">U</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">New user account created</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">5 minutes ago</p>
          </div>
        </div>
        <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span class="text-sm text-white">P</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Project enquiry submitted</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">12 minutes ago</p>
          </div>
        </div>
        <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <span class="text-sm text-white">T</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Task assignment completed</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">1 hour ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Mock system stats - in real app, fetch from API
const systemStats = ref({
  totalUsers: 25,
  totalDepartments: 7,
  activeProjects: 12
})

onMounted(() => {
  // Could fetch real system stats here
})
</script>
