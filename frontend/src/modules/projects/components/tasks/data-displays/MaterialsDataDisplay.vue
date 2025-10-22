<template>
  <div class="materials-data-display">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="flex space-x-8" aria-label="Materials Data Tabs">
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

    <!-- Materials Request Information -->
    <div v-show="activeTab === 'request'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span>Materials Request</span>
          </h3>
          <button
            @click="toggleEdit('request')"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg v-if="!isEditing.request" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {{ isEditing.request ? 'Cancel Edit' : 'Edit' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Request Date <span class="text-red-500">*</span>
            </label>
            <input
              v-if="isEditing.request"
              v-model="formData.request_date"
              type="date"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                fieldValidationState.request_date === 'invalid' ? 'border-red-500 dark:border-red-400' :
                fieldValidationState.request_date === 'valid' ? 'border-green-500 dark:border-green-400' :
                'border-gray-300 dark:border-gray-600'
              ]"
            />
            <div v-if="isEditing.request && validationErrors.request_date && validationErrors.request_date.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.request_date[0] }}
            </div>
            <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ formatDate(taskData.request_date) || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Required By Date <span class="text-red-500">*</span>
            </label>
            <input
              v-if="isEditing.request"
              v-model="formData.required_by_date"
              type="date"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                fieldValidationState.required_by_date === 'invalid' ? 'border-red-500 dark:border-red-400' :
                fieldValidationState.required_by_date === 'valid' ? 'border-green-500 dark:border-green-400' :
                'border-gray-300 dark:border-gray-600'
              ]"
            />
            <div v-if="isEditing.request && validationErrors.required_by_date && validationErrors.required_by_date.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.required_by_date[0] }}
            </div>
            <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ formatDate(taskData.required_by_date) || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority Level
            </label>
            <select
              v-if="isEditing.request"
              v-model="formData.priority"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'border-gray-300 dark:border-gray-600'
              ]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ typeof taskData.priority === 'string' ? taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1) : 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <input
              v-if="isEditing.request"
              v-model="formData.department"
              type="text"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter department"
            />
            <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.department || 'Not specified' }}
            </div>
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Purpose/Description <span class="text-red-500">*</span>
          </label>
          <textarea
            v-if="isEditing.request"
            v-model="formData.purpose"
            rows="4"
            :class="[
              'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              fieldValidationState.purpose === 'invalid' ? 'border-red-500 dark:border-red-400' :
              fieldValidationState.purpose === 'valid' ? 'border-green-500 dark:border-green-400' :
              'border-gray-300 dark:border-gray-600'
            ]"
            placeholder="Enter purpose or description"
          ></textarea>
          <div v-if="isEditing.request && validationErrors.purpose && validationErrors.purpose.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ validationErrors.purpose[0] }}
          </div>
          <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            {{ taskData.purpose || 'Not specified' }}
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <span class="text-sm font-medium text-red-800 dark:text-red-200">Error</span>
          </div>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
        </div>

        <!-- Success Display -->
        <div v-if="successMessage" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm font-medium text-green-800 dark:text-green-200">Success</span>
          </div>
          <p class="text-sm text-green-700 dark:text-green-300 mt-1">{{ successMessage }}</p>
        </div>

        <div v-if="isEditing.request" class="mt-6 flex justify-end space-x-3">
          <button
            @click="cancelEdit('request')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            @click="saveEdit('request')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Materials List -->
    <div v-show="activeTab === 'materials'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span>Materials List</span>
          </h3>
          <button
            @click="toggleEdit('materials')"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg v-if="!isEditing.materials" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {{ isEditing.materials ? 'Cancel Edit' : 'Edit' }}
          </button>
        </div>

        <!-- Materials Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Specifications</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(material, index) in displayMaterials" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ material.name || 'Not specified' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ material.quantity || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ material.unit || 'N/A' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {{ material.specifications || 'Not specified' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    material.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    material.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    material.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  ]">
                    {{ material.status ? material.status.charAt(0).toUpperCase() + material.status.slice(1) : 'Unknown' }}
                  </span>
                </td>
              </tr>
              <tr v-if="displayMaterials.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No materials specified
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="isEditing.materials" class="mt-6 flex justify-end space-x-3">
          <button
            @click="cancelEdit('materials')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            @click="saveEdit('materials')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Approval & Status -->
    <div v-show="activeTab === 'approval'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Approval & Status</span>
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Overall Status
            </label>
            <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                taskData.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                taskData.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                taskData.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              ]">
                {{ typeof taskData.status === 'string' ? taskData.status.charAt(0).toUpperCase() + taskData.status.slice(1) : 'Unknown' }}
              </span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Approved By
            </label>
            <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.approved_by || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Approval Date
            </label>
            <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ formatDate(taskData.approval_date) || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Estimated Cost
            </label>
            <div class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.total_cost ? `$${taskData.total_cost}` : 'Not specified' }}
            </div>
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Approval Notes
          </label>
          <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            {{ taskData.approval_notes || 'No approval notes available' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { EnquiryTask } from '../../../types/enquiry'

interface Props {
  task: EnquiryTask
  taskData: Record<string, unknown>
  enquiryId?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [payload: { tab: string; data: Record<string, unknown> }]
  cancel: [payload: { tab: string }]
  'update:taskData': [data: Record<string, unknown>]
}>()

const activeTab = ref('request')

const tabs = [
  { key: 'request', label: 'Request Info' },
  { key: 'materials', label: 'Materials List' },
  { key: 'approval', label: 'Approval & Status' }
]

const isEditing = reactive({
  request: false,
  materials: false
})

const formData = ref<Record<string, unknown>>({ ...props.taskData })

// Reactive states for API operations
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

// Validation state
interface ValidationErrors {
  [key: string]: string[]
}

const validationErrors = reactive<ValidationErrors>({})
const fieldValidationState = reactive<Record<string, 'valid' | 'invalid' | 'pending'>>({})

// Validation rules
const validationRules = {
  request_date: { required: true, type: 'date' },
  required_by_date: { required: true, type: 'date' },
  purpose: { required: true, type: 'string', minLength: 10 }
}

// Computed property for materials list
const displayMaterials = computed(() => {
  if (Array.isArray(props.taskData.materials)) {
    return props.taskData.materials
  }
  return []
})

// Validation functions
const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

const validateField = (fieldName: string, value: unknown): string[] => {
  const errors: string[] = []
  const rule = validationRules[fieldName as keyof typeof validationRules]

  if (!rule) return errors

  // Check required
  if (rule.required) {
    if (value === null || value === undefined || value === '') {
      errors.push('This field is required')
      return errors
    }
  } else {
    // If not required and empty, skip other validations
    if (value === null || value === undefined || value === '') {
      return errors
    }
  }

  // Type-specific validation
  const stringValue = String(value)

  switch (rule.type) {
    case 'date':
      if (!validateDate(stringValue)) {
        errors.push('Please enter a valid date')
      }
      break
    case 'string':
      if ('minLength' in rule && rule.minLength && stringValue.length < rule.minLength) {
        errors.push(`Minimum ${rule.minLength} characters required`)
      }
      break
  }

  return errors
}

const validateForm = (tab: string): boolean => {
  const tabFields = getTabFields(tab)
  let isValid = true

  tabFields.forEach(field => {
    const errors = validateField(field, formData.value[field])
    validationErrors[field] = errors
    fieldValidationState[field] = errors.length > 0 ? 'invalid' : 'valid'
    if (errors.length > 0) isValid = false
  })

  return isValid
}

const getTabFields = (tab: string): string[] => {
  const tabFieldMap = {
    request: ['request_date', 'required_by_date', 'purpose'],
    materials: []
  }
  return tabFieldMap[tab as keyof typeof tabFieldMap] || []
}

const toggleEdit = (tab: keyof typeof isEditing) => {
  isEditing[tab] = !isEditing[tab]
  if (isEditing[tab]) {
    formData.value = { ...props.taskData }
    // Clear any previous messages
    error.value = ''
    successMessage.value = ''
    // Clear validation errors for this tab
    const tabFields = getTabFields(tab)
    tabFields.forEach(field => {
      validationErrors[field] = []
      fieldValidationState[field] = 'pending'
    })
  }
}

const saveEdit = async (tab: keyof typeof isEditing) => {
  if (!props.taskData?.id) {
    error.value = 'Materials request data not found. Cannot save changes.'
    return
  }

  // Validate form before submission
  if (!validateForm(tab)) {
    error.value = 'Please fix the validation errors before saving.'
    return
  }

  error.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const requestId = props.taskData.id as number
    const payload = {
      ...formData.value,
      // Include updated_at for optimistic concurrency control
      updated_at: props.taskData.updated_at
    }

    console.log('[DEBUG] MaterialsDataDisplay.saveEdit - Making PATCH request:', {
      requestId,
      payload,
      tab
    })

    // Note: You'll need to implement the actual API endpoint
    // const response = await api.patch(`/api/projects/materials-requests/${requestId}`, payload)

    // For now, simulate success
    emit('update:taskData', payload)

    successMessage.value = 'Changes saved successfully!'
    isEditing[tab] = false

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (err: unknown) {
    console.error('[DEBUG] MaterialsDataDisplay.saveEdit - Error:', err)

    const errorObj = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }

    if (errorObj.response?.status === 409) {
      // Concurrent edit conflict
      error.value = 'This materials request has been modified by another user. Please refresh and try again.'
    } else if (errorObj.response?.status === 422) {
      // Validation errors
      const validationErrors = errorObj.response.data?.errors
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join(', ')
        error.value = `Validation failed: ${errorMessages}`
      } else {
        error.value = errorObj.response.data?.message || 'Validation failed. Please check your input.'
      }
    } else if (errorObj.response?.status === 403) {
      error.value = 'You do not have permission to edit this materials request.'
    } else if (errorObj.response?.status === 404) {
      error.value = 'Materials request not found. It may have been deleted.'
    } else {
      error.value = errorObj.response?.data?.message || 'Failed to save changes. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const cancelEdit = (tab: keyof typeof isEditing) => {
  emit('cancel', { tab })
  isEditing[tab] = false
  formData.value = { ...props.taskData }
  // Clear any messages
  error.value = ''
  successMessage.value = ''
}

// Utility functions
const formatDate = (dateString: unknown) => {
  if (!dateString || typeof dateString !== 'string') return null
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.materials-data-display {
  max-width: none;
}
</style>
