<template>
  <div class="max-w-9xl mx-auto space-y-6">
    <!-- Loading State -->
    <div v-if="!enquiry && enquiries.length === 0" class="bg-blue-100 dark:bg-blue-900 p-8 rounded-lg text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 class="text-lg font-medium text-blue-800 dark:text-blue-200">Loading Enquiry Data...</h3>
      <p class="text-sm text-blue-600 dark:text-blue-400 mt-2">
        Route ID: {{ route.params.id }}
      </p>
    </div>

    <!-- Department Access Error -->
    <div v-else-if="accessError" class="bg-yellow-100 dark:bg-yellow-900 p-8 rounded-lg text-center">
      <div class="w-16 h-16 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-200">Access Restricted</h3>
      <p class="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
        {{ accessError }}
      </p>
      <div class="flex justify-center space-x-3 mt-6">
        <button @click="retryAccess" class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
          Retry Access
        </button>
        <button @click="$router.push('/projects/enquiries')" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
          Back to Enquiries
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Enquiry Details Header -->
      <EnquiryDetails
        :enquiry="enquiry"
        :selected-project="selectedProject"
        :overall-progress="overallProgress"
        :project-progress-percentage="projectProgressPercentage"
        :project-completed-phases="projectCompletedPhases"
        :current-phase-index="currentPhaseIndex"
      />

      <!-- Workflow Steps -->
      <WorkflowSteps
        v-if="!selectedProject"
        :enquiry="enquiry"
        :current-detail-step="currentDetailStep"
        :step-statuses="stepStatuses"
        @step-click="handleStepClick"
      />

      <!-- Project Phases -->
      <ProjectPhases
        v-else
        :selected-project="selectedProject"
        :current-phase-index="currentPhaseIndex"
        :selected-quotation="selectedQuotation"
        @phase-click="setCurrentPhase"
        @previous-phase="goToPreviousPhase"
        @next-phase="goToNextPhase"
      />

      <!-- Detailed Content Area -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ selectedProject ? `Phase ${currentPhaseIndex + 1}: ${currentPhase?.name}` : getCurrentStepTitle() }}
          </h3>
          <div class="flex items-center space-x-2" v-if="selectedProject">
            <button @click="goToPreviousPhase" :disabled="!canGoToPreviousPhase" class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              ← Previous Phase
            </button>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Phase {{ currentPhaseIndex + 1 }} of {{ selectedProject.phases.length }}
            </span>
            <button @click="goToNextPhase" :disabled="!canGoToNextPhase" class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Next Phase →
            </button>
          </div>
          <div class="flex items-center space-x-2" v-else>
            <button @click="previousStep" :disabled="currentDetailStep <= 1" class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              ← Previous
            </button>
            <button @click="nextStep" :disabled="currentDetailStep >= 4" class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Next →
            </button>
          </div>
        </div>

        <!-- Step Content -->
        <div class="min-h-[400px]">
          <!-- Enquiry Details -->
          <div v-if="currentDetailStep === 1" class="space-y-6">
            <!-- Enquiry Header -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ enquiry?.title }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Enquiry Details & Information</p>
                </div>
              </div>
            </div>

            <!-- Description Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-2 mb-3">
                  <div class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <svg class="w-3 h-3 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                  <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Project Description</h5>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ enquiry?.description }}</p>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-2 mb-3">
                  <div class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <svg class="w-3 h-3 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Project Scope</h5>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ enquiry?.project_scope }}</p>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="grid grid-cols-1 gap-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Priority:</span>
                <span :class="getPriorityClass(enquiry?.priority)" class="text-sm font-medium px-2 py-1 rounded">
                  {{ enquiry?.priority }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Created:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ enquiry?.created_at ? formatDate(enquiry.created_at) : 'N/A' }}</span>
              </div>
              <div v-if="selectedSurvey" class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Survey Date:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedSurvey.site_visit_date) }}</span>
              </div>
              <div v-if="selectedSurvey" class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Survey Status:</span>
                <span :class="getStatusClass(selectedSurvey.status)" class="text-sm font-medium px-2 py-1 rounded">
                  {{ selectedSurvey.status.replace('_', ' ') }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="pt-2 border-t border-gray-200 dark:border-gray-600 space-y-2">
              <!-- Site Survey Button -->
              <button
                @click="openSurveyModal"
                class="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm"
              >
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                  <span>{{ selectedSurvey ? 'View Survey Details' : 'Schedule Site Survey' }}</span>
                </div>
              </button>

              <!-- Mark Complete Button -->
              <button
                v-if="selectedSurvey"
                @click="updateSurveyStatus('completed')"
                :class="selectedSurvey.status === 'completed' ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
                class="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 text-white text-sm rounded-md transition-colors font-medium"
                :disabled="selectedSurvey.status === 'completed'"
              >
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ selectedSurvey.status === 'completed' ? 'Survey Completed' : 'Mark Survey Complete' }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Design Concept and Materials Details -->
          <div v-if="currentDetailStep === 2" class="space-y-6">
            <!-- Creative Tasks Overview -->
            <div v-if="enquiry" class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Creative Workflow Status</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Progress: {{ getEnquiryProgress(enquiry.id) }}% complete</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="{ width: getEnquiryProgress(enquiry.id) + '%' }"></div>
                  </div>
                </div>
              </div>

              <!-- Task Status Grid -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span class="text-xs font-medium text-gray-900 dark:text-white">Design</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">0/1</span>
                  </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 rounded-full bg-green-500"></div>
                      <span class="text-xs font-medium text-gray-900 dark:text-white">Mockup</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">0/1</span>
                  </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span class="text-xs font-medium text-gray-900 dark:text-white">Render</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">0/1</span>
                  </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 rounded-full bg-red-500"></div>
                      <span class="text-xs font-medium text-gray-900 dark:text-white">Materials</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">0/1</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3 mt-4">
                <!-- Primary Materials Management Button -->
                <button
                  @click="openMaterialsModal"
                  class="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors font-medium"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  <span>Manage Materials & Specifications</span>
                </button>

                <!-- Creative Tasks Section -->
                <div class="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Creative Tasks</h5>
                  <div class="flex flex-wrap gap-2">
                    <!-- Create Tasks button -->
                    <button
                      @click="createCreativeTasks"
                      :disabled="isCreatingTasks"
                      class="inline-flex items-center space-x-2 px-3 py-2 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg v-if="isCreatingTasks" class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                      <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      <span>{{ isCreatingTasks ? 'Creating...' : 'Create Tasks' }}</span>
                    </button>

                    <!-- Navigate to Creatives -->
                    <button
                      @click="navigateToCreatives"
                      class="inline-flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                      <span>View Creative Tasks</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Materials and Quotation Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">Design Concept & Materials</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Total Items:</span>
                    <span class="text-sm font-medium">{{ materialItemsCount }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Total Cost:</span>
                    <span class="text-sm font-medium">KES {{ materialTotalCost.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">Quotation Status</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span v-if="selectedQuotation" :class="getQuotationStatusClass(selectedQuotation.status)" class="text-sm font-medium">
                      {{ selectedQuotation.status }}
                    </span>
                    <span v-else class="text-sm font-medium text-gray-500">Not created</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Quote Amount:</span>
                    <span v-if="selectedQuotation" class="text-sm font-medium">
                      KES {{ selectedQuotation.total_amount.toLocaleString() }}
                    </span>
                    <span v-else class="text-sm font-medium text-gray-500">Not calculated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Budget & Quote Preparation Details -->
          <div v-if="currentDetailStep === 3" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">Budget Information</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Material Cost:</span>
                    <span class="text-sm font-medium">KES {{ materialTotalCost.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Additional Costs:</span>
                    <span class="text-sm font-medium">KES 0</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Total Budget:</span>
                    <span class="text-sm font-medium">KES {{ materialTotalCost.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">Quote Status</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span v-if="selectedQuotation" :class="getQuotationStatusClass(selectedQuotation.status)" class="text-sm font-medium">
                      {{ selectedQuotation.status }}
                    </span>
                    <span v-else class="text-sm font-medium text-gray-500">Not created</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Quote Amount:</span>
                    <span v-if="selectedQuotation" class="text-sm font-medium">
                      KES {{ selectedQuotation.total_amount.toLocaleString() }}
                    </span>
                    <span v-else class="text-sm font-medium text-gray-500">Not calculated</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Action Buttons -->
            <div class="space-y-3">
              <!-- Primary Budget & Quote Button -->
              <button
                @click="openBudgetModal"
                class="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors font-medium"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
                <span>Create Budget & Prepare Quote</span>
              </button>

              <!-- Additional Actions -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  v-if="selectedQuotation"
                  @click="viewQuotation"
                  class="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <span>View Quotation</span>
                </button>
                <button
                  v-if="selectedQuotation && selectedQuotation.status === 'draft'"
                  @click="approveQuotation"
                  class="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Approve Quote</span>
                </button>
              </div>

              <!-- Quotation Status Display -->
              <div v-if="selectedQuotation" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Quotation Status:</span>
                  <span :class="getQuotationStatusClass(selectedQuotation.status)" class="text-sm font-medium px-2 py-1 rounded">
                    {{ selectedQuotation.status }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Total Amount: <span class="font-bold text-green-600">KES {{ selectedQuotation.total_amount.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Conversion -->
          <div v-if="!selectedProject && currentDetailStep === 4" class="space-y-6">
            <div v-if="selectedProject" class="space-y-6">
              <!-- Project Header -->
              <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      🎉 Project Created Successfully!
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Project ID: <span class="font-mono font-bold text-green-600 dark:text-green-400">#{{ Date.now() }}</span>
                    </p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm text-gray-600 dark:text-gray-400">Status</div>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      In Progress
                    </span>
                  </div>
                </div>
              </div>

              <!-- Project Phases -->
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Execution Phases</h4>
                <div class="text-center py-8">
                  <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Project Phases Available</h3>
                  <p class="text-gray-600 dark:text-gray-400">Navigate through the 10 project phases using the cards above</p>
                </div>
              </div>

              <!-- Project Summary -->
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Summary</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ completedPhases }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Completed Phases</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ inProgressPhases }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gray-600 dark:text-gray-400">{{ remainingPhases }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Ready for Production</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">All requirements are met. Click the button below to convert this enquiry into a production project.</p>

              <!-- Prerequisites Check -->
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Prerequisites Completed:</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">Site survey completed</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">Materials specified</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">Budget & quote approved</span>
                  </div>
                </div>
              </div>

              <button
                @click="startProduction"
                class="inline-flex items-center space-x-2 px-8 py-4 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span>Start Production Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modals -->
    <MaterialsModal
      :is-visible="showMaterialsModal"
      :enquiry="enquiry"
      :department="currentDepartment"
      @close="showMaterialsModal = false"
      @save="handleMaterialsSave"
    />

    <BudgetModal
      :is-visible="showBudgetModal"
      :enquiry="enquiry"
      :material-costs="budgetMaterialCosts"
      :material-elements="quoteMaterialElements"
      @close="showBudgetModal = false"
      @save="handleBudgetSave"
      @generate-quote="handleGenerateQuote"
    />

    <QuoteModal
      :is-visible="showQuoteModal"
      :enquiry="enquiry"
      :material-elements="quoteMaterialElements"
      @close="showQuoteModal = false"
      @save="handleQuoteSave"
    />

    <QuotationViewer
      :is-visible="showQuotationViewer"
      :quotation="currentQuotation"
      @close="showQuotationViewer = false"
    />

    <SiteSurveyModal
      :is-visible="showSiteSurveyModal"
      :enquiry="enquiry"
      :survey="selectedSurvey"
      @close="showSiteSurveyModal = false"
      @save="handleSiteSurveySave"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useWorkflowSteps } from '../composables/useWorkflowSteps'
import { useModalManagement } from '../composables/useModalManagement'

// Import extracted components
import EnquiryDetails from './components/EnquiryDetails.vue'
import WorkflowSteps from './components/WorkflowSteps.vue'
import ProjectPhases from './components/ProjectPhases.vue'
import MaterialsModal from '../components/MaterialsModal.vue'
import BudgetModal from '../components/BudgetModal.vue'
import QuoteModal from '../components/QuoteModal.vue'
import QuotationViewer from '../components/QuotationViewer.vue'
import SiteSurveyModal from '../components/SiteSurveyModal.vue'

const route = useRoute()

// Use extracted composables
const {
  enquiry,
  selectedSurvey,
  selectedQuotation,
  selectedProject,
  currentDetailStep,
  currentPhaseIndex,
  stepStatuses,
  overallProgress,
  currentPhase,
  projectProgressPercentage,
  projectCompletedPhases,
  canGoToPreviousPhase,
  canGoToNextPhase,
  completedPhases,
  inProgressPhases,
  remainingPhases,
  materialItemsCount,
  materialTotalCost,
  quotationApproved,
  workflowOffset,
  showMaterialsModal,
  showBudgetModal,
  showQuoteModal,
  showQuotationViewer,
  showSiteSurveyModal,
  budgetMaterialCosts,
  quoteMaterialElements,
  currentQuotation,
  enquiries,
  accessError,
  getEnquiryProgress,
  isCreatingTasks,
  currentDepartment,
  getCurrentStepTitle,
  formatDate,
  getPriorityClass,
  getStatusClass,
  getQuotationStatusClass,
  getPhaseStatusBadgeClass,
  getPhaseStatusText,
  getTaskStatusClass,
  getPhaseIconClass,
  updateStepStatus,
  previousStep,
  nextStep,
  handleStepClick,
  openSurveyModal,
  openMaterialsModal,
  openBudgetModal,
  handleMaterialsSave,
  handleBudgetSave,
  handleGenerateQuote,
  handleQuoteSave,
  handleSiteSurveySave,
  viewQuotation,
  startProduction,
  goToPreviousPhase,
  goToNextPhase,
  setCurrentPhase,
  approveQuotation,
  updateSurveyStatus,
  navigateToCreatives,
  createCreativeTasks,
  retryAccess
} = useWorkflowSteps()

// Modal management is handled by useWorkflowSteps composable
</script>
