<template>
  <div class="task-data-viewer">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-400">Loading task data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <span class="text-sm font-medium text-red-800 dark:text-red-200">Error loading data</span>
      </div>
      <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
    </div>

    <!-- Data Display -->
    <div v-else-if="taskData" class="space-y-6">
      <!-- Task Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Completed on {{ formatDate(task.updated_at) }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Completed
            </span>
          </div>
        </div>
      </div>

      <!-- Dynamic Data Display based on task type -->
      <component
        :is="getDataComponent(task.type)"
        :task="task"
        :task-data="taskData"
        :enquiry-id="task.project_enquiry_id"
      />
    </div>

    <!-- No Data State -->
    <div v-else class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No data available</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        This task hasn't been completed yet or no data was submitted.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/plugins/axios'
import type { EnquiryTask } from '../../types/enquiry'

// Import data display components for different task types
import SurveyDataDisplay from './data-displays/SurveyDataDisplay.vue'
import MaterialsDataDisplay from './data-displays/MaterialsDataDisplay.vue'
import DefaultDataDisplay from './data-displays/DefaultDataDisplay.vue'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const taskData = ref<Record<string, unknown> | null>(null)
const isLoading = ref(false)
const error = ref('')

// Map task types to their data display components
const dataDisplayComponents = {
  'site-survey': SurveyDataDisplay,
  'materials-request': MaterialsDataDisplay,
  // Add more task types here as needed
}

// Get the appropriate component for the task type
const getDataComponent = (taskKey?: string) => {
  if (!taskKey) return DefaultDataDisplay
  return dataDisplayComponents[taskKey as keyof typeof dataDisplayComponents] || DefaultDataDisplay
}

// Fetch task data based on task type
const fetchTaskData = async () => {
  console.log('[DEBUG] TaskDataViewer.fetchTaskData - STARTING DATA FETCH')
  console.log('[DEBUG] TaskDataViewer.fetchTaskData - Task verification:', {
    taskExists: !!props.task,
    taskId: props.task?.id,
    taskType: props.task?.type,
    taskStatus: props.task?.status,
    projectEnquiryId: props.task?.project_enquiry_id,
    isCompleted: props.task?.status === 'completed'
  })

  if (!props.task?.id) {
    console.log('[DEBUG] TaskDataViewer.fetchTaskData - NO TASK ID, SKIPPING')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const taskKey = props.task.type
    console.log('[DEBUG] TaskDataViewer.fetchTaskData - Task key determined:', taskKey)

    if (!taskKey) {
      console.error('[DEBUG] TaskDataViewer.fetchTaskData - ERROR: Task type not defined')
      throw new Error('Task type not defined')
    }

    let endpoint = ''
    console.log('[DEBUG] TaskDataViewer.fetchTaskData - Determining endpoint for task type:', taskKey)

    // Define endpoints for different task types
    switch (taskKey) {
      case 'site-survey':
        endpoint = `/api/projects/site-surveys?enquiry_task_id=${props.task.id}`
        console.log('[DEBUG] TaskDataViewer.fetchTaskData - Using site-survey endpoint:', endpoint)
        break
      case 'materials-request':
        endpoint = `/api/projects/materials-requests?task_id=${props.task.id}`
        console.log('[DEBUG] TaskDataViewer.fetchTaskData - Using materials-request endpoint:', endpoint)
        break
      // Add more task types here
      default:
        console.error('[DEBUG] TaskDataViewer.fetchTaskData - ERROR: No endpoint for task type:', taskKey)
        throw new Error(`Data display not implemented for task type: ${taskKey}`)
    }

    console.log('[DEBUG] TaskDataViewer.fetchTaskData - Final endpoint to call:', endpoint)
    console.log('[DEBUG] TaskDataViewer.fetchTaskData - Making API request...')

    const response = await api.get(endpoint)

    console.log('[DEBUG] TaskDataViewer.fetchTaskData - API Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
      dataKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : 'N/A',
      fullData: response.data
    })

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      taskData.value = response.data[0] // Usually the first/most recent record
      console.log('[DEBUG] TaskDataViewer.fetchTaskData - SUCCESS: Task data set from array:', {
        dataIndex: 0,
        dataKeys: taskData.value ? Object.keys(taskData.value) : [],
        sampleData: taskData.value ? {
          id: (taskData.value as any).id,
          site_visit_date: (taskData.value as any).site_visit_date,
          client_name: (taskData.value as any).client_name,
          location: (taskData.value as any).location
        } : null
      })
    } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      // Handle single object response
      taskData.value = response.data
      console.log('[DEBUG] TaskDataViewer.fetchTaskData - SUCCESS: Task data set from single object:', {
        dataKeys: taskData.value ? Object.keys(taskData.value) : [],
        sampleData: taskData.value ? {
          id: (taskData.value as any).id,
          site_visit_date: (taskData.value as any).site_visit_date,
          client_name: (taskData.value as any).client_name,
          location: (taskData.value as any).location
        } : null
      })
    } else {
      taskData.value = null
      console.log('[DEBUG] TaskDataViewer.fetchTaskData - NO DATA FOUND: Response data is empty or invalid:', {
        responseData: response.data,
        isEmptyArray: Array.isArray(response.data) && response.data.length === 0,
        isNullOrUndefined: response.data == null
      })
    }
  } catch (err: unknown) {
    console.error('[DEBUG] TaskDataViewer.fetchTaskData - ERROR during data fetch:', err)
    const errorObj = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> }; statusText?: string }; message?: string }
    console.error('[DEBUG] TaskDataViewer.fetchTaskData - Error details:', {
      status: errorObj.response?.status,
      statusText: errorObj.response?.statusText,
      responseData: errorObj.response?.data,
      message: errorObj.message
    })

    const errorMessage = errorObj.response?.data?.message ||
                         (errorObj.response?.data?.errors ? Object.values(errorObj.response.data.errors).flat().join(', ') : null) ||
                         errorObj.message ||
                         'Failed to load task data'
    error.value = errorMessage
    console.error('[DEBUG] TaskDataViewer.fetchTaskData - Final error message set:', errorMessage)
  } finally {
    console.log('[DEBUG] TaskDataViewer.fetchTaskData - COMPLETED - Setting loading to false')
    isLoading.value = false
  }
}

// Utility function for date formatting
const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

// Watch for task changes
watch(() => props.task?.id, (newTaskId, oldTaskId) => {
  console.log('[DEBUG] TaskDataViewer.watch(task.id) - TASK ID CHANGED:', {
    oldTaskId: oldTaskId,
    newTaskId: newTaskId,
    taskStatus: props.task?.status,
    taskType: props.task?.type,
    projectEnquiryId: props.task?.project_enquiry_id,
    isCompleted: props.task?.status === 'completed'
  })

  if (props.task?.status === 'completed') {
    console.log('[DEBUG] TaskDataViewer.watch(task.id) - Task is completed, fetching data...')
    fetchTaskData()
  } else {
    console.log('[DEBUG] TaskDataViewer.watch(task.id) - Task not completed, clearing data')
    taskData.value = null
  }
}, { immediate: true })

// Watch for task status changes
watch(() => props.task?.status, (newStatus, oldStatus) => {
  console.log('[DEBUG] TaskDataViewer.watch(task.status) - TASK STATUS CHANGED:', {
    oldStatus: oldStatus,
    newStatus: newStatus,
    taskId: props.task?.id,
    taskType: props.task?.type,
    projectEnquiryId: props.task?.project_enquiry_id,
    isCompleted: newStatus === 'completed'
  })

  if (newStatus === 'completed') {
    console.log('[DEBUG] TaskDataViewer.watch(task.status) - Status changed to completed, fetching data...')
    fetchTaskData()
  } else {
    console.log('[DEBUG] TaskDataViewer.watch(task.status) - Status not completed, clearing data')
    taskData.value = null
  }
})
</script>

<style scoped>
.task-data-viewer {
  max-width: none;
}
</style>
