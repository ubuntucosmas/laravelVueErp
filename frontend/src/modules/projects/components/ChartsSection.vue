<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Enquiry Trends Chart -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Enquiry Trends</h3>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span class="text-sm text-gray-600 dark:text-gray-400">Monthly Growth</span>
        </div>
      </div>
      <div class="h-80">
        <Chart type="line" :data="enquiryTrendData" :options="enquiryTrendOptions" class="h-full" />
      </div>
    </div>

    <!-- Task Distribution Chart -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tasks by Department</h3>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Distribution</span>
        </div>
      </div>
      <div class="h-80 flex items-center justify-center">
        <Chart type="doughnut" :data="taskDistributionData" :options="taskDistributionOptions" class="h-full w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Chart from 'primevue/chart'

 
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enquiryMetrics?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  taskMetrics?: any
}

const props = defineProps<Props>()

// Chart data
const enquiryTrendData = computed(() => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: props.enquiryMetrics?.monthly_trend?.map((item: any) => item.month) || [],
  datasets: [{
    label: 'Enquiries',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: props.enquiryMetrics?.monthly_trend?.map((item: any) => item.count) || [],
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4,
    fill: true,
    pointBackgroundColor: '#3B82F6',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6
  }]
}))

const enquiryTrendOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: '#6B7280'
      },
      grid: {
        color: '#E5E7EB'
      }
    },
    x: {
      ticks: {
        color: '#6B7280'
      },
      grid: {
        display: false
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
}))

const taskDistributionData = computed(() => ({
  labels: Object.keys(props.taskMetrics?.tasks_by_department || {}),
  datasets: [{
    data: Object.values(props.taskMetrics?.tasks_by_department || {}),
    backgroundColor: [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#06B6D4',
      '#EC4899',
      '#84CC16'
    ],
    hoverBackgroundColor: [
      '#2563EB',
      '#059669',
      '#D97706',
      '#DC2626',
      '#7C3AED',
      '#0891B2',
      '#BE185D',
      '#65A30D'
    ],
    borderWidth: 2,
    borderColor: '#ffffff'
  }]
}))

const taskDistributionOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        color: '#6B7280'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      cornerRadius: 8,
      callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  },
  cutout: '60%'
}))
</script>
