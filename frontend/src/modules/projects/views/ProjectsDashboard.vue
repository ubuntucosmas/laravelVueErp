<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Projects Dashboard
      </h1>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enquiries</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ enquiryMetrics?.total_enquiries || 0 }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              +{{ enquiryMetrics?.monthly_trend?.[enquiryMetrics.monthly_trend.length - 1]?.count || 0 }} this month
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectMetrics?.active_projects || 0 }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {{ Math.round(((projectMetrics?.active_projects || 0) / (projectMetrics?.total_projects || 1)) * 100) }}% of total
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Task Completion</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ taskMetrics?.completion_rate || 0 }}%</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {{ taskMetrics?.overdue_tasks || 0 }} overdue
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ formatCurrency(projectMetrics?.total_budget || 0) }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Avg: ${{ formatCurrency((projectMetrics?.total_budget || 0) / (projectMetrics?.total_projects || 1)) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Enquiry Trends Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Enquiry Trends</h3>
        <Chart type="line" :data="enquiryTrendData" :options="enquiryTrendOptions" class="h-64" />
      </div>

      <!-- Task Distribution Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Tasks by Department</h3>
        <Chart type="doughnut" :data="taskDistributionData" :options="taskDistributionOptions" class="h-64" />
      </div>
    </div>

    <!-- Detailed Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Enquiry Status Breakdown -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Enquiry Status Breakdown</h3>
        <div class="space-y-3">
          <div v-for="(count, status) in enquiryMetrics?.status_breakdown" :key="status"
               class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-2" :class="getStatusColor(status)"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ getStatusLabel(status) }}</span>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ count }}</span>
          </div>
        </div>
      </div>

      <!-- Project Phase Progress -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Project Phase Progress</h3>
        <div class="space-y-4">
          <div v-for="phase in projectMetrics?.phase_progress" :key="phase.name" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ phase.name }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ phase.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                   :style="{ width: phase.progress + '%' }"></div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-500">
              {{ phase.completed }}/{{ phase.total }} completed
            </div>
          </div>
        </div>
      </div>

      <!-- Priority Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
        <div class="space-y-3">
          <div v-for="(count, priority) in enquiryMetrics?.priority_distribution" :key="priority"
               class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-2" :class="getPriorityColor(priority)"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400 capitalize">{{ priority }}</span>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts and Activities -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Alerts -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Alerts</h3>
        </div>
        <div class="p-6">
          <div v-if="dashboardMetrics?.alerts?.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            No alerts at this time
          </div>
          <div v-else class="space-y-3">
            <div v-for="alert in dashboardMetrics?.alerts" :key="alert.type"
                 class="p-3 rounded-lg border-l-4"
                 :class="getAlertBorderColor(alert.severity)">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5" :class="getAlertIconColor(alert.severity)" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ alert.title }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ alert.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
          <div v-else-if="dashboardMetrics?.recent_activities?.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            No recent activities
          </div>
          <div v-else class="space-y-4">
            <div v-for="activity in dashboardMetrics?.recent_activities" :key="activity.timestamp"
                 class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full flex items-center justify-center"
                     :class="getActivityIconBg(activity.type)">
                  <svg class="w-4 h-4" :class="getActivityIconColor(activity.type)" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="activity.type === 'enquiry_created'" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    <path v-else-if="activity.type === 'task_updated'" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    <path v-else d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ activity.description }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {{ formatDate(activity.timestamp) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProjectsDashboard } from '../composables/useProjectsDashboard'
import Chart from 'primevue/chart'

const { dashboardMetrics, enquiryMetrics, taskMetrics, projectMetrics, loading, fetchDashboardMetrics } = useProjectsDashboard()

// Chart data
const enquiryTrendData = computed(() => ({
  labels: enquiryMetrics.value?.monthly_trend?.map(item => item.month) || [],
  datasets: [{
    label: 'Enquiries',
    data: enquiryMetrics.value?.monthly_trend?.map(item => item.count) || [],
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4,
    fill: true
  }]
}))

const enquiryTrendOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}))

const taskDistributionData = computed(() => ({
  labels: Object.keys(taskMetrics.value?.tasks_by_department || {}),
  datasets: [{
    data: Object.values(taskMetrics.value?.tasks_by_department || {}),
    backgroundColor: [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#06B6D4'
    ],
    hoverBackgroundColor: [
      '#2563EB',
      '#059669',
      '#D97706',
      '#DC2626',
      '#7C3AED',
      '#0891B2'
    ]
  }]
}))

const taskDistributionOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}))

// Helper functions
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

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'bg-green-400',
    'medium': 'bg-yellow-400',
    'high': 'bg-orange-400',
    'urgent': 'bg-red-400'
  }
  return colors[priority] || 'bg-gray-400'
}

const getAlertBorderColor = (severity: string) => {
  const colors: Record<string, string> = {
    'high': 'border-l-red-500',
    'medium': 'border-l-yellow-500',
    'low': 'border-l-blue-500'
  }
  return colors[severity] || 'border-l-gray-500'
}

const getAlertIconColor = (severity: string) => {
  const colors: Record<string, string> = {
    'high': 'text-red-500',
    'medium': 'text-yellow-500',
    'low': 'text-blue-500'
  }
  return colors[severity] || 'text-gray-500'
}

const getActivityIconBg = (type: string) => {
  const colors: Record<string, string> = {
    'enquiry_created': 'bg-blue-100 dark:bg-blue-900',
    'task_updated': 'bg-green-100 dark:bg-green-900',
    'phase_updated': 'bg-purple-100 dark:bg-purple-900'
  }
  return colors[type] || 'bg-gray-100 dark:bg-gray-900'
}

const getActivityIconColor = (type: string) => {
  const colors: Record<string, string> = {
    'enquiry_created': 'text-blue-600 dark:text-blue-400',
    'task_updated': 'text-green-600 dark:text-green-400',
    'phase_updated': 'text-purple-600 dark:text-purple-400'
  }
  return colors[type] || 'text-gray-600 dark:text-gray-400'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchDashboardMetrics()
})
</script>
