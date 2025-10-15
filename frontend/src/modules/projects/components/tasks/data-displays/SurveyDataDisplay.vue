<template>
  <div class="survey-data-display">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="flex space-x-8" aria-label="Survey Data Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.key
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Basic Information -->
    <div v-show="activeTab === 'basic'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Basic Information</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Site Visit Date
             </label>
             <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ formatDate(taskData.site_visit_date) || 'Not specified' }}
             </div>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Location
             </label>
             <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ taskData.location || 'Not specified' }}
             </div>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Client Name
             </label>
             <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ taskData.client_name || 'Not specified' }}
             </div>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Contact Person
             </label>
             <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ taskData.client_contact_person || 'Not specified' }}
             </div>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Phone Number
             </label>
             <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ taskData.client_phone || 'Not specified' }}
             </div>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Email Address
             </label>
             <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ taskData.client_email || 'Not specified' }}
             </div>
           </div>
         </div>

         <div class="mt-6">
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             Attendees
           </label>
           <div class="text-sm text-gray-900 dark:text-white">
             <ul v-if="Array.isArray(formatList(taskData.attendees)) && formatList(taskData.attendees).length > 0" class="list-disc list-inside space-y-1">
               <li v-for="item in formatList(taskData.attendees)" :key="item">{{ item }}</li>
             </ul>
             <span v-else class="text-gray-500 dark:text-gray-400">No items specified</span>
           </div>
         </div>
      </div>
    </div>

    <!-- Site Assessment -->
    <div v-show="activeTab === 'assessment'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
          <span>Site Assessment</span>
        </h3>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Description
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.project_description || 'Not specified' }}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Objectives
              </label>
              <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {{ taskData.objectives || 'Not specified' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Site Condition
              </label>
              <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {{ taskData.current_condition || 'Not specified' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Existing Branding
              </label>
              <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {{ taskData.existing_branding || 'Not specified' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Measurements
              </label>
              <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {{ taskData.site_measurements || 'Not specified' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room/Area Size
              </label>
              <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                {{ taskData.room_size || 'Not specified' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Constraints
              </label>
              <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {{ taskData.constraints || 'Not specified' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Access & Logistics -->
    <div v-show="activeTab === 'access'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span>Access & Logistics</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Access Logistics
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.access_logistics || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parking Availability
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.parking_availability || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Size & Accessibility
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.size_accessibility || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lifts/Elevators
            </label>
            <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.lifts || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Door Sizes
            </label>
            <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.door_sizes || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loading Areas
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.loading_areas || 'Not specified' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Requirements & Preferences -->
    <div v-show="activeTab === 'requirements'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          <span>Requirements & Preferences</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Branding Preferences
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.branding_preferences || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Material Preferences
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.material_preferences || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color Scheme
            </label>
            <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.color_scheme || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brand Guidelines
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.brand_guidelines || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Instructions
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.special_instructions || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Electrical Requirements
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.electrical_outlets || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Food & Refreshment
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.food_refreshment || 'Not specified' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Safety & Timeline -->
    <div v-show="activeTab === 'safety'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <span>Safety & Timeline</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Safety Conditions
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.safety_conditions || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Potential Hazards
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.potential_hazards || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Safety Requirements
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.safety_requirements || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Start Date
            </label>
            <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ formatDateTime(taskData.project_start_date) || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Deadline
            </label>
            <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ formatDateTime(taskData.project_deadline) || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Key Milestones
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.milestones || 'Not specified' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div v-show="activeTab === 'additional'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Additional Information</span>
        </h3>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.additional_notes || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Requests
            </label>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.special_requests || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prepared By
            </label>
            <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.prepared_by || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Action Items
            </label>
            <div class="text-sm text-gray-900 dark:text-white">
              <ul v-if="Array.isArray(formatList(taskData.action_items)) && formatList(taskData.action_items).length > 0" class="list-disc list-inside space-y-1">
                <li v-for="item in formatList(taskData.action_items)" :key="item">{{ item }}</li>
              </ul>
              <span v-else class="text-gray-500 dark:text-gray-400">No items specified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { EnquiryTask } from '../../../types/enquiry'


interface Props {
  task: EnquiryTask
  taskData: Record<string, unknown>
  enquiryId?: number
}

const props = defineProps<Props>()

console.log('[DEBUG] SurveyDataDisplay - COMPONENT MOUNTED/RECEIVING DATA:', {
  task: props.task,
  taskData: props.taskData,
  enquiryId: props.enquiryId,
  taskDataKeys: props.taskData ? Object.keys(props.taskData) : null,
  taskDataType: typeof props.taskData,
  taskDataIsNull: props.taskData === null,
  taskDataIsUndefined: props.taskData === undefined,
  taskDataIsEmpty: props.taskData && Object.keys(props.taskData).length === 0,
  sampleTaskData: props.taskData ? {
    id: (props.taskData as Record<string, unknown>).id,
    site_visit_date: (props.taskData as Record<string, unknown>).site_visit_date,
    client_name: (props.taskData as Record<string, unknown>).client_name,
    location: (props.taskData as Record<string, unknown>).location,
    project_description: (props.taskData as Record<string, unknown>).project_description as string | undefined
  } : null
})

const activeTab = ref('basic')

const tabs = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'assessment', label: 'Site Assessment' },
  { key: 'access', label: 'Access & Logistics' },
  { key: 'requirements', label: 'Requirements & Preferences' },
  { key: 'safety', label: 'Safety & Timeline' },
  { key: 'additional', label: 'Additional Information' }
]

// Utility functions
const formatDate = (dateString: unknown) => {
  if (!dateString || typeof dateString !== 'string') return null
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

const formatDateTime = (dateTimeString: unknown) => {
  if (!dateTimeString || typeof dateTimeString !== 'string') return null
  try {
    return new Date(dateTimeString).toLocaleString()
  } catch {
    return dateTimeString
  }
}

const formatList = (items: unknown) => {
  if (Array.isArray(items)) {
    return items
  }
  return []
}

onMounted(() => {
  console.log('[DEBUG] SurveyDataDisplay.onMounted - COMPONENT MOUNTED AND RENDERING:', {
    taskData: props.taskData,
    taskDataKeys: props.taskData ? Object.keys(props.taskData) : null,
    taskDataType: typeof props.taskData,
    hasData: !!props.taskData,
    isEmpty: props.taskData && Object.keys(props.taskData).length === 0,
    sampleData: props.taskData ? {
      id: (props.taskData as Record<string, unknown>).id,
      site_visit_date: (props.taskData as Record<string, unknown>).site_visit_date,
      client_name: (props.taskData as Record<string, unknown>).client_name,
      location: (props.taskData as Record<string, unknown>).location,
      project_description: (props.taskData as Record<string, unknown>).project_description as string | undefined
    } : null
  })
})
</script>

<style scoped>
.survey-data-display {
  max-width: none;
}
</style>
