<template>
  <div class="survey-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

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

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.key
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div v-show="activeTab === 'basic'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Site Visit Date -->
          <div>
            <label for="site_visit_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Visit Date <span class="text-red-500">*</span>
            </label>
            <input
              id="site_visit_date"
              v-model="formData.site_visit_date"
              type="date"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors',
                !formData.site_visit_date ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              required
            />
          </div>

          <!-- Location -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location <span class="text-red-500">*</span>
            </label>
            <input
              id="location"
              v-model="formData.location"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors',
                !formData.location?.trim() ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Site location address"
              required
            />
          </div>

          <!-- Client Name -->
          <div>
            <label for="client_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client Name <span class="text-red-500">*</span>
            </label>
            <input
              id="client_name"
              v-model="formData.client_name"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors',
                !formData.client_name?.trim() ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Client company or individual name"
              required
            />
          </div>

          <!-- Client Contact Person -->
          <div>
            <label for="client_contact_person" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Person
            </label>
            <input
              id="client_contact_person"
              v-model="formData.client_contact_person"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Primary contact person"
            />
          </div>

          <!-- Client Phone -->
          <div>
            <label for="client_phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              id="client_phone"
              v-model="formData.client_phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="+254 XXX XXX XXX"
            />
          </div>

          <!-- Client Email -->
          <div>
            <label for="client_email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="client_email"
              v-model="formData.client_email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="client@example.com"
            />
          </div>
        </div>

        <!-- Attendees -->
        <div class="mt-4">
          <label for="attendees" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attendees
          </label>
          <textarea
            id="attendees"
            v-model="attendeesText"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="List all attendees (one per line)"
            @input="parseAttendees"
          ></textarea>
        </div>
      </div>

      <!-- Site Assessment -->
      <div v-show="activeTab === 'assessment'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Site Assessment</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Project Description -->
          <div class="md:col-span-2">
            <label for="project_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Description <span class="text-red-500">*</span>
            </label>
            <textarea
              id="project_description"
              v-model="formData.project_description"
              rows="3"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors',
                !formData.project_description?.trim() ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Describe the project requirements and scope"
              required
            ></textarea>
          </div>

          <!-- Objectives -->
          <div>
            <label for="objectives" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Objectives
            </label>
            <textarea
              id="objectives"
              v-model="formData.objectives"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="What are the main objectives of this project?"
            ></textarea>
          </div>

          <!-- Current Condition -->
          <div>
            <label for="current_condition" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Site Condition
            </label>
            <textarea
              id="current_condition"
              v-model="formData.current_condition"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe the current state of the site"
            ></textarea>
          </div>

          <!-- Existing Branding -->
          <div>
            <label for="existing_branding" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Existing Branding
            </label>
            <textarea
              id="existing_branding"
              v-model="formData.existing_branding"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any existing branding or signage at the site"
            ></textarea>
          </div>

          <!-- Site Measurements -->
          <div>
            <label for="site_measurements" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Measurements
            </label>
            <textarea
              id="site_measurements"
              v-model="formData.site_measurements"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Key measurements and dimensions"
            ></textarea>
          </div>

          <!-- Room Size -->
          <div>
            <label for="room_size" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Room/Area Size
            </label>
            <input
              id="room_size"
              v-model="formData.room_size"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 10m x 15m, 150 sqm"
            />
          </div>

          <!-- Constraints -->
          <div>
            <label for="constraints" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Constraints
            </label>
            <textarea
              id="constraints"
              v-model="formData.constraints"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any constraints or limitations at the site"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Access & Logistics -->
      <div v-show="activeTab === 'access'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Access & Logistics</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Access Logistics -->
          <div>
            <label for="access_logistics" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Access Logistics
            </label>
            <textarea
              id="access_logistics"
              v-model="formData.access_logistics"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="How to access the site, entry points, etc."
            ></textarea>
          </div>

          <!-- Parking Availability -->
          <div>
            <label for="parking_availability" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parking Availability
            </label>
            <textarea
              id="parking_availability"
              v-model="formData.parking_availability"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="Parking options and capacity"
            ></textarea>
          </div>

          <!-- Size Accessibility -->
          <div>
            <label for="size_accessibility" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Size & Accessibility
            </label>
            <textarea
              id="size_accessibility"
              v-model="formData.size_accessibility"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="Size limitations and accessibility considerations"
            ></textarea>
          </div>

          <!-- Lifts -->
          <div>
            <label for="lifts" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lifts/Elevators
            </label>
            <input
              id="lifts"
              v-model="formData.lifts"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="Lift availability and capacity"
            />
          </div>

          <!-- Door Sizes -->
          <div>
            <label for="door_sizes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Door Sizes
            </label>
            <input
              id="door_sizes"
              v-model="formData.door_sizes"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="Door dimensions and types"
            />
          </div>

          <!-- Loading Areas -->
          <div>
            <label for="loading_areas" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loading Areas
            </label>
            <textarea
              id="loading_areas"
              v-model="formData.loading_areas"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="Loading dock availability and specifications"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Requirements & Preferences -->
      <div v-show="activeTab === 'requirements'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Requirements & Preferences</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Branding Preferences -->
          <div>
            <label for="branding_preferences" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Branding Preferences
            </label>
            <textarea
              id="branding_preferences"
              v-model="formData.branding_preferences"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Client's branding requirements and preferences"
            ></textarea>
          </div>

          <!-- Material Preferences -->
          <div>
            <label for="material_preferences" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Material Preferences
            </label>
            <textarea
              id="material_preferences"
              v-model="formData.material_preferences"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Preferred materials and specifications"
            ></textarea>
          </div>

          <!-- Color Scheme -->
          <div>
            <label for="color_scheme" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color Scheme
            </label>
            <input
              id="color_scheme"
              v-model="formData.color_scheme"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Preferred colors and color scheme"
            />
          </div>

          <!-- Brand Guidelines -->
          <div>
            <label for="brand_guidelines" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brand Guidelines
            </label>
            <textarea
              id="brand_guidelines"
              v-model="formData.brand_guidelines"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Brand guidelines and requirements"
            ></textarea>
          </div>

          <!-- Special Instructions -->
          <div>
            <label for="special_instructions" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Instructions
            </label>
            <textarea
              id="special_instructions"
              v-model="formData.special_instructions"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any special instructions or requirements"
            ></textarea>
          </div>

          <!-- Electrical Outlets -->
          <div>
            <label for="electrical_outlets" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Electrical Requirements
            </label>
            <textarea
              id="electrical_outlets"
              v-model="formData.electrical_outlets"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Power requirements and electrical specifications"
            ></textarea>
          </div>

          <!-- Food & Refreshment -->
          <div>
            <label for="food_refreshment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Food & Refreshment
            </label>
            <textarea
              id="food_refreshment"
              v-model="formData.food_refreshment"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Catering and refreshment requirements"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Safety & Timeline -->
      <div v-show="activeTab === 'safety'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Safety & Timeline</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Safety Conditions -->
          <div>
            <label for="safety_conditions" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Safety Conditions
            </label>
            <textarea
              id="safety_conditions"
              v-model="formData.safety_conditions"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Site safety conditions and requirements"
            ></textarea>
          </div>

          <!-- Potential Hazards -->
          <div>
            <label for="potential_hazards" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Potential Hazards
            </label>
            <textarea
              id="potential_hazards"
              v-model="formData.potential_hazards"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Identify any potential hazards or risks"
            ></textarea>
          </div>

          <!-- Safety Requirements -->
          <div>
            <label for="safety_requirements" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Safety Requirements
            </label>
            <textarea
              id="safety_requirements"
              v-model="formData.safety_requirements"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Required safety measures and equipment"
            ></textarea>
          </div>

          <!-- Project Start Date -->
          <div>
            <label for="project_start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Start Date
            </label>
            <input
              id="project_start_date"
              v-model="formData.project_start_date"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Project Deadline -->
          <div>
            <label for="project_deadline" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Deadline
            </label>
            <input
              id="project_deadline"
              v-model="formData.project_deadline"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Milestones -->
          <div>
            <label for="milestones" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Key Milestones
            </label>
            <textarea
              id="milestones"
              v-model="formData.milestones"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Key project milestones and deadlines"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div v-show="activeTab === 'additional'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Additional Notes -->
          <div class="md:col-span-2">
            <label for="additional_notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes
            </label>
            <textarea
              id="additional_notes"
              v-model="formData.additional_notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any additional notes or observations"
            ></textarea>
          </div>

          <!-- Special Requests -->
          <div>
            <label for="special_requests" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Requests
            </label>
            <textarea
              id="special_requests"
              v-model="formData.special_requests"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any special requests or requirements"
            ></textarea>
          </div>

          <!-- Prepared By -->
          <div>
            <label for="prepared_by" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prepared By
            </label>
            <input
              id="prepared_by"
              v-model="formData.prepared_by"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Survey conductor's name"
            />
          </div>
        </div>

        <!-- Action Items -->
        <div class="mt-4">
          <label for="action_items" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Action Items
          </label>
          <textarea
            id="action_items"
            v-model="actionItemsText"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="List action items (one per line)"
            @input="parseActionItems"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Survey
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Survey
          </button>
        </div>
        <div class="flex space-x-2">
          <button
            @click="handleSaveDraft"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Save to Draft
          </button>
          <button
            type="submit"
            :disabled="hasValidationErrors"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Survey Data
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const formData = ref({
  site_visit_date: '',
  location: '',
  client_name: '',
  attendees: [] as string[],
  client_contact_person: '',
  client_phone: '',
  client_email: '',
  project_description: '',
  objectives: '',
  current_condition: '',
  existing_branding: '',
  access_logistics: '',
  parking_availability: '',
  size_accessibility: '',
  lifts: '',
  door_sizes: '',
  loading_areas: '',
  site_measurements: '',
  room_size: '',
  constraints: '',
  electrical_outlets: '',
  food_refreshment: '',
  branding_preferences: '',
  material_preferences: '',
  color_scheme: '',
  brand_guidelines: '',
  special_instructions: '',
  safety_conditions: '',
  potential_hazards: '',
  safety_requirements: '',
  project_start_date: '',
  project_deadline: '',
  additional_notes: '',
  special_requests: '',
  action_items: [] as string[],
  milestones: '',
  prepared_by: ''
})

const attendeesText = ref('')
const actionItemsText = ref('')
const error = ref('')
const successMessage = ref('')
const activeTab = ref('basic')

const tabs = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'assessment', label: 'Site Assessment' },
  { key: 'access', label: 'Access & Logistics' },
  { key: 'requirements', label: 'Requirements & Preferences' },
  { key: 'safety', label: 'Safety & Timeline' },
  { key: 'additional', label: 'Additional Information' }
]

// Computed properties
const hasValidationErrors = computed(() => {
  return !formData.value.site_visit_date ||
         !formData.value.location?.trim() ||
         !formData.value.client_name?.trim() ||
         !formData.value.project_description?.trim()
})

// Methods
const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const parseAttendees = () => {
  const lines = attendeesText.value.trim().split('\n').filter(line => line.trim() !== '')
  formData.value.attendees = lines
}

const parseActionItems = () => {
  const lines = actionItemsText.value.trim().split('\n').filter(line => line.trim() !== '')
  formData.value.action_items = lines
}

const handleSubmit = () => {
  error.value = ''
  successMessage.value = ''

  if (hasValidationErrors.value) {
    error.value = 'Please fill in all required fields.'
    return
  }

  // Here you would typically save the form data
  console.log('Survey data:', formData.value)
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }

  successMessage.value = 'Survey data saved successfully!'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const handleSaveDraft = () => {
  error.value = ''
  successMessage.value = ''

  // Save draft without validation
  console.log('Survey draft data:', formData.value)

  successMessage.value = 'Survey draft saved successfully!'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

// Watch for task changes to reset form if needed
watch(() => props.task.id, () => {
  error.value = ''
  successMessage.value = ''
  // Reset form for new task
  formData.value = {
    site_visit_date: '',
    location: '',
    client_name: '',
    attendees: [],
    client_contact_person: '',
    client_phone: '',
    client_email: '',
    project_description: '',
    objectives: '',
    current_condition: '',
    existing_branding: '',
    access_logistics: '',
    parking_availability: '',
    size_accessibility: '',
    lifts: '',
    door_sizes: '',
    loading_areas: '',
    site_measurements: '',
    room_size: '',
    constraints: '',
    electrical_outlets: '',
    food_refreshment: '',
    branding_preferences: '',
    material_preferences: '',
    color_scheme: '',
    brand_guidelines: '',
    special_instructions: '',
    safety_conditions: '',
    potential_hazards: '',
    safety_requirements: '',
    project_start_date: '',
    project_deadline: '',
    additional_notes: '',
    special_requests: '',
    action_items: [],
    milestones: '',
    prepared_by: ''
  }
  attendeesText.value = ''
  actionItemsText.value = ''
})
</script>
