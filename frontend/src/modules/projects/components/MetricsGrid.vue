<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Enquiry Status Breakdown -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Enquiry Status</h3>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>
      <div class="space-y-3">
        <div v-for="(count, status) in enquiryMetrics?.status_breakdown" :key="status"
             class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-3" :class="getStatusColor(String(status))"></div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ getStatusLabel(String(status)) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ count }}</span>
            <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
              <div class="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                   :style="{ width: getStatusPercentage(String(status), Number(count)) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Phase Progress -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Project Phases</h3>
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-xs text-gray-500 dark:text-gray-400">Progress</span>
        </div>
      </div>
      <div class="space-y-4">
        <div v-for="phase in projectMetrics?.phase_progress" :key="phase.name"
             class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ phase.name }}</span>
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ phase.progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div class="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                 :style="{ width: phase.progress + '%' }"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{{ phase.completed }}/{{ phase.total }} completed</span>
            <span>{{ phase.total - phase.completed }} remaining</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Priority Distribution -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Priority Levels</h3>
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span class="text-xs text-gray-500 dark:text-gray-400">Distribution</span>
        </div>
      </div>
      <div class="space-y-3">
        <div v-for="(count, priority) in enquiryMetrics?.priority_distribution" :key="priority"
             class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-3" :class="getPriorityColor(String(priority))"></div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{{ priority }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ count }}</span>
            <div class="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
              <div class="h-1.5 rounded-full transition-all duration-300"
                   :class="getPriorityBarColor(String(priority))"
                   :style="{ width: getPriorityPercentage(String(priority), Number(count)) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enquiryMetrics?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectMetrics?: any
}

const props = defineProps<Props>()

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'client_registered': 'Client Registered',
    'enquiry_logged': 'Enquiry Logged',
    'site_survey_completed': 'Site Survey Done',
    'design_completed': 'Design Completed',
    'design_approved': 'Design Approved',
    'materials_specified': 'Materials Specified',
    'budget_created': 'Budget Created',
    'quote_prepared': 'Quote Prepared',
    'quote_approved': 'Quote Approved',
    'converted_to_project': 'Converted to Project',
    'planning': 'Planning',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'client_registered': 'bg-gray-400',
    'enquiry_logged': 'bg-blue-400',
    'site_survey_completed': 'bg-yellow-400',
    'design_completed': 'bg-purple-400',
    'design_approved': 'bg-indigo-400',
    'materials_specified': 'bg-pink-400',
    'budget_created': 'bg-green-400',
    'quote_prepared': 'bg-teal-400',
    'quote_approved': 'bg-cyan-400',
    'converted_to_project': 'bg-emerald-400',
    'planning': 'bg-orange-400',
    'in_progress': 'bg-blue-500',
    'completed': 'bg-green-500',
    'cancelled': 'bg-red-400'
  }
  return colors[status] || 'bg-gray-400'
}

const getStatusPercentage = (status: string, count: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = Object.values(props.enquiryMetrics?.status_breakdown || {}).reduce((sum: number, c: any) => sum + Number(c), 0)
  return total > 0 ? Math.round((count / total) * 100) : 0
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'bg-green-400',
    'medium': 'bg-yellow-400',
    'high': 'bg-orange-400',
    'urgent': 'bg-red-400'
  }
  return colors[priority] || 'bg-gray-400'
}

const getPriorityBarColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'bg-green-500',
    'medium': 'bg-yellow-500',
    'high': 'bg-orange-500',
    'urgent': 'bg-red-500'
  }
  return colors[priority] || 'bg-gray-500'
}

const getPriorityPercentage = (priority: string, count: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = Object.values(props.enquiryMetrics?.priority_distribution || {}).reduce((sum: number, c: any) => sum + Number(c), 0)
  return total > 0 ? Math.round((count / total) * 100) : 0
}
</script>
