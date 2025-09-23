<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Dashboard
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/projects" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Projects
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
              {{ selectedProject ? `Close-Out: ${selectedProject.name}` : 'Project Close-Out Report' }}
            </span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Project Selection (if no project selected) -->
    <div v-if="!selectedProject" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select Project for Close-Out Report</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="project in availableProjects" :key="project.id"
             @click="selectProject(project)"
             class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary hover:shadow-md transition-all">
          <h3 class="font-medium text-gray-900 dark:text-white">{{ project.name }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ project.enquiry?.client?.name }}</p>
          <div class="flex items-center mt-2">
            <span :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
              project.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
            ]">
              {{ project.status.replace('_', ' ').toUpperCase() }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="availableProjects.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        No completed projects available for close-out reports
      </div>
    </div>

    <!-- Main Form (only show when project is selected) -->
    <div v-else class="space-y-6">
      <!-- Project Header -->
      <div class="bg-gradient-to-r from-primary to-primary-light rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">{{ selectedProject.name }}</h1>
            <p class="text-primary-100 mt-1">{{ selectedProject.enquiry?.client?.name }}</p>
            <p class="text-sm text-primary-200 mt-2">
              Project Code: {{ selectedProject.enquiry?.id || 'N/A' }} |
              Status: {{ selectedProject.status.replace('_', ' ').toUpperCase() }}
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="saveDraft"
              class="px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
            >
              Save Draft
            </button>
            <button
              @click="submitReport"
              :disabled="submitting"
              class="px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="submitting" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></span>
              Submit Report
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Indicator -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Form Progress</span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Section {{ currentSection }} of {{ totalSections }} • {{ completionPercentage }}% Complete
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div class="bg-primary h-2 rounded-full transition-all duration-300" :style="{ width: completionPercentage + '%' }"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Section {{ currentSection }}</span>
          <span>{{ completionPercentage }}% Complete</span>
        </div>
      </div>

      <!-- Section Navigation -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Navigation</h3>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
          <button
            v-for="section in totalSections"
            :key="section"
            @click="goToSection(section)"
            :class="[
              'px-3 py-2 text-xs font-medium rounded-md transition-colors',
              currentSection === section
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            Section {{ section }}
          </button>
        </div>
      </div>

      <!-- Form Container -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <form @submit.prevent="handleSubmit" class="divide-y divide-gray-200 dark:divide-gray-700">

          <!-- Section 1: Project Information -->
          <div id="section-1" class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Section 1: Project Information</h3>
              <span class="text-sm text-green-600 dark:text-green-400">✓ Pre-filled from project data</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title *</label>
                <input
                  v-model="formData.project_title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                  readonly
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name *</label>
                <input
                  v-model="formData.client_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                  readonly
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Code/ID *</label>
                <input
                  v-model="formData.project_code"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Officer *</label>
                <input
                  v-model="formData.project_officer"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                <input
                  v-model="formData.start_date"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                  readonly
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completion Date *</label>
                <input
                  v-model="formData.completion_date"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Location *</label>
                <input
                  v-model="formData.site_location"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="goToFirstSection"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                First
              </button>
              <div class="flex space-x-2">
                <button
                  @click="goToPreviousSection"
                  :disabled="currentSection === 1"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Section {{ currentSection }} of {{ totalSections }}
                </span>
                <button
                  @click="goToNextSection"
                  :disabled="currentSection === totalSections"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              <button
                @click="goToLastSection"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Last
              </button>
            </div>
          </div>

          <!-- Section 2: Project Scope Summary -->
          <div id="section-2" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Section 2: Project Scope Summary</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Brief description of the deliverables, scale, and key components of the project *
              </label>
              <textarea
                v-model="formData.project_scope_summary"
                required
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe the project deliverables, scale, and key components..."
              ></textarea>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="goToFirstSection"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                First
              </button>
              <div class="flex space-x-2">
                <button
                  @click="goToPreviousSection"
                  :disabled="currentSection === 1"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Section {{ currentSection }} of {{ totalSections }}
                </span>
                <button
                  @click="goToNextSection"
                  :disabled="currentSection === totalSections"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              <button
                @click="goToLastSection"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Last
              </button>
            </div>
          </div>

          <!-- Section 3: Budget vs. Actual Summary -->
          <div id="section-3" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Section 3: Budget vs. Actual Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Approved Budget (KES) *</label>
                <input
                  v-model.number="formData.initial_budget"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                  readonly
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Final Actual Cost (KES) *</label>
                <input
                  v-model.number="formData.final_actual_cost"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variance (KES)</label>
                <input
                  :value="budgetVariance"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variance Explanation *</label>
              <textarea
                v-model="formData.variance_explanation"
                required
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Explain any variance between budget and actual costs..."
              ></textarea>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="goToFirstSection"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                First
              </button>
              <div class="flex space-x-2">
                <button
                  @click="goToPreviousSection"
                  :disabled="currentSection === 1"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Section {{ currentSection }} of {{ totalSections }}
                </span>
                <button
                  @click="goToNextSection"
                  :disabled="currentSection === totalSections"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              <button
                @click="goToLastSection"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Last
              </button>
            </div>
          </div>

          <!-- Section 4: Procurement & Inventory -->
          <div id="section-4" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Section 4: Procurement & Inventory</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Materials requested (attach MRF)</label>
                <textarea
                  v-model="formData.materials_requested"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="List materials requested and attach Material Requisition Form..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Items sourced externally</label>
                <textarea
                  v-model="formData.items_sourced_externally"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="List items sourced from external suppliers..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Store-issued items</label>
                <textarea
                  v-model="formData.store_issued_items"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="List items issued from store inventory..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inventory returns & balance (attach Inventory Log)</label>
                <textarea
                  v-model="formData.inventory_returns_balance"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Document returned items and final inventory balance..."
                ></textarea>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="goToFirstSection"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                First
              </button>
              <div class="flex space-x-2">
                <button
                  @click="goToPreviousSection"
                  :disabled="currentSection === 1"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Section {{ currentSection }} of {{ totalSections }}
                </span>
                <button
                  @click="goToNextSection"
                  :disabled="currentSection === totalSections"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              <button
                @click="goToLastSection"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Last
              </button>
            </div>
          </div>

          <!-- Section 5: Fabrication & Quality Control -->
          <div id="section-5" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Section 5: Fabrication & Quality Control</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date production started</label>
                <input
                  v-model="formData.production_start_date"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Challenges faced in production</label>
                <textarea
                  v-model="formData.production_challenges"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe any production challenges encountered..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">QC findings and resolutions (attach QC Checklist)</label>
                <textarea
                  v-model="formData.qc_findings_resolutions"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Document quality control findings and how they were resolved..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Packaging and labeling status</label>
                <textarea
                  v-model="formData.packaging_labeling_status"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Document packaging and labeling completion status..."
                ></textarea>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button @click="goToFirstSection" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">First</button>
              <div class="flex space-x-2">
                <button @click="goToPreviousSection" :disabled="currentSection === 1" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">Section {{ currentSection }} of {{ totalSections }}</span>
                <button @click="goToNextSection" :disabled="currentSection === totalSections" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
              </div>
              <button @click="goToLastSection" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Last</button>
            </div>
          </div>

          <!-- Section 6: On-Site Setup Summary -->
          <div id="section-6" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Section 6: On-Site Setup Summary</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Setup date(s)</label>
                <input
                  v-model="formData.setup_dates"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 2024-09-15 to 2024-09-17"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team composition</label>
                <textarea
                  v-model="formData.team_composition"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="List team members and their roles..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Challenges faced on site</label>
                <textarea
                  v-model="formData.site_challenges"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe any challenges encountered during setup..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client interactions and observations</label>
                <textarea
                  v-model="formData.client_interactions"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Document client interactions and key observations..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Safety issues or incidents</label>
                <textarea
                  v-model="formData.safety_issues"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Document any safety issues or incidents..."
                ></textarea>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button @click="goToFirstSection" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">First</button>
              <div class="flex space-x-2">
                <button @click="goToPreviousSection" :disabled="currentSection === 1" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">Section {{ currentSection }} of {{ totalSections }}</span>
                <button @click="goToNextSection" :disabled="currentSection === totalSections" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
              </div>
              <button @click="goToLastSection" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Last</button>
            </div>
          </div>

          <!-- Section 7: Client Handover -->
          <div id="section-7" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Section 7: Client Handover</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of handover</label>
                <input
                  v-model="formData.handover_date"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client sign-off status</label>
                <textarea
                  v-model="formData.client_sign_off_status"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Document client sign-off and acceptance..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client feedback (attach form if available)</label>
                <textarea
                  v-model="formData.client_feedback"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Record client feedback and satisfaction level..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post-handover adjustments made</label>
                <textarea
                  v-model="formData.post_handover_adjustments"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Document any adjustments made after handover..."
                ></textarea>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button @click="goToFirstSection" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">First</button>
              <div class="flex space-x-2">
                <button @click="goToPreviousSection" :disabled="currentSection === 1" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">Section {{ currentSection }} of {{ totalSections }}</span>
                <button @click="goToNextSection" :disabled="currentSection === totalSections" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
              </div>
              <button @click="goToLastSection" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Last</button>
            </div>
          </div>

          <!-- Section 8: Set-Down & Debrief Summary -->
          <div id="section-8" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Section 8: Set-Down & Debrief Summary</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of set-down</label>
                <input
                  v-model="formData.set_down_date"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition of items returned</label>
                <textarea
                  v-model="formData.items_returned_condition"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Document condition of returned items..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site clearance status</label>
                <textarea
                  v-model="formData.site_clearance_status"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Document site clearance completion..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Debrief notes (attach if separate)</label>
                <textarea
                  v-model="formData.debrief_notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Document debrief discussion points..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Section 9: Attachments Checklist -->
          <div id="section-9" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Section 9: Attachments Checklist</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label v-for="item in attachmentChecklist" :key="item.key" class="flex items-center space-x-3">
                <input
                  v-model="formData.attachments[item.key]"
                  type="checkbox"
                  class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.label }}</span>
              </label>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button @click="goToFirstSection" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">First</button>
              <div class="flex space-x-2">
                <button @click="goToPreviousSection" :disabled="currentSection === 1" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">Section {{ currentSection }} of {{ totalSections }}</span>
                <button @click="goToNextSection" :disabled="currentSection === totalSections" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
              </div>
              <button @click="goToLastSection" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Last</button>
            </div>
          </div>

          <!-- Section 10: Final Approval -->
          <div id="section-10" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Section 10: Final Approval</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Officer Name & Signature</label>
                <input
                  v-model="formData.project_officer_signature"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Name and signature"
                />
                <div class="mt-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    v-model="formData.project_officer_date"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reviewed by (Supervisor)</label>
                <input
                  v-model="formData.supervisor_signature"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Supervisor name and signature"
                />
                <div class="mt-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    v-model="formData.supervisor_date"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button @click="goToFirstSection" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">First</button>
              <div class="flex space-x-2">
                <button @click="goToPreviousSection" :disabled="currentSection === 1" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">Section {{ currentSection }} of {{ totalSections }}</span>
                <button @click="goToNextSection" :disabled="currentSection === totalSections" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
              </div>
              <button @click="goToLastSection" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Last</button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="p-6 bg-gray-50 dark:bg-gray-700">
            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                @click="autoFillCommonFields"
                class="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800"
              >
                Auto-fill Common Fields
              </button>
            </div>
          </div>

          <!-- Error/Success Messages -->
          <div v-if="error" class="p-6 border-t border-gray-200 dark:border-gray-700">
            <div class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {{ error }}
            </div>
          </div>

          <div v-if="success" class="p-6 border-t border-gray-200 dark:border-gray-700">
            <div class="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {{ success }}
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Project } from '../types/project'

const route = useRoute()
const submitting = ref(false)
const error = ref('')
const success = ref('')
const selectedProject = ref<Project | null>(null)
const availableProjects = ref<Project[]>([])
const currentSection = ref(1)
const totalSections = 10

// Attachment checklist items
const attachmentChecklist = [
  { key: 'approved_quotation', label: '☐ Approved Quotation' },
  { key: 'site_survey_form', label: '☐ Site Survey Form' },
  { key: 'project_budget_file', label: '☐ Project Budget File' },
  { key: 'material_requisition_form', label: '☐ Material Requisition Form (MRF)' },
  { key: 'inventory_log', label: '☐ Inventory Log' },
  { key: 'file_handover_form', label: '☐ File Handover Form' },
  { key: 'qc_checklist', label: '☐ QC Checklist' },
  { key: 'setup_setdown_checklists', label: '☐ Setup & Set-Down Checklists' },
  { key: 'signed_handover_form', label: '☐ Signed Handover Form' },
  { key: 'client_feedback_form', label: '☐ Client Feedback Form' },
  { key: 'paid_invoice_confirmation', label: '☐ Paid Invoice Confirmation' }
]

// Form data
const formData = ref({
  // Section 1
  project_title: '',
  client_name: '',
  project_code: '',
  project_officer: '',
  start_date: '',
  completion_date: '',
  site_location: '',

  // Section 2
  project_scope_summary: '',

  // Section 3
  initial_budget: 0,
  final_actual_cost: 0,
  variance_explanation: '',

  // Section 4: Procurement & Inventory
  materials_requested: '',
  items_sourced_externally: '',
  store_issued_items: '',
  inventory_returns_balance: '',

  // Section 5: Fabrication & Quality Control
  production_start_date: '',
  production_challenges: '',
  qc_findings_resolutions: '',
  packaging_labeling_status: '',

  // Section 6: On-Site Setup Summary
  setup_dates: '',
  team_composition: '',
  site_challenges: '',
  client_interactions: '',
  safety_issues: '',

  // Section 7: Client Handover
  handover_date: '',
  client_sign_off_status: '',
  client_feedback: '',
  post_handover_adjustments: '',

  // Section 8: Set-Down & Debrief Summary
  set_down_date: '',
  items_returned_condition: '',
  site_clearance_status: '',
  debrief_notes: '',

  // Section 9: Attachments Checklist
  attachments: {} as Record<string, boolean>,

  // Section 10: Final Approval
  project_officer_signature: '',
  project_officer_date: '',
  supervisor_signature: '',
  supervisor_date: ''
})

// Mock projects data - replace with actual API call
const mockProjects: Project[] = [
  {
    id: 1,
    enquiry_id: 1,
    name: 'Corporate Event Booth Setup',
    description: 'Complete booth setup for annual corporate event',
    start_date: '2024-08-01',
    end_date: '2024-08-15',
    status: 'completed',
    budget: 50000,
    current_phase: 8,
    phases: [],
    assigned_users: [1],
    created_by: 1,
    created_at: '2024-07-01T00:00:00Z',
    updated_at: '2024-08-15T00:00:00Z',
    enquiry: {
      id: 1,
      title: 'Corporate Event Booth Setup',
      client: {
        id: 1,
        name: 'ABC Corporation Ltd'
      }
    }
  },
  {
    id: 2,
    enquiry_id: 2,
    name: 'Wedding Exhibition Display',
    description: 'Custom display booth for wedding exhibition',
    start_date: '2024-09-01',
    end_date: '2024-09-10',
    status: 'completed',
    budget: 25000,
    current_phase: 8,
    phases: [],
    assigned_users: [2],
    created_by: 2,
    created_at: '2024-08-15T00:00:00Z',
    updated_at: '2024-09-10T00:00:00Z',
    enquiry: {
      id: 2,
      title: 'Wedding Exhibition Display',
      client: {
        id: 2,
        name: 'XYZ Events Ltd'
      }
    }
  }
]

// Computed properties
const budgetVariance = computed(() => {
  const variance = formData.value.final_actual_cost - formData.value.initial_budget
  return variance.toLocaleString()
})

const completionPercentage = computed(() => {
  const requiredFields = [
    'project_title', 'client_name', 'project_code', 'project_officer',
    'start_date', 'completion_date', 'site_location', 'project_scope_summary',
    'initial_budget', 'final_actual_cost', 'variance_explanation'
  ]

  const filledFields = requiredFields.filter(field => {
    const value = formData.value[field as keyof typeof formData.value]
    return value !== '' && value !== null && value !== undefined
  })

  return Math.round((filledFields.length / requiredFields.length) * 100)
})

// Methods
const selectProject = (project: Project) => {
  selectedProject.value = project

  // Pre-populate form with project data
  formData.value.project_title = project.name
  formData.value.client_name = project.enquiry?.client?.name || ''
  formData.value.start_date = project.start_date.split('T')[0]
  formData.value.initial_budget = project.budget
  formData.value.project_code = `PRJ-${project.id.toString().padStart(4, '0')}`

  // Load existing draft if available
  const draftKey = `closeout-draft-${project.id}`
  const existingDraft = localStorage.getItem(draftKey)
  if (existingDraft) {
    try {
      const draftData = JSON.parse(existingDraft)
      formData.value = { ...formData.value, ...draftData }
    } catch (err) {
      console.error('Failed to load draft:', err)
    }
  }
}

const autoFillCommonFields = () => {
  if (!selectedProject.value) return

  // Auto-fill common fields based on project data
  formData.value.site_location = 'Nairobi, Kenya'
  formData.value.project_officer = 'Project Officer'
  formData.value.production_start_date = selectedProject.value.start_date.split('T')[0]
  formData.value.setup_dates = `${selectedProject.value.start_date.split('T')[0]} to ${selectedProject.value.end_date?.split('T')[0] || 'TBD'}`
  formData.value.set_down_date = selectedProject.value.end_date?.split('T')[0] || ''
  formData.value.handover_date = selectedProject.value.end_date?.split('T')[0] || ''

  success.value = 'Common fields auto-filled successfully!'
  setTimeout(() => success.value = '', 3000)
}

const saveDraft = () => {
  if (!selectedProject.value) {
    error.value = 'Please select a project first'
    return
  }

  const draftKey = `closeout-draft-${selectedProject.value.id}`
  localStorage.setItem(draftKey, JSON.stringify(formData.value))
  success.value = 'Draft saved successfully!'
  setTimeout(() => success.value = '', 3000)
}

const submitReport = async () => {
  if (!selectedProject.value) {
    error.value = 'Please select a project first'
    return
  }

  if (!validateForm()) {
    error.value = 'Please fill in all required fields'
    return
  }

  submitting.value = true
  error.value = ''
  success.value = ''

  try {
    // Here you would send the data to your backend API
    console.log('Submitting close-out report for project:', selectedProject.value.id, formData.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    success.value = 'Project Close-Out Report submitted successfully!'

    // Clear draft after successful submission
    const draftKey = `closeout-draft-${selectedProject.value.id}`
    localStorage.removeItem(draftKey)

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to submit report'
  } finally {
    submitting.value = false
  }
}

const validateForm = (): boolean => {
  const requiredFields = [
    'project_title', 'client_name', 'project_code', 'project_officer',
    'start_date', 'completion_date', 'site_location', 'project_scope_summary',
    'initial_budget', 'final_actual_cost', 'variance_explanation'
  ]

  return requiredFields.every(field => {
    const value = formData.value[field as keyof typeof formData.value]
    return value !== '' && value !== null && value !== undefined
  })
}

const handleSubmit = (event: Event) => {
  event.preventDefault()
  submitReport()
}

// Navigation methods
const goToSection = (sectionNumber: number) => {
  if (sectionNumber >= 1 && sectionNumber <= totalSections) {
    currentSection.value = sectionNumber
    const sectionId = `section-${sectionNumber}`
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

const goToNextSection = () => {
  if (currentSection.value < totalSections) {
    goToSection(currentSection.value + 1)
  }
}

const goToPreviousSection = () => {
  if (currentSection.value > 1) {
    goToSection(currentSection.value - 1)
  }
}

const goToFirstSection = () => {
  goToSection(1)
}

const goToLastSection = () => {
  goToSection(totalSections)
}

// Initialize available projects
onMounted(() => {
  availableProjects.value = mockProjects.filter(project => project.status === 'completed')

  // Check if project ID is provided in route
  const projectId = route.params.projectId as string
  if (projectId) {
    const project = availableProjects.value.find(p => p.id === parseInt(projectId))
    if (project) {
      selectProject(project)
    }
  }
})
</script>
