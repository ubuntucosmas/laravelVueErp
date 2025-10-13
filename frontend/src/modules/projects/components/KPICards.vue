<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Enquiries -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enquiries</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ enquiryMetrics?.total_enquiries || 0 }}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="flex items-center" :class="getTrendClass(enquiryMetrics?.monthly_trend)">
            <svg class="w-4 h-4 mr-1" :class="getTrendIcon(enquiryMetrics?.monthly_trend)" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="getTrendDirection(enquiryMetrics?.monthly_trend) === 'up'" fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 00-.001-1.415L6.707 11.293a1 1 0 00-1.414 1.414L7.586 14H5a1 1 0 01-1-1V5a1 1 0 00-2 0v8z" clip-rule="evenodd"></path>
              <path v-else-if="getTrendDirection(enquiryMetrics?.monthly_trend) === 'down'" fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 011.414-1.414L9 15.586V3a1 1 0 012 0v12.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm font-medium">{{ getTrendValue(enquiryMetrics?.monthly_trend) }}</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ getTrendLabel(enquiryMetrics?.monthly_trend) }}</p>
        </div>
      </div>
    </div>

    <!-- Active Projects -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ projectMetrics?.active_projects || 0 }}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="flex items-center" :class="getProjectTrendClass(projectMetrics)">
            <svg class="w-4 h-4 mr-1" :class="getProjectTrendIcon(projectMetrics)" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="getProjectTrendDirection(projectMetrics) === 'up'" fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 00-.001-1.415L6.707 11.293a1 1 0 00-1.414 1.414L7.586 14H5a1 1 0 01-1-1V5a1 1 0 00-2 0v8z" clip-rule="evenodd"></path>
              <path v-else-if="getProjectTrendDirection(projectMetrics) === 'down'" fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 011.414-1.414L9 15.586V3a1 1 0 012 0v12.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              <path v-else d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
            </svg>
            <span class="text-sm font-medium">{{ getProjectTrendValue(projectMetrics) }}</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ getProjectTrendLabel(projectMetrics) }}</p>
        </div>
      </div>
    </div>

    <!-- Task Completion -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Task Completion</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ taskMetrics?.completion_rate || 0 }}%</p>
          </div>
        </div>
        <div class="text-right">
          <div class="flex items-center" :class="getTaskTrendClass(taskMetrics)">
            <svg class="w-4 h-4 mr-1" :class="getTaskTrendIcon(taskMetrics)" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="getTaskTrendDirection(taskMetrics) === 'up'" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 000 16zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              <path v-else-if="getTaskTrendDirection(taskMetrics) === 'down'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              <path v-else fill-rule="evenodd" d="M10 18a8 8 0 11-16 0 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L8.586 9.5H5a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm font-medium">{{ getTaskTrendValue(taskMetrics) }}</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ getTaskTrendLabel(taskMetrics) }}</p>
        </div>
      </div>
    </div>

    <!-- Total Budget -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">${{ formatCurrency(projectMetrics?.total_budget || 0) }}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="flex items-center" :class="getBudgetTrendClass(projectMetrics)">
            <svg class="w-4 h-4 mr-1" :class="getBudgetTrendIcon(projectMetrics)" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="getBudgetTrendDirection(projectMetrics) === 'up'" fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              <path v-else-if="getBudgetTrendDirection(projectMetrics) === 'down'" fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path>
              <path v-else d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
            </svg>
            <span class="text-sm font-medium">{{ getBudgetTrendValue(projectMetrics) }}</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ getBudgetTrendLabel(projectMetrics) }}</p>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  taskMetrics?: any
}

defineProps<Props>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrendDirection = (trend: any[]) => {
  if (!trend || trend.length < 2) return 'neutral'
  const current = trend[trend.length - 1]?.count || 0
  const previous = trend[trend.length - 2]?.count || 0
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'neutral'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrendClass = (trend: any[]) => {
  const direction = getTrendDirection(trend)
  const classes = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }
  return classes[direction] || classes.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrendIcon = (trend: any[]) => {
  const direction = getTrendDirection(trend)
  const icons = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }
  return icons[direction] || icons.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrendValue = (trend: any[]) => {
  if (!trend || trend.length === 0) return '0'
  const current = trend[trend.length - 1]?.count || 0
  const previous = trend.length > 1 ? trend[trend.length - 2]?.count || 0 : 0
  const diff = current - previous
  const sign = diff > 0 ? '+' : diff < 0 ? '-' : ''
  return `${sign}${Math.abs(diff)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrendLabel = (trend: any[]) => {
  const direction = getTrendDirection(trend)
  const labels = {
    up: 'vs last month',
    down: 'vs last month',
    neutral: 'no change'
  }
  return labels[direction] || labels.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectTrendDirection = (metrics: any) => {
  if (!metrics) return 'neutral'
  const active = metrics.active_projects || 0
  const total = metrics.total_projects || 1
  const percentage = (active / total) * 100
  if (percentage > 70) return 'up'
  if (percentage < 30) return 'down'
  return 'neutral'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectTrendClass = (metrics: any) => {
  const direction = getProjectTrendDirection(metrics)
  const classes = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-blue-600 dark:text-blue-400'
  }
  return classes[direction] || classes.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectTrendIcon = (metrics: any) => {
  const direction = getProjectTrendDirection(metrics)
  const icons = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-blue-600 dark:text-blue-400'
  }
  return icons[direction] || icons.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectTrendValue = (metrics: any) => {
  if (!metrics) return '0%'
  const active = metrics.active_projects || 0
  const total = metrics.total_projects || 1
  return `${Math.round((active / total) * 100)}%`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectTrendLabel = (metrics: any) => {
  const direction = getProjectTrendDirection(metrics)
  const labels = {
    up: 'high activity',
    down: 'low activity',
    neutral: 'of total'
  }
  return labels[direction] || labels.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTaskTrendDirection = (metrics: any) => {
  if (!metrics) return 'neutral'
  const overdue = metrics.overdue_tasks || 0
  const completion = metrics.completion_rate || 0
  if (overdue > 5) return 'up' // high overdue = bad
  if (completion > 80) return 'down' // high completion = good
  return 'neutral'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTaskTrendClass = (metrics: any) => {
  const direction = getTaskTrendDirection(metrics)
  const classes = {
    up: 'text-red-600 dark:text-red-400',
    down: 'text-green-600 dark:text-green-400',
    neutral: 'text-yellow-600 dark:text-yellow-400'
  }
  return classes[direction] || classes.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTaskTrendIcon = (metrics: any) => {
  const direction = getTaskTrendDirection(metrics)
  const icons = {
    up: 'text-red-600 dark:text-red-400',
    down: 'text-green-600 dark:text-green-400',
    neutral: 'text-yellow-600 dark:text-yellow-400'
  }
  return icons[direction] || icons.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTaskTrendValue = (metrics: any) => {
  if (!metrics) return '0%'
  return `${metrics.completion_rate || 0}%`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTaskTrendLabel = (metrics: any) => {
  const direction = getTaskTrendDirection(metrics)
  const labels = {
    up: 'needs attention',
    down: 'on track',
    neutral: 'completion rate'
  }
  return labels[direction] || labels.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBudgetTrendDirection = (metrics: any) => {
  if (!metrics) return 'neutral'
  const avgBudget = (metrics.total_budget || 0) / (metrics.total_projects || 1)
  if (avgBudget > 50000) return 'up' // high budget
  if (avgBudget < 10000) return 'down' // low budget
  return 'neutral'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBudgetTrendClass = (metrics: any) => {
  const direction = getBudgetTrendDirection(metrics)
  const classes = {
    up: 'text-purple-600 dark:text-purple-400',
    down: 'text-blue-600 dark:text-blue-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }
  return classes[direction] || classes.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBudgetTrendIcon = (metrics: any) => {
  const direction = getBudgetTrendDirection(metrics)
  const icons = {
    up: 'text-purple-600 dark:text-purple-400',
    down: 'text-blue-600 dark:text-blue-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }
  return icons[direction] || icons.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBudgetTrendValue = (metrics: any) => {
  if (!metrics) return '$0'
  const avgBudget = (metrics.total_budget || 0) / (metrics.total_projects || 1)
  return formatCurrency(avgBudget)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBudgetTrendLabel = (metrics: any) => {
  const direction = getBudgetTrendDirection(metrics)
  const labels = {
    up: 'high value',
    down: 'budget friendly',
    neutral: 'avg per project'
  }
  return labels[direction] || labels.neutral
}
</script>
