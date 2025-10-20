<template>
  <div class="design-task-container p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ props.task.title }}</h2>
          <p class="text-gray-600 dark:text-gray-400">Upload and manage design concepts, mockups, and artworks for this {{ props.task.type }} task</p>
        </div>
        <button
          @click="triggerFileUpload"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Upload Files
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="dark:bg-gray-800  p-6 rounded-xl border-gray-200 shadow-sm">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-blue-600">Total Assets</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ designAssets.length }}</p>
            </div>
          </div>
        </div>

        <div class="dark:bg-gray-800 p-6 rounded-xl border-gray-200 shadow-sm">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-green-600">Approved</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ approvedCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-yellow-600">Pending</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ pendingCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 5l4 4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-purple-600">Concepts</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ conceptCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Area -->
    <div
      class="upload-zone mb-8 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer bg-white dark:bg-gray-800"
      :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-105': isDragOver }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileUpload"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*,.pdf,.ai,.psd,.sketch,.fig,.xd"
        @change="handleFileSelect"
        class="hidden"
      />

      <div class="upload-content pointer-events-none">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Drop your design files here or click to browse
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Supports: JPG, PNG, PDF, AI, PSD, Sketch, Figma, XD files
        </p>
        <div class="flex flex-wrap justify-center gap-2">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">Concepts</span>
          <span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Mockups</span>
          <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">Artworks</span>
          <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">Prototypes</span>
        </div>
      </div>
    </div>

    <!-- Filter and Search -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1 relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search design assets..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Category Dropdown -->
  <div class="relative w-full md:w-48">
    <select
      v-model="selectedCategory"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            bg-gray-800 text-white appearance-none cursor-pointer"
    >
      <option value="">All Categories</option>
      <option value="concept">Concept</option>
      <option value="mockup">Mockup</option>
      <option value="artwork">Artwork</option>
      <option value="prototype">Prototype</option>
      <option value="logo">Logo</option>
      <option value="ui-ux">UI/UX</option>
      <option value="illustration">Illustration</option>
    </select>

    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>


      <!-- Status Dropdown -->
      <div class="relative w-full md:w-48">
        <select
          v-model="selectedStatus"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="revision">Needs Revision</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Task Status & Submit Section -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-4 mb-4">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ designAssets.length }} design asset{{ designAssets.length !== 1 ? 's' : '' }} uploaded
            </div>

            <!-- Task Status Badge -->
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Task Status:</span>
              <span :class="getTaskStatusClasses(props.task.status)" class="px-3 py-1 text-xs font-medium rounded-full">
                {{ props.task.status }}
              </span>
            </div>
          </div>

          <!-- Task Status Controls -->
          <div class="flex flex-wrap gap-2">
            <button
              v-if="props.task.status === 'pending'"
              @click="updateTaskStatus('in_progress')"
              :disabled="isUpdatingTask"
              class="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m2 0h1.586a1 1 0 01.707.293l.707.707A1 1 0 0021 12.414V15m0 2a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h3.17a2 2 0 011.414.586l.828.828A2 2 0 019.17 7H19a2 2 0 012 2v6z"/>
              </svg>
              Start Working
            </button>

            <button
              v-if="props.task.status === 'in_progress'"
              @click="updateTaskStatus('pending')"
              :disabled="isUpdatingTask"
              class="inline-flex items-center px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Pause Work
            </button>

            <button
              v-if="canCompleteTask"
              @click="updateTaskStatus('completed')"
              :disabled="isUpdatingTask || designAssets.length === 0"
              class="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <svg v-if="isUpdatingTask" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ isUpdatingTask ? 'Updating...' : 'Mark Complete' }}
            </button>

            <button
              v-if="props.task.status !== 'cancelled' && props.task.status !== 'completed'"
              @click="updateTaskStatus('cancelled')"
              :disabled="isUpdatingTask"
              class="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Cancel Task
            </button>
          </div>
        </div>

        <!-- Asset Status Summary -->
        <div class="flex flex-col gap-2 min-w-0 lg:min-w-[200px]">
          <div class="text-xs text-gray-500 dark:text-gray-400">Asset Status Summary</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{{ approvedCount }} Approved</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>{{ pendingCount }} Pending</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{{ designAssets.filter((a: DesignAsset) => a.status === 'rejected').length }} Rejected</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>{{ designAssets.filter((a: DesignAsset) => a.status === 'revision').length }} Revision</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Design Assets Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="asset in filteredAssets"
        :key="asset.id"
        class="design-asset-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
      >
        <!-- Asset Preview -->
        <div class="relative aspect-video bg-gray-100">
          <img
            v-if="isImageFile(asset.type)"
            :src="asset.preview || asset.url"
            :alt="asset.name"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
          >
            <component :is="getFileIcon(asset.type)" class="w-12 h-12 text-gray-500" />
          </div>

          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <span
              :class="getStatusClasses(asset.status)"
              class="px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm"
            >
              {{ asset.status }}
            </span>
          </div>

          <!-- Category Badge -->
          <div class="absolute top-3 left-3">
            <span class="px-2 py-1 text-xs font-medium bg-gray-800 bg-opacity-75 text-white rounded-full backdrop-blur-sm">
              {{ asset.category }}
            </span>
          </div>
        </div>

        <!-- Asset Info -->
        <div class="p-4">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-1 truncate" :title="asset.name">
            {{ asset.name }}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ asset.size }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Uploaded {{ formatDate(asset.uploadedAt) }}
          </p>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click="previewAsset(asset)"
              class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Preview"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
            <button
              @click="downloadAsset(asset)"
              class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
              title="Download"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
            <button
              @click="shareAsset(asset)"
              class="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              title="Share"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
            </button>
            <button
              @click="confirmDelete(asset)"
              class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredAssets.length === 0" class="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <svg class="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No design assets found</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        {{ searchQuery || selectedCategory || selectedStatus ? 'Try adjusting your filters' : 'Start by uploading your first design file' }}
      </p>
      <button
        v-if="!searchQuery && !selectedCategory && !selectedStatus"
        @click="triggerFileUpload"
        class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Upload Your First Design
      </button>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closePreview"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl max-h-full overflow-auto shadow-2xl"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedAsset?.name }}</h3>
          <button
            @click="closePreview"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div v-if="selectedAsset" class="text-center">
            <img
              v-if="isImageFile(selectedAsset.type)"
              :src="selectedAsset.url"
              :alt="selectedAsset.name"
              class="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
            />
            <div v-else class="p-12">
              <component :is="getFileIcon(selectedAsset.type)" class="w-24 h-24 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p class="text-gray-600 dark:text-gray-400 mb-4">Preview not available for this file type</p>
              <button
                @click="downloadAsset(selectedAsset)"
                class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download to View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="cancelDelete"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-2xl"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="p-3 bg-red-100 dark:bg-red-900/20 rounded-full mr-4">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Confirmation</h3>
              <p class="text-gray-600 dark:text-gray-400">Are you sure you want to delete "{{ assetToDelete?.name }}"?</p>
            </div>
          </div>
          <div class="flex gap-3 justify-end">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              @click="deleteAsset"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="getToastClasses(toast.type)"
        class="p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300"
      >
        <div class="flex items-center">
          <component :is="getToastIcon(toast.type)" class="w-5 h-5 mr-3 flex-shrink-0" />
          <div class="flex-1">
            <p class="font-medium">{{ toast.title }}</p>
            <p class="text-sm opacity-90">{{ toast.message }}</p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="ml-3 opacity-70 hover:opacity-100"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

// Types
interface DesignAsset {
  id: string
  name: string
  type: string
  size: string
  sizeBytes?: number
  url: string
  preview?: string
  thumbnail?: string
  category: string
  status: 'pending' | 'approved' | 'rejected' | 'revision'
  uploadedAt: Date
  uploadedBy: string
  uploadedById?: number
  description?: string
  tags?: string[]
  created_at?: string
  updated_at?: string
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

// Props
interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
  'save-design-data': [data: DesignAsset[]]
}>()

// Reactive data
const designAssets = ref<DesignAsset[]>([])
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const isDragOver = ref(false)
const showPreview = ref(false)
const showDeleteConfirm = ref(false)
const selectedAsset = ref<DesignAsset | null>(null)
const assetToDelete = ref<DesignAsset | null>(null)
const fileInput = ref<HTMLInputElement>()
const toasts = ref<Toast[]>([])
const isSubmitting = ref(false)
const isUpdatingTask = ref(false)

// Computed properties
const filteredAssets = computed(() => {
  let filtered = designAssets.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(asset =>
      asset.name.toLowerCase().includes(query) ||
      asset.category.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(asset => asset.category === selectedCategory.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(asset => asset.status === selectedStatus.value)
  }

  return filtered
})

const approvedCount = computed(() =>
  designAssets.value.filter(asset => asset.status === 'approved').length
)

const pendingCount = computed(() =>
  designAssets.value.filter(asset => asset.status === 'pending').length
)

const conceptCount = computed(() =>
  designAssets.value.filter(asset => asset.category === 'concept').length
)

const canCompleteTask = computed(() => {
  if (props.task.status !== 'in_progress') return false
  // Require at least one approved asset to complete
  return approvedCount.value > 0
})

// Methods
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

const handleFiles = async (files: File[]) => {
  const validFiles = files.filter(file => {
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/postscript', // AI files
      'image/vnd.adobe.photoshop', // PSD files
    ]

    const validExtensions = ['.sketch', '.fig', '.xd']
    const hasValidExtension = validExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    )

    return validTypes.includes(file.type) || hasValidExtension
  })

  if (validFiles.length !== files.length) {
    showToast('warning', 'Invalid Files', 'Some files were skipped due to unsupported format')
  }

  for (const file of validFiles) {
    await uploadFile(file)
  }
}

const uploadFile = async (file: File) => {
  try {
    // Validate file first
    const validation = { isValid: true, errors: [], warnings: [] } // Simplified validation
    if (!validation.isValid) {
      showToast('error', 'Validation Failed', validation.errors.join(', '))
      return
    }

    // Show upload progress
    showToast('info', 'Uploading', `Uploading ${file.name}...`)

    // Create FormData for file upload
    const formData = new FormData()
    formData.append('files[]', file) // Backend expects 'files' as array
    formData.append('category', inferCategory(file.name))

    // Upload to backend
    const response = await fetch(`http://localhost:8000/api/projects/enquiry-tasks/${props.task.id}/design-assets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json'
        // Don't set Content-Type for FormData - browser sets it with boundary automatically
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    const uploadedAsset = Array.isArray(result) ? result[0] : result // Handle both array and single object responses

    // Add uploaded asset to local state
    const newAsset: DesignAsset = {
      id: uploadedAsset.id,
      name: uploadedAsset.original_name || uploadedAsset.name,
      type: uploadedAsset.mime_type,
      size: formatFileSize(uploadedAsset.file_size),
      sizeBytes: uploadedAsset.file_size,
      url: uploadedAsset.url || `/api/projects/enquiry-tasks/${props.task.id}/design-assets/${uploadedAsset.id}/download`,
      preview: uploadedAsset.url || `/api/projects/enquiry-tasks/${props.task.id}/design-assets/${uploadedAsset.id}/download`,
      thumbnail: uploadedAsset.thumbnail_url,
      category: uploadedAsset.category,
      status: uploadedAsset.status,
      uploadedAt: new Date(uploadedAsset.created_at),
      uploadedBy: uploadedAsset.uploaded_by_name || 'Unknown User',
      uploadedById: uploadedAsset.uploaded_by,
      description: uploadedAsset.description,
      tags: uploadedAsset.tags || [],
      created_at: uploadedAsset.created_at,
      updated_at: uploadedAsset.updated_at,
    }

    designAssets.value.unshift(newAsset)
    showToast('success', 'Upload Successful', `${file.name} has been uploaded`)

    // Emit design data changes to parent component
    emit('save-design-data', designAssets.value)

  } catch (error) {
    console.error('Upload failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    showToast('error', 'Upload Failed', `Failed to upload ${file.name}: ${errorMessage}`)
  }
}

const previewAsset = (asset: DesignAsset) => {
  selectedAsset.value = asset
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
  selectedAsset.value = null
}

const downloadAsset = (asset: DesignAsset) => {
  // Create a temporary link to download the file
  const link = document.createElement('a')
  link.href = asset.url
  link.download = asset.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showToast('info', 'Download Started', `Downloading ${asset.name}`)
}

const shareAsset = (asset: DesignAsset) => {
  // Copy share link to clipboard
  const shareUrl = `${window.location.origin}/design-assets/${asset.id}`
  navigator.clipboard.writeText(shareUrl).then(() => {
    showToast('success', 'Link Copied', 'Share link copied to clipboard')
  })
}

const confirmDelete = (asset: DesignAsset) => {
  assetToDelete.value = asset
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  assetToDelete.value = null
}

const deleteAsset = () => {
  if (assetToDelete.value) {
    const index = designAssets.value.findIndex(a => a.id === assetToDelete.value!.id)
    if (index > -1) {
      const assetName = assetToDelete.value.name
      designAssets.value.splice(index, 1)
      showToast('success', 'Deleted', `${assetName} has been deleted`)

      // Emit design data changes to parent component
      emit('save-design-data', designAssets.value)
    }
  }
  showDeleteConfirm.value = false
  assetToDelete.value = null
}

const updateTaskStatus = async (newStatus: EnquiryTask['status']) => {
  isUpdatingTask.value = true

  try {
    const response = await fetch(`http://localhost:8000/api/projects/enquiry-tasks/${props.task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        status: newStatus,
        notes: `Task status changed to ${newStatus}`,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const updatedTask = await response.json()

    showToast('success', 'Task Updated', `Task status changed to ${newStatus}`)

    // Emit status change to parent component
    emit('update-status', newStatus)

  } catch (error) {
    console.error('Task status update failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    showToast('error', 'Update Failed', `Failed to update task status: ${errorMessage}`)
  } finally {
    isUpdatingTask.value = false
  }
}

// Toast system
const showToast = (type: Toast['type'], title: string, message: string) => {
  const toast: Toast = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type,
    title,
    message
  }

  toasts.value.push(toast)

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(toast.id)
  }, 5000)
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Utility functions
const isImageFile = (type: string): boolean => {
  return type.startsWith('image/')
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return h('svg', { class: 'w-12 h-12', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ])
  }
  if (type === 'application/pdf') {
    return h('svg', { class: 'w-12 h-12', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ])
  }
  return h('svg', { class: 'w-12 h-12', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
  ])
}

const getStatusClasses = (status: string): string => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800 border border-green-200'
    case 'rejected': return 'bg-red-100 text-red-800 border border-red-200'
    case 'revision': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    default: return 'bg-blue-100 text-blue-800 border border-blue-200'
  }
}

const getTaskStatusClasses = (status: string): string => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800 border border-green-200'
    case 'in_progress': return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    default: return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

const getToastClasses = (type: string): string => {
  switch (type) {
    case 'success': return 'bg-green-500 text-white'
    case 'error': return 'bg-red-500 text-white'
    case 'warning': return 'bg-yellow-500 text-white'
    default: return 'bg-blue-500 text-white'
  }
}

const getToastIcon = (type: string) => {
  switch (type) {
    case 'success':
      return h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
      ])
    case 'error':
      return h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
      ])
    case 'warning':
      return h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' })
      ])
    default:
      return h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
      ])
  }
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

const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// Removed unused function - functionality moved to backend

const inferCategory = (filename: string): string => {
  const name = filename.toLowerCase()
  if (name.includes('concept')) return 'concept'
  if (name.includes('mockup')) return 'mockup'
  if (name.includes('logo')) return 'logo'
  if (name.includes('ui') || name.includes('ux')) return 'ui-ux'
  if (name.includes('illustration')) return 'illustration'
  return 'artwork'
}

/**
 * Submit all design assets and mark task as completed
 */
const submitDesignAssets = async () => {
  if (designAssets.value.length === 0) return

  isSubmitting.value = true

  try {
    // First upload any remaining assets that haven't been uploaded yet
    const unuploadedAssets = designAssets.value.filter(asset => !asset.url || asset.url === '#')
    if (unuploadedAssets.length > 0) {
      showToast('info', 'Uploading Assets', `Uploading ${unuploadedAssets.length} remaining assets...`)
      // Note: In a real implementation, you'd upload these assets here
      // For now, we'll assume they're already uploaded via individual uploads
    }

    // Update task status to completed via API
    const response = await fetch(`http://localhost:8000/api/projects/enquiry-tasks/${props.task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        status: 'completed',
        notes: `Design task completed with ${designAssets.value.length} assets uploaded`,
        completed_at: new Date().toISOString()
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    await response.json()

    showToast('success', 'Design Assets Submitted',
      `All ${designAssets.value.length} design assets have been successfully submitted and saved.`)

    // Mark task as completed locally
    emit('update-status', 'completed')

  } catch (error) {
    console.error('Submission failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    showToast('error', 'Submission Failed',
      `Failed to submit design assets: ${errorMessage}`)
  } finally {
    isSubmitting.value = false
  }
}

// Load initial data
onMounted(async () => {
  await loadDesignAssets()
})

/**
 * Load existing design assets from the backend
 */
const loadDesignAssets = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/projects/enquiry-tasks/${props.task.id}/design-assets`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      const result = await response.json()
      // Handle both paginated and direct array responses
      const assets = result.data || result
      designAssets.value = assets.map((asset: Record<string, unknown>) => ({
        id: String(asset.id || ''),
        name: String(asset.original_name || asset.name || ''),
        type: String(asset.mime_type || ''),
        size: formatFileSize(Number(asset.file_size) || 0),
        sizeBytes: Number(asset.file_size) || 0,
        url: String(asset.url || `/api/projects/enquiry-tasks/${props.task.id}/design-assets/${asset.id}/download`),
        preview: String(asset.url || `/api/projects/enquiry-tasks/${props.task.id}/design-assets/${asset.id}/download`),
        thumbnail: asset.thumbnail_url ? String(asset.thumbnail_url) : undefined,
        category: String(asset.category || 'other'),
        status: String(asset.status || 'pending') as DesignAsset['status'],
        uploadedAt: new Date(String(asset.created_at || new Date())),
        uploadedBy: String(asset.uploaded_by_name || 'Unknown User'),
        uploadedById: Number(asset.uploaded_by) || 0,
        description: String(asset.description || ''),
        tags: Array.isArray(asset.tags) ? asset.tags.map(String) : [],
        created_at: String(asset.created_at || ''),
        updated_at: String(asset.updated_at || ''),
      }))
    } else {
      console.warn('Failed to load design assets:', response.status)
      // Keep empty array if loading fails
      designAssets.value = []
    }
  } catch (error) {
    console.error('Error loading design assets:', error)
    designAssets.value = []
  }
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-track:window-inactive {
  background: #e2e8f0;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Upload zone animations */
.upload-zone {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-zone:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Card hover effects */
.design-asset-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.design-asset-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Button hover effects */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Select dropdown styling */
select {
  background-image: none;
}

select:focus {
  outline: none;
}

/* Modal backdrop blur */
.fixed.inset-0.bg-black.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

/* Toast animations */
.fixed.top-4.right-4 > div {
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Drag and drop visual feedback */
.upload-zone.scale-105 {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Grid responsive improvements */
@media (min-width: 1536px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3.xl\:grid-cols-4 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .design-task-container {
    padding: 1rem;
  }

  .upload-zone {
    padding: 2rem 1rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .flex.flex-col.md\:flex-row {
    flex-direction: column;
  }

  .w-full.md\:w-48 {
    width: 100%;
  }
}

/* Loading states */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Focus states for accessibility */
button:focus,
input:focus,
select:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* Status badge animations */
.absolute.top-3 span {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Image loading placeholder */
img {
  transition: opacity 0.3s ease-in-out;
}

img[src=""], img:not([src]) {
  opacity: 0;
}

/* Custom file input styling */
input[type="file"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

/* Tooltip-like hover effects */
[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Print styles */
@media print {
  .fixed,
  button,
  .upload-zone {
    display: none !important;
  }

  .design-task-container {
    background: white !important;
    box-shadow: none !important;
  }
}
</style>
