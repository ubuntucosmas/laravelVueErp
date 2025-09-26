<!-- src/modules/production/views/reports/Index.vue -->
<template>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Production Reports</h1>
          <p class="text-sm text-gray-600">View and analyze production metrics and reports</p>
        </div>
      </div>
  
      <!-- Reports Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Work Order Status Report -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Work Order Status</h3>
            <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">View</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Overview of work orders by status and completion rate
          </p>
          <div class="h-40 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">Work Order Status Chart</span>
          </div>
        </div>
  
        <!-- Production Efficiency -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Production Efficiency</h3>
            <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">View</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Track production efficiency and identify bottlenecks
          </p>
          <div class="h-40 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">Efficiency Metrics Chart</span>
          </div>
        </div>
  
        <!-- Resource Utilization -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Resource Utilization</h3>
            <span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">View</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Monitor resource allocation and utilization rates
          </p>
          <div class="h-40 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">Resource Utilization Chart</span>
          </div>
        </div>
  
        <!-- Quality Control -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Quality Control</h3>
            <span class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">View</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Track quality metrics and defect rates
          </p>
          <div class="h-40 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">Quality Metrics Chart</span>
          </div>
        </div>
  
        <!-- Time to Completion -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Time to Completion</h3>
            <span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">View</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Analyze average time to complete work orders
          </p>
          <div class="h-40 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">Time to Completion Chart</span>
          </div>
        </div>
  
        <!-- Cost Analysis -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Cost Analysis</h3>
            <span class="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">View</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Track production costs and budget vs. actuals
          </p>
          <div class="h-40 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">Cost Analysis Chart</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Import any necessary composables or components here
  // For example:
  // import { useProductionReports } from '../composables/useProductionReports'
  
  // Initialize any data or methods needed for the reports
  // const { reports, loading, error, fetchReports } = useProductionReports()
  
  // onMounted(() => {
  //   fetchReports()
  // })
  </script>