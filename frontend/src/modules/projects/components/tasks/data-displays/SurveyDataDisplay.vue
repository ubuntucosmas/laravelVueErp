<template>
  <div class="survey-data-display">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="flex space-x-8" aria-label="Survey Data Tabs">
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

    <!-- Basic Information -->
    <div v-show="activeTab === 'basic'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Basic Information</span>
          </h3>
          <button
            @click="toggleEdit('basic')"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg v-if="!isEditing.basic" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {{ isEditing.basic ? 'Cancel Edit' : 'Edit' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Site Visit Date <span class="text-red-500">*</span>
             </label>
             <input
               v-if="isEditing.basic"
               v-model="formData.site_visit_date"
               type="date"
               :class="[
                 'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                 fieldValidationState.site_visit_date === 'invalid' ? 'border-red-500 dark:border-red-400' :
                 fieldValidationState.site_visit_date === 'valid' ? 'border-green-500 dark:border-green-400' :
                 'border-gray-300 dark:border-gray-600'
               ]"
             />
             <div v-if="isEditing.basic && validationErrors.site_visit_date && validationErrors.site_visit_date.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
               {{ validationErrors.site_visit_date[0] }}
             </div>
             <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ formatDate(taskData.site_visit_date) || 'Not specified' }}
             </div>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Location <span class="text-red-500">*</span>
             </label>
             <input
               v-if="isEditing.basic"
               v-model="formData.location"
               type="text"
               :class="[
                 'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                 fieldValidationState.location === 'invalid' ? 'border-red-500 dark:border-red-400' :
                 fieldValidationState.location === 'valid' ? 'border-green-500 dark:border-green-400' :
                 'border-gray-300 dark:border-gray-600'
               ]"
               placeholder="Enter location"
             />
             <div v-if="isEditing.basic && validationErrors.location && validationErrors.location.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
               {{ validationErrors.location[0] }}
             </div>
             <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ taskData.location || 'Not specified' }}
             </div>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Client Name <span class="text-red-500">*</span>
             </label>
             <input
               v-if="isEditing.basic"
               v-model="formData.client_name"
               type="text"
               :class="[
                 'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                 fieldValidationState.client_name === 'invalid' ? 'border-red-500 dark:border-red-400' :
                 fieldValidationState.client_name === 'valid' ? 'border-green-500 dark:border-green-400' :
                 'border-gray-300 dark:border-gray-600'
               ]"
               placeholder="Enter client name"
             />
             <div v-if="isEditing.basic && validationErrors.client_name && validationErrors.client_name.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
               {{ validationErrors.client_name[0] }}
             </div>
             <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ taskData.client_name || 'Not specified' }}
             </div>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Contact Person <span class="text-red-500">*</span>
             </label>
             <input
               v-if="isEditing.basic"
               v-model="formData.client_contact_person"
               type="text"
               :class="[
                 'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                 fieldValidationState.client_contact_person === 'invalid' ? 'border-red-500 dark:border-red-400' :
                 fieldValidationState.client_contact_person === 'valid' ? 'border-green-500 dark:border-green-400' :
                 'border-gray-300 dark:border-gray-600'
               ]"
               placeholder="Enter contact person"
             />
             <div v-if="isEditing.basic && validationErrors.client_contact_person && validationErrors.client_contact_person.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
               {{ validationErrors.client_contact_person[0] }}
             </div>
             <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ taskData.client_contact_person || 'Not specified' }}
             </div>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Phone Number <span class="text-red-500">*</span>
             </label>
             <input
               v-if="isEditing.basic"
               v-model="formData.client_phone"
               type="tel"
               :class="[
                 'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                 fieldValidationState.client_phone === 'invalid' ? 'border-red-500 dark:border-red-400' :
                 fieldValidationState.client_phone === 'valid' ? 'border-green-500 dark:border-green-400' :
                 'border-gray-300 dark:border-gray-600'
               ]"
               placeholder="Enter phone number"
             />
             <div v-if="isEditing.basic && validationErrors.client_phone && validationErrors.client_phone.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
               {{ validationErrors.client_phone[0] }}
             </div>
             <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ taskData.client_phone || 'Not specified' }}
             </div>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Email Address <span class="text-red-500">*</span>
             </label>
             <input
               v-if="isEditing.basic"
               v-model="formData.client_email"
               type="email"
               :class="[
                 'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                 fieldValidationState.client_email === 'invalid' ? 'border-red-500 dark:border-red-400' :
                 fieldValidationState.client_email === 'valid' ? 'border-green-500 dark:border-green-400' :
                 'border-gray-300 dark:border-gray-600'
               ]"
               placeholder="Enter email address"
             />
             <div v-if="isEditing.basic && validationErrors.client_email && validationErrors.client_email.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
               {{ validationErrors.client_email[0] }}
             </div>
             <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
               {{ taskData.client_email || 'Not specified' }}
             </div>
           </div>
         </div>

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

         <div class="mt-6">
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             Attendees
           </label>
           <textarea
             v-if="isEditing.basic"
             v-model="formData.attendees"
             rows="3"
             :class="[
               'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
               fieldValidationState.attendees === 'invalid' ? 'border-red-500 dark:border-red-400' :
               fieldValidationState.attendees === 'valid' ? 'border-green-500 dark:border-green-400' :
               'border-gray-300 dark:border-gray-600'
             ]"
             placeholder="Enter attendees (one per line)"
           ></textarea>
           <div v-if="isEditing.basic && validationErrors.attendees && validationErrors.attendees.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
             {{ validationErrors.attendees[0] }}
           </div>
           <div v-else class="text-sm text-gray-900 dark:text-white">
             <ul v-if="Array.isArray(formatList(taskData.attendees)) && formatList(taskData.attendees).length > 0" class="list-disc list-inside space-y-1">
               <li v-for="item in formatList(taskData.attendees)" :key="item">{{ item }}</li>
             </ul>
             <span v-else class="text-gray-500 dark:text-gray-400">No items specified</span>
           </div>
         </div>

         <div v-if="isEditing.basic" class="mt-6 flex justify-end space-x-3">
           <button
             @click="cancelEdit('basic')"
             :disabled="isLoading"
             class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Cancel
           </button>
           <button
             @click="saveEdit('basic')"
             :disabled="isLoading"
             class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <span v-if="isLoading" class="inline-flex items-center">
               <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Saving...
             </span>
             <span v-else>Save Changes</span>
           </button>
         </div>
      </div>
    </div>

    <!-- Site Assessment -->
    <div v-show="activeTab === 'assessment'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            <span>Site Assessment</span>
          </h3>
          <button
            @click="toggleEdit('assessment')"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg v-if="!isEditing.assessment" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {{ isEditing.assessment ? 'Cancel Edit' : 'Edit' }}
          </button>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-if="isEditing.assessment"
              v-model="formData.project_description"
              rows="4"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                fieldValidationState.project_description === 'invalid' ? 'border-red-500 dark:border-red-400' :
                fieldValidationState.project_description === 'valid' ? 'border-green-500 dark:border-green-400' :
                'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Enter project description"
            ></textarea>
            <div v-if="isEditing.assessment && validationErrors.project_description && validationErrors.project_description.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.project_description[0] }}
            </div>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.project_description || 'Not specified' }}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Objectives <span class="text-red-500">*</span>
              </label>
              <textarea
                v-if="isEditing.assessment"
                v-model="formData.objectives"
                rows="3"
                :class="[
                  'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  fieldValidationState.objectives === 'invalid' ? 'border-red-500 dark:border-red-400' :
                  fieldValidationState.objectives === 'valid' ? 'border-green-500 dark:border-green-400' :
                  'border-gray-300 dark:border-gray-600'
                ]"
                placeholder="Enter objectives"
              ></textarea>
              <div v-if="isEditing.assessment && validationErrors.objectives && validationErrors.objectives.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ validationErrors.objectives[0] }}
              </div>
              <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {{ taskData.objectives || 'Not specified' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Site Condition <span class="text-red-500">*</span>
              </label>
              <textarea
                v-if="isEditing.assessment"
                v-model="formData.current_condition"
                rows="3"
                :class="[
                  'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  fieldValidationState.current_condition === 'invalid' ? 'border-red-500 dark:border-red-400' :
                  fieldValidationState.current_condition === 'valid' ? 'border-green-500 dark:border-green-400' :
                  'border-gray-300 dark:border-gray-600'
                ]"
                placeholder="Enter current site condition"
              ></textarea>
              <div v-if="isEditing.assessment && validationErrors.current_condition && validationErrors.current_condition.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ validationErrors.current_condition[0] }}
              </div>
              <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {{ taskData.current_condition || 'Not specified' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Existing Branding
              </label>
              <textarea
                v-if="isEditing.assessment"
                v-model="formData.existing_branding"
                rows="3"
                class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter existing branding"
              ></textarea>
              <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {{ taskData.existing_branding || 'Not specified' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Measurements
              </label>
              <textarea
                v-if="isEditing.assessment"
                v-model="formData.site_measurements"
                rows="3"
                class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter site measurements"
              ></textarea>
              <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {{ taskData.site_measurements || 'Not specified' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room/Area Size
              </label>
              <input
                v-if="isEditing.assessment"
                v-model="formData.room_size"
                type="text"
                class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter room/area size"
              />
              <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                {{ taskData.room_size || 'Not specified' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Constraints
              </label>
              <textarea
                v-if="isEditing.assessment"
                v-model="formData.constraints"
                rows="3"
                class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter site constraints"
              ></textarea>
              <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {{ taskData.constraints || 'Not specified' }}
              </div>
            </div>
          </div>

          <div v-if="isEditing.assessment" class="mt-6 flex justify-end space-x-3">
            <button
              @click="cancelEdit('assessment')"
              :disabled="isLoading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              @click="saveEdit('assessment')"
              :disabled="isLoading"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Access & Logistics -->
    <div v-show="activeTab === 'access'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span>Access & Logistics</span>
          </h3>
          <button
            @click="toggleEdit('access')"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg v-if="!isEditing.access" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {{ isEditing.access ? 'Cancel Edit' : 'Edit' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Access Logistics <span class="text-red-500">*</span>
            </label>
            <textarea
              v-if="isEditing.access"
              v-model="formData.access_logistics"
              rows="3"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                fieldValidationState.access_logistics === 'invalid' ? 'border-red-500 dark:border-red-400' :
                fieldValidationState.access_logistics === 'valid' ? 'border-green-500 dark:border-green-400' :
                'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Enter access logistics"
            ></textarea>
            <div v-if="isEditing.access && validationErrors.access_logistics && validationErrors.access_logistics.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.access_logistics[0] }}
            </div>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.access_logistics || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parking Availability
            </label>
            <textarea
              v-if="isEditing.access"
              v-model="formData.parking_availability"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter parking availability"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.parking_availability || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Size & Accessibility
            </label>
            <textarea
              v-if="isEditing.access"
              v-model="formData.size_accessibility"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter size & accessibility"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.size_accessibility || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lifts/Elevators
            </label>
            <input
              v-if="isEditing.access"
              v-model="formData.lifts"
              type="text"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter lifts/elevators"
            />
            <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.lifts || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Door Sizes
            </label>
            <input
              v-if="isEditing.access"
              v-model="formData.door_sizes"
              type="text"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter door sizes"
            />
            <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.door_sizes || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loading Areas
            </label>
            <textarea
              v-if="isEditing.access"
              v-model="formData.loading_areas"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter loading areas"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.loading_areas || 'Not specified' }}
            </div>
          </div>
        </div>

        <div v-if="isEditing.access" class="mt-6 flex justify-end space-x-3">
          <button
            @click="cancelEdit('access')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            @click="saveEdit('access')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Requirements & Preferences -->
    <div v-show="activeTab === 'requirements'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <span>Requirements & Preferences</span>
          </h3>
          <button
            @click="toggleEdit('requirements')"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg v-if="!isEditing.requirements" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {{ isEditing.requirements ? 'Cancel Edit' : 'Edit' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Branding Preferences
            </label>
            <textarea
              v-if="isEditing.requirements"
              v-model="formData.branding_preferences"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter branding preferences"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.branding_preferences || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Material Preferences
            </label>
            <textarea
              v-if="isEditing.requirements"
              v-model="formData.material_preferences"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter material preferences"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.material_preferences || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color Scheme
            </label>
            <input
              v-if="isEditing.requirements"
              v-model="formData.color_scheme"
              type="text"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter color scheme"
            />
            <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.color_scheme || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brand Guidelines
            </label>
            <textarea
              v-if="isEditing.requirements"
              v-model="formData.brand_guidelines"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter brand guidelines"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.brand_guidelines || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Instructions
            </label>
            <textarea
              v-if="isEditing.requirements"
              v-model="formData.special_instructions"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter special instructions"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.special_instructions || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Electrical Requirements
            </label>
            <textarea
              v-if="isEditing.requirements"
              v-model="formData.electrical_outlets"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter electrical requirements"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.electrical_outlets || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Food & Refreshment
            </label>
            <textarea
              v-if="isEditing.requirements"
              v-model="formData.food_refreshment"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter food & refreshment"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.food_refreshment || 'Not specified' }}
            </div>
          </div>
        </div>

        <div v-if="isEditing.requirements" class="mt-6 flex justify-end space-x-3">
          <button
            @click="cancelEdit('requirements')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            @click="saveEdit('requirements')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Safety & Timeline -->
    <div v-show="activeTab === 'safety'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <span>Safety & Timeline</span>
          </h3>
          <button
            @click="toggleEdit('safety')"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg v-if="!isEditing.safety" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {{ isEditing.safety ? 'Cancel Edit' : 'Edit' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Safety Conditions <span class="text-red-500">*</span>
            </label>
            <textarea
              v-if="isEditing.safety"
              v-model="formData.safety_conditions"
              rows="3"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                fieldValidationState.safety_conditions === 'invalid' ? 'border-red-500 dark:border-red-400' :
                fieldValidationState.safety_conditions === 'valid' ? 'border-green-500 dark:border-green-400' :
                'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Enter safety conditions"
            ></textarea>
            <div v-if="isEditing.safety && validationErrors.safety_conditions && validationErrors.safety_conditions.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.safety_conditions[0] }}
            </div>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.safety_conditions || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Potential Hazards
            </label>
            <textarea
              v-if="isEditing.safety"
              v-model="formData.potential_hazards"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter potential hazards"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.potential_hazards || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Safety Requirements <span class="text-red-500">*</span>
            </label>
            <textarea
              v-if="isEditing.safety"
              v-model="formData.safety_requirements"
              rows="3"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                fieldValidationState.safety_requirements === 'invalid' ? 'border-red-500 dark:border-red-400' :
                fieldValidationState.safety_requirements === 'valid' ? 'border-green-500 dark:border-green-400' :
                'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Enter safety requirements"
            ></textarea>
            <div v-if="isEditing.safety && validationErrors.safety_requirements && validationErrors.safety_requirements.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.safety_requirements[0] }}
            </div>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.safety_requirements || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Start Date <span class="text-red-500">*</span>
            </label>
            <input
              v-if="isEditing.safety"
              v-model="formData.project_start_date"
              type="datetime-local"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                fieldValidationState.project_start_date === 'invalid' ? 'border-red-500 dark:border-red-400' :
                fieldValidationState.project_start_date === 'valid' ? 'border-green-500 dark:border-green-400' :
                'border-gray-300 dark:border-gray-600'
              ]"
            />
            <div v-if="isEditing.safety && validationErrors.project_start_date && validationErrors.project_start_date.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.project_start_date[0] }}
            </div>
            <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ formatDateTime(taskData.project_start_date) || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Deadline <span class="text-red-500">*</span>
            </label>
            <input
              v-if="isEditing.safety"
              v-model="formData.project_deadline"
              type="datetime-local"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                fieldValidationState.project_deadline === 'invalid' ? 'border-red-500 dark:border-red-400' :
                fieldValidationState.project_deadline === 'valid' ? 'border-green-500 dark:border-green-400' :
                'border-gray-300 dark:border-gray-600'
              ]"
            />
            <div v-if="isEditing.safety && validationErrors.project_deadline && validationErrors.project_deadline.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.project_deadline[0] }}
            </div>
            <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ formatDateTime(taskData.project_deadline) || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Key Milestones
            </label>
            <textarea
              v-if="isEditing.safety"
              v-model="formData.milestones"
              rows="3"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter key milestones"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.milestones || 'Not specified' }}
            </div>
          </div>
        </div>

        <div v-if="isEditing.safety" class="mt-6 flex justify-end space-x-3">
          <button
            @click="cancelEdit('safety')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            @click="saveEdit('safety')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div v-show="activeTab === 'additional'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Additional Information</span>
          </h3>
          <button
            @click="toggleEdit('additional')"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg v-if="!isEditing.additional" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {{ isEditing.additional ? 'Cancel Edit' : 'Edit' }}
          </button>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes
            </label>
            <textarea
              v-if="isEditing.additional"
              v-model="formData.additional_notes"
              rows="4"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter additional notes"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.additional_notes || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Requests
            </label>
            <textarea
              v-if="isEditing.additional"
              v-model="formData.special_requests"
              rows="4"
              class="w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter special requests"
            ></textarea>
            <div v-else class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {{ taskData.special_requests || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prepared By <span class="text-red-500">*</span>
            </label>
            <input
              v-if="isEditing.additional"
              v-model="formData.prepared_by"
              type="text"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                fieldValidationState.prepared_by === 'invalid' ? 'border-red-500 dark:border-red-400' :
                fieldValidationState.prepared_by === 'valid' ? 'border-green-500 dark:border-green-400' :
                'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Enter prepared by"
            />
            <div v-if="isEditing.additional && validationErrors.prepared_by && validationErrors.prepared_by.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.prepared_by[0] }}
            </div>
            <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              {{ taskData.prepared_by || 'Not specified' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Action Items
            </label>
            <textarea
              v-if="isEditing.additional"
              v-model="formData.action_items"
              rows="4"
              :class="[
                'w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                fieldValidationState.action_items === 'invalid' ? 'border-red-500 dark:border-red-400' :
                fieldValidationState.action_items === 'valid' ? 'border-green-500 dark:border-green-400' :
                'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Enter action items (one per line)"
            ></textarea>
            <div v-if="isEditing.additional && validationErrors.action_items && validationErrors.action_items.length > 0" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ validationErrors.action_items[0] }}
            </div>
            <div v-else class="text-sm text-gray-900 dark:text-white">
              <ul v-if="Array.isArray(formatList(taskData.action_items)) && formatList(taskData.action_items).length > 0" class="list-disc list-inside space-y-1">
                <li v-for="item in formatList(taskData.action_items)" :key="item">{{ item }}</li>
              </ul>
              <span v-else class="text-gray-500 dark:text-gray-400">No items specified</span>
            </div>
          </div>
        </div>

        <div v-if="isEditing.additional" class="mt-6 flex justify-end space-x-3">
          <button
            @click="cancelEdit('additional')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            @click="saveEdit('additional')"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import api from '@/plugins/axios'
import type { EnquiryTask } from '../../../types/enquiry'

interface Props {
  task: EnquiryTask
  taskData: Record<string, unknown>
  enquiryId?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [payload: { tab: string; data: Record<string, unknown> }]
  cancel: [payload: { tab: string }]
  'update:taskData': [data: Record<string, unknown>]
}>()

console.log('[DEBUG] SurveyDataDisplay - COMPONENT MOUNTED/RECEIVING DATA:', {
  task: props.task,
  taskData: props.taskData,
  enquiryId: props.enquiryId,
  taskDataKeys: props.taskData ? Object.keys(props.taskData) : null,
  taskDataType: typeof props.taskData,
  taskDataIsNull: props.taskData === null,
  taskDataIsUndefined: props.taskData === undefined,
  taskDataIsEmpty: props.taskData && Object.keys(props.taskData).length === 0,
  sampleTaskData: props.taskData ? {
    id: (props.taskData as Record<string, unknown>).id,
    site_visit_date: (props.taskData as Record<string, unknown>).site_visit_date,
    client_name: (props.taskData as Record<string, unknown>).client_name,
    location: (props.taskData as Record<string, unknown>).location,
    project_description: (props.taskData as Record<string, unknown>).project_description as string | undefined
  } : null
})

const activeTab = ref('basic')

const tabs = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'assessment', label: 'Site Assessment' },
  { key: 'access', label: 'Access & Logistics' },
  { key: 'requirements', label: 'Requirements & Preferences' },
  { key: 'safety', label: 'Safety & Timeline' },
  { key: 'additional', label: 'Additional Information' }
]

const isEditing = reactive({
  basic: false,
  assessment: false,
  access: false,
  requirements: false,
  safety: false,
  additional: false
})

const formData = ref<Record<string, unknown>>({ ...props.taskData })

// Reactive states for API operations
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

// Validation state
interface ValidationErrors {
  [key: string]: string[]
}

const validationErrors = reactive<ValidationErrors>({})
const fieldValidationState = reactive<Record<string, 'valid' | 'invalid' | 'pending'>>({})

// Validation rules
const validationRules = {
  site_visit_date: { required: true, type: 'date' },
  location: { required: true, type: 'string', minLength: 2 },
  client_name: { required: true, type: 'string', minLength: 2 },
  client_contact_person: { required: true, type: 'string', minLength: 2 },
  client_phone: { required: true, type: 'phone' },
  client_email: { required: true, type: 'email' },
  attendees: { required: false, type: 'array' },
  project_description: { required: true, type: 'string', minLength: 10 },
  objectives: { required: true, type: 'string', minLength: 10 },
  current_condition: { required: true, type: 'string', minLength: 10 },
  existing_branding: { required: false, type: 'string' },
  site_measurements: { required: false, type: 'string' },
  room_size: { required: false, type: 'string' },
  constraints: { required: false, type: 'string' },
  access_logistics: { required: true, type: 'string', minLength: 10 },
  parking_availability: { required: false, type: 'string' },
  size_accessibility: { required: false, type: 'string' },
  lifts: { required: false, type: 'string' },
  door_sizes: { required: false, type: 'string' },
  loading_areas: { required: false, type: 'string' },
  branding_preferences: { required: false, type: 'string' },
  material_preferences: { required: false, type: 'string' },
  color_scheme: { required: false, type: 'string' },
  brand_guidelines: { required: false, type: 'string' },
  special_instructions: { required: false, type: 'string' },
  electrical_outlets: { required: false, type: 'string' },
  food_refreshment: { required: false, type: 'string' },
  safety_conditions: { required: true, type: 'string', minLength: 10 },
  potential_hazards: { required: false, type: 'string' },
  safety_requirements: { required: true, type: 'string', minLength: 10 },
  project_start_date: { required: true, type: 'datetime-local' },
  project_deadline: { required: true, type: 'datetime-local' },
  milestones: { required: false, type: 'string' },
  additional_notes: { required: false, type: 'string' },
  special_requests: { required: false, type: 'string' },
  prepared_by: { required: true, type: 'string', minLength: 2 },
  action_items: { required: false, type: 'array' }
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

const validateDateTime = (dateTimeString: string): boolean => {
  const date = new Date(dateTimeString)
  return !isNaN(date.getTime())
}

const validateField = (fieldName: string, value: unknown): string[] => {
  const errors: string[] = []
  const rule = validationRules[fieldName as keyof typeof validationRules]

  if (!rule) return errors

  // Check required
  if (rule.required) {
    if (value === null || value === undefined || value === '') {
      errors.push('This field is required')
      return errors
    }
  } else {
    // If not required and empty, skip other validations
    if (value === null || value === undefined || value === '') {
      return errors
    }
  }

  // Type-specific validation
  const stringValue = String(value)

  switch (rule.type) {
    case 'email':
      if (!validateEmail(stringValue)) {
        errors.push('Please enter a valid email address')
      }
      break
    case 'phone':
      if (!validatePhone(stringValue)) {
        errors.push('Please enter a valid phone number')
      }
      break
    case 'date':
      if (!validateDate(stringValue)) {
        errors.push('Please enter a valid date')
      }
      break
    case 'datetime-local':
      if (!validateDateTime(stringValue)) {
        errors.push('Please enter a valid date and time')
      }
      break
    case 'string':
      if ('minLength' in rule && rule.minLength && stringValue.length < rule.minLength) {
        errors.push(`Minimum ${rule.minLength} characters required`)
      }
      break
    case 'array':
      if (Array.isArray(value) && value.length === 0) {
        errors.push('At least one item is required')
      } else if (typeof value === 'string' && value.trim().length === 0) {
        errors.push('At least one item is required')
      }
      break
  }

  return errors
}

const validateForm = (tab: string): boolean => {
  const tabFields = getTabFields(tab)
  let isValid = true

  tabFields.forEach(field => {
    const errors = validateField(field, formData.value[field])
    validationErrors[field] = errors
    fieldValidationState[field] = errors.length > 0 ? 'invalid' : 'valid'
    if (errors.length > 0) isValid = false
  })

  // Cross-field validation for dates
  if (tab === 'safety') {
    const startDate = formData.value.project_start_date as string
    const deadline = formData.value.project_deadline as string

    if (startDate && deadline) {
      const start = new Date(startDate)
      const end = new Date(deadline)

      if (start >= end) {
        validationErrors.project_start_date = ['Start date must be before deadline']
        validationErrors.project_deadline = ['Deadline must be after start date']
        fieldValidationState.project_start_date = 'invalid'
        fieldValidationState.project_deadline = 'invalid'
        isValid = false
      } else {
        // Clear date validation errors if dates are valid
        if (validationErrors.project_start_date?.includes('Start date must be before deadline')) {
          validationErrors.project_start_date = validationErrors.project_start_date.filter(err => err !== 'Start date must be before deadline')
        }
        if (validationErrors.project_deadline?.includes('Deadline must be after start date')) {
          validationErrors.project_deadline = validationErrors.project_deadline.filter(err => err !== 'Deadline must be after start date')
        }
        if (validationErrors.project_start_date.length === 0) fieldValidationState.project_start_date = 'valid'
        if (validationErrors.project_deadline.length === 0) fieldValidationState.project_deadline = 'valid'
      }
    }
  }

  return isValid
}

const getTabFields = (tab: string): string[] => {
  const tabFieldMap = {
    basic: ['site_visit_date', 'location', 'client_name', 'client_contact_person', 'client_phone', 'client_email', 'attendees'],
    assessment: ['project_description', 'objectives', 'current_condition', 'existing_branding', 'site_measurements', 'room_size', 'constraints'],
    access: ['access_logistics', 'parking_availability', 'size_accessibility', 'lifts', 'door_sizes', 'loading_areas'],
    requirements: ['branding_preferences', 'material_preferences', 'color_scheme', 'brand_guidelines', 'special_instructions', 'electrical_outlets', 'food_refreshment'],
    safety: ['safety_conditions', 'potential_hazards', 'safety_requirements', 'project_start_date', 'project_deadline', 'milestones'],
    additional: ['additional_notes', 'special_requests', 'prepared_by', 'action_items']
  }
  return tabFieldMap[tab as keyof typeof tabFieldMap] || []
}

// Watch for real-time validation
Object.keys(validationRules).forEach(field => {
  watch(() => formData.value[field], (newValue) => {
    const errors = validateField(field, newValue)
    validationErrors[field] = errors
    fieldValidationState[field] = errors.length > 0 ? 'invalid' : errors.length === 0 && newValue ? 'valid' : 'pending'

    // Special handling for date cross-validation
    if (field === 'project_start_date' || field === 'project_deadline') {
      const startDate = formData.value.project_start_date as string
      const deadline = formData.value.project_deadline as string

      if (startDate && deadline) {
        const start = new Date(startDate)
        const end = new Date(deadline)

        if (start >= end) {
          validationErrors.project_start_date = ['Start date must be before deadline']
          validationErrors.project_deadline = ['Deadline must be after start date']
          fieldValidationState.project_start_date = 'invalid'
          fieldValidationState.project_deadline = 'invalid'
        } else {
          // Clear date validation errors
          if (validationErrors.project_start_date?.includes('Start date must be before deadline')) {
            validationErrors.project_start_date = validationErrors.project_start_date.filter(err => err !== 'Start date must be before deadline')
          }
          if (validationErrors.project_deadline?.includes('Deadline must be after start date')) {
            validationErrors.project_deadline = validationErrors.project_deadline.filter(err => err !== 'Deadline must be after start date')
          }
          if (validationErrors.project_start_date.length === 0) fieldValidationState.project_start_date = 'valid'
          if (validationErrors.project_deadline.length === 0) fieldValidationState.project_deadline = 'valid'
        }
      }
    }
  })
})

// Remove unused function

const toggleEdit = (tab: keyof typeof isEditing) => {
  isEditing[tab] = !isEditing[tab]
  if (isEditing[tab]) {
    formData.value = { ...props.taskData }
    // Clear any previous messages
    error.value = ''
    successMessage.value = ''
    // Clear validation errors for this tab
    const tabFields = getTabFields(tab)
    tabFields.forEach(field => {
      validationErrors[field] = []
      fieldValidationState[field] = 'pending'
    })
  }
}

const saveEdit = async (tab: keyof typeof isEditing) => {
  if (!props.taskData?.id) {
    error.value = 'Survey data not found. Cannot save changes.'
    return
  }

  // Validate form before submission
  if (!validateForm(tab)) {
    error.value = 'Please fix the validation errors before saving.'
    return
  }

  error.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const surveyId = props.taskData.id as number
    const payload = {
      ...formData.value,
      // Ensure action_items is properly formatted as an array
      action_items: Array.isArray(formData.value.action_items)
        ? formData.value.action_items
        : formData.value.action_items
          ? String(formData.value.action_items).split('\n').filter(item => item.trim())
          : []
    }

    console.log('[DEBUG] SurveyDataDisplay.saveEdit - Making PATCH request:', {
      surveyId,
      payload,
      tab
    })

    const response = await api.patch(`/api/projects/site-surveys/${surveyId}`, payload)

    console.log('[DEBUG] SurveyDataDisplay.saveEdit - API response:', response.data)

    // Update local data with server response
    const updatedData = response.data
    emit('update:taskData', updatedData)

    // Update form data
    formData.value = { ...updatedData }

    successMessage.value = 'Changes saved successfully!'
    isEditing[tab] = false

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (err: unknown) {
    console.error('[DEBUG] SurveyDataDisplay.saveEdit - Error:', err)

    const errorObj = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }

    if (errorObj.response?.status === 409) {
      // Concurrent edit conflict
      error.value = 'This survey has been modified by another user. Please refresh and try again.'
    } else if (errorObj.response?.status === 422) {
      // Validation errors
      const validationErrors = errorObj.response.data?.errors
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join(', ')
        error.value = `Validation failed: ${errorMessages}`
      } else {
        error.value = errorObj.response.data?.message || 'Validation failed. Please check your input.'
      }
    } else if (errorObj.response?.status === 403) {
      error.value = 'You do not have permission to edit this survey.'
    } else if (errorObj.response?.status === 404) {
      error.value = 'Survey not found. It may have been deleted.'
    } else {
      error.value = errorObj.response?.data?.message || 'Failed to save changes. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const cancelEdit = (tab: keyof typeof isEditing) => {
  emit('cancel', { tab })
  isEditing[tab] = false
  formData.value = { ...props.taskData }
  // Clear any messages
  error.value = ''
  successMessage.value = ''
}

// Utility functions
const formatDate = (dateString: unknown) => {
  if (!dateString || typeof dateString !== 'string') return null
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

const formatDateTime = (dateTimeString: unknown) => {
  if (!dateTimeString || typeof dateTimeString !== 'string') return null
  try {
    return new Date(dateTimeString).toLocaleString()
  } catch {
    return dateTimeString
  }
}

const formatList = (items: unknown) => {
  if (Array.isArray(items)) {
    return items
  }
  return []
}

onMounted(() => {
  console.log('[DEBUG] SurveyDataDisplay.onMounted - COMPONENT MOUNTED AND RENDERING:', {
    taskData: props.taskData,
    taskDataKeys: props.taskData ? Object.keys(props.taskData) : null,
    taskDataType: typeof props.taskData,
    hasData: !!props.taskData,
    isEmpty: props.taskData && Object.keys(props.taskData).length === 0,
    sampleData: props.taskData ? {
      id: (props.taskData as Record<string, unknown>).id,
      site_visit_date: (props.taskData as Record<string, unknown>).site_visit_date,
      client_name: (props.taskData as Record<string, unknown>).client_name,
      location: (props.taskData as Record<string, unknown>).location,
      project_description: (props.taskData as Record<string, unknown>).project_description as string | undefined
    } : null
  })
})
</script>

<style scoped>
.survey-data-display {
  max-width: none;
}
</style>
