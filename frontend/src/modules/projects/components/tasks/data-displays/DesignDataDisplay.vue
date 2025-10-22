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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="asset in taskData"
            :key="(asset as Record<string, unknown>).id as string"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <!-- File type icon based on mime type -->
                <div v-if="isImageFile((asset as Record<string, unknown>).mime_type as string)" class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center cursor-pointer" @click="previewAsset(asset)">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div v-else-if="((asset as Record<string, unknown>).mime_type as string)?.includes('pdf')" class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center cursor-pointer" @click="previewAsset(asset)">
                  <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div v-else class="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center cursor-pointer" @click="previewAsset(asset)">
                  <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate" :title="((asset as Record<string, unknown>).original_name || (asset as Record<string, unknown>).name) as string">
                  {{ (asset as Record<string, unknown>).original_name || (asset as Record<string, unknown>).name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ formatFileSize((asset as Record<string, unknown>).file_size as number) }}
                  <span v-if="(asset as Record<string, unknown>).mime_type" class="ml-1">• {{ (asset as Record<string, unknown>).mime_type }}</span>
                </p>
                <div class="flex items-center justify-between mt-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="getStatusClass((asset as Record<string, unknown>).status as string)">
                    {{ (asset as Record<string, unknown>).status || 'uploaded' }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate((asset as Record<string, unknown>).created_at as string) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No design assets uploaded -->
      <div v-else class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No design assets uploaded</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Design assets will be displayed here once they are uploaded.
        </p>
      </div>

      <!-- Preview Modal -->
      <div v-if="showPreviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closePreview">
        <div class="bg-white dark:bg-gray-800 rounded-lg max-w-7xl max-h-[90vh] overflow-hidden" @click.stop>
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ previewAssetData?.original_name || previewAssetData?.name }}
            </h3>
            <button @click="closePreview" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="p-4 max-h-[70vh] overflow-auto">
            <div v-if="isImageFile(previewAssetData?.mime_type as string)" class="text-center">
              <img :src="getFileUrl(previewAssetData!)" :alt="previewAssetData?.original_name as string" class="max-w-full max-h-[60vh] object-contain mx-auto" />
            </div>
            <div v-else-if="(previewAssetData?.mime_type as string)?.includes('pdf')" class="text-center">
              <iframe :src="getFileUrl(previewAssetData!)" class="w-full h-[60vh] border-0"></iframe>
            </div>
            <div v-else class="text-center py-8">
              <!-- Try to display file content based on type -->
              <div v-if="isLoadingContent" class="flex items-center justify-center">
                <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="ml-2 text-gray-600 dark:text-gray-400">Loading content...</span>
              </div>
              <div v-else-if="fileContent" class="text-left">
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-900 dark:text-white whitespace-pre-wrap max-h-96 overflow-auto">{{ fileContent }}</pre>
              </div>
              <div v-else-if="(previewAssetData?.mime_type as string)?.includes('text') || (previewAssetData?.original_name as string)?.endsWith('.txt') || (previewAssetData?.original_name as string)?.endsWith('.md')" class="text-left">
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-900 dark:text-white whitespace-pre-wrap max-h-96 overflow-auto">{{ fileContent }}</pre>
              </div>
              <div v-else-if="(previewAssetData?.mime_type as string)?.includes('json') || (previewAssetData?.original_name as string)?.endsWith('.json')" class="text-left">
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-900 dark:text-white whitespace-pre-wrap max-h-96 overflow-auto">{{ fileContent }}</pre>
              </div>
              <div v-else-if="(previewAssetData?.mime_type as string)?.includes('xml') || (previewAssetData?.original_name as string)?.endsWith('.xml')" class="text-left">
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-900 dark:text-white whitespace-pre-wrap max-h-96 overflow-auto">{{ fileContent }}</pre>
              </div>
              <div v-else-if="(previewAssetData?.mime_type as string)?.includes('csv') || (previewAssetData?.original_name as string)?.endsWith('.csv')" class="text-left">
                <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-900 dark:text-white whitespace-pre-wrap max-h-96 overflow-auto">{{ fileContent }}</pre>
              </div>
              <div v-else-if="(previewAssetData?.original_name as string)?.endsWith('.ai') || (previewAssetData?.original_name as string)?.endsWith('.psd') || (previewAssetData?.original_name as string)?.endsWith('.sketch')" class="text-center">
                <svg class="mx-auto h-16 w-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                </svg>
                <p class="mt-4 text-gray-500 dark:text-gray-400">Design file - {{ previewAssetData?.original_name }}</p>
                <p class="text-sm text-gray-400 dark:text-gray-500">This is a design file that requires specific software to view</p>
              </div>
              <div v-else>
                <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="mt-4 text-gray-500 dark:text-gray-400">File preview not available</p>
                <p class="text-sm text-gray-400 dark:text-gray-500">{{ previewAssetData?.mime_type || 'Unknown type' }} • {{ formatFileSize(previewAssetData?.file_size as number) }}</p>
              </div>
              <a :href="getFileUrl(previewAssetData!)" target="_blank" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Download File
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { EnquiryTask } from '../../../types/enquiry'

interface Props {
  task: EnquiryTask
  taskData: Record<string, unknown> | Record<string, unknown>[]
}

defineProps<Props>()

// Preview modal state
const showPreviewModal = ref(false)
const previewAssetData = ref<Record<string, unknown> | null>(null)
const fileContent = ref('')
const isLoadingContent = ref(false)

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
    case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900'
    case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900'
    case 'revision': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
  }
}

// Preview functions
const previewAsset = async (asset: Record<string, unknown>) => {
  previewAssetData.value = asset
  showPreviewModal.value = true

  // Try to load file content for text-based files
  const mimeType = asset.mime_type as string
  const fileName = (asset.original_name || asset.name) as string

  if (mimeType?.includes('text') ||
      fileName?.endsWith('.txt') ||
      fileName?.endsWith('.md') ||
      mimeType?.includes('json') ||
      fileName?.endsWith('.json') ||
      mimeType?.includes('xml') ||
      fileName?.endsWith('.xml') ||
      mimeType?.includes('csv') ||
      fileName?.endsWith('.csv')) {

    isLoadingContent.value = true
    fileContent.value = ''

    try {
      const response = await fetch(getFileUrl(asset))
      if (response.ok) {
        const text = await response.text()
        // Limit content to prevent huge files from crashing the browser
        fileContent.value = text.length > 50000 ? text.substring(0, 50000) + '\n\n[Content truncated - file too large]' : text
      }
    } catch (error) {
      console.error('Error loading file content:', error)
      fileContent.value = 'Error loading file content'
    } finally {
      isLoadingContent.value = false
    }
  }
}

const closePreview = () => {
  showPreviewModal.value = false
  previewAssetData.value = null
}

const getFileUrl = (asset: Record<string, unknown>) => {
  const filePath = asset.file_path as string
  if (filePath) {
    // Use the backend URL since that's where the storage link is created
    return `http://localhost:8000/storage/${filePath}`
  }
  return ''
}
</script>

<style scoped>
.design-data-display {
  max-width: none;
}
</style>
