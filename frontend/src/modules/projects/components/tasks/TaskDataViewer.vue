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
            <button
              v-if="taskData"
              @click="toggleEditMode"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Dynamic Data Display based on task type -->
      <component
        v-if="!isEditMode"
        :is="getDataComponent(task.type)"
        :task="task"
        :task-data="taskData"
        :enquiry-id="task.project_enquiry_id"
        @update:taskData="handleTaskDataUpdate"
      />

      <!-- Editable form when in edit mode -->
      <component
        v-else
        :is="getEditableComponent(task.type)"
        :task="task"
        :readonly="false"
        @update-status="$emit('update-status', $event)"
        @complete="$emit('complete')"
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
import BudgetDataDisplay from './data-displays/BudgetDataDisplay.vue'
import ConversionDataDisplay from './data-displays/ConversionDataDisplay.vue'
import DesignDataDisplay from './data-displays/DesignDataDisplay.vue'
import HandoverDataDisplay from './data-displays/HandoverDataDisplay.vue'
import LogisticsDataDisplay from './data-displays/LogisticsDataDisplay.vue'
import ProcurementDataDisplay from './data-displays/ProcurementDataDisplay.vue'
import ProductionDataDisplay from './data-displays/ProductionDataDisplay.vue'
import QuoteApprovalDataDisplay from './data-displays/QuoteApprovalDataDisplay.vue'
import QuoteDataDisplay from './data-displays/QuoteDataDisplay.vue'
import ReportDataDisplay from './data-displays/ReportDataDisplay.vue'
import SetdownDataDisplay from './data-displays/SetdownDataDisplay.vue'
import SetupDataDisplay from './data-displays/SetupDataDisplay.vue'
import DefaultDataDisplay from './data-displays/DefaultDataDisplay.vue'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const taskData = ref<Record<string, unknown> | Record<string, unknown>[] | null>(null)
const isLoading = ref(false)
const error = ref('')
const isEditMode = ref(false)

// Map task types to their data display components
const dataDisplayComponents = {
  'site-survey': SurveyDataDisplay,
  'materials': MaterialsDataDisplay,
  'budget': BudgetDataDisplay,
  'conversion': ConversionDataDisplay,
  'design': DesignDataDisplay,
  'handover': HandoverDataDisplay,
  'logistics': LogisticsDataDisplay,
  'procurement': ProcurementDataDisplay,
  'production': ProductionDataDisplay,
  'quote_approval': QuoteApprovalDataDisplay,
  'quote': QuoteDataDisplay,
  'report': ReportDataDisplay,
  'setdown': SetdownDataDisplay,
  'setup': SetupDataDisplay,
  // Add more task types here as needed
}

// Map task types to their editable components
const editableComponents = {
  'site-survey': () => import('./SurveyTask.vue'),
  'design': () => import('./DesignTask.vue'),
  'materials': () => import('./MaterialsTask.vue'),
  // Add more task types here as needed
}

// Get the appropriate component for the task type
const getDataComponent = (taskKey?: string) => {
  if (!taskKey) {
    console.log('TaskDataViewer: No task key provided, using DefaultDataDisplay')
    return DefaultDataDisplay
  }

  const component = dataDisplayComponents[taskKey as keyof typeof dataDisplayComponents]
  if (!component) {
    console.warn('TaskDataViewer: No component found for task type:', taskKey, '- available types:', Object.keys(dataDisplayComponents), '- using DefaultDataDisplay')
    return DefaultDataDisplay
  }

  console.log('TaskDataViewer: Using component for task type:', taskKey, '- component:', component.name || 'unnamed')
  return component
}

// Get the appropriate editable component for the task type
const getEditableComponent = async (taskKey?: string) => {
  if (!taskKey) return null
  const componentImport = editableComponents[taskKey as keyof typeof editableComponents]
  if (componentImport) {
    const module = await componentImport()
    return module.default
  }
  return null
}

// Fetch task data based on task type
const fetchTaskData = async () => {
  console.log('TaskDataViewer: Starting data fetch for task', props.task?.id, 'with type:', props.task?.type)

  if (!props.task?.id) {
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const taskKey = props.task.type
    if (!taskKey) {
      throw new Error('Task type not defined')
    }

    console.log('TaskDataViewer: Task key determined as:', taskKey)
    console.log('TaskDataViewer: Available data display components:', Object.keys(dataDisplayComponents))

    let endpoint = ''

    // Define endpoints for different task types
    switch (taskKey) {
      case 'site-survey':
        endpoint = `/api/projects/site-surveys?enquiry_task_id=${props.task.id}`
        break
      case 'materials':
        endpoint = `/api/projects/tasks/${props.task.id}/materials`
        console.log('TaskDataViewer: Materials task endpoint:', endpoint)
        break
      case 'materials-request':
        endpoint = `/api/projects/tasks/${props.task.id}/materials`
        console.log('TaskDataViewer: Materials-request task endpoint:', endpoint)
        break
      case 'design':
        endpoint = `/api/projects/enquiry-tasks/${props.task.id}/design-assets`
        console.log('TaskDataViewer: Design task endpoint:', endpoint)
        break
      // Add more task types here
      default:
        console.warn('TaskDataViewer: No specific endpoint for task type:', taskKey, '- will use default display')
        throw new Error(`Data display not implemented for task type: ${taskKey}`)
    }

    const response = await api.get(endpoint)

    console.log('TaskDataViewer: API response for task type', taskKey, ':', response.data)
    console.log('TaskDataViewer: Response data type:', typeof response.data, 'isArray:', Array.isArray(response.data))

    if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as Record<string, unknown>).data)) {
      // Handle paginated response (like design assets API)
      const paginatedData = (response.data as Record<string, unknown>).data as Record<string, unknown>[]
      if (paginatedData.length > 0) {
        taskData.value = paginatedData // Full array of design assets
        console.log('TaskDataViewer: Set taskData to paginated data array:', taskData.value)
      } else {
        taskData.value = null
        console.log('TaskDataViewer: Set taskData to null (empty paginated response)')
      }
    } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      // Handle direct array response
      if (taskKey === 'site-survey') {
        // Site survey expects a single object, not an array
        taskData.value = response.data[0] as Record<string, unknown>
        console.log('TaskDataViewer: Set taskData to first item of array for site-survey:', taskData.value)
      } else {
        taskData.value = response.data as Record<string, unknown>[] // Full array for other types
        console.log('TaskDataViewer: Set taskData to array:', taskData.value)
      }
    } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      // Handle single object response
      taskData.value = response.data
      console.log('TaskDataViewer: Set taskData to object:', taskData.value)
    } else {
      taskData.value = null
      console.log('TaskDataViewer: Set taskData to null')
    }
  } catch (err: unknown) {
    const errorObj = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> }; statusText?: string }; message?: string }

    const errorMessage = errorObj.response?.data?.message ||
                          (errorObj.response?.data?.errors ? Object.values(errorObj.response.data.errors).flat().join(', ') : null) ||
                          errorObj.message ||
                          'Failed to load task data'
    error.value = errorMessage
  } finally {
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
watch(() => props.task?.id, () => {
  if (props.task?.status === 'completed') {
    fetchTaskData()
  } else {
    taskData.value = null
  }
}, { immediate: true })

// Handle task data updates from child components
const handleTaskDataUpdate = (updatedData: Record<string, unknown>) => {
  taskData.value = updatedData
}

// Toggle edit mode
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

// Watch for task status changes
watch(() => props.task?.status, (newStatus) => {
  if (newStatus === 'completed') {
    fetchTaskData()
    // Reset edit mode when task status changes
    isEditMode.value = false
  } else {
    taskData.value = null
    isEditMode.value = false
  }
})
</script>

<style scoped>
.task-data-viewer {
  max-width: none;
}
</style>
