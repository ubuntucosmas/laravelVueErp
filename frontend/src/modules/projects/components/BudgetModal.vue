<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Budget & Quote Preparation
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create comprehensive budget and quotation for {{ enquiry?.title }}
          </p>
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Auto-populated with material costs from design phase
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
      <div class="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
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

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column: Cost Breakdown -->
          <div class="space-y-6">
            <!-- Material Costs (Auto-populated) -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                  <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <h4 class="text-md font-semibold text-gray-900 dark:text-white">Material Costs</h4>
                </div>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Auto-populated
                </span>
              </div>

              <div class="space-y-4">
                <!-- Display hierarchical structure -->
                <div v-for="element in materialElements" :key="element.id"
                     class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <!-- Element Header -->
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-3">
                      <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ element.elementName }}</span>
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            :class="element.category === 'production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'">
                        {{ element.category }}
                      </span>
                    </div>
                    <span class="text-sm font-bold text-green-600 dark:text-green-400">
                      KES {{ getElementTotalCost(element).toLocaleString() }}
                    </span>
                  </div>

                  <!-- Sub-materials -->
                  <div class="ml-4 space-y-1">
                    <div v-for="subItem in element.subItems" :key="subItem.id"
                         class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 py-1">
                      <div class="flex items-center space-x-4">
                        <span>• {{ subItem.name }}</span>
                        <span>Qty: {{ subItem.quantity }}</span>
                        <span>Unit: {{ subItem.unit }}</span>
                        <span>@ KES {{ subItem.unitPrice.toLocaleString() }}</span>
                      </div>
                      <span class="font-medium">KES {{ (subItem.quantity * subItem.unitPrice).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Material Subtotal</span>
                  <span class="text-lg font-bold text-green-600 dark:text-green-400">KES {{ materialSubtotal.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Labor Costs -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="p-4 border-b border-gray-200 dark:border-gray-600">
                <button
                  @click="toggleSection('labor')"
                  class="w-full flex items-center justify-between text-left"
                >
                  <div class="flex items-center space-x-2">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <svg class="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-md font-semibold text-gray-900 dark:text-white">Labor Costs</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Workshop and site labor expenses</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-orange-600 dark:text-orange-400">KES {{ laborSubtotal.toLocaleString() }}</span>
                    <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': expandedSections.labor }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
              </div>

              <div v-if="expandedSections.labor" class="p-4 space-y-4">
                <!-- Workshop Labor -->
                <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div class="flex items-center justify-between mb-3">
                    <h5 class="text-sm font-medium text-gray-900 dark:text-white">Workshop Labor</h5>
                    <button
                      @click="addLaborItem('workshop')"
                      class="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700"
                    >
                      + Add
                    </button>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(item, index) in workshopLabor" :key="item.id"
                         class="flex items-center space-x-2 p-2 text-white rounded">
                      <input
                        v-model="item.description"
                        type="text"
                        placeholder="Labor description"
                        class="flex-1 text-sm border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                      />
                      <input
                        v-model.number="item.hours"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="Hours"
                        class="w-16 text-sm border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                      />
                      <input
                        v-model.number="item.ratePerHour"
                        type="number"
                        min="0"
                        placeholder="Rate/hr"
                        class="w-20 text-sm border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                      />
                      <span class="text-sm font-medium w-20 text-right">KES {{ (item.hours * item.ratePerHour).toLocaleString() }}</span>
                      <button
                        @click="removeLaborItem('workshop', index)"
                        class="text-red-600 hover:text-red-800"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Site Labor -->
                <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div class="flex items-center justify-between mb-3">
                    <h5 class="text-sm font-medium text-gray-900 dark:text-white">Site Labor</h5>
                    <button
                      @click="addLaborItem('site')"
                      class="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700"
                    >
                      + Add
                    </button>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(item, index) in siteLabor" :key="item.id"
                         class="flex items-center space-x-2 p-2 text-white rounded">
                      <input
                        v-model="item.description"
                        type="text"
                        placeholder="Labor description"
                        class="flex-1 text-sm border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                      />
                      <input
                        v-model.number="item.hours"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="Hours"
                        class="w-16 text-sm border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                      />
                      <input
                        v-model.number="item.ratePerHour"
                        type="number"
                        min="0"
                        placeholder="Rate/hr"
                        class="w-20 text-sm border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                      />
                      <span class="text-sm font-medium w-20 text-right">KES {{ (item.hours * item.ratePerHour).toLocaleString() }}</span>
                      <button
                        @click="removeLaborItem('site', index)"
                        class="text-red-600 hover:text-red-800"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Additional Costs -->
          <div class="space-y-6">
            <!-- Logistics Costs -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="p-4 border-b border-gray-200 dark:border-gray-600">
                <button
                  @click="toggleSection('logistics')"
                  class="w-full flex items-center justify-between text-left"
                >
                  <div class="flex items-center space-x-2">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-md font-semibold text-gray-900 dark:text-white">Logistics & Transportation</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Delivery, transportation, and shipping costs</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-purple-600 dark:text-purple-400">KES {{ logisticsSubtotal.toLocaleString() }}</span>
                    <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': expandedSections.logistics }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
              </div>

              <div v-if="expandedSections.logistics" class="p-4 space-y-3">
                <div v-for="(item, index) in logisticsCosts" :key="item.id"
                     class="flex items-center space-x-2 p-3 text-white rounded-lg">
                  <input
                    v-model="item.description"
                    type="text"
                    placeholder="Transportation, delivery, etc."
                    class="flex-1 text-sm border border-gray-300 dark:border-gray-500 rounded px-3 py-2"
                  />
                  <input
                    v-model.number="item.amount"
                    type="number"
                    min="0"
                    placeholder="Amount"
                    class="w-24 text-sm border border-gray-300 dark:border-gray-500 rounded px-3 py-2"
                  />
                  <button
                    @click="removeLogisticsItem(index)"
                    class="text-red-600 hover:text-red-800 p-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <button
                  @click="addLogisticsItem"
                  class="w-full p-2 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg text-purple-600 dark:text-purple-400 hover:border-purple-400 dark:hover:border-purple-500 text-sm"
                >
                  + Add Logistics Cost
                </button>
              </div>
            </div>

            <!-- Miscellaneous Costs -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="p-4 border-b border-gray-200 dark:border-gray-600">
                <button
                  @click="toggleSection('misc')"
                  class="w-full flex items-center justify-between text-left"
                >
                  <div class="flex items-center space-x-2">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-md font-semibold text-gray-900 dark:text-white">Miscellaneous Costs</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Additional expenses and contingencies</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">KES {{ miscSubtotal.toLocaleString() }}</span>
                    <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': expandedSections.misc }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
              </div>

              <div v-if="expandedSections.misc" class="p-4 space-y-3">
                <div v-for="(item, index) in miscCosts" :key="item.id"
                     class="flex items-center space-x-2 p-3 text-white rounded-lg">
                  <input
                    v-model="item.name"
                    type="text"
                    placeholder="Cost description"
                    class="flex-1 text-sm border border-gray-300 dark:border-gray-500 rounded px-3 py-2"
                  />
                  <input
                    v-model.number="item.amount"
                    type="number"
                    min="0"
                    placeholder="Amount"
                    class="w-24 text-sm border border-gray-300 dark:border-gray-500 rounded px-3 py-2"
                  />
                  <input
                    v-model="item.notes"
                    type="text"
                    placeholder="Notes"
                    class="w-32 text-sm border border-gray-300 dark:border-gray-500 rounded px-3 py-2"
                  />
                  <button
                    @click="removeMiscItem(index)"
                    class="text-red-600 hover:text-red-800 p-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <button
                  @click="addMiscItem"
                  class="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 text-sm"
                >
                  + Add Miscellaneous Cost
                </button>
              </div>
            </div>

            <!-- Additional Items -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="p-4 border-b border-gray-200 dark:border-gray-600">
                <button
                  @click="toggleSection('additionals')"
                  class="w-full flex items-center justify-between text-left"
                >
                  <div class="flex items-center space-x-2">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-md font-semibold text-gray-900 dark:text-white">Additional Items</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Client-requested additional items with separate budgets</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400">KES {{ additionalsSubtotal.toLocaleString() }}</span>
                    <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': expandedSections.additionals }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
              </div>

              <div v-if="expandedSections.additionals" class="p-4 space-y-4">
                <div v-for="(additional, additionalIndex) in additionals" :key="additional.id"
                     class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <!-- Additional Item Header -->
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex-1 space-y-2">
                      <input
                        v-model="additional.name"
                        type="text"
                        placeholder="Additional item name"
                        class="w-full text-sm font-medium text-white border border-gray-300 dark:border-gray-500 rounded px-3 py-2"
                      />
                      <input
                        v-model="additional.description"
                        type="text"
                        placeholder="Description"
                        class="w-full text-sm text-white border border-gray-300 dark:border-gray-500 rounded px-3 py-2"
                      />
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                      <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">KES {{ additional.subtotal.toLocaleString() }}</span>
                      <button
                        @click="removeAdditionalItem(additionalIndex)"
                        class="text-red-600 hover:text-red-800"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Additional Item Budget Breakdown -->
                  <div class="grid grid-cols-2 gap-4">
                    <!-- Materials for this additional -->
                    <div class="space-y-2">
                      <h5 class="text-sm font-medium text-gray-900 dark:text-white">Materials</h5>
                      <div v-for="(material, materialIndex) in additional.materials" :key="material.id"
                           class="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <input
                          v-model="material.name"
                          type="text"
                          placeholder="Material name"
                          class="flex-1 text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                        />
                        <input
                          v-model.number="material.quantity"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Qty"
                          class="w-16 text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                        />
                        <input
                          v-model.number="material.unitPrice"
                          type="number"
                          min="0"
                          placeholder="Unit Price"
                          class="w-20 text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                        />
                        <span class="text-xs font-medium w-16 text-right">KES {{ (material.quantity * material.unitPrice).toLocaleString() }}</span>
                        <button
                          @click="additional.materials.splice(materialIndex, 1); updateAdditionalSubtotal(additionalIndex)"
                          class="text-red-600 hover:text-red-800"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                      <button
                        @click="additional.materials.push({ id: Date.now().toString(), name: '', quantity: 0, unit: 'pcs', unitPrice: 0, category: 'production', totalCost: 0 }); updateAdditionalSubtotal(additionalIndex)"
                        class="w-full p-1 border border-dashed border-green-300 dark:border-green-600 rounded text-xs text-green-600 dark:text-green-400 hover:border-green-400"
                      >
                        + Add Material
                      </button>
                    </div>

                    <!-- Labor for this additional -->
                    <div class="space-y-2">
                      <h5 class="text-sm font-medium text-gray-900 dark:text-white">Labor</h5>
                      <div v-for="(labor, laborIndex) in additional.workshopLabor" :key="labor.id"
                           class="flex items-center space-x-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <input
                          v-model="labor.description"
                          type="text"
                          placeholder="Labor description"
                          class="flex-1 text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                        />
                        <input
                          v-model.number="labor.hours"
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="Hours"
                          class="w-12 text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                        />
                        <input
                          v-model.number="labor.ratePerHour"
                          type="number"
                          min="0"
                          placeholder="Rate/hr"
                          class="w-16 text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                        />
                        <span class="text-xs font-medium w-16 text-right">KES {{ (labor.hours * labor.ratePerHour).toLocaleString() }}</span>
                        <button
                          @click="additional.workshopLabor.splice(laborIndex, 1); updateAdditionalSubtotal(additionalIndex)"
                          class="text-red-600 hover:text-red-800"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                      <button
                        @click="additional.workshopLabor.push({ id: Date.now().toString(), description: '', hours: 0, ratePerHour: 0 }); updateAdditionalSubtotal(additionalIndex)"
                        class="w-full p-1 border border-dashed border-orange-300 dark:border-orange-600 rounded text-xs text-orange-600 dark:text-orange-400 hover:border-orange-400"
                      >
                        + Add Labor
                      </button>
                    </div>
                  </div>

                  <!-- Logistics and Misc for this additional -->
                  <div class="grid grid-cols-2 gap-4 mt-4">
                    <!-- Logistics for this additional -->
                    <div class="space-y-2">
                      <h5 class="text-sm font-medium text-gray-900 dark:text-white">Logistics</h5>
                      <div v-for="(logistic, logisticIndex) in additional.logisticsCosts" :key="logistic.id"
                           class="flex items-center space-x-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <input
                          v-model="logistic.description"
                          type="text"
                          placeholder="Logistics description"
                          class="flex-1 text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                        />
                        <input
                          v-model.number="logistic.amount"
                          type="number"
                          min="0"
                          placeholder="Amount"
                          class="w-20 text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                        />
                        <button
                          @click="additional.logisticsCosts.splice(logisticIndex, 1); updateAdditionalSubtotal(additionalIndex)"
                          class="text-red-600 hover:text-red-800"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                      <button
                        @click="additional.logisticsCosts.push({ id: Date.now().toString(), description: '', amount: 0 }); updateAdditionalSubtotal(additionalIndex)"
                        class="w-full p-1 border border-dashed border-purple-300 dark:border-purple-600 rounded text-xs text-purple-600 dark:text-purple-400 hover:border-purple-400"
                      >
                        + Add Logistics
                      </button>
                    </div>

                    <!-- Misc for this additional -->
                    <div class="space-y-2">
                      <h5 class="text-sm font-medium text-gray-900 dark:text-white">Miscellaneous</h5>
                      <div v-for="(misc, miscIndex) in additional.miscCosts" :key="misc.id"
                           class="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <input
                          v-model="misc.name"
                          type="text"
                          placeholder="Misc description"
                          class="flex-1 text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                        />
                        <input
                          v-model.number="misc.amount"
                          type="number"
                          min="0"
                          placeholder="Amount"
                          class="w-20 text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1"
                        />
                        <button
                          @click="additional.miscCosts.splice(miscIndex, 1); updateAdditionalSubtotal(additionalIndex)"
                          class="text-red-600 hover:text-red-800"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                      <button
                        @click="additional.miscCosts.push({ id: Date.now().toString(), name: '', amount: 0, notes: '' }); updateAdditionalSubtotal(additionalIndex)"
                        class="w-full p-1 border border-dashed border-gray-300 dark:border-gray-600 rounded text-xs text-gray-600 dark:text-gray-400 hover:border-gray-400"
                      >
                        + Add Misc
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  @click="addAdditionalItem"
                  class="w-full p-3 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500 text-sm font-medium"
                >
                  + Add Additional Item
                </button>
              </div>
            </div>

            <!-- Budget Summary -->
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Budget Summary</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Material Costs:</span>
                  <span class="font-medium">KES {{ materialSubtotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Labor Costs:</span>
                  <span class="font-medium">KES {{ laborSubtotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Logistics:</span>
                  <span class="font-medium">KES {{ logisticsSubtotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Miscellaneous:</span>
                  <span class="font-medium">KES {{ miscSubtotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Additional Items:</span>
                  <span class="font-medium">KES {{ additionalsSubtotal.toLocaleString() }}</span>
                </div>
                <div class="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <div class="flex justify-between">
                    <span class="font-semibold text-gray-900 dark:text-white">Total Budget:</span>
                    <span class="font-bold text-lg text-blue-600 dark:text-blue-400">KES {{ totalBudget.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div class="flex items-center space-x-4">
          <button
            @click="calculateTotal"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            <span>Calculate Total</span>
          </button>
          <button
            @click="generateQuote"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Generate Main Quotation</span>
          </button>
          <button
            v-if="additionals.length > 0"
            @click="generateAdditionalsQuote"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span>Generate Additionals Quote</span>
          </button>
          <button
            @click="saveBudget"
            :disabled="isSaving"
            class="inline-flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ isSaving ? 'Saving...' : 'Save Budget' }}</span>
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

// Props
interface Props {
  isVisible: boolean
  enquiry: Enquiry | null
  materialCosts?: MaterialCost[]
  materialElements?: any[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  save: [budget: BudgetData]
  generateQuote: [materialElements: any[]]
  generateAdditionalsQuote: [additionals: AdditionalItem[]]
}>()

// Types
interface MaterialCost {
  id: string
  name: string
  quantity: number
  unit: string
  unitPrice: number
  category: 'production' | 'hire'
  totalCost: number
}

interface LaborItem {
  id: string
  description: string
  hours: number
  ratePerHour: number
}

interface LogisticsItem {
  id: string
  description: string
  amount: number
}

interface MiscItem {
  id: string
  name: string
  amount: number
  notes: string
}

interface AdditionalItem {
  id: string
  name: string
  description: string
  materials: MaterialCost[]
  workshopLabor: LaborItem[]
  siteLabor: LaborItem[]
  logisticsCosts: LogisticsItem[]
  miscCosts: MiscItem[]
  subtotal: number
}

interface BudgetData {
  materialCosts: MaterialCost[]
  workshopLabor: LaborItem[]
  siteLabor: LaborItem[]
  logisticsCosts: LogisticsItem[]
  miscCosts: MiscItem[]
  additionals: AdditionalItem[]
  totals: {
    materialSubtotal: number
    laborSubtotal: number
    logisticsSubtotal: number
    miscSubtotal: number
    additionalsSubtotal: number
    totalBudget: number
  }
}

// Reactive data
const materialCosts = ref<MaterialCost[]>([])
const materialElements = ref<any[]>([])
const workshopLabor = ref<LaborItem[]>([])
const siteLabor = ref<LaborItem[]>([])
const logisticsCosts = ref<LogisticsItem[]>([])
const miscCosts = ref<MiscItem[]>([])
const additionals = ref<AdditionalItem[]>([])
const expandedSections = ref({
  labor: false,
  logistics: false,
  misc: false,
  additionals: false
})
const error = ref('')
const successMessage = ref('')
const isSaving = ref(false)

// Initialize material costs from props
watch(() => props.materialCosts, (newCosts) => {
  if (newCosts && newCosts.length > 0) {
    // Material costs are already flattened, just assign them
    materialCosts.value = [...newCosts]
  }
}, { immediate: true })

// Initialize material elements from props
watch(() => props.materialElements, (newElements) => {
  if (newElements && newElements.length > 0) {
    materialElements.value = [...newElements]
  }
}, { immediate: true })

// Computed properties
const materialSubtotal = computed(() => {
  return materialCosts.value.reduce((total, item) => total + item.totalCost, 0)
})

const laborSubtotal = computed(() => {
  const workshopTotal = workshopLabor.value.reduce((total, item) => total + (item.hours * item.ratePerHour), 0)
  const siteTotal = siteLabor.value.reduce((total, item) => total + (item.hours * item.ratePerHour), 0)
  return workshopTotal + siteTotal
})

const logisticsSubtotal = computed(() => {
  return logisticsCosts.value.reduce((total, item) => total + item.amount, 0)
})

const miscSubtotal = computed(() => {
  return miscCosts.value.reduce((total, item) => total + item.amount, 0)
})

const additionalsSubtotal = computed(() => {
  return additionals.value.reduce((total, item) => total + item.subtotal, 0)
})

const totalBudget = computed(() => {
  return materialSubtotal.value + laborSubtotal.value + logisticsSubtotal.value + miscSubtotal.value + additionalsSubtotal.value
})

// Methods
const closeModal = () => {
  emit('close')
}

const getElementTotalCost = (element: any): number => {
  if (!element.subItems) return 0
  return element.subItems.reduce((total: number, subItem: any) => {
    return total + (subItem.quantity * subItem.unitPrice)
  }, 0)
}

const generateQuote = () => {
  // Emit event to open quote modal with material elements
  emit('generateQuote', materialElements.value)
  closeModal()
}

const generateAdditionalsQuote = () => {
  // Emit event to generate quote for additionals only
  emit('generateAdditionalsQuote', additionals.value)
  closeModal()
}

const toggleSection = (section: keyof typeof expandedSections.value) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

const addLaborItem = (type: 'workshop' | 'site') => {
  const newItem: LaborItem = {
    id: Date.now().toString(),
    description: '',
    hours: 0,
    ratePerHour: 0
  }

  if (type === 'workshop') {
    workshopLabor.value.push(newItem)
  } else {
    siteLabor.value.push(newItem)
  }
}

const removeLaborItem = (type: 'workshop' | 'site', index: number) => {
  if (type === 'workshop') {
    workshopLabor.value.splice(index, 1)
  } else {
    siteLabor.value.splice(index, 1)
  }
}

const addLogisticsItem = () => {
  logisticsCosts.value.push({
    id: Date.now().toString(),
    description: '',
    amount: 0
  })
}

const removeLogisticsItem = (index: number) => {
  logisticsCosts.value.splice(index, 1)
}

const addMiscItem = () => {
  miscCosts.value.push({
    id: Date.now().toString(),
    name: '',
    amount: 0,
    notes: ''
  })
}

const removeMiscItem = (index: number) => {
  miscCosts.value.splice(index, 1)
}

const addAdditionalItem = () => {
  const newItem: AdditionalItem = {
    id: Date.now().toString(),
    name: '',
    description: '',
    materials: [],
    workshopLabor: [],
    siteLabor: [],
    logisticsCosts: [],
    miscCosts: [],
    subtotal: 0
  }
  additionals.value.push(newItem)
}

const removeAdditionalItem = (index: number) => {
  additionals.value.splice(index, 1)
}

const calculateAdditionalSubtotal = (additional: AdditionalItem): number => {
  const materialTotal = additional.materials.reduce((total, item) => total + item.totalCost, 0)
  const workshopTotal = additional.workshopLabor.reduce((total, item) => total + (item.hours * item.ratePerHour), 0)
  const siteTotal = additional.siteLabor.reduce((total, item) => total + (item.hours * item.ratePerHour), 0)
  const logisticsTotal = additional.logisticsCosts.reduce((total, item) => total + item.amount, 0)
  const miscTotal = additional.miscCosts.reduce((total, item) => total + item.amount, 0)
  return materialTotal + workshopTotal + siteTotal + logisticsTotal + miscTotal
}

const updateAdditionalSubtotal = (index: number) => {
  additionals.value[index].subtotal = calculateAdditionalSubtotal(additionals.value[index])
}

const calculateTotal = () => {
  // Force recalculation of computed properties
  console.log('Total budget calculated:', totalBudget.value)
  successMessage.value = `Budget total calculated: KES ${totalBudget.value.toLocaleString()}`
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const saveBudget = async () => {
  // Clear previous messages
  error.value = ''
  successMessage.value = ''

  // Basic validation
  if (totalBudget.value <= 0) {
    error.value = 'Budget total must be greater than zero.'
    return
  }

  isSaving.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const budgetData: BudgetData = {
      materialCosts: materialCosts.value,
      workshopLabor: workshopLabor.value,
      siteLabor: siteLabor.value,
      logisticsCosts: logisticsCosts.value,
      miscCosts: miscCosts.value,
      additionals: additionals.value,
      totals: {
        materialSubtotal: materialSubtotal.value,
        laborSubtotal: laborSubtotal.value,
        logisticsSubtotal: logisticsSubtotal.value,
        miscSubtotal: miscSubtotal.value,
        additionalsSubtotal: additionalsSubtotal.value,
        totalBudget: totalBudget.value
      }
    }

    emit('save', budgetData)

    successMessage.value = `Budget saved successfully! Total: KES ${totalBudget.value.toLocaleString()}`

    // Auto-close after success
    setTimeout(() => {
      closeModal()
    }, 2000)

  } catch (err) {
    console.error('Save failed:', err)
    error.value = 'Failed to save budget. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// Watch for modal visibility changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    error.value = ''
    successMessage.value = ''
    // Expand labor section by default for better UX
    expandedSections.value.labor = true
  }
})
</script>
