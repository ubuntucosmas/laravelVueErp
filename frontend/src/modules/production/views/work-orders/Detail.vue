<!-- src/modules/production/views/work-orders/Detail.vue -->
<template>
    <div v-if="loading" class="p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Loading work order...</p>
    </div>
  
    <div v-else-if="error" class="p-8 text-center text-red-600">
      Error: {{ error }}
    </div>
  
    <div v-else-if="!workOrder" class="p-8 text-center text-gray-500">
      Work order not found
    </div>
  
    <div v-else class="space-y-6">
      <!-- Header with title and actions -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {{ workOrder.title }}
            </h1>
            <span 
              :class="`ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(workOrder.status)}`"
            >
              {{ formatStatus(workOrder.status) }}
            </span>
          </div>
          <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              Created on {{ formatDate(workOrder.created_at) }}
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              Due on {{ workOrder.due_date ? formatDate(workOrder.due_date) : 'No due date' }}
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0116 8H4a5 5 0 014.5 2.67A6.97 6.97 0 007 16c0 .34.024.673.07 1h5.86z" />
              </svg>
              Project: 
              <router-link 
                v-if="workOrder.project"
                :to="`/projects/projects/${workOrder.project_id}`"
                class="ml-1 text-blue-600 hover:underline"
              >
                {{ workOrder.project.title }}
              </router-link>
              <span v-else class="ml-1">No project linked</span>
            </div>
          </div>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            @click="router.push('/production/work-orders')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            Back to List
          </button>
          <button
            type="button"
            @click="router.push(`/production/work-orders/${workOrder.id}/edit`)"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
        </div>
      </div>
  
      <!-- Main content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Description -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px