<template>
  <div class="design-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
        </svg>
        <span>Design & Concept Development</span>
      </h3>

      <!-- Design Assets Grid -->
      <div v-if="Array.isArray(taskData) && taskData.length > 0" class="mb-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">Uploaded Design Assets ({{ taskData.length }})</h4>
        {{ console.log('DesignDataDisplay: taskData is array with length:', taskData.length, taskData) }}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="asset in taskData"
            :key="asset.id"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div v-if="isImageFile(asset.mime_type)" class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div v-else class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate" :title="asset.original_name || asset.name">
                  {{ asset.original_name || asset.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(asset.file_size) }} • {{ asset.category || 'Other' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Status: <span :class="getStatusClass(asset.status)">{{ asset.status }}</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Uploaded: {{ formatDate(asset.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fallback for non-array data -->
      <div v-else class="space-y-4">
        {{ console.log('DesignDataDisplay: taskData is not array, using fallback:', taskData) }}
        <DataField label="Design Concept" :value="taskData.design_concept" type="textarea" />
        <DataField label="Design Files" :value="taskData.design_files" type="textarea" />
        <DataField label="Color Palette" :value="taskData.color_palette" />
        <DataField label="Design Software" :value="taskData.design_software" />
        <DataField label="Mockup Links" :value="taskData.mockup_links" type="textarea" />
        <DataField label="Client Feedback" :value="taskData.client_feedback" type="textarea" />
        <DataField label="Revisions Count" :value="taskData.revisions_count" />
        <DataField label="Final Approval Date" :value="formatDate(taskData.final_approval_date)" />
        <DataField label="Designer Notes" :value="taskData.designer_notes" type="textarea" />
        <DataField label="Status" :value="taskData.status" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnquiryTask } from '../../../types/enquiry'

// Reusable Data Field Component
const DataField = {
  props: {
    label: String,
    value: [String, Number],
    type: { type: String, default: 'text' }
  },
  template: `
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {{ label }}
      </label>
      <div v-if="type === 'textarea'" class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
        {{ value || 'Not specified' }}
      </div>
      <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
        {{ value || 'Not specified' }}
      </div>
    </div>
  `
}

interface Props {
  task: EnquiryTask
  taskData: Record<string, unknown>
}

defineProps<Props>()

// Utility functions
const formatDate = (dateString: unknown) => {
  if (!dateString || typeof dateString !== 'string') return null
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

const isImageFile = (mimeType: string): boolean => {
  return mimeType?.startsWith('image/')
}

const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'approved': return 'text-green-600 font-medium'
    case 'rejected': return 'text-red-600 font-medium'
    case 'revision': return 'text-yellow-600 font-medium'
    default: return 'text-gray-600'
  }
}
</script>

<style scoped>
.design-data-display {
  max-width: none;
}
</style>
