<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Project Overview</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ project.description || 'No description available' }}
        </p>
      </div>
      <div class="mt-4 md:mt-0 flex items-center">
        <span 
          class="px-3 py-1 rounded-full text-xs font-medium"
          :class="{
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': project.status === 'completed',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': project.status === 'in-progress',
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': project.status === 'planning'
          }"
        >
          {{ formatStatus(project.status) }}
        </span>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
        <span>Project Progress</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          class="bg-indigo-600 h-2.5 rounded-full" 
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Timeline -->
      <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Timeline</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Budget -->
      <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Budget</p>
            <div class="flex items-center">
              <p class="font-medium text-gray-900 dark:text-white mr-2">
                {{ formatCurrency(project.spent || 0) }}
              </p>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                of {{ formatCurrency(project.budget || 0) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Team -->
      <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Team</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ project.team?.length || 0 }} members
            </p>
          </div>
        </div>
      </div>

      <!-- Project Manager -->
      <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Project Manager</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ project.manager?.name || 'Unassigned' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  }
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatStatus = (status: string) => {
  if (!status) return 'Not Started';
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
</script>
