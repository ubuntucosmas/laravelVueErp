<template>
  <div class="design-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <!-- Editable section - only show when not readonly (not completed) -->
    <div v-if="!readonly">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

      <!-- Error Display -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <span class="text-sm font-medium text-red-800 dark:text-red-200">Error</span>
        </div>
        <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
      </div>

      <!-- Success Display -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-sm font-medium text-green-800 dark:text-green-200">Success</span>
        </div>
        <p class="text-sm text-green-700 dark:text-green-300 mt-1">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Use TaskDataViewer for completed tasks -->
    <TaskDataViewer
      v-if="readonly"
      :task="task"
    />

    <div v-else class="space-y-6">
      <!-- Loading State -->
      <div v-if="isLoadingExistingData" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200">Loading existing design assets...</span>
        </div>
      </div>

      <!-- Design Assets Upload Section -->
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <div class="flex items-center space-x-2 mb-6">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Upload Design Assets</h3>
        </div>

        <div class="space-y-6">
          <!-- Category Selection -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asset Category
            </label>
            <select
              id="category"
              v-model="uploadData.category"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="concept">Concept</option>
              <option value="mockup">Mockup</option>
              <option value="artwork">Artwork</option>
              <option value="logo">Logo</option>
              <option value="ui-ux">UI/UX</option>
              <option value="illustration">Illustration</option>
              <option value="prototype">Prototype</option>
              <option value="presentation">Presentation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              v-model="uploadData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe these design assets"
            ></textarea>
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (Optional)
            </label>
            <input
              id="tags"
              v-model="tagsText"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter tags separated by commas"
              @input="parseTags"
            />
          </div>

          <!-- File Upload Section -->
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <div class="mt-4">
                <label for="file-upload" class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-white">Click to upload design assets</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" multiple accept=".jpeg,.png,.gif,.webp,.pdf,.ai,.psd,.sketch,.fig,.xd" @change="handleFileUpload" />
                </label>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF, WebP, PDF, AI, PSD, Sketch, Figma, XD up to 50MB each</p>
              </div>
            </div>
          </div>

          <!-- Selected Files List -->
          <div v-if="selectedFiles.length > 0" class="space-y-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Selected Files ({{ selectedFiles.length }})</h4>
            <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-md">
              <div class="flex items-center space-x-3">
                <!-- File type icon -->
                <div v-if="isImageFile(file.type)" class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div v-else-if="file.type.includes('pdf')" class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div v-else class="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                  <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ file.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(file.size) }} • {{ file.type || 'Unknown' }}</p>
                </div>
              </div>
              <button @click="removeFile(index)" class="text-red-500 hover:text-red-700 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Upload Progress -->
          <div v-if="isUploading" class="space-y-2">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Uploading...</span>
              <span>{{ uploadProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Design Task
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Design Task
          </button>
        </div>
        <div class="flex space-x-2">
          <button
            @click="handleUpload"
            :disabled="selectedFiles.length === 0 || isUploading"
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isUploading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
            <span v-else>Upload Assets</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/plugins/axios'
import type { EnquiryTask } from '../../types/enquiry'
import TaskDataViewer from './TaskDataViewer.vue'

interface Props {
  task: EnquiryTask
  readonly?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

// Upload data
const uploadData = ref({
  category: 'other',
  description: '',
  tags: [] as string[]
})

const selectedFiles = ref<File[]>([])
const tagsText = ref('')
const error = ref('')
const successMessage = ref('')
const isLoadingExistingData = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)

// Utility functions
const isImageFile = (mimeType: string): boolean => {
  return mimeType?.startsWith('image/')
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Methods
const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    // Validate file types and sizes
    const validFiles: File[] = []
    const maxSize = 50 * 1024 * 1024 // 50MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check file size
      if (file.size > maxSize) {
        error.value = `File "${file.name}" is too large. Maximum size is 50MB.`
        return
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/postscript', 'image/vnd.adobe.photoshop', 'application/octet-stream']
      const allowedExtensions = ['.ai', '.psd', '.sketch', '.fig', '.xd']

      const isValidType = allowedTypes.includes(file.type) ||
        allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

      if (!isValidType) {
        error.value = `File "${file.name}" has an unsupported format.`
        return
      }

      validFiles.push(file)
    }

    // Add valid files to selected files
    selectedFiles.value.push(...validFiles)

    // Clear any previous errors
    error.value = ''
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const parseTags = () => {
  const tags = tagsText.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  uploadData.value.tags = tags
}

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) {
    error.value = 'Please select at least one file to upload.'
    return
  }

  error.value = ''
  successMessage.value = ''
  isUploading.value = true
  uploadProgress.value = 0

  try {
    const formData = new FormData()

    // Add files
    selectedFiles.value.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })

    // Add metadata
    formData.append('category', uploadData.value.category)
    if (uploadData.value.description) {
      formData.append('description', uploadData.value.description)
    }
    if (uploadData.value.tags.length > 0) {
      uploadData.value.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag)
      })
    }

    // Upload to correct endpoint
    await api.post(`/api/projects/enquiry-tasks/${props.task.id}/design-assets`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
    })

    successMessage.value = `Successfully uploaded ${selectedFiles.value.length} design asset(s)!`

    // Clear form
    selectedFiles.value = []
    uploadData.value = {
      category: 'other',
      description: '',
      tags: []
    }
    tagsText.value = ''

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)

  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
    console.error('Upload error:', errorObj)

    if (errorObj.response?.data?.errors) {
      const errors = Object.values(errorObj.response.data.errors).flat().join(', ')
      error.value = `Upload failed: ${errors}`
    } else if (errorObj.response?.data?.message) {
      error.value = `Upload failed: ${errorObj.response.data.message}`
    } else {
      error.value = 'Upload failed. Please try again.'
    }
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// Function to load existing design data
const loadDesignData = async () => {
  error.value = ''
  successMessage.value = ''
  isLoadingExistingData.value = true

  try {
    // Load existing design assets for display
    await api.get(`/api/projects/enquiry-tasks/${props.task.id}/design-assets`)
    // The data will be displayed by TaskDataViewer when readonly
  } catch (loadError) {
    console.error('Error loading existing design data:', loadError)
    // Don't show error for loading existing data, as it's not critical
  } finally {
    isLoadingExistingData.value = false
  }
}

// Watch for task changes to load existing data
watch(() => props.task?.id, async (newTaskId, oldTaskId) => {
  try {
    console.log('[DEBUG] Design Task - Task ID changed:', {
      oldTaskId: oldTaskId,
      newTaskId: newTaskId,
      taskStatus: props.task?.status,
      readonly: props.readonly,
      project_enquiry_id: props.task?.project_enquiry_id
    })

    if (!props.task) {
      console.warn('[DEBUG] Task object is not available in watcher')
      return
    }

    await loadDesignData()
  } catch (watcherError) {
    console.error('[DEBUG] Error in design task watcher callback:', watcherError)
    error.value = 'Failed to load design data. Please refresh the page.'
    isLoadingExistingData.value = false
  }
}, { immediate: true })
</script>
<style scoped>
.design-task {
  max-width: none;
}
</style>
