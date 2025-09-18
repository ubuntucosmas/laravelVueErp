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
          class="grid grid-cols-1 lg:grid-cols-4 gap-4"
        >
      <!-- Step 1: Enquiry Details -->
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
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Enquiry Details</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Client information</p>
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
              <span class="font-medium">Client:</span>
              <span class="text-gray-500">{{ enquiry?.client?.name }}</span>
            </div>
            <div class="text-sm">
              <span class="font-medium">Priority:</span>
              <span :class="getPriorityClass(enquiry?.priority)">
                {{ enquiry?.priority }}
              </span>
            </div>
            <div class="text-sm">
              <span class="font-medium">Status:</span>
              <span class="text-gray-500">{{ enquiry?.status?.replace('_', ' ') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Site Survey -->
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
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Site Survey</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Location assessment</p>
              </div>
            </div>
            <span :class="getStatusBadgeClass(getStepStatus(2))" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
              {{ getStepStatusText(2) }}
            </span>
          </div>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div v-if="selectedSurvey" class="text-sm">
              <span class="font-medium">Date:</span>
              <span class="text-gray-500">{{ formatDate(selectedSurvey.survey_date) }}</span>
            </div>
            <div v-if="selectedSurvey" class="text-sm">
              <span class="font-medium">Status:</span>
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

      <!-- Step 3: Materials & Quotation -->
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
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Materials & Quote</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Cost estimation</p>
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
              <span class="font-medium">Materials:</span>
              <span class="text-gray-500">{{ materialItemsCount }} items</span>
            </div>
            <div class="text-sm">
              <span class="font-medium">Quotation:</span>
              <span v-if="selectedQuotation" :class="getQuotationStatusClass(selectedQuotation.status)">
                {{ selectedQuotation.status }}
              </span>
              <span v-else class="text-gray-500">Not created</span>
            </div>
            <div class="text-sm">
              <span class="font-medium">Total:</span>
              <span v-if="selectedQuotation" class="text-gray-500">
                KES {{ selectedQuotation.total_amount.toLocaleString() }}
              </span>
              <span v-else class="text-gray-500">Not calculated</span>
            </div>
            <button
              @click="openMaterialsModal"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
              :disabled="!canAccessMaterials"
            >
              Manage Materials & Quote
            </button>
          </div>
        </div>
      </div>

      <!-- Step 4: Project Conversion -->
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
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Project Ready</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Production start</p>
              </div>
            </div>
            <span :class="getStatusBadgeClass(getStepStatus(4))" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
              {{ getStepStatusText(4) }}
            </span>
          </div>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div v-if="selectedProject" class="text-sm">
              <span class="font-medium">Project:</span>
              <span class="text-gray-500">Project Created</span>
            </div>
            <div v-if="selectedProject" class="text-sm">
              <span class="font-medium">Status:</span>
              <span class="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">
                In Progress
              </span>
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
               <p class="text-sm text-gray-600 dark:text-gray-400">4 of 10 phases completed</p>
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
                 :class="getStepBorderClass(10)">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                         :class="getStepNumberClass(10)">
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Enquiry Information</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Title:</span>
                  <span class="text-sm font-medium">{{ enquiry?.title }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                  <span :class="getPriorityClass(enquiry?.priority)" class="text-sm font-medium">
                    {{ enquiry?.priority }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span class="text-sm font-medium">{{ enquiry?.status?.replace('_', ' ') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                  <span class="text-sm font-medium">{{ enquiry?.created_at ? formatDate(enquiry.created_at) : 'N/A' }}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Client Information</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                  <span class="text-sm font-medium">{{ enquiry?.client?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                  <span class="text-sm font-medium">{{ enquiry?.client?.email }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Contact:</span>
                  <span class="text-sm font-medium">{{ enquiry?.client?.email }}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">Project Description</h4>
            <p class="text-gray-700 dark:text-gray-300">{{ enquiry?.description }}</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">Project Scope</h4>
            <p class="text-gray-700 dark:text-gray-300">{{ enquiry?.project_scope }}</p>
          </div>
        </div>

        <!-- Site Survey Details -->
        <div v-if="currentDetailStep === 2" class="space-y-6">
          <div v-if="selectedSurvey" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Survey Information</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                  <span class="text-sm font-medium">{{ formatDate(selectedSurvey.survey_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Location:</span>
                  <span class="text-sm font-medium">{{ selectedSurvey.location }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span :class="getStatusClass(selectedSurvey.status)" class="text-sm font-medium">
                    {{ selectedSurvey.status.replace('_', ' ') }}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Survey Details</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Findings:</span>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ selectedSurvey.findings }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Recommendations:</span>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ selectedSurvey.recommendations }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Site Survey Scheduled</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Schedule a site survey to assess the project requirements.</p>
            <button
              @click="openSurveyModal"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Schedule Site Survey
            </button>
          </div>
        </div>

        <!-- Materials & Quotation Details -->
        <div v-if="currentDetailStep === 3" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Materials List</h4>
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
          <div class="flex justify-center">
            <button
              @click="openMaterialsModal"
              class="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Manage Materials & Create Quotation
            </button>
          </div>
        </div>

        <!-- Current Project Phase Details -->
        <div v-if="selectedProject && currentPhase" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Phase Information</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Phase:</span>
                  <span class="text-sm font-medium">{{ currentPhase.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span :class="getPhaseStatusBadgeClass(currentPhase.status)" class="text-sm font-medium px-2 py-1 rounded">
                    {{ getPhaseStatusText(currentPhase.status) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
                  <span class="text-sm font-medium">{{ currentPhase.estimatedDuration }} days</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Assigned:</span>
                  <span class="text-sm font-medium">{{ currentPhase.assignedRole }}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Phase Description</h4>
              <p class="text-gray-700 dark:text-gray-300">{{ currentPhase.summary }}</p>
            </div>
          </div>

          <!-- Required Actions -->
          <div v-if="currentPhase.requiredActions && currentPhase.requiredActions.length > 0" class="mb-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Required Actions:</h4>
            <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li v-for="action in currentPhase.requiredActions" :key="action">{{ action }}</li>
            </ul>
          </div>

          <!-- Forms -->
          <div v-if="currentPhase.forms && currentPhase.forms.length > 0" class="mb-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Required Forms:</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="form in currentPhase.forms"
                :key="form"
                class="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {{ form.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
              </span>
            </div>
          </div>

          <!-- Phase Controls -->
          <div class="flex items-center justify-center space-x-3">
            <button
              v-if="currentPhase.status !== 'Completed'"
              @click="updatePhaseStatus(currentPhase.id, 'In Progress')"
              class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Start Phase
            </button>
            <button
              v-if="currentPhase.status === 'In Progress'"
              @click="updatePhaseStatus(currentPhase.id, 'Completed')"
              class="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Mark Complete
            </button>

            <!-- Special approval button for quotation phase -->
            <button
              v-if="currentPhase.id === 'quotation-budget' && currentPhase.status === 'In Progress'"
              @click="approveQuotation"
              class="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Approve Quotation
            </button>

            <span class="text-sm text-gray-500 dark:text-gray-400">
              Duration: {{ currentPhase.estimatedDuration }} days
            </span>
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
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Enquiry, SiteSurvey, Quotation, Project, ProjectPhase } from '../types'
import { useEnquiries } from '../composables/useEnquiries'

const route = useRoute()
const { enquiries } = useEnquiries()

// Reactive data
const enquiry = ref<Enquiry | null>(null)
const selectedSurvey = ref<SiteSurvey | null>(null)
const selectedQuotation = ref<Quotation | null>(null)
const selectedProject = ref<Project | null>(null)
const currentDetailStep = ref(1)
const currentPhaseIndex = ref(0)
const quotationApproved = ref(false)
const workflowOffset = ref(0) // 0 = enquiry workflow, -100 = project workflow

// Workflow step statuses (reactive)
const stepStatuses = ref({
  1: 'completed', // Enquiry Details always completed
  2: 'pending',   // Site Survey
  3: 'pending',   // Materials & Quotation
  4: 'pending'    // Project Conversion
})

// Mock data for demonstration
const materialItemsCount = ref(15)
const materialTotalCost = ref(250000)

// Computed properties
const overallProgress = computed(() => {
  let completed = 0
  if (enquiry.value) completed++
  if (selectedSurvey.value && selectedSurvey.value.status === 'completed') completed++
  if (materialItemsCount.value > 0) completed++
  if (selectedQuotation.value && selectedQuotation.value.status === 'approved') completed++
  if (selectedProject.value) completed++

  return Math.round((completed / 5) * 100)
})


const canAccessMaterials = computed(() => {
  return selectedSurvey.value && selectedSurvey.value.status === 'completed'
})

const currentPhase = computed(() => {
  return selectedProject.value?.phases[currentPhaseIndex.value] || null
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
    'Enquiry Details',
    'Site Survey',
    'Materials & Quotation',
    'Project Conversion'
  ]
  return titles[currentDetailStep.value - 1] || 'Enquiry Details'
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
    } else if (stepNumber >= 2 && status === 'completed') {
      enquiry.value.status = 'approved'
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
  // Show survey modal or inline form within the enquiry workflow
  alert('Site Survey functionality will be implemented as a modal within the enquiry workflow')
}

const openMaterialsModal = () => {
  // Show materials modal or inline form within the enquiry workflow
  alert('Materials & Quotation functionality will be implemented as a modal within the enquiry workflow')
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
        name: 'Client Engagement & Briefing',
        icon: 'bi-folder-symlink',
        summary: 'Initial client meetings, project briefs, and requirements gathering. This phase sets the foundation for the entire project.',
        status: 'Completed',
        estimatedDuration: 5,
        assignedRole: 'Project Officer',
        id: 'client-engagement',
        isRequired: true,
        order: 1,
        offsetStart: 0,
        offsetEnd: 5,
        tasks: [
          {
            name: 'Receive Client Brief',
            description: 'Capture client needs via email, call, or physical visit.',
            deliverables: [
              'Customer Service captures client needs.',
              'Assign a Project Officer (PO).',
              'Log new project entry in system.'
            ]
          },
          {
            name: 'Analyze Requirements',
            description: 'Review and allocate project internally.',
            deliverables: [
              'Team leads and PO review client brief.',
              'Allocate project to relevant departments.',
              'Schedule internal project briefing.'
            ]
          },
          {
            name: 'Confirm Project Scope',
            description: 'Align with client on deliverables and expectations.',
            deliverables: [
              'Document project deliverables.',
              'Share requirements summary for client confirmation.',
              'Use official communication channels for confirmation.'
            ]
          }
        ]
      },
      {
        name: 'Design & Concept Development',
        icon: 'bi-brush',
        summary: 'Creative development, mood boards, and initial design concepts. This is where ideas take visual form.',
        status: 'Completed',
        estimatedDuration: 9,
        assignedRole: 'Design Officer',
        id: 'design-development',
        isRequired: true,
        order: 2,
        offsetStart: 6,
        offsetEnd: 15,
        tasks: [
          {
            name: 'Initial Design Creation',
            description: 'Create and share initial design concepts.',
            deliverables: [
              'Designer creates initial concepts.',
              'Share internally and with client.',
              'Collect feedback via email or portal.'
            ]
          },
          {
            name: 'Final Design Approval',
            description: 'Refine and approve final design.',
            deliverables: [
              'Incorporate revisions from feedback.',
              'Client provides sign-off.',
              'Document final designs in ERP.'
            ]
          },
          {
            name: 'Material & Cost Listing',
            description: 'Estimate material needs and costs.',
            deliverables: [
              'List all required materials.',
              'Rough cost estimation.',
              'Finalize and approve materials list internally.'
            ]
          }
        ]
      },
      {
        name: 'Procurement & Inventory Management',
        icon: 'bi-list-task',
        summary: 'Ensure necessary stock is available and handle procurement of materials.',
        status: 'Completed',
        estimatedDuration: 4,
        assignedRole: 'Procurement Officer',
        id: 'procurement-inventory',
        isRequired: true,
        order: 3,
        offsetStart: 16,
        offsetEnd: 20,
        tasks: [
          {
            name: 'Inventory Check',
            description: 'Ensure necessary stock is available.',
            deliverables: [
              'Store manager checks available stock.'
            ]
          },
          {
            name: 'Procurement Process',
            description: 'Raise and track procurement of materials.',
            deliverables: [
              'Raise purchase request.',
              'Approve via Procurement Officer.',
              'Track supplier delivery status.'
            ]
          },
          {
            name: 'Inventory Ready for Production',
            description: 'Prepare materials for use.',
            deliverables: [
              'Receive and verify materials.',
              'Notify production team.'
            ]
          }
        ]
      },
      {
        name: 'Quotation & Budget Approval',
        icon: 'bi-cash-coin',
        summary: 'Financial planning, cost estimation, and client quotations.',
        status: 'Completed',
        estimatedDuration: 4,
        assignedRole: 'Project Lead',
        id: 'quotation-budget',
        isRequired: true,
        order: 4,
        offsetStart: 21,
        offsetEnd: 25,
        tasks: [
          {
            name: 'Budget Confirmation',
            description: 'Validate cost and prepare client quotation.',
            deliverables: [
              'Cross-check cost with scope.',
              'Generate and send quotation.'
            ]
          },
          {
            name: 'Approval & TAT',
            description: 'Follow up and confirm client approval.',
            deliverables: [
              'Follow up within 45 minutes (or as needed).',
              'Confirm client approval.',
              'Mark status as "Quote Approved".'
            ]
          }
        ]
      },
      {
        name: 'Production',
        icon: 'bi-gear',
        summary: 'Manufacturing and assembly of project components. Tracks work orders, progress, and quality control.',
        status: 'In Progress',
        estimatedDuration: 4,
        assignedRole: 'Production Manager',
        id: 'production',
        isRequired: true,
        order: 5,
        offsetStart: 26,
        offsetEnd: 30,
        tasks: [
          {
            name: 'Execute Production',
            description: 'Fabricate/brand as per approved design.',
            deliverables: [
              'Log time and material usage.'
            ]
          },
          {
            name: 'Quality Control',
            description: 'Ensure deliverables meet standards.',
            deliverables: [
              'QA team inspects output.',
              'Retouch if needed.',
              'Approve for delivery.'
            ]
          },
          {
            name: 'Packing & Handover for Setup',
            description: 'Prepare items for delivery.',
            deliverables: [
              'Package final items.',
              'Update delivery docket.',
              'Handover to logistics.'
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
        order: 6,
        offsetStart: 31,
        offsetEnd: 35,
        tasks: [
          {
            name: 'Site Delivery',
            description: 'Transport and confirm safe arrival of items.',
            deliverables: [
              'Load and transport items to venue.',
              'Confirm arrival and condition.'
            ]
          },
          {
            name: 'Setup Execution',
            description: 'Install and test setup on-site.',
            deliverables: [
              'Install branding/equipment as per design.',
              'Test all components.',
              'Confirm readiness with client.'
            ]
          }
        ]
      },
      {
        name: 'Set Down & Return',
        icon: 'bi-arrow-return-left',
        summary: 'Post-event activities, including equipment return and storage.',
        status: 'Not Started',
        estimatedDuration: 4,
        assignedRole: 'Operations Team',
        id: 'set-down-return',
        isRequired: false,
        order: 7,
        offsetStart: 36,
        offsetEnd: 40,
        tasks: [
          {
            name: 'Dismantling',
            description: 'Safely uninstall and collect materials.',
            deliverables: [
              'Uninstall props/equipment.',
              'Account for all items.'
            ]
          },
          {
            name: 'Returns & Storage',
            description: 'Return items to workshop and update records.',
            deliverables: [
              'Transport items back.',
              'Inspect for damage.',
              'Update return condition.'
            ]
          }
        ]
      },
      {
        name: 'Client Handover & Feedback',
        icon: 'bi-clipboard-check',
        summary: 'Final delivery to client. Includes training, documentation, and sign-off procedures.',
        status: 'Not Started',
        estimatedDuration: 2,
        assignedRole: 'Project Lead',
        id: 'client-handover',
        isRequired: true,
        order: 8,
        offsetStart: 41,
        offsetEnd: 43,
        tasks: [
          {
            name: 'Final Handover',
            description: 'Wrap up project and submit final report.',
            deliverables: [
              'Submit final project report.',
              'Provide soft copies or photos.'
            ]
          },
          {
            name: 'Feedback Collection',
            description: 'Collect feedback and assess satisfaction.',
            deliverables: [
              'Debrief session with client.',
              'Record satisfaction and lessons learned.'
            ]
          }
        ]
      },
      {
        name: 'Archival & Reporting',
        icon: 'bi-archive',
        summary: 'Final project review, documentation, and lessons learned. Formally closes out the project.',
        status: 'Not Started',
        estimatedDuration: 1,
        assignedRole: 'Project Lead',
        id: 'archival-reporting',
        isRequired: true,
        order: 9,
        offsetStart: 44,
        offsetEnd: 45,
        tasks: [
          {
            name: 'Close Project',
            description: 'Mark project complete and archive.',
            deliverables: [
              'Mark Project as complete.',
              'Archive all related documentation.'
            ]
          },
          {
            name: 'Analytics & Reports',
            description: 'Generate insights for management review.',
            deliverables: [
              'Create cost, time, and material usage reports.',
              'Send summary to management.'
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
    selectedProject.value.phases[phaseIndex].status = status as any
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

onMounted(async () => {
  console.log('EnquiryDetailWorkflow mounted')
  console.log('Route params:', route.params)
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
      }
    }
  } else {
    console.error('No enquiry ID provided in route')
  }
})
</script>
