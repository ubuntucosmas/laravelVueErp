<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Project Coordination
      </h1>
      <NotificationDropdown />
    </div>

    <!-- Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            @click="activeTab = 'enquiries'"
            :class="[
              activeTab === 'enquiries'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Department Enquiries
          </button>
          <button
            @click="activeTab = 'tasks'"
            :class="[
              activeTab === 'tasks'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Department Tasks
          </button>
          <button
            v-if="showDashboardTab"
            @click="activeTab = 'dashboard'"
            :class="[
              activeTab === 'dashboard'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Projects Dashboard
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Enquiries Tab -->
        <div v-if="activeTab === 'enquiries'">
          <div v-if="loading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
          <div v-else-if="enquiriesWithPendingTasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No enquiries with pending tasks assigned to your department
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="enquiry in enquiriesWithPendingTasks"
              :key="enquiry.id"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ enquiry.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Enquiry #{{ enquiry.enquiry_number }} • {{ enquiry.client?.full_name }}
                  </p>
                </div>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getPriorityClass(enquiry.priority)
                  ]"
                >
                  {{ enquiry.priority }}
                </span>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {{ enquiry.description }}
              </p>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <p>Status: {{ getStatusLabel(enquiry.status) }}</p>
                <p>Pending Tasks: {{ enquiry.enquiryTasks?.filter(t => t.status === 'pending' || t.status === 'in_progress').length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tasks Tab -->
        <div v-if="activeTab === 'tasks'">
          <div v-if="loading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
          <div v-else-if="departmentTasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No pending tasks assigned to your department
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="task in departmentTasks"
              :key="task.id"
              :class="[
                'rounded-lg p-4 border-l-4',
                isOverdue(task) ? 'bg-red-50 dark:bg-red-900/20 border-red-500' : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
              ]"
            >
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ task.title }}
                    </h3>
                    <span
                      v-if="task.priority"
                      :class="[
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        getPriorityClass(task.priority)
                      ]"
                    >
                      {{ task.priority }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Type: {{ task.type }} • Status: {{ getStatusLabel(task.status) }}
                  </p>
                  <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span v-if="task.assignedBy">
                      Assigned to: {{ task.assignedBy?.name || 'Unknown' }}
                    </span>
                    <span v-if="task.due_date" :class="isOverdue(task) ? 'text-red-600 dark:text-red-400 font-medium' : ''">
                      Due: {{ formatDate(task.due_date) }}
                    </span>
                    <span v-if="task.assigned_at">
                      Assigned: {{ formatDate(task.assigned_at) }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="showAssignmentHistory(task)"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm underline"
                  >
                    History
                  </button>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusClass(task.status)
                    ]"
                  >
                    {{ getStatusLabel(task.status) }}
                  </span>
                </div>
              </div>

              <!-- Task Renderer for completion -->
              <TaskRenderer
                :task="task"
                @update-status="handleTaskStatusUpdate(task.id, $event)"
                @complete="handleTaskComplete(task.id)"
              />
            </div>
          </div>
        </div>

        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'">
          <div v-if="dashboardLoading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
          <div v-else>
            <!-- Key Metrics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
          </div>
        </div>
      </div>
    </div>

    <!-- Assignment History Modal -->
    <AssignmentHistory
      :show="showHistoryModal"
      :task="selectedTask"
      @close="closeHistoryModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProjectCoordination } from '../composables/useProjectCoordination'
import { useProjectsDashboard } from '../composables/useProjectsDashboard'
import { useNotifications } from '../composables/useNotifications'
import { useAuth } from '@/composables/useAuth'
import TaskRenderer from '../components/tasks/TaskRenderer.vue'
import NotificationDropdown from '../components/NotificationDropdown.vue'
import AssignmentHistory from '../components/AssignmentHistory.vue'
import Chart from 'primevue/chart'
import type { EnquiryTask } from '../types/enquiry'

const activeTab = ref<'enquiries' | 'tasks' | 'dashboard'>('enquiries')

const { user } = useAuth()
const { } = useNotifications()

// Assignment history modal
const showHistoryModal = ref(false)
const selectedTask = ref<EnquiryTask | null>(null)
const showDashboardTab = computed(() => user.value?.department?.name === 'Projects')

const { enquiryMetrics, taskMetrics, projectMetrics, loading: dashboardLoading, fetchDashboardMetrics } = useProjectsDashboard()

const {
  enquiriesWithPendingTasks,
  departmentTasks,
  loading,
  fetchCoordinationData,
  updateTaskStatus
} = useProjectCoordination()

// Dashboard chart data
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
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

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

const handleTaskStatusUpdate = async (taskId: number, status: EnquiryTask['status']) => {
  try {
    await updateTaskStatus(taskId, status)
  } catch (error) {
    console.error('Failed to update task status:', error)
  }
}

const handleTaskComplete = async (taskId: number) => {
  await handleTaskStatusUpdate(taskId, 'completed')
}

// Assignment history methods
const showAssignmentHistory = (task: EnquiryTask) => {
  selectedTask.value = task
  showHistoryModal.value = true
}

const closeHistoryModal = () => {
  showHistoryModal.value = false
  selectedTask.value = null
}

// Helper functions
const isOverdue = (task: EnquiryTask): boolean => {
  if (!task.due_date) return false
  const dueDate = new Date(task.due_date)
  const now = new Date()
  return dueDate < now && task.status !== 'completed'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

onMounted(() => {
  fetchCoordinationData()
  if (showDashboardTab.value) {
    fetchDashboardMetrics()
  }
})
</script>
