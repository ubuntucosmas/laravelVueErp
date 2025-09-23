<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Element Templates</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage reusable element templates with pre-configured materials and components
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span>Create Template</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Total Templates</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Production</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.production }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">For Hire</p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.hire }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Most Used</p>
            <p class="text-lg font-bold text-indigo-600 dark:text-indigo-400 truncate">
              {{ stats.mostUsed?.name || 'None' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search templates..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @input="debouncedFetch"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select
            v-model="filters.category"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @change="fetchTemplates(filters)"
          >
            <option value="">All Categories</option>
            <option value="production">Production Elements</option>
            <option value="hire">Elements for Hire</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
          <select
            v-model="filters.sortBy"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @change="fetchTemplates(filters)"
          >
            <option value="name">Name</option>
            <option value="created_at">Created Date</option>
            <option value="usage_count">Usage Count</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
          <select
            v-model="filters.sortOrder"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @change="fetchTemplates(filters)"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Templates Grid -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="templates.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No templates found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by creating your first element template.
      </p>
      <div class="mt-6">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Create Template</span>
        </button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in templates"
        :key="template.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
      >
        <!-- Template Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ template.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ template.description }}</p>
          </div>
          <span
            :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              template.category === 'production'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            ]"
          >
            {{ template.category === 'production' ? 'Production' : 'For Hire' }}
          </span>
        </div>

        <!-- Template Stats -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="text-center">
            <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ template.elements.length }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Elements</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ template.usage_count || 0 }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Used</div>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="template.tags && template.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
          <span
            v-for="tag in template.tags"
            :key="tag"
            class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
          <div class="flex items-center space-x-2">
            <button
              @click="editTemplate(template)"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title="Edit Template"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button
              @click="duplicateTemplate(template)"
              class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              title="Duplicate Template"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
          <button
            @click="deleteTemplate(template)"
            class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title="Delete Template"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ showEditModal ? 'Edit Template' : 'Create New Template' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form @submit.prevent="saveTemplate" class="space-y-6">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="currentTemplate.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Exhibition Booth 3x3m Standard"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="currentTemplate.category"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Category</option>
                  <option value="production">Production Elements</option>
                  <option value="hire">Elements for Hire</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                v-model="currentTemplate.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Brief description of the template..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                v-model="tagsInput"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="exhibition, booth, standard"
              />
            </div>

            <!-- Elements Section -->
            <div class="border-t border-gray-200 dark:border-gray-600 pt-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Elements</h3>
                <button
                  type="button"
                  @click="addElement"
                  class="inline-flex items-center space-x-2 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <span>Add Element</span>
                </button>
              </div>

              <div v-if="!currentTemplate.elements || currentTemplate.elements.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                No elements added yet. Click "Add Element" to get started.
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="(element, elementIndex) in currentTemplate.elements"
                  :key="element.id"
                  class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <!-- Element Header -->
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-md font-medium text-gray-900 dark:text-white">Element {{ elementIndex + 1 }}</h4>
                    <button
                      type="button"
                      @click="removeElement(elementIndex)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Element Details -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Element Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="element.elementName"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                        placeholder="e.g., Aluminum Frame Structure"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="element.category"
                        required
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                      >
                        <option value="">Select Category</option>
                        <option value="production">Production</option>
                        <option value="hire">For Hire</option>
                      </select>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      v-model="element.description"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                      placeholder="Brief description of the element..."
                    ></textarea>
                  </div>

                  <!-- Materials Section -->
                  <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div class="flex items-center justify-between mb-3">
                      <h5 class="text-sm font-medium text-gray-900 dark:text-white">Materials</h5>
                      <button
                        type="button"
                        @click="addSubItem(element)"
                        class="inline-flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        <span>Add Material</span>
                      </button>
                    </div>

                    <div v-if="element.subItems.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                      No materials added yet.
                    </div>

                    <div v-else class="space-y-2">
                      <div
                        v-for="(subItem, subIndex) in element.subItems"
                        :key="subItem.id"
                        class="bg-white dark:bg-gray-600 rounded p-3"
                      >
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ subItem.name }}</span>
                          <button
                            type="button"
                            @click="removeSubItem(element, subIndex)"
                            class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div>
                            <label class="block text-gray-600 dark:text-gray-400 mb-1">Quantity</label>
                            <input
                              v-model.number="subItem.quantity"
                              type="number"
                              min="1"
                              required
                              class="w-full px-2 py-1 border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-500 dark:text-white"
                            />
                          </div>
                          <div>
                            <label class="block text-gray-600 dark:text-gray-400 mb-1">Unit</label>
                            <select
                              v-model="subItem.unit"
                              required
                              class="w-full px-2 py-1 border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-500 dark:text-white"
                            >
                              <option value="">Unit</option>
                              <option value="pcs">pcs</option>
                              <option value="sqm">sqm</option>
                              <option value="kg">kg</option>
                              <option value="set">set</option>
                            </select>
                          </div>
                          <div>
                            <label class="block text-gray-600 dark:text-gray-400 mb-1">Price (KES)</label>
                            <input
                              v-model.number="subItem.unitPrice"
                              type="number"
                              min="0"
                              step="0.01"
                              required
                              class="w-full px-2 py-1 border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-500 dark:text-white"
                            />
                          </div>
                          <div>
                            <label class="block text-gray-600 dark:text-gray-400 mb-1">Category</label>
                            <select
                              v-model="subItem.category"
                              required
                              class="w-full px-2 py-1 border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-500 dark:text-white"
                            >
                              <option value="">Category</option>
                              <option value="production">Production</option>
                              <option value="hire">For Hire</option>
                            </select>
                          </div>
                        </div>

                        <div class="mt-2">
                          <label class="block text-gray-600 dark:text-gray-400 mb-1 text-xs">Notes</label>
                          <input
                            v-model="subItem.comment"
                            type="text"
                            class="w-full px-2 py-1 border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-500 dark:text-white text-xs"
                            placeholder="Additional notes..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ saving ? 'Saving...' : (showEditModal ? 'Update Template' : 'Create Template') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useElementTemplates } from '../composables/useElementTemplates'
import type { ElementTemplate, TemplateElement, TemplateSubItem } from '../types'

const { templates, loading, stats, fetchTemplates, createTemplate, updateTemplate, deleteTemplate: deleteTemplateComposable, duplicateTemplate: duplicateTemplateComposable } = useElementTemplates()

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const saving = ref(false)

// Current template being edited
const currentTemplate = ref<Partial<ElementTemplate>>({
  name: '',
  description: '',
  category: 'production',
  elements: [],
  tags: []
})

// Tags input
const tagsInput = ref('')

// Filters
const filters = ref({
  search: '',
  category: '' as '' | 'production' | 'hire',
  sortBy: 'name' as 'name' | 'created_at' | 'usage_count',
  sortOrder: 'asc' as 'asc' | 'desc'
})

// Debounce search
let searchTimeout: number | null = null
const debouncedFetch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchTemplates(filters.value)
  }, 300)
}

// Methods
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  currentTemplate.value = {
    name: '',
    description: '',
    category: 'production',
    elements: [],
    tags: []
  }
  tagsInput.value = ''
}

const addElement = () => {
  if (!currentTemplate.value.elements) {
    currentTemplate.value.elements = []
  }
  const newElement: TemplateElement = {
    id: `element-${Date.now()}`,
    elementName: '',
    description: '',
    category: 'production',
    subItems: []
  }
  currentTemplate.value.elements.push(newElement)
}

const removeElement = (index: number) => {
  if (currentTemplate.value.elements) {
    currentTemplate.value.elements.splice(index, 1)
  }
}

const addSubItem = (element: TemplateElement) => {
  const newSubItem: TemplateSubItem = {
    id: `subitem-${Date.now()}`,
    name: '',
    quantity: 1,
    unit: 'pcs',
    unitPrice: 0,
    category: 'production',
    comment: ''
  }
  element.subItems.push(newSubItem)
}

const removeSubItem = (element: TemplateElement, subIndex: number) => {
  element.subItems.splice(subIndex, 1)
}

const saveTemplate = async () => {
  if (!currentTemplate.value.name || !currentTemplate.value.category) {
    return
  }

  saving.value = true

  try {
    // Process tags
    const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')

    const templateData = {
      ...currentTemplate.value,
      tags,
      created_by: 1 // TODO: Get from auth
    } as Omit<ElementTemplate, 'id' | 'created_at' | 'updated_at' | 'usage_count'>

    if (showEditModal.value && currentTemplate.value.id) {
      await updateTemplate(currentTemplate.value.id, templateData)
    } else {
      await createTemplate(templateData)
    }

    await fetchTemplates(filters.value)
    closeModal()
  } catch (err) {
    console.error('Error saving template:', err)
  } finally {
    saving.value = false
  }
}

const editTemplate = (template: ElementTemplate) => {
  currentTemplate.value = { ...template }
  tagsInput.value = template.tags ? template.tags.join(', ') : ''
  showEditModal.value = true
}

const duplicateTemplate = async (template: ElementTemplate) => {
  try {
    await duplicateTemplateComposable(template.id, `${template.name} (Copy)`)
    await fetchTemplates(filters.value)
  } catch (err) {
    console.error('Error duplicating template:', err)
  }
}

const deleteTemplate = async (template: ElementTemplate) => {
  if (confirm(`Are you sure you want to delete "${template.name}"? This action cannot be undone.`)) {
    try {
      await deleteTemplateComposable(template.id)
      await fetchTemplates(filters.value)
    } catch (err) {
      console.error('Error deleting template:', err)
    }
  }
}

// Watch for tags input changes
watch(tagsInput, (newTags) => {
  if (currentTemplate.value) {
    currentTemplate.value.tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
  }
})

// Lifecycle
onMounted(() => {
  fetchTemplates(filters.value)
})
</script>
