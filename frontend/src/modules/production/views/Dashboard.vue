<!-- src/modules/production/views/Dashboard.vue -->
<template>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Production Dashboard</h1>
          <p class="text-sm text-gray-600">Overview of production activities</p>
        </div>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="text-sm text-gray-600 dark:text-gray-300">Active Work Orders</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">12</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="text-sm text-gray-600 dark:text-gray-300">Tasks in Progress</div>
          <div class="text-2xl font-bold text-blue-600">8</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="text-sm text-gray-600 dark:text-gray-300">Completed Today</div>
          <div class="text-2xl font-bold text-green-600">5</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="text-sm text-gray-600 dark:text-gray-300">Issues Reported</div>
          <div class="text-2xl font-bold text-red-600">2</div>
        </div>
      </div>
  
      <!-- Recent Work Orders -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Work Orders</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Work Order
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Project
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="order in recentWorkOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <router-link 
                    :to="`/production/work-orders/${order.id}`"
                    class="text-blue-600 hover:underline"
                  >
                    {{ order.title }}
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ order.project?.title || 'N/A' }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ order.project?.client?.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ order.due_date ? new Date(order.due_date).toLocaleDateString() : 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      class="bg-blue-600 h-2.5 rounded-full" 
                      :style="{ width: '75%' }"  <!-- Replace with actual progress -->
                    ></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
          <router-link 
            to="/production/work-orders" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Work Orders
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useWorkOrders } from '../composables/useWorkOrders'
  
  const { workOrders, loading, fetchWorkOrders } = useWorkOrders()
  
  const recentWorkOrders = computed(() => {
    return workOrders.value.slice(0, 5) // Show only 5 most recent
  })
  
  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
  
  const getStatusClass = (status: string) => {
    const classes = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      on_hold: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }
  
  onMounted(async () => {
    await fetchWorkOrders()
  })
  </script>