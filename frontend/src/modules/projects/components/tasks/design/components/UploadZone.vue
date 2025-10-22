<template>
  <div
    class="upload-zone relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group"
    :class="[
      isDragOver
        ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50',
      { 'opacity-50 pointer-events-none': isUploading }
    ]"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    @click="triggerFileUpload"
    role="button"
    tabindex="0"
    :aria-label="uploadLabel"
    @keydown.enter="triggerFileUpload"
    @keydown.space="triggerFileUpload"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      :accept="acceptedTypes"
      @change="handleFileSelect"
      class="hidden"
      :aria-label="fileInputLabel"
    />

    <!-- Upload Icon and Content -->
    <div class="upload-content pointer-events-none">
      <div class="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
        <svg
          v-if="!isUploading"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3 3V4"
          />
        </svg>

        <!-- Loading Spinner -->
        <div v-else class="animate-spin">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-gray-700 mb-2 group-hover:text-blue-700 transition-colors duration-200">
        {{ isUploading ? 'Uploading files...' : 'Drop your design files here or click to browse' }}
      </h3>

      <p class="text-gray-500 mb-6 group-hover:text-blue-600 transition-colors duration-200">
        {{ acceptedFormatsText }}
      </p>

      <!-- File Type Tags -->
      <div class="flex flex-wrap justify-center gap-2 mb-4">
        <span
          v-for="type in supportedTypes"
          :key="type.key"
          class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full transition-colors duration-200 hover:bg-blue-200"
        >
          {{ type.label }}
        </span>
      </div>

      <!-- Upload Progress -->
      <div v-if="isUploading && totalProgress > 0" class="w-full max-w-xs mx-auto">
        <div class="bg-gray-200 rounded-full h-2 mb-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${totalProgress}%` }"
          />
        </div>
        <p class="text-sm text-gray-600">
          {{ Math.round(totalProgress) }}% uploaded
        </p>
      </div>

      <!-- Upload Limits Info -->
      <div class="text-xs text-gray-400 mt-4">
        <p>Maximum file size: {{ formatFileSize(maxFileSize) }}</p>
        <p>Maximum files: {{ maxFiles }}</p>
      </div>
    </div>

    <!-- Drag Overlay -->
    <div
      v-if="isDragOver"
      class="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center pointer-events-none"
    >
      <div class="text-blue-700 font-semibold text-lg">
        Drop files here
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  isUploading?: boolean
  totalProgress?: number
  maxFileSize?: number
  maxFiles?: number
  acceptedTypes?: string
}

interface Emits {
  (e: 'files-selected', files: File[]): void
  (e: 'drag-over'): void
  (e: 'drag-leave'): void
}

const props = withDefaults(defineProps<Props>(), {
  isUploading: false,
  totalProgress: 0,
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 10,
  acceptedTypes: 'image/*,.pdf,.ai,.psd,.sketch,.fig,.xd',
})

const emit = defineEmits<Emits>()

// Template refs
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)

// Computed properties
const uploadLabel = computed(() =>
  props.isUploading
    ? 'Upload in progress'
    : 'Click to select design files or drag and drop them here'
)

const fileInputLabel = computed(() =>
  'Select design files (images, PDFs, design files)'
)

const acceptedFormatsText = computed(() => {
  const formats = [
    'JPG, PNG, GIF, WebP',
    'PDF documents',
    'AI, PSD, Sketch, Figma, XD files'
  ]
  return `Supports: ${formats.join(', ')}`
})

const supportedTypes = computed(() => [
  { key: 'images', label: 'Images' },
  { key: 'documents', label: 'PDFs' },
  { key: 'designs', label: 'Design Files' },
  { key: 'prototypes', label: 'Prototypes' },
])

// Methods
const triggerFileUpload = () => {
  if (!props.isUploading) {
    fileInput.value?.click()
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
  emit('drag-over')
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  // Only emit leave if we're actually leaving the drop zone
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragOver.value = false
    emit('drag-leave')
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  emit('drag-leave')

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFiles(Array.from(files))
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFiles(Array.from(files))
  }
  // Reset input value to allow selecting the same file again
  target.value = ''
}

const processFiles = (files: File[]) => {
  // Filter out invalid files and limit count
  const validFiles = files.slice(0, props.maxFiles)
  emit('files-selected', validFiles)
}

const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

</script>

<style scoped>
.upload-zone {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-zone:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.upload-zone:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .upload-zone,
  .upload-zone * {
    transition: none !important;
    animation: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .upload-zone {
    border-width: 3px;
  }
}
</style>
