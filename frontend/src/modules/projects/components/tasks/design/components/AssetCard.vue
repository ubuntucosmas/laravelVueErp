<template>
  <div
    class="asset-card group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    :class="{ 'ring-2 ring-blue-500 ring-opacity-50': isSelected }"
  >
    <!-- Asset Preview -->
    <div class="relative aspect-video bg-gray-100 overflow-hidden">
      <img
        v-if="isImageAsset"
        :src="asset.preview || asset.url"
        :alt="asset.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Non-image preview -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
      >
        <component
          :is="fileIconComponent"
          class="w-12 h-12 text-gray-500 transition-colors duration-200 group-hover:text-blue-500"
          aria-hidden="true"
        />
      </div>

      <!-- Status Badge / Dropdown -->
      <div class="absolute top-3 right-3">
        <div v-if="!isEditingStatus" class="relative">
          <span
            :class="statusBadgeClasses"
            class="px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
            @click="startEditingStatus"
            :title="'Click to change status'"
          >
            {{ asset.status }}
          </span>
        </div>

        <!-- Status Update Dropdown -->
        <div v-else class="relative">
          <select
            ref="statusSelect"
            :value="asset.status"
            @change="handleStatusChange"
            @blur="cancelStatusEdit"
            @keyup.escape="cancelStatusEdit"
            class="px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm shadow-sm bg-white border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="isUpdatingStatus"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="revision">Revision</option>
            <option value="archived">Archived</option>
          </select>

          <!-- Loading spinner for status update -->
          <div v-if="isUpdatingStatus" class="absolute right-1 top-1/2 transform -translate-y-1/2">
            <div class="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
          </div>
        </div>
      </div>

      <!-- Category Badge -->
      <div class="absolute top-3 left-3">
        <span class="px-2 py-1 text-xs font-medium bg-gray-800 bg-opacity-75 text-white rounded-full backdrop-blur-sm">
          {{ asset.category }}
        </span>
      </div>

      <!-- Selection Checkbox -->
      <div
        v-if="showSelection"
        class="absolute top-3 left-3"
      >
        <input
          :id="`asset-${asset.id}`"
          type="checkbox"
          :checked="isSelected"
          @change="$emit('toggle-selection', asset.id)"
          class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          :aria-label="`Select ${asset.name}`"
        />
      </div>

      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </div>

    <!-- Asset Info -->
    <div class="p-4">
      <h4
        class="font-semibold text-gray-900 mb-1 truncate"
        :title="asset.name"
      >
        {{ asset.name }}
      </h4>

      <p class="text-sm text-gray-500 mb-2 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z"/>
        </svg>
        {{ formatFileSize(asset.sizeBytes) }}
      </p>

      <p class="text-xs text-gray-400 mb-4 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ formatDate(asset.uploadedAt) }}
      </p>

      <!-- Tags -->
      <div v-if="asset.tags && asset.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
        <span
          v-for="tag in asset.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
        >
          {{ tag }}
        </span>
        <span
          v-if="asset.tags.length > 3"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
        >
          +{{ asset.tags.length - 3 }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="$emit('preview', asset)"
          class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :title="'Preview ' + asset.name"
          :aria-label="'Preview ' + asset.name"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        </button>

        <button
          @click="$emit('download', asset)"
          class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          :title="'Download ' + asset.name"
          :aria-label="'Download ' + asset.name"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </button>

        <button
          @click="$emit('share', asset)"
          class="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          :title="'Share ' + asset.name"
          :aria-label="'Share ' + asset.name"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
        </button>

        <button
          @click="$emit('delete', asset)"
          class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          :title="'Delete ' + asset.name"
          :aria-label="'Delete ' + asset.name"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>

      <!-- Error State -->
      <div
        v-if="asset.error"
        class="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg"
      >
        <p class="text-xs text-red-700">{{ asset.error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, nextTick } from 'vue'
import type { DesignAsset } from '../types/design'

interface Props {
  asset: DesignAsset
  isSelected?: boolean
  showSelection?: boolean
  isLoading?: boolean
  isUpdatingStatus?: boolean
}

interface Emits {
  (e: 'preview', asset: DesignAsset): void
  (e: 'download', asset: DesignAsset): void
  (e: 'share', asset: DesignAsset): void
  (e: 'delete', asset: DesignAsset): void
  (e: 'toggle-selection', assetId: string): void
  (e: 'update-status', assetId: string, status: DesignAsset['status']): void
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  showSelection: false,
  isLoading: false,
  isUpdatingStatus: false,
})

const emit = defineEmits<Emits>()

// Computed properties
const isImageAsset = computed(() => props.asset.type.startsWith('image/'))

const statusBadgeClasses = computed(() => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm shadow-sm'

  switch (props.asset.status) {
    case 'approved':
      return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
    case 'rejected':
      return `${baseClasses} bg-red-100 text-red-800 border border-red-200`
    case 'revision':
      return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`
    default:
      return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`
  }
})

const fileIconComponent = computed(() => {
  if (props.asset.type.startsWith('image/')) {
    return h('svg', {
      class: 'w-12 h-12',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
      })
    ])
  }

  if (props.asset.type === 'application/pdf') {
    return h('svg', {
      class: 'w-12 h-12',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      })
    ])
  }

  return h('svg', {
    class: 'w-12 h-12',
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    })
  ])
})

// Reactive data
const isEditingStatus = ref(false)
const statusSelect = ref<HTMLSelectElement>()

// Methods
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.png' // Fallback image
}

const startEditingStatus = () => {
  isEditingStatus.value = true
  // Focus the select element after it's rendered
  nextTick(() => {
    statusSelect.value?.focus()
  })
}

const cancelStatusEdit = () => {
  isEditingStatus.value = false
}

const handleStatusChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newStatus = target.value as DesignAsset['status']

  if (newStatus !== props.asset.status) {
    emit('update-status', props.asset.id, newStatus)
  }

  isEditingStatus.value = false
}

const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'today'
  if (diffDays === 2) return 'yesterday'
  if (diffDays <= 7) return `${diffDays} days ago`

  return date.toLocaleDateString()
}
</script>

<style scoped>
.asset-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.asset-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Focus states for accessibility */
.asset-card button:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .asset-card,
  .asset-card * {
    transition: none !important;
    animation: none !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .asset-card {
    border-width: 2px;
  }
}
</style>
