<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ isDesignMode ? 'Design Concept and Material Specification' : 'Materials & Design Assets Management' }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ isDesignMode ? 'Comprehensive material list management for design workflow' : 'Manage materials and upload design assets for' }} {{ enquiry?.title }}
            <span v-if="department" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 ml-2">
              {{ getDepartmentTitle() }} Department
            </span>
          </p>
          <div v-if="department" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {{ getDepartmentContext() }}
          </div>
        </div>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-4 overflow-y-auto max-h-[calc(95vh-180px)]">
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

        <!-- Material List Management -->
        <div class="space-y-4">
          <!-- Form Validation Summary -->
          <div v-if="hasValidationErrors" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div class="flex items-center space-x-2 mb-2">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <span class="text-sm font-medium text-red-800 dark:text-red-200">Please fix the following errors:</span>
            </div>
            <ul class="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li v-for="error in validationErrors" :key="error" class="flex items-start space-x-2">
                <span class="text-red-500">•</span>
                <span>{{ error }}</span>
              </li>
            </ul>
          </div>

          <!-- Input Mode Toggle -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <button
                @click="inputMode = 'simple'"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  inputMode === 'simple'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                ]"
              >
                Simple Input
              </button>
              <button
                @click="inputMode = 'detailed'"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  inputMode === 'detailed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                ]"
              >
                Detailed Form
              </button>
            </div>
          </div>

          <!-- Template Selection -->
          <div v-if="inputMode === 'detailed'" class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
            <div class="flex items-center space-x-2 mb-3">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h4 class="text-sm font-medium text-purple-800 dark:text-purple-200">Use Element Templates</h4>
            </div>
            <p class="text-sm text-purple-700 dark:text-purple-300 mb-3">
              Select one or more pre-configured templates to quickly populate elements and materials.
            </p>

            <!-- Template Selection Area -->
            <div class="space-y-3">
              <!-- Selected Templates Display -->
              <div v-if="selectedTemplateIds.length > 0" class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="templateId in selectedTemplateIds"
                  :key="templateId"
                  class="inline-flex items-center space-x-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                >
                  <span>{{ getTemplateById(templateId)?.name }}</span>
                  <button
                    @click="removeTemplate(templateId)"
                    class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </span>
              </div>

              <!-- Template Dropdown -->
              <div class="flex items-center space-x-3">
                <select
                  v-model="currentTemplateSelection"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  @change="addTemplate"
                >
                  <option value="">Select templates to add...</option>
                  <option
                    v-for="template in availableTemplates"
                    :key="template.id"
                    :value="template.id"
                    :disabled="selectedTemplateIds.includes(template.id)"
                  >
                    {{ template.name }} ({{ template.elements.length }} elements)
                  </option>
                </select>
                <button
                  v-if="selectedTemplateIds.length > 0"
                  @click="applySelectedTemplates"
                  class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Apply Templates
                </button>
                <button
                  v-if="selectedTemplateIds.length > 0"
                  @click="clearAllTemplates"
                  class="px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear All
                </button>
              </div>

              <!-- Selection Summary -->
              <div v-if="selectedTemplateIds.length > 0" class="text-xs text-gray-500 dark:text-gray-400">
                {{ selectedTemplateIds.length }} template(s) selected • {{ getTotalElementsFromSelectedTemplates() }} total elements
              </div>
            </div>
          </div>

          <!-- Simple Input Mode -->
          <div v-if="inputMode === 'simple'" class="space-y-4">
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-3">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">Quick Material Input</h4>
              </div>
              <p class="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Enter materials one per line in this format: <code class="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded text-xs">Material Name - Quantity Unit - Price each</code>
              </p>
              <textarea
                v-model="materialsText"
                :class="[
                  'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors',
                  materialsText.trim() === '' ? 'border-gray-300 dark:border-gray-600' : 'border-gray-300 dark:border-gray-600'
                ]"
                rows="8"
                placeholder="Aluminum Frame 2x3m - 4 pcs - 15000
LED Panel 50 inch - 2 pcs - 25000
Carpet Tiles - 20 sqm - 5000
Steel Structure - 1 set - 75000"
                @input="parseMaterialsText"
              ></textarea>
              <div class="flex items-center justify-between mt-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ parsedMaterialsCount }} materials parsed
                </p>
                <button
                  @click="clearMaterialsText"
                  class="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear All
                </button>
              </div>
            </div>

            <!-- Parsed Materials Preview -->
            <div v-if="materialItems.length > 0" class="space-y-3">
              <h4 class="font-medium text-gray-900 dark:text-white">Parsed Materials</h4>
              <div v-for="(product, index) in materialItems" :key="product.id"
                    class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ product.elementName }}</span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="product.category === 'production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'">
                      {{ product.category }}
                    </span>
                  </div>
                  <button
                    @click="removeMaterialItem(index)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
                <!-- Show sub-items -->
                <div class="space-y-1 ml-4">
                  <div v-for="(subItem, subIndex) in product.subItems" :key="subItem.id"
                       class="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                    <span>• {{ subItem.name }}</span>
                    <span>Qty: {{ subItem.quantity }}</span>
                    <span>Unit: {{ subItem.unit }}</span>
                    <span>KES {{ subItem.unitPrice.toLocaleString() }}</span>
                  </div>
                </div>
                <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Total: KES {{ getProductTotalCost(product).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed Form Mode -->
          <div v-else class="space-y-4">
            <!-- Product Items -->
            <div v-for="(product, productIndex) in materialItems" :key="product.id" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <!-- Product Header -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ product.elementName }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.description }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="product.category === 'production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'">
                    {{ product.category === 'production' ? 'Production' : 'For Hire' }}
                  </span>
                  <button
                    @click="removeProductItem(productIndex)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Product Details -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label :for="`element-name-${product.id}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Element Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    :id="`element-name-${product.id}`"
                    v-model="product.elementName"
                    type="text"
                    :class="[
                      'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors',
                      product.elementName?.trim() === '' && product.errors?.elementName ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    ]"
                    placeholder="e.g., Exhibition Booth 3x3m, LED Display Panel"
                    @blur="validateElementField(product, 'elementName')"
                    @input="validateElementField(product, 'elementName')"
                    required
                  />
                  <p v-if="product.elementName?.trim() === '' && product.errors?.elementName" class="text-red-500 text-xs mt-1" role="alert">Element name is required</p>
                </div>

                <div>
                  <label :for="`element-category-${product.id}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category <span class="text-red-500">*</span>
                  </label>
                  <select
                    :id="`element-category-${product.id}`"
                    v-model="product.category"
                    :class="[
                      'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors',
                      !product.category && product.errors?.category ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    ]"
                    @change="validateElementField(product, 'category')"
                    @blur="validateElementField(product, 'category')"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="production">Production Element</option>
                    <option value="hire">Element for Hire</option>
                  </select>
                  <p v-if="!product.category && product.errors?.category" class="text-red-500 text-xs mt-1" role="alert">Category is required</p>
                </div>
              </div>

              <!-- Product Description -->
              <div class="mb-6">
                <label :for="`product-desc-${product.id}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  :id="`product-desc-${product.id}`"
                  v-model="product.description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brief description of the product..."
                ></textarea>
              </div>

              <!-- Sub-Components Section -->
              <div class="border-t border-gray-200 dark:border-gray-600 pt-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-md font-semibold text-gray-900 dark:text-white">Materials</h4>
                  <button
                    @click="addSubItem(product)"
                    class="inline-flex items-center space-x-2 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    <span>Add Material</span>
                  </button>
                </div>

                <!-- Sub-Items -->
                <div class="space-y-3">
                  <div v-for="(subItem, subIndex) in product.subItems" :key="subItem.id"
                       class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">Material #{{ subIndex + 1 }}</span>
                      <button
                        @click="removeSubItem(product, subIndex)"
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <!-- Component Name -->
                      <div class="md:col-span-2">
                        <label :for="`sub-name-${subItem.id}`" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Material Name <span class="text-red-500">*</span>
                        </label>
                        <input
                          :id="`sub-name-${subItem.id}`"
                          v-model="subItem.name"
                          type="text"
                          :class="[
                            'w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-600 dark:text-white transition-colors',
                            subItem.name.trim() === '' && subItem.errors?.name ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-500'
                          ]"
                          placeholder="e.g., Aluminum Frame, LED Panel"
                          @blur="validateSubItemField(subItem, 'name')"
                          @input="validateSubItemField(subItem, 'name')"
                          required
                        />
                      </div>

                      <!-- Quantity -->
                      <div>
                        <label :for="`sub-qty-${subItem.id}`" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Quantity <span class="text-red-500">*</span>
                        </label>
                        <input
                          :id="`sub-qty-${subItem.id}`"
                          v-model.number="subItem.quantity"
                          type="number"
                          min="1"
                          :class="[
                            'w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-600 dark:text-white transition-colors',
                            (subItem.quantity < 1 || isNaN(subItem.quantity)) && subItem.errors?.quantity ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-500'
                          ]"
                          placeholder="1"
                          @blur="validateSubItemField(subItem, 'quantity')"
                          @input="validateSubItemField(subItem, 'quantity')"
                          required
                        />
                      </div>

                      <!-- Unit -->
                      <div>
                        <label :for="`sub-unit-${subItem.id}`" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Unit <span class="text-red-500">*</span>
                        </label>
                        <select
                          :id="`sub-unit-${subItem.id}`"
                          v-model="subItem.unit"
                          :class="[
                            'w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-600 dark:text-white transition-colors',
                            !subItem.unit && subItem.errors?.unit ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-500'
                          ]"
                          @change="validateSubItemField(subItem, 'unit')"
                          @blur="validateSubItemField(subItem, 'unit')"
                          required
                        >
                          <option value="">Unit</option>
                          <option value="pcs">pcs</option>
                          <option value="sqm">sqm</option>
                          <option value="lm">lm</option>
                          <option value="kg">kg</option>
                          <option value="set">set</option>
                          <option value="unit">unit</option>
                        </select>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <!-- Unit Price -->
                      <div>
                        <label :for="`sub-price-${subItem.id}`" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Unit Price (KES) <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                          <span class="absolute left-2 top-1 text-xs text-gray-500 dark:text-gray-400">KES</span>
                          <input
                            :id="`sub-price-${subItem.id}`"
                            v-model.number="subItem.unitPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            :class="[
                              'w-full pl-10 pr-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-600 dark:text-white transition-colors',
                              (subItem.unitPrice <= 0 || isNaN(subItem.unitPrice)) && subItem.errors?.unitPrice ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-500'
                            ]"
                            placeholder="0.00"
                            @blur="validateSubItemField(subItem, 'unitPrice')"
                            @input="validateSubItemField(subItem, 'unitPrice')"
                            required
                          />
                        </div>
                      </div>

                      <!-- Category -->
                      <div>
                        <label :for="`sub-category-${subItem.id}`" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category <span class="text-red-500">*</span>
                        </label>
                        <select
                          :id="`sub-category-${subItem.id}`"
                          v-model="subItem.category"
                          :class="[
                            'w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-600 dark:text-white transition-colors',
                            !subItem.category && subItem.errors?.category ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-500'
                          ]"
                          @change="validateSubItemField(subItem, 'category')"
                          @blur="validateSubItemField(subItem, 'category')"
                          required
                        >
                          <option value="">Category</option>
                          <option value="production">Production</option>
                          <option value="hire">For Hire</option>
                        </select>
                      </div>
                    </div>

                    <!-- Comment -->
                    <div class="mt-3">
                      <label :for="`sub-comment-${subItem.id}`" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notes
                      </label>
                      <input
                        :id="`sub-comment-${subItem.id}`"
                        v-model="subItem.comment"
                        type="text"
                        class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-600 dark:text-white"
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Add Product Button -->
            <button
              @click="addMaterialItem"
              class="w-full p-4 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg text-purple-600 dark:text-purple-400 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>Add Element</span>
              </div>
            </button>
          </div>

          <!-- Material Summary -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div>
                <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ materialItems.length }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Elements</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-green-600 dark:text-green-400">{{ materialItems.reduce((total, product) => total + product.subItems.length, 0) }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Components</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-purple-600 dark:text-purple-400">{{ productionItemsCount }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Production</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">KES {{ totalMaterialCost.toLocaleString() }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Total Cost</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Features for Non-Design Departments -->
        <div v-if="!isDesignMode" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Department-specific features -->
          <div v-if="department" class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <svg class="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                  </svg>
                </div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ getDepartmentTitle() }} Department Features</h4>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="{ width: getDepartmentProgress() + '%' }"></div>
                </div>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ getDepartmentProgress() }}%</span>
              </div>
            </div>

            <!-- Department-specific feature grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="feature in getDepartmentFeatures()" :key="feature" class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span class="text-xs font-medium text-gray-900 dark:text-white">{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- Department-specific actions -->
            <div class="flex flex-wrap gap-2 mt-4">
              <button
                v-if="department === 'creatives'"
                @click="createCreativeTasks"
                class="inline-flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>Create Tasks</span>
              </button>
              <button
                v-if="department === 'design'"
                @click="generateDesignSpecs"
                class="inline-flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Design Specs</span>
              </button>
              <button
                v-if="department === 'procurement'"
                @click="generateProcurementList"
                class="inline-flex items-center space-x-2 px-3 py-2 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span>Procurement List</span>
              </button>
              <button
                v-if="department === 'projects'"
                @click="updateProjectStatus"
                class="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Update Status</span>
              </button>
            </div>
          </div>

          <!-- Design Assets Upload Section -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Design Assets</h3>
            </div>

            <!-- Upload Area -->
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"/>
                </svg>
                <div class="mt-4">
                  <label for="file-upload" class="cursor-pointer">
                    <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-white">Upload design files</span>
                    <span class="mt-1 block text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF up to 10MB</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only" multiple @change="handleFileUpload" />
                  </label>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">or drag and drop files here</p>
              </div>
            </div>

            <!-- Uploaded Files -->
            <div v-if="uploadedFiles.length > 0" class="space-y-2">
              <h4 class="font-medium text-gray-900 dark:text-white">Uploaded Files</h4>
              <div v-for="(file, index) in uploadedFiles" :key="index"
                    class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ file.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
                  </div>
                </div>
                <button
                  @click="removeFile(index)"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Design Notes -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Design Notes</label>
              <textarea
                v-model="designNotes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Add any design specifications or notes..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div class="flex items-center space-x-4">
          <button
            @click="saveDraft"
            :disabled="isSaving"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            <span>Save Draft</span>
          </button>
          <button
            @click="saveMaterials"
            :disabled="isSaving || hasValidationErrors"
            class="inline-flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ isSaving ? 'Saving...' : 'Save Materials' }}</span>
          </button>
          <button
            @click="generateQuotation"
            :disabled="materialItems.length === 0"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Generate Quotation</span>
          </button>
          <button
            v-if="department === 'creatives'"
            @click="completeDepartmentTask('creatives')"
            :disabled="materialItems.length === 0"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Complete Creative Task</span>
          </button>
          <button
            v-if="department === 'design'"
            @click="completeDepartmentTask('design')"
            :disabled="materialItems.length === 0"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Complete Design Task</span>
          </button>
          <button
            v-if="department === 'procurement'"
            @click="completeDepartmentTask('procurement')"
            :disabled="materialItems.length === 0"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Complete Procurement Task</span>
          </button>
          <button
            v-if="department === 'projects'"
            @click="completeDepartmentTask('projects')"
            :disabled="materialItems.length === 0"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Complete Project Task</span>
          </button>
        </div>
        <button
          @click="closeModal"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Enquiry } from '../types'
import { useElementTemplates } from '../../creatives/composables/useElementTemplates'
import type { ElementTemplate } from '../../creatives/types'

// Props
interface Props {
  isVisible: boolean
  enquiry: Enquiry | null
  department?: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  save: [materials: MaterialItem[], files: UploadedFile[], notes: string]
}>()

// Types
interface MaterialSubItem {
  id: string
  name: string
  quantity: number
  unit: string
  unitPrice: number
  category: 'production' | 'hire'
  comment?: string
  errors?: {
    name?: boolean
    category?: boolean
    unit?: boolean
    unitPrice?: boolean
    quantity?: boolean
  }
}

interface MaterialItem {
  id: string
  elementName: string
  description?: string
  category: 'production' | 'hire'
  subItems: MaterialSubItem[]
  comment?: string
  errors?: {
    elementName?: boolean
    category?: boolean
  }
}

interface UploadedFile {
  name: string
  size: number
  type: string
  url?: string
}

// Reactive data
const materialItems = ref<MaterialItem[]>([
  {
    id: '1',
    elementName: 'Exhibition Booth 3x3m',
    description: 'Complete exhibition booth setup with all components',
    category: 'production',
    subItems: [
      {
        id: '1-1',
        name: 'Aluminum Frame 2x3m',
        quantity: 4,
        unit: 'pcs',
        unitPrice: 15000,
        category: 'hire',
        comment: 'Main structural frame'
      },
      {
        id: '1-2',
        name: 'LED Panel 50"',
        quantity: 2,
        unit: 'pcs',
        unitPrice: 25000,
        category: 'hire',
        comment: 'High-brightness display panels'
      },
      {
        id: '1-3',
        name: 'Carpet Tiles',
        quantity: 20,
        unit: 'sqm',
        unitPrice: 5000,
        category: 'production',
        comment: 'Premium carpet flooring'
      }
    ],
    comment: 'Complete booth package'
  }
])

const uploadedFiles = ref<UploadedFile[]>([])
const designNotes = ref('')
const error = ref('')
const successMessage = ref('')
const isSaving = ref(false)
const department = ref<string>(props.department || '')

// Simple input mode
const inputMode = ref<'simple' | 'detailed'>('detailed')
const materialsText = ref('')
const parsedMaterialsCount = ref(0)

// Template selection
const { templates: availableTemplates, fetchTemplates: fetchAvailableTemplates } = useElementTemplates()
const selectedTemplateIds = ref<string[]>([])
const currentTemplateSelection = ref('')

// Form data persistence key
const storageKey = computed(() => {
  return props.enquiry ? `materials-form-${props.enquiry.id}-${department.value}` : null
})

// Computed properties
const productionItemsCount = computed(() => {
  return materialItems.value.filter(item => item.category === 'production').length
})


const totalMaterialCost = computed(() => {
  return materialItems.value.reduce((total, product) => {
    return total + product.subItems.reduce((subTotal, subItem) => {
      return subTotal + (subItem.quantity * subItem.unitPrice)
    }, 0)
  }, 0)
})

// Design mode detection
const isDesignMode = computed(() => {
  return department.value === 'design'
})

// Form validation
const hasValidationErrors = computed(() => {
  // For simple input mode, just check if we have any materials
  if (inputMode.value === 'simple') {
    return materialItems.value.length === 0
  }

  // For detailed mode, check product and sub-item validation
  return materialItems.value.some(element => {
    // Check element-level validation
    const elementHasErrors = !element.elementName?.trim() || !element.category

    // Check sub-item validation
    const subItemsHaveErrors = element.subItems?.some(subItem => {
      return !subItem.name?.trim() ||
             !subItem.category ||
             !subItem.unit ||
             subItem.unitPrice <= 0 ||
             isNaN(subItem.unitPrice) ||
             subItem.quantity < 1 ||
             isNaN(subItem.quantity)
    }) || false

    return elementHasErrors || subItemsHaveErrors
  })
})

const validationErrors = computed(() => {
  const errors: string[] = []

  if (inputMode.value === 'simple') {
    if (materialItems.value.length === 0) {
      errors.push('Please enter at least one material in the text area above')
    }
    return errors
  }

  // Detailed mode validation
  materialItems.value.forEach((element, elementIndex) => {
    const elementNum = elementIndex + 1

    if (!element.elementName?.trim()) {
      errors.push(`Element ${elementNum}: Element name is required`)
    }
    if (!element.category) {
      errors.push(`Element ${elementNum}: Category selection is required`)
    }

    // Check sub-items
    element.subItems.forEach((subItem, subIndex) => {
      const subNum = subIndex + 1

      if (!subItem.name.trim()) {
        errors.push(`Element ${elementNum}, Material ${subNum}: Material name is required`)
      }
      if (!subItem.category) {
        errors.push(`Element ${elementNum}, Material ${subNum}: Category selection is required`)
      }
      if (!subItem.unit) {
        errors.push(`Element ${elementNum}, Material ${subNum}: Unit of measure is required`)
      }
      if (subItem.unitPrice <= 0 || isNaN(subItem.unitPrice)) {
        errors.push(`Element ${elementNum}, Material ${subNum}: Valid unit price is required`)
      }
      if (subItem.quantity < 1 || isNaN(subItem.quantity)) {
        errors.push(`Element ${elementNum}, Material ${subNum}: Quantity must be at least 1`)
      }
    })
  })

  return errors
})

// Methods
const closeModal = () => {
  emit('close')
}

const addMaterialItem = () => {
  const newElement: MaterialItem = {
    id: Date.now().toString(),
    elementName: '',
    description: '',
    category: 'production',
    subItems: [
      {
        id: `${Date.now()}-1`,
        name: '',
        quantity: 1,
        unit: 'pcs',
        unitPrice: 0,
        category: 'production',
        comment: '',
        errors: {}
      }
    ],
    comment: '',
    errors: {}
  }
  materialItems.value.push(newElement)
}

const removeProductItem = (index: number) => {
  materialItems.value.splice(index, 1)
}

const addSubItem = (product: MaterialItem) => {
  const newSubItem: MaterialSubItem = {
    id: `${Date.now()}-${product.subItems.length + 1}`,
    name: '',
    quantity: 1,
    unit: 'pcs',
    unitPrice: 0,
    category: 'production',
    comment: '',
    errors: {}
  }
  product.subItems.push(newSubItem)
}

const removeSubItem = (product: MaterialItem, subIndex: number) => {
  product.subItems.splice(subIndex, 1)
}

const getProductTotalCost = (product: MaterialItem): number => {
  return product.subItems.reduce((total, subItem) => {
    return total + (subItem.quantity * subItem.unitPrice)
  }, 0)
}


const removeMaterialItem = (index: number) => {
  materialItems.value.splice(index, 1)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      uploadedFiles.value.push({
        name: file.name,
        size: file.size,
        type: file.type
      })
    }
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const saveMaterials = async () => {
  // Clear previous messages
  error.value = ''
  successMessage.value = ''

  // Validate form before submission
  if (hasValidationErrors.value) {
    error.value = 'Please fix all validation errors before saving.'
    return
  }

  isSaving.value = true

  try {
    // Validate all fields one more time
    materialItems.value.forEach(item => {
      validateField(item, 'name')
      validateField(item, 'category')
      validateField(item, 'unit')
      validateField(item, 'unitPrice')
      validateField(item, 'quantity')
    })

    // If still has errors after validation, don't proceed
    if (hasValidationErrors.value) {
      error.value = 'Please fix all validation errors before saving.'
      return
    }

    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Save to localStorage for persistence
    saveFormDataToStorage()

    // Emit success event with validated data
    emit('save', materialItems.value, uploadedFiles.value, designNotes.value)

    // Show success message
    successMessage.value = `Successfully saved ${materialItems.value.length} material item(s) with total cost of KES ${totalMaterialCost.value.toLocaleString()}.`

    // Clear form data from storage after successful save
    clearFormDataFromStorage()

    // Auto-close modal after success message
    setTimeout(() => {
      closeModal()
    }, 2000)

  } catch (err) {
    console.error('Save failed:', err)
    error.value = 'Failed to save materials. Please check your connection and try again.'
  } finally {
    isSaving.value = false
  }
}

// Form data persistence methods
const saveFormDataToStorage = () => {
  if (!storageKey.value) return

  const formData = {
    inputMode: inputMode.value,
    materialsText: materialsText.value,
    materialItems: materialItems.value,
    uploadedFiles: uploadedFiles.value,
    designNotes: designNotes.value,
    timestamp: Date.now()
  }

  try {
    localStorage.setItem(storageKey.value, JSON.stringify(formData))
  } catch (err) {
    console.warn('Failed to save form data to localStorage:', err)
  }
}

const loadFormDataFromStorage = () => {
  if (!storageKey.value) return

  try {
    const stored = localStorage.getItem(storageKey.value)
    if (stored) {
      const formData = JSON.parse(stored)
      // Only load if data is less than 24 hours old
      if (Date.now() - formData.timestamp < 24 * 60 * 60 * 1000) {
        inputMode.value = formData.inputMode || 'simple'
        materialsText.value = formData.materialsText || ''
        materialItems.value = formData.materialItems || []
        uploadedFiles.value = formData.uploadedFiles || []
        designNotes.value = formData.designNotes || ''
        parsedMaterialsCount.value = materialItems.value.length
      } else {
        // Clear old data
        localStorage.removeItem(storageKey.value)
      }
    }
  } catch (err) {
    console.warn('Failed to load form data from localStorage:', err)
  }
}

const clearFormDataFromStorage = () => {
  if (storageKey.value) {
    localStorage.removeItem(storageKey.value)
  }
}

const saveDraft = () => {
  saveFormDataToStorage()
  successMessage.value = 'Draft saved successfully! Your progress has been saved locally.'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

// Simple input methods
const parseMaterialsText = () => {
  const lines = materialsText.value.trim().split('\n').filter(line => line.trim() !== '')

  // Clear existing materials if we're in simple mode
  if (inputMode.value === 'simple') {
    materialItems.value = []
  }

  lines.forEach((line) => {
    const parsed = parseMaterialLine(line.trim())
    if (parsed) {
      // Check if material already exists (avoid duplicates)
      // For simple mode, we compare the first sub-item name
      const existingIndex = materialItems.value.findIndex(item =>
        item.subItems && item.subItems.length > 0 &&
        parsed.subItems && parsed.subItems.length > 0 &&
        item.subItems[0].name.toLowerCase() === parsed.subItems[0].name.toLowerCase()
      )

      if (existingIndex >= 0) {
        // Update existing item
        materialItems.value[existingIndex] = { ...materialItems.value[existingIndex], ...parsed }
      } else {
        // Add new item
        materialItems.value.push(parsed)
      }
    }
  })

  parsedMaterialsCount.value = materialItems.value.length
}

const parseMaterialLine = (line: string): MaterialItem | null => {
  // Expected format: "Material Name - Quantity Unit - Price"
  // Examples:
  // "Aluminum Frame 2x3m - 4 pcs - 15000"
  // "LED Panel 50 inch - 2 pcs - 25000"
  // "Carpet Tiles - 20 sqm - 5000"

  const parts = line.split(' - ').map(part => part.trim())

  if (parts.length < 3) {
    return null // Invalid format
  }

  const name = parts[0]
  const quantityPart = parts[1]
  const pricePart = parts[2]

  // Parse quantity and unit
  const quantityMatch = quantityPart.match(/^(\d+(?:\.\d+)?)\s+(.+)$/)
  if (!quantityMatch) {
    return null
  }

  const quantity = parseFloat(quantityMatch[1])
  const unit = quantityMatch[2]

  // Parse price
  const price = parseFloat(pricePart.replace(/[^\d.]/g, ''))

  if (isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
    return null
  }

  // Determine category based on common patterns
  let category: 'production' | 'hire' = 'production'
  const lowerName = name.toLowerCase()
  if (lowerName.includes('frame') || lowerName.includes('panel') || lowerName.includes('screen') ||
      lowerName.includes('display') || lowerName.includes('light') || lowerName.includes('led')) {
    category = 'hire' // These are typically rented items
  }

  // Create an element with this as a sub-item
  return {
    id: `parsed-${Date.now()}`,
    elementName: `Element with ${name}`,
    description: `Auto-generated element containing ${name}`,
    category: 'production',
    subItems: [{
      id: `parsed-${Date.now()}-1`,
      name,
      quantity,
      unit,
      unitPrice: price,
      category,
      comment: `Parsed from: ${line}`,
      errors: {}
    }],
    comment: '',
    errors: {}
  }
}

const clearMaterialsText = () => {
  materialsText.value = ''
  materialItems.value = []
  parsedMaterialsCount.value = 0
}

// Template methods
const addTemplate = () => {
  if (!currentTemplateSelection.value) return

  if (!selectedTemplateIds.value.includes(currentTemplateSelection.value)) {
    selectedTemplateIds.value.push(currentTemplateSelection.value)
  }

  currentTemplateSelection.value = ''
}

const removeTemplate = (templateId: string) => {
  const index = selectedTemplateIds.value.indexOf(templateId)
  if (index > -1) {
    selectedTemplateIds.value.splice(index, 1)
  }
}

const applySelectedTemplates = () => {
  if (selectedTemplateIds.value.length === 0) return

  // Collect all elements from selected templates
  const allElements: MaterialItem[] = []

  selectedTemplateIds.value.forEach(templateId => {
    const template = availableTemplates.value.find(t => t.id === templateId)
    if (template) {
      // Add elements from this template
      const templateElements = template.elements.map(element => ({
        id: `template-${templateId}-${element.id}-${Date.now()}-${Math.random()}`,
        elementName: element.elementName,
        description: element.description,
        category: element.category,
        subItems: element.subItems.map(subItem => ({
          id: `template-${templateId}-${subItem.id}-${Date.now()}-${Math.random()}`,
          name: subItem.name,
          quantity: subItem.quantity,
          unit: subItem.unit,
          unitPrice: subItem.unitPrice,
          category: subItem.category,
          comment: subItem.comment,
          errors: {}
        })),
        comment: `From template: ${template.name}`,
        errors: {}
      }))

      allElements.push(...templateElements)

      // Increment usage count
      template.usage_count = (template.usage_count || 0) + 1
    }
  })

  // Clear existing materials and apply all template elements
  materialItems.value = allElements

  // Clear selection after applying
  selectedTemplateIds.value = []
}

const clearAllTemplates = () => {
  selectedTemplateIds.value = []
  currentTemplateSelection.value = ''
}

const getTemplateById = (templateId: string) => {
  return availableTemplates.value.find(t => t.id === templateId)
}

const getTotalElementsFromSelectedTemplates = () => {
  return selectedTemplateIds.value.reduce((total, templateId) => {
    const template = getTemplateById(templateId)
    return total + (template?.elements.length || 0)
  }, 0)
}

const generateQuotation = () => {
  // TODO: Implement quotation generation
  console.log('Generate quotation from materials')
}

const completeDepartmentTask = (departmentName: string) => {
  console.log(`Completing ${departmentName} department task`)

  // Emit event to parent component with department context
  emit('save', materialItems.value, uploadedFiles.value, designNotes.value)

  // Close modal after task completion
  closeModal()

  // Show success message
  alert(`${getDepartmentTitle()} task completed successfully!`)

  // In a real application, this would:
  // 1. Update the task status in the backend
  // 2. Emit an event to update the parent component's state
  // 3. Trigger workflow progression to the next phase
  // 4. Update progress tracking
}

const getDepartmentTitle = () => {
  const titles: Record<string, string> = {
    'creatives': 'Creative',
    'design': 'Design',
    'survey': 'Survey',
    'projects': 'Projects',
    'procurement': 'Procurement'
  }
  return titles[department.value] || 'General'
}

const getDepartmentFeatures = () => {
  const features: Record<string, string[]> = {
    'creatives': [
      'Material lists auto-integrated with budget creation',
      'Design assets linked to material specifications',
      'Progress tracking for creative workflow',
      'Concept development and ideation tools'
    ],
    'design': [
      'Material specification and planning',
      'Cost estimation and budget integration',
      'Supplier coordination and management',
      'Design-to-production workflow tracking'
    ],
    'survey': [
      'Site assessment and evaluation tools',
      'Requirements gathering and analysis',
      'Feasibility study capabilities',
      'Client consultation and briefing'
    ],
    'projects': [
      'Project timeline and milestone tracking',
      'Resource allocation and management',
      'Progress monitoring and reporting',
      'Stakeholder communication tools'
    ],
    'procurement': [
      'Vendor selection and evaluation',
      'Purchase order management',
      'Delivery tracking and logistics',
      'Cost comparison and negotiation tools'
    ]
  }
  return features[department.value] || ['General project management features']
}

const getDepartmentContext = () => {
  const contexts: Record<string, string> = {
    'creatives': 'This department handles enquiry designs, mockups, renders, and material lists required for creative projects. Material lists are categorized into production items and items for hire.',
    'design': 'This department manages detailed material specifications, technical drawings, and production planning. All materials are integrated with budget creation and cost estimation.',
    'survey': 'This department conducts site assessments and feasibility studies. Material requirements are determined based on site evaluation and client requirements.',
    'projects': 'This department oversees project execution and coordination. Material management focuses on timeline integration and resource allocation.',
    'procurement': 'This department handles vendor management and material sourcing. All materials are tracked through procurement processes and integrated with supplier systems.'
  }
  return contexts[department.value] || 'Department-specific material management and workflow integration.'
}

const getDepartmentProgress = () => {
  switch (department.value) {
    case 'creatives':
      return materialItems.value.length > 0 ? 75 : 25
    case 'design':
      return materialItems.value.length > 0 ? 80 : 30
    case 'survey':
      return 60 // Survey progress would be tracked separately
    case 'procurement':
      return materialItems.value.length > 0 ? 70 : 20
    case 'projects':
      return 90 // Project management progress
    default:
      return 0
  }
}

const createCreativeTasks = () => {
  console.log('Creating creative tasks for department:', department.value)
  // This would integrate with the creative task management system
  // For now, just show a notification
  alert('Creative tasks would be created here')
}

const generateDesignSpecs = () => {
  console.log('Generating design specifications for department:', department.value)
  // This would generate design specifications from materials
  alert('Design specifications would be generated here')
}

const generateProcurementList = () => {
  console.log('Generating procurement list for department:', department.value)
  // This would generate a procurement list from materials
  alert('Procurement list would be generated here')
}

const updateProjectStatus = () => {
  console.log('Updating project status for department:', department.value)
  // This would update the project status
  alert('Project status would be updated here')
}

// Design Mode Methods

const validateElementField = (element: MaterialItem, field: string) => {
  if (!element.errors) {
    element.errors = {}
  }

  switch (field) {
    case 'elementName':
      element.errors.elementName = element.elementName?.trim() === ''
      break
    case 'category':
      element.errors.category = !element.category
      break
  }
}

const validateSubItemField = (subItem: MaterialSubItem, field: string) => {
  if (!subItem.errors) {
    subItem.errors = {}
  }

  switch (field) {
    case 'name':
      subItem.errors.name = subItem.name.trim() === ''
      break
    case 'category':
      subItem.errors.category = !subItem.category
      break
    case 'unit':
      subItem.errors.unit = !subItem.unit
      break
    case 'unitPrice':
      subItem.errors.unitPrice = subItem.unitPrice <= 0 || isNaN(subItem.unitPrice)
      break
    case 'quantity':
      subItem.errors.quantity = subItem.quantity < 1 || isNaN(subItem.quantity)
      break
  }
}

const validateField = (item: MaterialItem, field: string) => {
  // Legacy function for backward compatibility
  if (item.subItems && item.subItems.length > 0) {
    // If it's a product with sub-items, validate the first sub-item
    const firstSubItem = item.subItems[0]
    if (firstSubItem) {
      validateSubItemField(firstSubItem, field)
    }
  }
}


// Watch for modal visibility changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    // Load saved form data when modal opens
    loadFormDataFromStorage()
    // Load available templates
    fetchAvailableTemplates()
    error.value = ''
    successMessage.value = ''
  } else {
    // Reset messages when modal closes
    error.value = ''
    successMessage.value = ''
    // Clear template selection
    selectedTemplateIds.value = []
    currentTemplateSelection.value = ''
  }
})

// Auto-save form data when it changes
watch([inputMode, materialsText, materialItems, uploadedFiles, designNotes], () => {
  if (props.isVisible) {
    saveFormDataToStorage()
  }
}, { deep: true })
</script>
