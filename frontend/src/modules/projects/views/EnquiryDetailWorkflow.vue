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

    <!-- Error State -->
    <div v-else-if="!enquiry && enquiries.length > 0" class="bg-red-100 dark:bg-red-900 p-8 rounded-lg text-center">
      <div class="w-16 h-16 bg-red-200 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-red-800 dark:text-red-200">Enquiry Not Found</h3>
      <p class="text-sm text-red-600 dark:text-red-400 mt-2">
        Could not find enquiry with ID: {{ route.params.id }}
      </p>
      <p class="text-xs text-red-500 dark:text-red-500 mt-2">
        Available enquiry IDs: {{ enquiries.map(e => e.id).join(', ') }}
      </p>
      <button
        @click="$router.push('/projects/enquiries')"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Back to Enquiries
      </button>
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

      <!-- Department-specific error details -->
      <div v-if="currentDepartment" class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-800/50 rounded-lg">
        <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Access Requirements</h4>
        <div class="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
          <p v-if="currentDepartment === 'creatives'">• Enquiry must be in 'design_completed' or 'materials_specified' status</p>
          <p v-if="currentDepartment === 'design'">• Enquiry must be in 'design_completed' or 'materials_specified' status</p>
          <p v-if="currentDepartment === 'survey'">• Enquiry must be in 'enquiry_logged' or 'client_registered' status</p>
          <p v-if="currentDepartment === 'procurement'">• Enquiry must be in 'materials_specified' or 'budget_created' status</p>
          <p v-if="currentDepartment === 'projects'">• Enquiry must be in 'quote_approved' or 'converted_to_project' status</p>
          <p>• You must have the required permissions for this department</p>
        </div>
      </div>

      <!-- Current enquiry status -->
      <div v-if="enquiry" class="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
        <div class="text-sm">
          <span class="font-medium text-gray-700 dark:text-gray-300">Current Status:</span>
          <span class="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
            {{ enquiry.status?.replace('_', ' ') }}
          </span>
        </div>
      </div>

      <div class="flex justify-center space-x-3 mt-6">
        <button
          @click="retryAccess"
          class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          Retry Access
        </button>
        <button
          @click="$router.push('/projects/enquiries')"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Back to Enquiries
        </button>
      </div>
    </div>

    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ selectedProject ? 'Project Workflow' : 'Enquiry Workflow' }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            {{ selectedProject ? selectedProject.name : enquiry?.title }}
          </p>
          <div v-if="selectedProject" class="flex items-center space-x-4 mt-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Phase {{ currentPhaseIndex + 1 }} of {{ selectedProject.phases.length }}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ projectCompletedPhases }}/{{ selectedProject.phases.length }} phases completed
            </span>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <div class="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              <span v-if="workflowOffset === -100 && !selectedProject">Creating Project...</span>
              <span v-else-if="selectedProject">{{ Math.round(projectProgressPercentage) }}%</span>
              <span v-else>{{ overallProgress }}%</span>
            </div>
          </div>
          <!-- Information Cards -->
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
               <div class="flex items-center space-x-2 mb-3">
                 <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                   <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                   </svg>
                 </div>
                 <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Enquiry Information</h5>
               </div>
               <div class="space-y-3">
                 <div class="flex items-center justify-between">
                   <span class="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                   <span :class="getPriorityClass(enquiry?.priority)" class="text-sm font-medium px-2 py-1 rounded">
                     {{ enquiry?.priority }}
                   </span>
                 </div>
                 <div class="flex items-center justify-between">
                   <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                   <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry?.status?.replace('_', ' ') }}</span>
                 </div>
                 <div class="flex items-center justify-between">
                   <span class="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                   <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry?.created_at ? formatDate(enquiry.created_at) : 'N/A' }}</span>
                 </div>
               </div>
             </div>

             <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
               <div class="flex items-center space-x-2 mb-3">
                 <div class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                   <svg class="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                   </svg>
                 </div>
                 <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Client Information</h5>
               </div>
               <div class="space-y-3">
                 <div class="flex items-center justify-between">
                   <span class="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                   <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry?.client?.name }}</span>
                 </div>
                 <div class="flex items-center justify-between">
                   <span class="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                   <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry?.client?.email }}</span>
                 </div>
                 <div class="flex items-center justify-between">
                   <span class="text-sm text-gray-600 dark:text-gray-400">Contact:</span>
                   <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry?.client?.email }}</span>
                 </div>
               </div>
             </div>
           </div>
          <button
            @click="$router.push('/projects/enquiries')"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ← Back to Enquiries
          </button>
        </div>
      </div>
    </div>

    <!-- Workflow Steps -->
    <div class="relative overflow-hidden">
      <div class="w-full px-4">
        <!-- Enquiry Workflow Cards -->
        <div
          v-if="!selectedProject"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
      <!-- Step 1: Enquiry & Site Survey -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
            :class="getStepBorderClass(1)">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    :class="getStepNumberClass(1)">
                1
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Enquiry & Site Survey</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Project request & assessment</p>
              </div>
            </div>
            <span :class="getStatusBadgeClass(getStepStatus(1))" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
              {{ getStepStatusText(1) }}
            </span>
          </div>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div class="text-sm">
              <span class="font-medium">Priority:</span>
              <span :class="getPriorityClass(enquiry?.priority)">
                {{ enquiry?.priority }}
              </span>
            </div>
            <div class="text-sm">
              <span class="font-medium">Created:</span>
              <span class="text-gray-500">{{ enquiry?.created_at ? formatDate(enquiry.created_at) : 'N/A' }}</span>
            </div>
            <div v-if="selectedSurvey" class="text-sm">
              <span class="font-medium">Survey Date:</span>
              <span class="text-gray-500">{{ formatDate(selectedSurvey.site_visit_date) }}</span>
            </div>
            <div v-if="selectedSurvey" class="text-sm">
              <span class="font-medium">Survey Status:</span>
              <span :class="getStatusClass(selectedSurvey.status)">
                {{ selectedSurvey.status.replace('_', ' ') }}
              </span>
            </div>
            <button
              v-if="enquiry"
              @click="openSurveyModal"
              class="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
              :disabled="!enquiry"
            >
              {{ selectedSurvey ? 'View Survey' : 'Schedule Survey' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Material Specification -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
            :class="getStepBorderClass(2)">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    :class="getStepNumberClass(2)">
                2
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Design Concept and Material Specification</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Creative work & requirements</p>
              </div>
            </div>
            <span :class="getStatusBadgeClass(getStepStatus(2))" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
              {{ getStepStatusText(2) }}
            </span>
          </div>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <!-- Department-specific header -->

            <div class="text-sm">
              <span class="font-medium">Materials:</span>
              <span class="text-gray-500">{{ materialItemsCount }} items</span>
            </div>
            <div v-if="enquiry" class="text-sm">
              <span class="font-medium">Creative Progress:</span>
              <span class="text-gray-500">{{ getEnquiryProgress(enquiry.id) }}% complete</span>
            </div>

            <!-- Department-specific error handling -->
            <div v-if="integrationError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  <span class="text-sm font-medium text-red-800 dark:text-red-200">Creative Tasks Error</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="retryCreativeTasks"
                    class="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span>Retry</span>
                  </button>
                  <button
                    @click="clearError"
                    class="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
              <p class="text-sm text-red-700 dark:text-red-300 mt-2">{{ integrationError }}</p>
            </div>

            <!-- Department-specific action buttons -->
            <div class="flex flex-col space-y-2">
              <div class="flex space-x-2">
                <button
                  @click="openMaterialsModal"
                  class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
                >
                  Manage Materials
                </button>
                <button
                  v-if="enquiry && canAccessCreatives(enquiry)"
                  @click="navigateToCreatives"
                  class="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
                  :disabled="isCreatingTasks"
                >
                  <span v-if="isCreatingTasks">Creating Tasks...</span>
                  <span v-else>Creative Tasks</span>
                </button>
                <button
                  v-else-if="enquiry && canCreateTasks(enquiry)"
                  @click="createCreativeTasks"
                  class="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
                  :disabled="isCreatingTasks"
                >
                  <span v-if="isCreatingTasks">Creating Tasks...</span>
                  <span v-else>Create Creative Tasks</span>
                </button>
                <button
                  v-if="(currentDepartment === 'creatives' || currentDepartment === 'design') && enquiry"
                  @click="completeDepartmentTask(enquiry!, 'materials')"
                  class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
                >
                  Complete Materials Task
                </button>
              </div>

              <!-- Design-specific button for comprehensive material list management -->
              <button
                v-if="currentDepartment === 'design' && enquiry"
                @click="openDesignMaterialModal"
                class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm py-3 px-4 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span>Manage Material List and Design</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Budget & Quote Preparation -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
            :class="getStepBorderClass(3)">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    :class="getStepNumberClass(3)">
                3
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Budget & Quote Preparation</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Cost calculation & quotation</p>
              </div>
            </div>
            <span :class="getStatusBadgeClass(getStepStatus(3))" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
              {{ getStepStatusText(3) }}
            </span>
          </div>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div class="text-sm">
              <span class="font-medium">Total Cost:</span>
              <span class="text-gray-500">KES {{ materialTotalCost.toLocaleString() }}</span>
            </div>
            <div class="text-sm">
              <span class="font-medium">Quotation:</span>
              <span v-if="selectedQuotation" :class="getQuotationStatusClass(selectedQuotation.status)">
                {{ selectedQuotation.status }}
              </span>
              <span v-else class="text-gray-500">Not created</span>
              <button
                v-if="selectedQuotation"
                @click="viewQuotation"
                class="ml-2 inline-flex items-center space-x-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span>View</span>
              </button>
            </div>
            <button
              @click="openBudgetModal"
              class="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
            >
              Create Budget & Quote
            </button>
          </div>
        </div>
      </div>


      <!-- Step 4: Project Conversion -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
           :class="getStepBorderClass(10)">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                   :class="getStepNumberClass(10)">
                10
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Project Conversion</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Production ready</p>
              </div>
            </div>
            <span :class="getStatusBadgeClass(getStepStatus(10))" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
              {{ getStepStatusText(4) }}
            </span>
          </div>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div v-if="selectedProject" class="text-sm">
              <span class="font-medium">Project ID:</span>
              <span class="text-gray-500">#{{ Date.now() }}</span>
            </div>
            <button
              @click="startProduction"
              class="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
            >
              Start Production
            </button>
          </div>
        </div>

       <!-- Project Phases (Available when quotation is approved) -->
       <div v-if="selectedQuotation && selectedQuotation.status === 'approved'" class="mt-8">
         <div class="flex items-center justify-between mb-6">
           <h3 class="text-xl font-bold text-gray-900 dark:text-white">Project Execution Phases</h3>
           <div class="text-sm text-gray-600 dark:text-gray-400">
             Track progress through all project stages
           </div>
         </div>

         <!-- Phase Progress Overview -->
         <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-6">
           <div class="flex items-center justify-between">
             <div>
               <h4 class="font-semibold text-gray-900 dark:text-white">Overall Progress</h4>
               <p class="text-sm text-gray-600 dark:text-gray-400">0 of 7 phases completed</p>
             </div>
             <div class="text-right">
               <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">40%</div>
               <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                 <div class="bg-blue-600 h-2 rounded-full" style="width: 40%"></div>
               </div>
             </div>
           </div>
         </div>

         <!-- Project Phase Cards (Matching Workflow Style) -->
         <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
           <!-- Phase 1: Client Engagement & Briefing -->
           <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 cursor-pointer"
                :class="{
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20': currentPhaseIndex === 0,
                  'border-green-500 bg-green-50 dark:bg-green-900/20': selectedProject.phases[0].status === 'Completed',
                  'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20': selectedProject.phases[0].status === 'In Progress',
                  'border-gray-300 dark:border-gray-600': selectedProject.phases[0].status === 'Not Started'
                }"
                @click="setCurrentPhase(0)">
             <div class="p-4 border-b border-gray-200 dark:border-gray-700">
               <div class="flex items-center justify-between">
                 <div class="flex items-center space-x-3">
                   <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        :class="getStepNumberClass(1)">
                     1
                   </div>
                   <div>
                     <h3 class="text-sm font-medium text-gray-900 dark:text-white">Client Engagement</h3>
                     <p class="text-xs text-gray-600 dark:text-gray-400">Initial meetings & briefs</p>
                   </div>
                 </div>
                 <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                   Completed
                 </span>
               </div>
             </div>
             <div class="p-4">
               <div class="space-y-3">
                 <div class="text-sm">
                   <span class="font-medium">Duration:</span>
                   <span class="text-gray-500 ml-2">5 days</span>
                 </div>
                 <div class="text-sm">
                   <span class="font-medium">Assigned:</span>
                   <span class="text-gray-500 ml-2">Project Officer</span>
                 </div>
                 <div class="text-sm">
                   <span class="font-medium">Status:</span>
                   <span class="text-green-600 ml-2">Phase foundation completed</span>
                 </div>
               </div>
             </div>
           </div>

           <!-- Phase 2: Design & Concept Development -->
           <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
                :class="getStepBorderClass(2)">
             <div class="p-4 border-b border-gray-200 dark:border-gray-700">
               <div class="flex items-center justify-between">
                 <div class="flex items-center space-x-3">
                   <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        :class="getStepNumberClass(2)">
                     2
                   </div>
                   <div>
                     <h3 class="text-sm font-medium text-gray-900 dark:text-white">Design & Concept</h3>
                     <p class="text-xs text-gray-600 dark:text-gray-400">Creative development</p>
                   </div>
                 </div>
                 <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                   In Progress
                 </span>
               </div>
             </div>
             <div class="p-4">
               <div class="space-y-3">
                 <div class="text-sm">
                   <span class="font-medium">Duration:</span>
                   <span class="text-gray-500 ml-2">9 days</span>
                 </div>
                 <div class="text-sm">
                   <span class="font-medium">Assigned:</span>
                   <span class="text-gray-500 ml-2">Design Officer</span>
                 </div>
                 <div class="text-sm">
                   <span class="font-medium">Status:</span>
                   <span class="text-blue-600 ml-2">Creating design concepts</span>
                 </div>
               </div>
             </div>
           </div>

            <!-- Phase 3: Project Material List -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
                 :class="getStepBorderClass(3)">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="getStepNumberClass(3)">
                      3
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">Material List</h3>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Procurement planning</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Pending
                  </span>
                </div>
              </div>
              <div class="p-4">
                <div class="space-y-3">
                  <div class="text-sm">
                    <span class="font-medium">Duration:</span>
                    <span class="text-gray-500 ml-2">4 days</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Assigned:</span>
                    <span class="text-gray-500 ml-2">Procurement Officer</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Status:</span>
                    <span class="text-yellow-600 ml-2">Creating material specifications</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phase 4: Budget & Quotation -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
                 :class="getStepBorderClass(4)">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="getStepNumberClass(4)">
                      4
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">Budget & Quote</h3>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Financial planning</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Approved
                  </span>
                </div>
              </div>
              <div class="p-4">
                <div class="space-y-3">
                  <div class="text-sm">
                    <span class="font-medium">Duration:</span>
                    <span class="text-gray-500 ml-2">4 days</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Assigned:</span>
                    <span class="text-gray-500 ml-2">Project Lead</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Status:</span>
                    <span class="text-green-600 ml-2">Quotation approved by client</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phase 5: Production -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
                 :class="getStepBorderClass(5)">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="getStepNumberClass(5)">
                      5
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">Production</h3>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Manufacturing</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Not Started
                  </span>
                </div>
              </div>
              <div class="p-4">
                <div class="space-y-3">
                  <div class="text-sm">
                    <span class="font-medium">Duration:</span>
                    <span class="text-gray-500 ml-2">4 days</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Assigned:</span>
                    <span class="text-gray-500 ml-2">Production Manager</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Status:</span>
                    <span class="text-gray-600 ml-2">Waiting for approval</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phase 6: Logistics -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
                 :class="getStepBorderClass(6)">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="getStepNumberClass(6)">
                      6
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">Logistics</h3>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Transportation</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Not Started
                  </span>
                </div>
              </div>
              <div class="p-4">
                <div class="space-y-3">
                  <div class="text-sm">
                    <span class="font-medium">Duration:</span>
                    <span class="text-gray-500 ml-2">3 days</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Assigned:</span>
                    <span class="text-gray-500 ml-2">Logistics Coordinator</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Status:</span>
                    <span class="text-gray-600 ml-2">Planning transportation</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phase 7: Event Setup & Execution -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
                 :class="getStepBorderClass(7)">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="getStepNumberClass(7)">
                      7
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">Event Setup</h3>
                      <p class="text-xs text-gray-600 dark:text-gray-400">On-site setup</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Not Started
                  </span>
                </div>
              </div>
              <div class="p-4">
                <div class="space-y-3">
                  <div class="text-sm">
                    <span class="font-medium">Duration:</span>
                    <span class="text-gray-500 ml-2">4 days</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Assigned:</span>
                    <span class="text-gray-500 ml-2">Installation Team</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Status:</span>
                    <span class="text-gray-600 ml-2">Preparing setup equipment</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phase 8: Client Handover -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
                 :class="getStepBorderClass(8)">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="getStepNumberClass(8)">
                      8
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">Client Handover</h3>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Final delivery</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Not Started
                  </span>
                </div>
              </div>
              <div class="p-4">
                <div class="space-y-3">
                  <div class="text-sm">
                    <span class="font-medium">Duration:</span>
                    <span class="text-gray-500 ml-2">2 days</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Assigned:</span>
                    <span class="text-gray-500 ml-2">Project Lead</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Status:</span>
                    <span class="text-gray-600 ml-2">Preparing handover documentation</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phase 9: Set Down & Return -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
                 :class="getStepBorderClass(9)">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="getStepNumberClass(9)">
                      9
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">Set Down & Return</h3>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Post-event cleanup</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Not Started
                  </span>
                </div>
              </div>
              <div class="p-4">
                <div class="space-y-3">
                  <div class="text-sm">
                    <span class="font-medium">Duration:</span>
                    <span class="text-gray-500 ml-2">4 days</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Assigned:</span>
                    <span class="text-gray-500 ml-2">Operations Team</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Status:</span>
                    <span class="text-gray-600 ml-2">Planning equipment return</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phase 10: Archival & Reporting -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200"
                 :class="getStepBorderClass(4)">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="getStepNumberClass(4)">
                      10
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">Archival & Reporting</h3>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Final documentation</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Not Started
                  </span>
                </div>
              </div>
              <div class="p-4">
                <div class="space-y-3">
                  <div class="text-sm">
                    <span class="font-medium">Duration:</span>
                    <span class="text-gray-500 ml-2">1 day</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Assigned:</span>
                    <span class="text-gray-500 ml-2">Project Lead</span>
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Status:</span>
                    <span class="text-gray-600 ml-2">Preparing final reports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Content Area -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ selectedProject ? `Phase ${currentPhaseIndex + 1}: ${currentPhase?.name}` : getCurrentStepTitle() }}
        </h3>
        <div class="flex items-center space-x-2" v-if="selectedProject">
          <button
            @click="goToPreviousPhase"
            :disabled="!canGoToPreviousPhase"
            class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous Phase
          </button>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Phase {{ currentPhaseIndex + 1 }} of {{ selectedProject.phases.length }}
          </span>
          <button
            @click="goToNextPhase"
            :disabled="!canGoToNextPhase"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next Phase →
          </button>
        </div>
        <div class="flex items-center space-x-2" v-else>
          <button
            @click="previousStep"
            :disabled="currentDetailStep <= 1"
            class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <button
            @click="nextStep"
            :disabled="currentDetailStep >= 4"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
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
         </div>

        <!-- Site Survey Details -->
        <div v-if="currentDetailStep === 2" class="space-y-6">
           <!-- Site Survey Header -->
           <div class="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800">
             <div class="flex items-center space-x-3">
               <div class="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                 <svg class="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                 </svg>
               </div>
               <div>
                 <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Site Survey Assessment</h4>
                 <p class="text-sm text-gray-600 dark:text-gray-400">Project site evaluation and requirements analysis</p>
               </div>
             </div>
           </div>

           <div v-if="selectedSurvey" class="space-y-4">
             <!-- Survey Information Cards -->
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                 <div class="flex items-center space-x-2 mb-3">
                   <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                     <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                     </svg>
                   </div>
                   <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Survey Information</h5>
                 </div>
                 <div class="space-y-3">
                   <div class="flex items-center justify-between">
                     <span class="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                     <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedSurvey.site_visit_date) }}</span>
                   </div>
                   <div class="flex items-center justify-between">
                     <span class="text-sm text-gray-600 dark:text-gray-400">Location:</span>
                     <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedSurvey.location }}</span>
                   </div>
                   <div class="flex items-center justify-between">
                     <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                     <span :class="getStatusClass(selectedSurvey.status)" class="text-sm font-medium px-2 py-1 rounded">
                       {{ selectedSurvey.status.replace('_', ' ') }}
                     </span>
                   </div>
                 </div>
               </div>

               <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                 <div class="flex items-center space-x-2 mb-3">
                   <div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                     <svg class="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                     </svg>
                   </div>
                   <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Survey Progress</h5>
                 </div>
                 <div class="space-y-3">
                   <div class="flex items-center justify-between">
                     <span class="text-sm text-gray-600 dark:text-gray-400">Completion:</span>
                     <div class="flex items-center space-x-2">
                       <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                         <div class="bg-green-600 h-2 rounded-full" :style="{ width: selectedSurvey.status === 'completed' ? '100%' : selectedSurvey.status === 'approved' ? '75%' : '25%' }"></div>
                       </div>
                       <span class="text-sm font-medium text-gray-900 dark:text-white">
                         {{ selectedSurvey.status === 'completed' ? '100%' : selectedSurvey.status === 'approved' ? '75%' : '25%' }}
                       </span>
                     </div>
                   </div>
                   <div class="flex items-center justify-between">
                     <span class="text-sm text-gray-600 dark:text-gray-400">Surveyor:</span>
                     <span class="text-sm font-medium text-gray-900 dark:text-white">Field Team</span>
                   </div>
                   <div class="flex items-center justify-between">
                     <span class="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
                     <span class="text-sm font-medium text-gray-900 dark:text-white">2 hours</span>
                   </div>
                 </div>
               </div>
             </div>

             <!-- Survey Findings and Recommendations -->
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                 <div class="flex items-center space-x-2 mb-3">
                   <div class="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                     <svg class="w-3 h-3 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                     </svg>
                   </div>
                   <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Key Findings</h5>
                 </div>
                 <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ selectedSurvey.findings }}</p>
               </div>

               <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                 <div class="flex items-center space-x-2 mb-3">
                   <div class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                     <svg class="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                   </svg>
                   </div>
                   <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Recommendations</h5>
                 </div>
                 <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ selectedSurvey.recommendations }}</p>
               </div>
             </div>

             <!-- Survey Actions -->
             <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
               <div class="flex items-center justify-between">
                 <div class="flex items-center space-x-2">
                   <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                   </svg>
                   <span class="text-sm font-medium text-gray-900 dark:text-white">Survey Actions</span>
                 </div>
                 <div class="flex items-center space-x-3">
                   <button
                     @click="openSurveyModal"
                     class="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                   >
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                     </svg>
                     <span>Edit Survey</span>
                   </button>
                   <button
                     v-if="selectedSurvey.status !== 'completed'"
                     @click="updateSurveyStatus('completed')"
                     class="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                   >
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                     </svg>
                     <span>Mark Complete</span>
                   </button>
                 </div>
               </div>
             </div>
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
            <div class="flex flex-wrap gap-2 mt-4">
              <button
                v-if="canCreateTasks(enquiry)"
                @click="createCreativeTasks"
                :disabled="isCreatingTasks"
                class="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg v-if="isCreatingTasks" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>{{ isCreatingTasks ? 'Creating Tasks...' : 'Create Creative Tasks' }}</span>
              </button>
              <button
                v-else-if="canAccessCreatives(enquiry)"
                @click="navigateToCreatives"
                class="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span>Manage Creative Tasks</span>
              </button>
              <button
                @click="openMaterialsModal"
                class="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <span>Manage Materials</span>
              </button>
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
                  <span class="text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
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
          <div class="flex justify-center">
            <button class="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
              Create Budget & Prepare Quote
            </button>
          </div>
        </div>

        <!-- Current Project Phase Details -->
        <div v-if="selectedProject && currentPhase" class="space-y-6">
          <!-- Phase Header with Enhanced Information -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ currentPhase.name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ currentPhase.summary }}</p>
                  <div class="flex items-center space-x-4 mt-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">Phase {{ currentPhaseIndex + 1 }} of {{ selectedProject.phases.length }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">Order: {{ currentPhase.order }}</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <span :class="getPhaseStatusBadgeClass(currentPhase.status)" class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-2">
                  {{ getPhaseStatusText(currentPhase.status) }}
                </span>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  ID: {{ currentPhase.id }}
                </div>
              </div>
            </div>

            <!-- Phase Progress Bar -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Phase Progress</span>
                <span class="text-sm font-bold text-gray-900 dark:text-white">{{ getPhaseProgressPercentage(currentPhase) }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div class="bg-blue-600 h-3 rounded-full transition-all duration-300" :style="{ width: getPhaseProgressPercentage(currentPhase) + '%' }"></div>
              </div>
            </div>
          </div>

         <!-- Phase Metrics Dashboard -->
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <!-- Duration & Timeline -->
           <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
             <div class="flex items-center space-x-3">
               <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                 <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                 </svg>
               </div>
               <div>
                 <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</p>
                 <p class="text-lg font-bold text-gray-900 dark:text-white">{{ currentPhase.estimatedDuration }} days</p>
                 <p class="text-xs text-gray-600 dark:text-gray-400">{{ getPhaseTimelineInfo(currentPhase) }}</p>
               </div>
             </div>
           </div>

           <!-- Assigned Team/User -->
           <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
             <div class="flex items-center space-x-3">
               <div class="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                 <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                 </svg>
               </div>
               <div>
                 <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Assigned To</p>
                 <p class="text-sm font-bold text-gray-900 dark:text-white">{{ currentPhase.assignedRole }}</p>
                 <p class="text-xs text-gray-600 dark:text-gray-400">{{ getAssignedUserCount(currentPhase) }} team member(s)</p>
               </div>
             </div>
           </div>

           <!-- Budget & Costs -->
           <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
             <div class="flex items-center space-x-3">
               <div class="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                 <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                 </svg>
               </div>
               <div>
                 <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Budget Allocation</p>
                 <p class="text-sm font-bold text-gray-900 dark:text-white">{{ getPhaseBudgetAllocation(currentPhase) }}</p>
                 <p class="text-xs text-gray-600 dark:text-gray-400">{{ getPhaseCostBreakdown(currentPhase) }}</p>
               </div>
             </div>
           </div>

           <!-- Materials & Resources -->
           <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
             <div class="flex items-center space-x-3">
               <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                 <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                 </svg>
               </div>
               <div>
                 <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Materials</p>
                 <p class="text-sm font-bold text-gray-900 dark:text-white">{{ getPhaseMaterialCount(currentPhase) }} items</p>
                 <p class="text-xs text-gray-600 dark:text-gray-400">{{ getPhaseMaterialStatus(currentPhase) }}</p>
               </div>
             </div>
           </div>
         </div>

         <!-- Associated Materials & Resources -->
         <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
           <div class="flex items-center justify-between mb-4">
             <div class="flex items-center space-x-3">
               <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                 <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                 </svg>
               </div>
               <div>
                 <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Associated Materials & Resources</h4>
                 <p class="text-sm text-gray-600 dark:text-gray-400">Materials and resources allocated to this phase</p>
               </div>
             </div>
             <div class="text-right">
               <div class="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
               <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ getPhaseTotalMaterialValue(currentPhase) }}</div>
             </div>
           </div>

           <!-- Material Items for this Phase -->
           <div class="space-y-3">
             <div v-for="material in getPhaseMaterials(currentPhase)" :key="material.id"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
               <div class="flex items-center space-x-3">
                 <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                   <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                   </svg>
                 </div>
                 <div>
                   <p class="text-sm font-medium text-gray-900 dark:text-white">{{ material.name }}</p>
                   <p class="text-xs text-gray-600 dark:text-gray-400">{{ material.quantity }} {{ material.unit }} • {{ material.category }}</p>
                 </div>
               </div>
               <div class="text-right">
                 <div class="text-sm font-bold text-gray-900 dark:text-white">KES {{ material.totalCost?.toLocaleString() || '0' }}</div>
                 <div class="text-xs text-gray-600 dark:text-gray-400">@ KES {{ material.unitPrice?.toLocaleString() || '0' }}/{{ material.unit }}</div>
               </div>
             </div>

             <div v-if="getPhaseMaterials(currentPhase).length === 0" class="text-center py-8">
               <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
               </svg>
               <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No materials allocated</h3>
               <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Materials will be allocated as the phase progresses</p>
             </div>
           </div>
         </div>

         <!-- Phase Tasks & Deliverables -->
         <div v-if="currentPhase.tasks && currentPhase.tasks.length > 0" class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
           <div class="flex items-center space-x-3 mb-4">
             <div class="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
               <svg class="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
               </svg>
             </div>
             <div>
               <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Phase Tasks & Deliverables</h4>
               <p class="text-sm text-gray-600 dark:text-gray-400">{{ currentPhase.tasks.length }} task(s) defined</p>
             </div>
           </div>

           <div class="space-y-3">
             <div v-for="task in currentPhase.tasks" :key="task.name" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
               <div class="flex items-start justify-between">
                 <div class="flex-1">
                   <h5 class="font-medium text-gray-900 dark:text-white">{{ task.name }}</h5>
                   <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ task.description }}</p>

                   <div class="mt-3">
                     <h6 class="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Deliverables</h6>
                     <ul class="space-y-1">
                       <li v-for="deliverable in task.deliverables" :key="deliverable" class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                         <svg class="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                           <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                         </svg>
                         <span>{{ deliverable }}</span>
                       </li>
                     </ul>
                   </div>
                 </div>
                 <div class="ml-4">
                   <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                     Pending
                   </span>
                 </div>
               </div>
             </div>
           </div>
         </div>

          <!-- Phase Controls -->
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <button
                  v-if="currentPhase.status !== 'Completed'"
                  @click="updatePhaseStatus(currentPhase.id, 'In Progress')"
                  class="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m2 0h1.586a1 1 0 01.707.293l.707.707A1 1 0 0021 12.414V15m0 2h-1.586a1 1 0 01-.707-.293l-.707-.707A1 1 0 0018.586 16H16m-2 0H9"/>
                  </svg>
                  <span>Start Phase</span>
                </button>
                <button
                  v-if="currentPhase.status === 'In Progress'"
                  @click="updatePhaseStatus(currentPhase.id, 'Completed')"
                  class="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Mark Complete</span>
                </button>

                <!-- Special approval button for quotation phase -->
                <button
                  v-if="currentPhase.id === 'quotation-budget' && currentPhase.status === 'In Progress'"
                  @click="approveQuotation"
                  class="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Approve Quotation</span>
                </button>
              </div>

              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ currentPhase.estimatedDuration }} days estimated</span>
              </div>
            </div>
          </div>

          <!-- Quotation approval status -->
          <div v-if="currentPhase.id === 'quotation-budget'" class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 rounded-full" :class="quotationApproved ? 'bg-green-500' : 'bg-yellow-500'"></div>
              <span class="text-sm font-medium" :class="quotationApproved ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'">
                {{ quotationApproved ? 'Quotation Approved' : 'Waiting for Quotation Approval' }}
              </span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {{ quotationApproved ? 'Client has approved the quotation. You can now proceed to production.' : 'Quotation must be approved before production can begin.' }}
            </p>
          </div>
        </div>

        <!-- Project Conversion / Project Phases -->
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
            <p class="text-gray-600 dark:text-gray-400 mb-4">Click the button below to convert this enquiry into a production project.</p>
            <button
              @click="startProduction"
              class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Start Production
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<!-- Materials Modal -->
<MaterialsModal
  :is-visible="showMaterialsModal"
  :enquiry="enquiry"
  :department="currentDepartment"
  @close="showMaterialsModal = false"
  @save="handleMaterialsSave"
/>

<!-- Budget Modal -->
<BudgetModal
  :is-visible="showBudgetModal"
  :enquiry="enquiry"
  :material-costs="budgetMaterialCosts"
  :material-elements="quoteMaterialElements"
  @close="showBudgetModal = false"
  @save="handleBudgetSave"
  @generate-quote="handleGenerateQuote"
/>

<!-- Quote Modal -->
<QuoteModal
  :is-visible="showQuoteModal"
  :enquiry="enquiry"
  :material-elements="quoteMaterialElements"
  @close="showQuoteModal = false"
  @save="handleQuoteSave"
/>

<!-- Quotation Viewer -->
<QuotationViewer
  :is-visible="showQuotationViewer"
  :quotation="currentQuotation"
  @close="showQuotationViewer = false"
/>

<!-- Site Survey Modal -->
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Enquiry, SiteSurvey, Quotation, Project, ProjectPhase } from '../types'
import { useEnquiries } from '../composables/useEnquiries'
import { useSiteSurveys } from '../composables/useSiteSurveys'
import { useEnquiryIntegration } from '../../creatives/composables'
import { useDepartmentWorkflow } from '../composables/useDepartmentWorkflow'
import MaterialsModal from '../components/MaterialsModal.vue'
import BudgetModal from '../components/BudgetModal.vue'
import QuoteModal from '../components/QuoteModal.vue'
import QuotationViewer from '../components/QuotationViewer.vue'
import SiteSurveyModal from '../components/SiteSurveyModal.vue'

const route = useRoute()
const router = useRouter()
const { enquiries } = useEnquiries()
const { getSiteSurveyByEnquiry } = useSiteSurveys()
const {
  canCreateTasks,
  canAccessCreatives,
  getEnquiryProgress,
  createTasksFromEnquiry,
  isCreatingTasks,
  integrationError,
  fetchTasks
} = useEnquiryIntegration()
const {
  initializeFromRoute,
  currentDepartment,
  currentPhase: departmentPhase,
  currentEnquiry: departmentEnquiry,
  accessError,
  canAccessCurrentWorkflow,
  currentConfig,
  completeDepartmentTask,
  clearError: clearDepartmentError
} = useDepartmentWorkflow()

// Reactive data
const enquiry = ref<Enquiry | null>(null)
const selectedSurvey = ref<SiteSurvey | null>(null)
const selectedQuotation = ref<Quotation | null>(null)
const selectedProject = ref<Project | null>(null)
const currentDetailStep = ref(1)
const currentPhaseIndex = ref(0)
const quotationApproved = ref(false)
const workflowOffset = ref(0) // 0 = enquiry workflow, -100 = project workflow
const showMaterialsModal = ref(false)
const showBudgetModal = ref(false)
const showQuoteModal = ref(false)
const showQuotationViewer = ref(false)
const showSiteSurveyModal = ref(false)
const budgetMaterialCosts = ref([])
const quoteMaterialElements = ref([])
const currentQuotation = ref<any>(null)

// Workflow step statuses (reactive)
const stepStatuses = ref({
  1: 'completed', // Enquiry & Site Survey
  2: 'pending',   // Material Specification
  3: 'pending',   // Budget & Quote Preparation
  4: 'pending'    // Project Conversion
})

// Mock data for demonstration
const materialItemsCount = ref(15)
const materialTotalCost = ref(250000)

// Computed properties
const overallProgress = computed(() => {
  let completed = 0
  // Step 1: Enquiry & Site Survey - always completed if enquiry exists
  if (enquiry.value) completed++
  // Step 2: Material Specification - check if materials exist
  if (materialItemsCount.value > 0) completed++
  // Step 3: Budget & Quote Preparation - check if quotation exists
  if (selectedQuotation.value) completed++
  // Step 4: Project Conversion - check if project exists
  if (selectedProject.value) completed++

  return Math.round((completed / 4) * 100)
})


const canAccessMaterials = computed(() => {
  return selectedSurvey.value && selectedSurvey.value.status === 'completed'
})

const currentPhase = computed(() => {
  const phase = selectedProject.value?.phases[currentPhaseIndex.value] || null
  console.log('=== DETAILED CONTENT AREA DEBUG ===')
  console.log('Current Detail Step:', currentDetailStep.value)
  console.log('Selected Project:', selectedProject.value ? 'Yes' : 'No')
  console.log('Current Phase Index:', currentPhaseIndex.value)
  console.log('Current Phase:', phase)
  console.log('Enquiry:', enquiry.value)
  console.log('Selected Survey:', selectedSurvey.value)
  console.log('Selected Quotation:', selectedQuotation.value)
  console.log('=====================================')
  return phase
})

const projectProgressPercentage = computed(() => {
  if (!selectedProject.value) return 0
  const completed = selectedProject.value.phases.filter(phase => phase.status === 'Completed').length
  return (completed / selectedProject.value.phases.length) * 100
})

const projectCompletedPhases = computed(() => {
  return selectedProject.value?.phases.filter(phase => phase.status === 'Completed').length || 0
})

const canGoToPreviousPhase = computed(() => {
  return currentPhaseIndex.value > 0
})

const canGoToNextPhase = computed(() => {
  if (!selectedProject.value) return false
  const nextIndex = currentPhaseIndex.value + 1
  return nextIndex < selectedProject.value.phases.length
})

// Phase-specific computed properties
const getPhaseProgressPercentage = (phase: ProjectPhase) => {
  switch (phase.status) {
    case 'Completed': return 100
    case 'In Progress': return 60
    case 'Not Started': return 0
    default: return 0
  }
}

const getPhaseTimelineInfo = (phase: ProjectPhase) => {
  const startDate = selectedProject.value?.start_date
  if (!startDate) return 'Timeline not set'

  const start = new Date(startDate)
  const end = new Date(start)
  end.setDate(start.getDate() + phase.estimatedDuration)

  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
}

const getAssignedUserCount = (phase: ProjectPhase) => {
  // In a real app, this would count actual assigned users
  // For now, return a mock count based on role
  const roleCounts: Record<string, number> = {
    'Project Officer': 1,
    'Design Officer': 2,
    'Procurement Officer': 1,
    'Production Manager': 3,
    'Logistics Coordinator': 2,
    'Installation Team': 4,
    'Project Lead': 1,
    'Operations Team': 2
  }
  return roleCounts[phase.assignedRole] || 1
}

const getPhaseBudgetAllocation = (phase: ProjectPhase) => {
  if (!selectedQuotation.value) return 'KES 0'

  // Allocate budget based on phase type
  const totalBudget = selectedQuotation.value.total_amount
  const allocations: Record<string, number> = {
    'procurement': totalBudget * 0.25, // 25% for procurement
    'production': totalBudget * 0.35,  // 35% for production
    'logistics': totalBudget * 0.15,   // 15% for logistics
    'event-setup': totalBudget * 0.20, // 20% for setup
    'client-handover': totalBudget * 0.03, // 3% for handover
    'set-down-return': totalBudget * 0.01, // 1% for return
    'archival-reporting': totalBudget * 0.01 // 1% for reporting
  }

  const allocation = allocations[phase.id] || totalBudget * 0.1
  return `KES ${allocation.toLocaleString()}`
}

const getPhaseCostBreakdown = (phase: ProjectPhase) => {
  // Mock cost breakdown - in real app would calculate from actual costs
  const breakdowns: Record<string, string> = {
    'procurement': 'Materials: 80%, Labor: 15%, Misc: 5%',
    'production': 'Labor: 70%, Materials: 20%, Equipment: 10%',
    'logistics': 'Transport: 60%, Handling: 30%, Insurance: 10%',
    'event-setup': 'Labor: 80%, Equipment: 15%, Permits: 5%',
    'client-handover': 'Documentation: 50%, Training: 30%, Sign-off: 20%',
    'set-down-return': 'Labor: 70%, Transport: 25%, Cleanup: 5%',
    'archival-reporting': 'Documentation: 80%, Review: 20%'
  }
  return breakdowns[phase.id] || 'Standard allocation'
}

const getPhaseMaterialCount = (phase: ProjectPhase) => {
  // Mock material counts - in real app would query actual materials
  const materialCounts: Record<string, number> = {
    'procurement': 15,
    'production': 8,
    'logistics': 3,
    'event-setup': 12,
    'client-handover': 2,
    'set-down-return': 5,
    'archival-reporting': 1
  }
  return materialCounts[phase.id] || 0
}

const getPhaseMaterialStatus = (phase: ProjectPhase) => {
  const counts = getPhaseMaterialCount(phase)
  if (counts === 0) return 'No materials required'
  return `${counts} items allocated`
}

const getPhaseTotalMaterialValue = (phase: ProjectPhase) => {
  // Mock calculation - in real app would sum actual material costs
  const baseValues: Record<string, number> = {
    'procurement': 150000,
    'production': 120000,
    'logistics': 25000,
    'event-setup': 80000,
    'client-handover': 5000,
    'set-down-return': 15000,
    'archival-reporting': 1000
  }
  const value = baseValues[phase.id] || 0
  return `KES ${value.toLocaleString()}`
}

const getPhaseMaterials = (phase: ProjectPhase) => {
  // Mock materials data - in real app would fetch from API
  const mockMaterials: Record<string, any[]> = {
    'procurement': [
      { id: '1', name: 'Aluminum Frame 2x3m', quantity: 4, unit: 'pcs', unitPrice: 15000, totalCost: 60000, category: 'hire' },
      { id: '2', name: 'LED Panel 50"', quantity: 2, unit: 'pcs', unitPrice: 25000, totalCost: 50000, category: 'hire' }
    ],
    'production': [
      { id: '3', name: 'Carpet Tiles', quantity: 20, unit: 'sqm', unitPrice: 5000, totalCost: 100000, category: 'production' }
    ],
    'logistics': [
      { id: '4', name: 'Transport Services', quantity: 1, unit: 'service', unitPrice: 25000, totalCost: 25000, category: 'service' }
    ],
    'event-setup': [
      { id: '5', name: 'Installation Tools', quantity: 1, unit: 'set', unitPrice: 15000, totalCost: 15000, category: 'hire' },
      { id: '6', name: 'Safety Equipment', quantity: 5, unit: 'pcs', unitPrice: 2000, totalCost: 10000, category: 'hire' }
    ],
    'client-handover': [
      { id: '7', name: 'Documentation Package', quantity: 1, unit: 'set', unitPrice: 5000, totalCost: 5000, category: 'service' }
    ],
    'set-down-return': [
      { id: '8', name: 'Packing Materials', quantity: 10, unit: 'pcs', unitPrice: 500, totalCost: 5000, category: 'consumable' },
      { id: '9', name: 'Cleaning Supplies', quantity: 1, unit: 'set', unitPrice: 2000, totalCost: 2000, category: 'consumable' }
    ],
    'archival-reporting': [
      { id: '10', name: 'Project Documentation', quantity: 1, unit: 'set', unitPrice: 1000, totalCost: 1000, category: 'service' }
    ]
  }
  return mockMaterials[phase.id] || []
}


// Methods
const getStepStatus = (step: number) => {
  return stepStatuses.value[step as keyof typeof stepStatuses.value] || 'pending'
}

const getStepStatusText = (step: number) => {
  const status = getStepStatus(step)
  switch (status) {
    case 'completed': return 'Completed'
    case 'in_progress': return 'In Progress'
    case 'pending': return 'Pending'
    default: return 'Unknown'
  }
}

const getStepBorderClass = (step: number) => {
  const status = getStepStatus(step)
  if (currentDetailStep.value === step) {
    return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
  } else if (status === 'completed') {
    return 'border-green-500 bg-green-50 dark:bg-green-900/20'
  } else if (status === 'in_progress') {
    return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
  } else {
    return 'border-gray-300 dark:border-gray-600'
  }
}

const getStepNumberClass = (step: number) => {
  const status = getStepStatus(step)
  if (currentDetailStep.value === step) {
    return 'bg-blue-500 text-white'
  } else if (status === 'completed') {
    return 'bg-green-500 text-white'
  } else if (status === 'in_progress') {
    return 'bg-yellow-500 text-white'
  } else {
    return 'bg-gray-400 text-white'
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'pending':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getPriorityClass = (priority?: string) => {
  const classes = {
    low: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
    medium: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs',
    high: 'text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs',
    urgent: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs'
  }
  return classes[priority as keyof typeof classes] || classes.medium
}

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs',
    completed: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
    approved: 'text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs',
    rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const getQuotationStatusClass = (status: string) => {
  const classes = {
    draft: 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs',
    sent: 'text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs',
    approved: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
    rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs',
    expired: 'text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs'
  }
  return classes[status as keyof typeof classes] || classes.draft
}


const getPhaseStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Not Started':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getPhaseStatusText = (status: string) => {
  switch (status) {
    case 'Completed': return 'Completed'
    case 'In Progress': return 'In Progress'
    case 'Not Started': return 'Not Started'
    default: return 'Unknown'
  }
}

const canStartPhase = (phase: ProjectPhase, index: number) => {
  if (!selectedProject.value) return false

  // Can start if previous phase is completed and current phase is not started
  if (index === 0) {
    return phase.status === 'Not Started'
  }

  const previousPhase = selectedProject.value.phases[index - 1]
  return previousPhase.status === 'Completed' && phase.status === 'Not Started'
}

const canCompletePhase = (phase: ProjectPhase) => {
  return phase.status === 'In Progress'
}

const startProjectPhase = (index: number) => {
  if (!selectedProject.value) return

  // Update phase status to In Progress
  selectedProject.value.phases[index].status = 'In Progress'
  console.log(`Started phase: ${selectedProject.value.phases[index].name}`)
}

const completeProjectPhase = (index: number) => {
  if (!selectedProject.value) return

  // Update phase status to Completed
  selectedProject.value.phases[index].status = 'Completed'

  // If this is the last phase, mark project as completed
  if (index === selectedProject.value.phases.length - 1) {
    selectedProject.value.status = 'completed'
  }

  console.log(`Completed phase: ${selectedProject.value.phases[index].name}`)
}


// Computed properties for project summary
const completedPhases = computed(() => {
  if (!selectedProject.value) return 0
  return selectedProject.value.phases.filter(phase => phase.status === 'Completed').length
})

const inProgressPhases = computed(() => {
  if (!selectedProject.value) return 0
  return selectedProject.value.phases.filter(phase => phase.status === 'In Progress').length
})

const remainingPhases = computed(() => {
  if (!selectedProject.value) return 0
  return selectedProject.value.phases.filter(phase => phase.status === 'Not Started').length
})

const getCurrentStepTitle = () => {
  const titles = [
    'Enquiry & Site Survey',
    'Design Concept and Material Specification',
    'Budget & Quote Preparation',
    'Project Conversion'
  ]
  return titles[currentDetailStep.value - 1] || 'Enquiry & Site Survey'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const previousStep = () => {
  if (currentDetailStep.value > 1) {
    currentDetailStep.value--
  }
}

const updateStepStatus = (stepNumber: number, status: string) => {
  // Update the status of workflow steps
  stepStatuses.value[stepNumber as keyof typeof stepStatuses.value] = status

  // Update enquiry status based on step completion
  if (enquiry.value) {
    if (stepNumber === 4 && status === 'completed') {
      enquiry.value.status = 'converted_to_project'
    } else if (stepNumber >= 1 && status === 'completed') {
      enquiry.value.status = 'design_completed'
    }
  }

  console.log(`Updated step ${stepNumber} to status: ${status}`)
}

const nextStep = () => {
  if (currentDetailStep.value < 4) {
    // Update the status of current step to completed
    updateStepStatus(currentDetailStep.value, 'completed')

    // Move to next step
    currentDetailStep.value++

    // Update the status of new current step to in_progress
    if (currentDetailStep.value <= 4) {
      updateStepStatus(currentDetailStep.value, 'in_progress')
    }
  }
}

const openSurveyModal = () => {
  // Show site survey modal
  showSiteSurveyModal.value = true
}

const openMaterialsModal = () => {
  showMaterialsModal.value = true
}

const openDesignMaterialModal = () => {
  showMaterialsModal.value = true
  // This will trigger the enhanced materials modal with design-specific features
  console.log('Opening design material list modal for department:', currentDepartment.value)
}

const openBudgetModal = () => {
  // Prepare material costs for budget modal (flattened for backward compatibility)
  budgetMaterialCosts.value = [
    {
      id: '1',
      name: 'Aluminum Frame 2x3m',
      quantity: 4,
      unit: 'pcs',
      unitPrice: 15000,
      category: 'hire',
      totalCost: 60000
    },
    {
      id: '2',
      name: 'LED Panel 50"',
      quantity: 2,
      unit: 'pcs',
      unitPrice: 25000,
      category: 'hire',
      totalCost: 50000
    },
    {
      id: '3',
      name: 'Carpet Tiles',
      quantity: 20,
      unit: 'sqm',
      unitPrice: 5000,
      category: 'production',
      totalCost: 100000
    }
  ]

  // Prepare hierarchical material elements for quote generation
  quoteMaterialElements.value = [
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
      ]
    }
  ]

  showBudgetModal.value = true
}

const handleMaterialsSave = (materials: any[], files: any[], notes: string) => {
  console.log('Materials saved:', { materials, files, notes })

  // Update material items count and cost
  materialItemsCount.value = materials.length
  materialTotalCost.value = materials.reduce((total, item) => total + (item.quantity * item.unitPrice), 0)

  // Update step status if materials are added
  if (materials.length > 0) {
    updateStepStatus(2, 'completed')
  }

  // Close modal
  showMaterialsModal.value = false
}

const handleBudgetSave = (budget: any) => {
  console.log('Budget saved:', budget)

  // Update quotation with budget data
  selectedQuotation.value = {
    id: Date.now(),
    enquiry_id: enquiry.value?.id || 0,
    enquiry: {
      id: enquiry.value?.id || 0,
      title: enquiry.value?.title || '',
      client: {
        id: enquiry.value?.client_id || 0,
        name: enquiry.value?.client?.name || 'Unknown Client'
      }
    },
    title: `Quotation for ${enquiry.value?.title}`,
    description: 'Generated quotation from budget calculation',
    items: [
      {
        id: 1,
        description: 'Material Costs',
        quantity: 1,
        unit_price: budget.totals.materialSubtotal,
        total_price: budget.totals.materialSubtotal,
        category: 'Materials'
      },
      {
        id: 2,
        description: 'Labor Costs',
        quantity: 1,
        unit_price: budget.totals.laborSubtotal,
        total_price: budget.totals.laborSubtotal,
        category: 'Labor'
      },
      {
        id: 3,
        description: 'Logistics & Transportation',
        quantity: 1,
        unit_price: budget.totals.logisticsSubtotal,
        total_price: budget.totals.logisticsSubtotal,
        category: 'Logistics'
      },
      {
        id: 4,
        description: 'Miscellaneous Costs',
        quantity: 1,
        unit_price: budget.totals.miscSubtotal,
        total_price: budget.totals.miscSubtotal,
        category: 'Miscellaneous'
      }
    ],
    subtotal: budget.totals.totalBudget,
    tax_rate: 16,
    tax_amount: budget.totals.totalBudget * 0.16,
    discount_rate: 0,
    discount_amount: 0,
    total_amount: budget.totals.totalBudget * 1.16,
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    notes: 'Auto-generated quotation from budget calculation',
    created_by: 1,
    created_by_user: {
      id: 1,
      name: 'System'
    },
    approved_by: undefined,
    approved_at: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // Update step status to completed
  updateStepStatus(3, 'completed')

  // Close modal
  showBudgetModal.value = false

  // Show success message
  alert('Budget saved and quotation created successfully!')
}

const handleGenerateQuote = (materialElements: any[]) => {
  // Set the material elements for the quote modal
  quoteMaterialElements.value = materialElements
  // Open the quote modal
  showQuoteModal.value = true
}

const handleQuoteSave = (quotation: any) => {
  console.log('Quotation saved:', quotation)

  // Update the quotation with the final pricing
  selectedQuotation.value = {
    id: Date.now(),
    enquiry_id: enquiry.value?.id || 0,
    enquiry: {
      id: enquiry.value?.id || 0,
      title: enquiry.value?.title || '',
      client: {
        id: enquiry.value?.client_id || 0,
        name: enquiry.value?.client?.name || 'Unknown Client'
      }
    },
    title: `Final Quotation for ${enquiry.value?.title}`,
    description: 'Final quotation with profit margins and VAT applied',
    items: quotation.elements.map((element: any, index: number) => ({
      id: index + 1,
      description: element.elementName,
      quantity: 1,
      unit_price: element.quotePrice,
      total_price: element.quotePrice,
      category: element.category === 'production' ? 'Production' : 'Hire'
    })),
    subtotal: quotation.summary.subtotalBeforeTax,
    tax_rate: 16,
    tax_amount: quotation.summary.vatAmount,
    discount_rate: 0,
    discount_amount: 0,
    total_amount: quotation.summary.totalQuoteAmount,
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    notes: `Final quotation with ${quotation.summary.averageMarginPercentage.toFixed(1)}% average margin. Subtotal: KES ${quotation.summary.subtotalBeforeTax.toLocaleString()}, VAT (16%): KES ${quotation.summary.vatAmount.toLocaleString()}, Total: KES ${quotation.summary.totalQuoteAmount.toLocaleString()}. Total profit: KES ${quotation.summary.totalProfitAmount.toLocaleString()}`,
    created_by: 1,
    created_by_user: {
      id: 1,
      name: 'System'
    },
    approved_by: undefined,
    approved_at: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // Update step status to completed
  updateStepStatus(3, 'completed')

  // Close modal
  showQuoteModal.value = false

  // Show success message
  alert(`Final quotation created successfully!\nSubtotal: KES ${quotation.summary.subtotalBeforeTax.toLocaleString()}\nVAT (16%): KES ${quotation.summary.vatAmount.toLocaleString()}\nTotal: KES ${quotation.summary.totalQuoteAmount.toLocaleString()}\nProfit: KES ${quotation.summary.totalProfitAmount.toLocaleString()}`)
}

const handleSiteSurveySave = (survey: SiteSurvey) => {
  console.log('Site survey saved:', survey)

  // Update the selected survey
  selectedSurvey.value = survey

  // Update step status to completed if survey is completed
  if (survey.status === 'completed') {
    updateStepStatus(1, 'completed')
  }

  // Close modal
  showSiteSurveyModal.value = false

  // Show success message
  alert('Site survey saved successfully!')
}

const viewQuotation = () => {
  if (selectedQuotation.value) {
    // Prepare the quotation data for the viewer
    // We need to reconstruct the hierarchical structure from the saved quotation
    const quotationData = {
      elements: selectedQuotation.value.items?.map(item => ({
        id: item.id.toString(),
        elementName: item.description,
        description: `Element from quotation item`,
        category: item.category === 'Production' ? 'production' : 'hire',
        subItems: [], // We'll need to reconstruct this from the original data
        baseCost: item.unit_price,
        marginPercentage: 0, // We'll calculate this
        marginFixed: 0,
        profitAmount: 0,
        quotePrice: item.unit_price
      })) || [],
      summary: {
        totalBaseCost: selectedQuotation.value.subtotal || 0,
        totalProfitAmount: 0, // We'll need to calculate this
        subtotalBeforeTax: selectedQuotation.value.subtotal || 0,
        vatAmount: selectedQuotation.value.tax_amount || 0,
        totalQuoteAmount: selectedQuotation.value.total_amount || 0,
        averageMarginPercentage: 0
      },
      enquiry: {
        id: selectedQuotation.value.enquiry_id,
        title: selectedQuotation.value.enquiry?.title || '',
        client: selectedQuotation.value.enquiry?.client
      },
      createdAt: selectedQuotation.value.created_at
    }

    currentQuotation.value = quotationData
    showQuotationViewer.value = true
  }
}

const startProduction = () => {
  if (!enquiry.value) return

  // Create dummy quotation if none exists
  if (!selectedQuotation.value) {
    selectedQuotation.value = {
      id: Date.now(),
      enquiry_id: enquiry.value.id,
      enquiry: {
        id: enquiry.value.id,
        title: enquiry.value.title,
        client: {
          id: enquiry.value.client_id,
          name: enquiry.value.client?.name || 'Unknown Client'
        }
      },
      title: `Quotation for ${enquiry.value.title}`,
      description: 'Generated quotation for project conversion',
      items: [
        {
          id: 1,
          description: 'Project Materials',
          quantity: 1,
          unit_price: 200000,
          total_price: 200000,
          category: 'Materials'
        },
        {
          id: 2,
          description: 'Labor and Installation',
          quantity: 1,
          unit_price: 50000,
          total_price: 50000,
          category: 'Labor'
        }
      ],
      subtotal: 250000,
      tax_rate: 16,
      tax_amount: 40000,
      discount_rate: 0,
      discount_amount: 0,
      total_amount: 290000,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'approved',
      notes: 'Auto-generated quotation for project conversion',
      created_by: 1,
      created_by_user: {
        id: 1,
        name: 'System'
      },
      approved_by: 1,
      approved_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  // Create the project
  selectedProject.value = {
    id: Date.now(),
    enquiry_id: enquiry.value.id,
    enquiry: {
      id: enquiry.value.id,
      title: enquiry.value.title,
      client: {
        id: enquiry.value.client_id,
        name: enquiry.value.client?.name || 'Unknown Client'
      }
    },
    name: `Project for ${enquiry.value.client?.name || 'Client'}`,
    description: enquiry.value.description,
    start_date: new Date().toISOString().split('T')[0],
    status: 'in_progress',
    budget: selectedQuotation.value.total_amount,
    current_phase: 0,
    phases: [
      {
        name: 'Procurement & Material Sourcing',
        icon: 'bi-cart-plus',
        summary: 'Source and acquire all required materials and supplies for production.',
        status: 'Not Started',
        estimatedDuration: 5,
        assignedRole: 'Procurement Officer',
        id: 'procurement',
        isRequired: true,
        order: 1,
        tasks: [
          {
            name: 'Material Procurement',
            description: 'Order all required materials from approved suppliers.',
            deliverables: [
              'Create purchase orders for all materials.',
              'Confirm supplier availability and lead times.',
              'Track order status and delivery dates.'
            ]
          },
          {
            name: 'Material Receipt & Inspection',
            description: 'Receive and inspect delivered materials.',
            deliverables: [
              'Verify material quality and specifications.',
              'Document any discrepancies.',
              'Store materials appropriately.'
            ]
          }
        ]
      },
      {
        name: 'Production',
        icon: 'bi-gear',
        summary: 'Manufacturing and assembly of project components. Tracks work orders, progress, and quality control.',
        status: 'Not Started',
        estimatedDuration: 7,
        assignedRole: 'Production Manager',
        id: 'production',
        isRequired: true,
        order: 2,
        tasks: [
          {
            name: 'Manufacturing Execution',
            description: 'Produce items according to specifications.',
            deliverables: [
              'Follow production procedures.',
              'Monitor quality standards.',
              'Document production progress.'
            ]
          },
          {
            name: 'Assembly & Finishing',
            description: 'Complete final assembly and finishing work.',
            deliverables: [
              'Assemble components.',
              'Apply finishing touches.',
              'Prepare for quality inspection.'
            ]
          }
        ]
      },
      {
        name: 'Logistics',
        icon: 'bi-truck',
        summary: 'Coordination of transportation, storage, and delivery of project materials and equipment.',
        status: 'Not Started',
        estimatedDuration: 3,
        assignedRole: 'Logistics Coordinator',
        id: 'logistics',
        isRequired: true,
        order: 3,
        tasks: [
          {
            name: 'Transportation Planning',
            description: 'Arrange appropriate transportation method.',
            deliverables: [
              'Select transportation provider.',
              'Schedule delivery time.',
              'Prepare shipping documents.'
            ]
          },
          {
            name: 'Delivery Execution',
            description: 'Monitor and confirm successful delivery.',
            deliverables: [
              'Track shipment progress.',
              'Confirm delivery receipt.',
              'Handle any delivery issues.'
            ]
          }
        ]
      },
      {
        name: 'Event Setup & Execution',
        icon: 'bi-tools',
        summary: 'On-site setup and implementation. Includes installation schedules and site reports.',
        status: 'Not Started',
        estimatedDuration: 4,
        assignedRole: 'Installation Team',
        id: 'event-setup',
        isRequired: true,
        order: 4,
        tasks: [
          {
            name: 'Site Preparation',
            description: 'Prepare installation site.',
            deliverables: [
              'Assess installation location.',
              'Prepare necessary tools.',
              'Ensure safety compliance.'
            ]
          },
          {
            name: 'Installation & Testing',
            description: 'Install and test the products.',
            deliverables: [
              'Complete installation.',
              'Test functionality.',
              'Provide client training.'
            ]
          }
        ]
      },
      {
        name: 'Client Handover',
        icon: 'bi-clipboard-check',
        summary: 'Final delivery to client. Includes training, documentation, and sign-off procedures.',
        status: 'Not Started',
        estimatedDuration: 2,
        assignedRole: 'Project Lead',
        id: 'client-handover',
        isRequired: true,
        order: 5,
        tasks: [
          {
            name: 'Client Training',
            description: 'Train client on product usage.',
            deliverables: [
              'Conduct training session.',
              'Provide user manuals.',
              'Answer client questions.'
            ]
          },
          {
            name: 'Final Handover',
            description: 'Complete project handover.',
            deliverables: [
              'Deliver all documentation.',
              'Obtain client sign-off.',
              'Confirm client satisfaction.'
            ]
          }
        ]
      },
      {
        name: 'Set Down & Return',
        icon: 'bi-arrow-return-left',
        summary: 'Post-event activities, including equipment return and storage.',
        status: 'Not Started',
        estimatedDuration: 3,
        assignedRole: 'Operations Team',
        id: 'set-down-return',
        isRequired: true,
        order: 6,
        tasks: [
          {
            name: 'Equipment Return',
            description: 'Return any temporary equipment.',
            deliverables: [
              'Collect all equipment.',
              'Inspect for damage.',
              'Return to storage.'
            ]
          },
          {
            name: 'Site Cleanup',
            description: 'Clean up installation site.',
            deliverables: [
              'Remove packaging materials.',
              'Clean work area.',
              'Restore site to original condition.'
            ]
          }
        ]
      },
      {
        name: 'Archival & Reporting',
        icon: 'bi-archive',
        summary: 'Final project review, documentation, and lessons learned. Formally closes out the project.',
        status: 'Not Started',
        estimatedDuration: 2,
        assignedRole: 'Project Lead',
        id: 'archival-reporting',
        isRequired: true,
        order: 7,
        tasks: [
          {
            name: 'Final Documentation',
            description: 'Complete all project documentation.',
            deliverables: [
              'Compile project reports.',
              'Archive all documents.',
              'Update project database.'
            ]
          },
          {
            name: 'Project Review',
            description: 'Review project performance.',
            deliverables: [
              'Collect team feedback.',
              'Document lessons learned.',
              'Prepare final report.'
            ]
          }
        ]
      }
    ],
    assigned_users: [1],
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // Update enquiry status to converted
  if (enquiry.value) {
    enquiry.value.status = 'converted_to_project'
  }

  // Set current phase to the first incomplete phase
  const firstIncompleteIndex = selectedProject.value.phases.findIndex(phase => phase.status !== 'Completed')
  currentPhaseIndex.value = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0

  // Trigger smooth workflow transition animation
  setTimeout(() => {
    workflowOffset.value = -100
  }, 100) // Small delay to ensure DOM is ready

  // Update workflow to show project phases
  console.log('Project created and workflow transitioned to project phases with smooth animation')
}

const goToPreviousPhase = () => {
  if (canGoToPreviousPhase.value) {
    currentPhaseIndex.value--
  }
}

const goToNextPhase = () => {
  if (canGoToNextPhase.value) {
    currentPhaseIndex.value++
  }
}

const updatePhaseStatus = (phaseId: string, status: string) => {
  if (!selectedProject.value) return

  const phaseIndex = selectedProject.value.phases.findIndex(phase => phase.id === phaseId)
  if (phaseIndex >= 0) {
    selectedProject.value.phases[phaseIndex].status = status as ProjectPhase['status']
    console.log(`Updated phase ${phaseId} to status: ${status}`)
  }
}

const setCurrentPhase = (index: number) => {
  currentPhaseIndex.value = index
}

const approveQuotation = () => {
  quotationApproved.value = true
  // In a real application, this would update the quotation status in the backend
  // For demo purposes, we just set the local state
  console.log('Quotation approved for project:', selectedProject.value?.name)
}

const updateSurveyStatus = (status: 'pending' | 'approved' | 'completed' | 'rejected') => {
  if (selectedSurvey.value) {
    selectedSurvey.value.status = status
    console.log('Survey status updated to:', status)
  }
}

const navigateToCreatives = () => {
  if (enquiry.value) {
    router.push(`/creatives/tasks?enquiry_id=${enquiry.value.id}`)
  }
}

const createCreativeTasks = async () => {
  if (!enquiry.value) return

  try {
    const createdTasks = await createTasksFromEnquiry(enquiry.value, 1) // Assuming user ID 1 for now
    if (createdTasks.length > 0) {
      console.log('Creative tasks created successfully:', createdTasks)
      // Refresh tasks to update the UI
      await fetchTasks()
      // Update step status
      updateStepStatus(2, 'in_progress')
      // Clear any previous errors
      integrationError.value = null
      // Navigate to creatives module
      navigateToCreatives()
    } else {
      throw new Error('No tasks were created')
    }
  } catch (error) {
    console.error('Failed to create creative tasks:', error)
    // Set integration error for display
    integrationError.value = error instanceof Error ? error.message : 'Failed to create creative tasks'
  }
}

const retryCreativeTasks = async () => {
  integrationError.value = null
  await createCreativeTasks()
}

const clearError = () => {
  integrationError.value = null
}

const retryAccess = () => {
  // Clear the current error
  accessError.value = ''

  // Re-initialize the workflow from route
  if (enquiry.value) {
    const initialized = initializeFromRoute(enquiry.value)
    if (!initialized) {
      // If still failing, show a more specific error
      accessError.value = `Unable to access ${currentDepartment.value} department workflow. Please check your permissions and try again.`
    }
  }
}

// Department-specific methods
const getDepartmentPhaseTitle = () => {
  switch (currentDepartment.value) {
    case 'creatives':
      return 'Creative Department - Design Concept Development'
    case 'design':
      return 'Design Department - Material Specification & Planning'
    case 'survey':
      return 'Survey Department - Site Assessment & Analysis'
    case 'procurement':
      return 'Procurement Department - Vendor Management & Sourcing'
    case 'projects':
      return 'Projects Department - Project Management & Coordination'
    default:
      return 'Department Workflow'
  }
}

const getDepartmentDescription = () => {
  switch (currentDepartment.value) {
    case 'creatives':
      return 'Handles enquiry designs, mockups, renders, and material specifications for creative projects'
    case 'design':
      return 'Manages detailed material specifications, technical drawings, and production planning'
    case 'survey':
      return 'Conducts site assessments, feasibility studies, and requirement analysis'
    case 'procurement':
      return 'Manages vendor relationships, material sourcing, and supply chain coordination'
    case 'projects':
      return 'Oversees project execution, timeline management, and client coordination'
    default:
      return 'Department-specific workflow management'
  }
}

const getDepartmentProgress = () => {
  if (!enquiry.value) return 0

  switch (currentDepartment.value) {
    case 'creatives':
      return getEnquiryProgress(enquiry.value.id)
    case 'design':
      return materialItemsCount.value > 0 ? 75 : 25
    case 'survey':
      return selectedSurvey.value?.status === 'completed' ? 100 : 50
    case 'procurement':
      return selectedQuotation.value ? 80 : 30
    case 'projects':
      return selectedProject.value ? 90 : 40
    default:
      return 0
  }
}

const getDepartmentFeatures = () => {
  switch (currentDepartment.value) {
    case 'creatives':
      return ['Design Creation', 'Mockup Development', '3D Rendering', 'Material Lists']
    case 'design':
      return ['Technical Drawings', 'Material Specs', 'Production Planning', 'Quality Standards']
    case 'survey':
      return ['Site Assessment', 'Feasibility Studies', 'Requirement Analysis', 'Risk Assessment']
    case 'procurement':
      return ['Vendor Management', 'Price Negotiation', 'Quality Control', 'Supply Chain']
    case 'projects':
      return ['Timeline Management', 'Resource Allocation', 'Client Communication', 'Progress Tracking']
    default:
      return ['Task Management', 'Progress Tracking', 'Team Coordination']
  }
}

const navigateToDesign = () => {
  if (enquiry.value) {
    router.push(`/projects/enquiries/${enquiry.value.id}?phase=material_specification&department=design`)
  }
}

onMounted(async () => {
  console.log('EnquiryDetailWorkflow mounted')
  console.log('Route params:', route.params)
  console.log('Route query:', route.query)
  console.log('Available enquiries before fetch:', enquiries.value)

  // Ensure enquiries are loaded
  if (enquiries.value.length === 0) {
    console.log('Enquiries array is empty, fetching data...')
    // You might need to call fetchEnquiries here if data isn't loaded
  }

  console.log('Available enquiries after check:', enquiries.value)

  const enquiryId = parseInt(route.params.id as string)
  console.log('Parsed enquiry ID:', enquiryId)

  if (enquiryId) {
    // Find the enquiry in the enquiries array
    const foundEnquiry = enquiries.value.find(e => e.id === enquiryId)
    console.log('Found enquiry:', foundEnquiry)

    if (foundEnquiry) {
      enquiry.value = foundEnquiry
      console.log('Enquiry set successfully:', enquiry.value)

      // Load site survey for this enquiry
      const survey = getSiteSurveyByEnquiry(foundEnquiry.id)
      if (survey) {
        selectedSurvey.value = survey
        console.log('Site survey loaded:', survey)
      }

      // Initialize department workflow from route parameters
      const initialized = initializeFromRoute(foundEnquiry)
      if (!initialized) {
        console.warn('Failed to initialize department workflow, access may be restricted')
      }
    } else {
      console.error(`Enquiry with ID ${enquiryId} not found`)
      console.log('Available enquiry IDs:', enquiries.value.map(e => e.id))
      console.log('Searching in dummy data directly...')

      // Try to find in dummy data as fallback
      const dummyEnquiries = [
        { id: 1, title: 'Corporate Event Booth Setup', client: { name: 'ABC Corporation' } },
        { id: 2, title: 'Wedding Exhibition Display', client: { name: 'XYZ Events' } },
        { id: 3, title: 'Product Launch Event', client: { name: 'ABC Corporation' } }
      ]
      const dummyEnquiry = dummyEnquiries.find(e => e.id === enquiryId)
      if (dummyEnquiry) {
        console.log('Found in dummy data, setting manually...')
        enquiry.value = dummyEnquiry as Enquiry

        // Initialize department workflow for dummy data
        initializeFromRoute(dummyEnquiry as Enquiry)
      }
    }
  } else {
    console.error('No enquiry ID provided in route')
  }
})
</script>
