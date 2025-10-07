<template>
  <div class="design-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          v-for="tab in availableTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center justify-center px-2 py-2 text-xs font-medium rounded-md transition-colors',
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          ]"
        >
          <span class="mr-1 text-sm">{{ tab.icon }}</span>
          <span class="hidden sm:inline">{{ tab.label }}</span>
        </button>
      </nav>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Project Type Required Message -->
      <div v-if="!formData.project_type && activeTab !== 'project-type'" class="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <div>
            <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Project Type Required</h4>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">Please select a project type first to access design configuration.</p>
          </div>
        </div>
        <button
          @click="activeTab = 'project-type'"
          class="mt-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
        >
          Select Project Type
        </button>
      </div>

      <!-- Project Type Tab -->
      <div v-if="activeTab === 'project-type'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Project Type *</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="projectType in projectTypes"
              :key="projectType.id"
              @click="formData.project_type = projectType.id"
              :class="[
                'border-2 rounded-lg p-4 cursor-pointer transition-all',
                formData.project_type === projectType.id
                  ? 'border-primary bg-primary bg-opacity-10'
                  : 'border-gray-200 dark:border-gray-600 hover:border-primary hover:border-opacity-50'
              ]"
            >
              <div class="flex items-center mb-2">
                <span class="text-2xl mr-3">{{ projectType.icon }}</span>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">{{ projectType.name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ projectType.description }}</p>
                </div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                <span class="font-medium">Tabs:</span> {{ projectType.tabs.length }} active
              </div>
            </div>
          </div>
        </div>

        <div v-if="formData.project_type" class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Selected: {{ projectTypes.find(pt => pt.id === formData.project_type)?.name }}</h4>
          <p class="text-sm text-blue-800 dark:text-blue-200 mb-3">{{ projectTypes.find(pt => pt.id === formData.project_type)?.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 text-xs rounded-full">
              Active Tabs: {{ availableTabs.length - 1 }}
            </span>
            <span class="px-2 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 text-xs rounded-full">
              Required Fields: {{ projectTypes.find(pt => pt.id === formData.project_type)?.requiredFields.length }}
            </span>
          </div>
        </div>
      </div>

      <!-- Branding Tab -->
      <div v-if="activeTab === 'branding' && formData.project_type" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Brand Name
              <span v-if="isFieldRequired('brand_name')" class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.brand_name"
              type="text"
              :required="isFieldRequired('brand_name')"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Client's brand name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo Provided</label>
            <div class="mt-1 flex items-center">
              <input
                v-model="formData.logo_provided"
                type="checkbox"
                class="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Client has provided logo</span>
            </div>
          </div>
        </div>

        <div v-if="formData.logo_provided" class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload($event, 'logo')"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Primary Color
              <span v-if="isFieldRequired('primary_color')" class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.primary_color"
              type="text"
              :required="isFieldRequired('primary_color')"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., #FF0000 or Red"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Secondary Color</label>
            <input
              v-model="formData.secondary_color"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., #00FF00 or Green"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Accent Colors</label>
            <input
              v-model="formData.accent_colors"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Additional colors"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Typography</label>
          <input
            v-model="formData.typography"
            type="text"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Primary fonts, sizes, weights"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand Guidelines</label>
          <textarea
            v-model="formData.brand_guidelines"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Brand guidelines, usage rules, restrictions"
          ></textarea>
        </div>
      </div>

      <!-- Stage Design Tab -->
      <div v-if="activeTab === 'stage'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Stage Type</label>
            <select
              v-model="formData.stage_type"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select stage type</option>
              <option value="platform">Platform Stage</option>
              <option value="modular">Modular Stage</option>
              <option value="truss">Truss System</option>
              <option value="custom">Custom Build</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Stage Material</label>
            <select
              v-model="formData.stage_material"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select material</option>
              <option value="wood">Wood</option>
              <option value="metal">Metal</option>
              <option value="composite">Composite</option>
              <option value="mixed">Mixed Materials</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Dimensions (L×W)</label>
            <input
              v-model="formData.stage_dimensions"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., 10m × 5m"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Height</label>
            <input
              v-model="formData.stage_height"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., 1.2m"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Flooring Type</label>
            <select
              v-model="formData.flooring_type"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select flooring</option>
              <option value="carpet">Carpet</option>
              <option value="wood">Wood</option>
              <option value="vinyl">Vinyl</option>
              <option value="none">No flooring</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Lighting Requirements</label>
          <textarea
            v-model="formData.lighting_requirements"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="LED lights, spotlights, uplighting, etc."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Backdrop Design</label>
          <textarea
            v-model="formData.backdrop_design"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Curtains, banners, LED screens, etc."
          ></textarea>
        </div>
      </div>

      <!-- Booth Design Tab -->
      <div v-if="activeTab === 'booth'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Booth Type</label>
            <select
              v-model="formData.booth_type"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="inline">Inline Booth</option>
              <option value="corner">Corner Booth</option>
              <option value="peninsula">Peninsula Booth</option>
              <option value="island">Island Booth</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Booth Size</label>
            <input
              v-model="formData.booth_size"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., 3m × 3m"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Booth Height</label>
            <input
              v-model="formData.booth_height"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., 2.5m"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Configuration</label>
            <select
              v-model="formData.booth_configuration"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select configuration</option>
              <option value="open">Open Layout</option>
              <option value="semi-enclosed">Semi-Enclosed</option>
              <option value="enclosed">Fully Enclosed</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Elements</label>
          <textarea
            v-model="formData.display_elements"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Shelves, counters, product displays, etc."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Interactive Elements</label>
          <textarea
            v-model="formData.interactive_elements"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Touch screens, demo stations, games, etc."
          ></textarea>
        </div>
      </div>

      <!-- Signage Tab -->
      <div v-if="activeTab === 'signage'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Signage Types Required</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <label class="flex items-center">
              <input
                v-model="formData.signage_types"
                type="checkbox"
                value="banners"
                class="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <span class="ml-2 text-sm">Banners</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.signage_types"
                type="checkbox"
                value="posters"
                class="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <span class="ml-2 text-sm">Posters</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.signage_types"
                type="checkbox"
                value="stands"
                class="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <span class="ml-2 text-sm">Display Stands</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.signage_types"
                type="checkbox"
                value="flags"
                class="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <span class="ml-2 text-sm">Flags</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Banner Sizes</label>
          <input
            v-model="formData.banner_sizes"
            type="text"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="e.g., 2m×1m, 3m×2m, etc."
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center">
            <input
              v-model="formData.digital_signage"
              type="checkbox"
              class="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <label class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Digital Signage</label>
          </div>
          <div class="flex items-center">
            <input
              v-model="formData.custom_badges"
              type="checkbox"
              class="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <label class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Custom Badges</label>
          </div>
          <div class="flex items-center">
            <input
              v-model="formData.directional_signs"
              type="checkbox"
              class="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <label class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Directional Signs</label>
          </div>
        </div>
      </div>

      <!-- Fabrication Tab -->
      <div v-if="activeTab === 'fabrication'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Materials List</label>
          <textarea
            v-model="formData.materials_list"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="List all materials needed for fabrication"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fabrication Notes</label>
          <textarea
            v-model="formData.fabrication_notes"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Special fabrication requirements or techniques"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Assembly Requirements</label>
            <textarea
              v-model="formData.assembly_requirements"
              rows="2"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Assembly instructions, tools needed"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Transportation Notes</label>
            <textarea
              v-model="formData.transportation_notes"
              rows="2"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Shipping requirements, vehicle access"
            ></textarea>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight Limitations</label>
          <input
            v-model="formData.weight_limitations"
            type="text"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Maximum weight per component or total"
          />
        </div>
      </div>

      <!-- Mockups Tab -->
      <div v-if="activeTab === 'mockups'" class="space-y-4">
        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Mockup Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleFileUpload($event, 'mockups')"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light"
          />
          <p class="mt-1 text-xs text-gray-500">Upload design mockups, renderings, or concept images</p>
        </div>

        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Concept Boards</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            multiple
            @change="handleFileUpload($event, 'concept_boards')"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light"
          />
          <p class="mt-1 text-xs text-gray-500">Upload mood boards, inspiration, or concept presentations</p>
        </div>

        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Technical Drawings</label>
          <input
            type="file"
            accept="image/*,application/pdf,.dwg,.dxf"
            multiple
            @change="handleFileUpload($event, 'technical_drawings')"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light"
          />
          <p class="mt-1 text-xs text-gray-500">Upload CAD files, technical drawings, or specifications</p>
        </div>
      </div>

      <!-- Approval Tab -->
      <div v-if="activeTab === 'approval'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center">
            <input
              v-model="formData.client_approval_required"
              type="checkbox"
              class="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <label class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Client Approval Required</label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Approval Deadline</label>
            <input
              v-model="formData.approval_deadline"
              type="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Revision Rounds</label>
            <select
              v-model.number="formData.revision_rounds"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option :value="1">1 Round</option>
              <option :value="2">2 Rounds</option>
              <option :value="3">3 Rounds</option>
              <option :value="4">Unlimited</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Approval Status</label>
            <select
              v-model="formData.approval_status"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="submitted">Submitted for Approval</option>
              <option value="approved">Approved</option>
              <option value="revision_requested">Revision Requested</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notes Tab -->
      <div v-if="activeTab === 'notes'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Design Requirements</label>
          <textarea
            v-model="formData.requirements"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Specific design requirements, preferences, or constraints"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Reference Materials</label>
          <textarea
            v-model="formData.references"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Links to inspiration, images, or reference materials"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Design Notes</label>
          <textarea
            v-model="formData.notes"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Additional design notes, comments, or special considerations"
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
            Start Design
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Design
          </button>
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          Save Design Data
        </button>
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

const activeTab = ref('project-type')

// Project Type Configurations
const projectTypes = [
  {
    id: 'corporate-event',
    name: 'Corporate Event',
    description: 'Conferences, seminars, corporate gatherings',
    icon: '🏢',
    tabs: ['branding', 'stage', 'signage', 'fabrication', 'mockups', 'approval', 'notes'],
    requiredFields: ['brand_name', 'stage_type', 'signage_types']
  },
  {
    id: 'trade-show',
    name: 'Trade Show/Exhibition',
    description: 'Booth design and exhibition setup',
    icon: '🏪',
    tabs: ['branding', 'booth', 'signage', 'fabrication', 'mockups', 'approval', 'notes'],
    requiredFields: ['brand_name', 'booth_type', 'signage_types']
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Product unveiling and launch events',
    icon: '🚀',
    tabs: ['branding', 'stage', 'booth', 'signage', 'fabrication', 'mockups', 'approval', 'notes'],
    requiredFields: ['brand_name', 'stage_type', 'booth_type']
  },
  {
    id: 'wedding-corporate',
    name: 'Wedding/Corporate Party',
    description: 'Social and corporate celebrations',
    icon: '🎉',
    tabs: ['branding', 'stage', 'signage', 'fabrication', 'mockups', 'approval', 'notes'],
    requiredFields: ['brand_name', 'stage_type']
  },
  {
    id: 'branding-campaign',
    name: 'Branding Campaign',
    description: 'Brand identity and marketing materials',
    icon: '🎨',
    tabs: ['branding', 'signage', 'mockups', 'approval', 'notes'],
    requiredFields: ['brand_name', 'primary_color']
  },
  {
    id: 'custom-fabrication',
    name: 'Custom Fabrication',
    description: 'Specialized fabrication projects',
    icon: '🔧',
    tabs: ['branding', 'fabrication', 'mockups', 'approval', 'notes'],
    requiredFields: ['materials_list', 'fabrication_notes']
  }
]

const allTabs = [
  { id: 'project-type', label: 'Project Type', icon: '📋' },
  { id: 'branding', label: 'Branding', icon: '🏷️' },
  { id: 'stage', label: 'Stage Design', icon: '🎪' },
  { id: 'booth', label: 'Booth Design', icon: '🏪' },
  { id: 'signage', label: 'Signage', icon: '📢' },
  { id: 'fabrication', label: 'Fabrication', icon: '🔧' },
  { id: 'mockups', label: 'Mockups', icon: '🖼️' },
  { id: 'approval', label: 'Approval', icon: '✅' },
  { id: 'notes', label: 'Notes', icon: '📝' }
]

// Computed property for available tabs based on project type
const availableTabs = computed(() => {
  if (!formData.value.project_type) return [allTabs[0]] // Only show project type selector
  const projectType = projectTypes.find(pt => pt.id === formData.value.project_type)
  if (!projectType) return allTabs
  return allTabs.filter(tab => projectType.tabs.includes(tab.id) || tab.id === 'project-type')
})

// Check if a field is required for current project type
const isFieldRequired = (fieldName: string) => {
  const projectType = projectTypes.find(pt => pt.id === formData.value.project_type)
  return projectType?.requiredFields.includes(fieldName) || false
}

const formData = ref({
  // Project Type
  project_type: '',

  // Branding
  brand_name: '',
  logo_provided: false,
  logo_file: null as File | null,
  primary_color: '',
  secondary_color: '',
  accent_colors: '',
  typography: '',
  brand_guidelines: '',

  // Stage Design
  stage_type: '',
  stage_dimensions: '',
  stage_height: '',
  stage_material: '',
  lighting_requirements: '',
  backdrop_design: '',
  flooring_type: '',

  // Booth Design
  booth_type: 'inline',
  booth_size: '',
  booth_height: '',
  booth_configuration: '',
  display_elements: '',
  interactive_elements: '',

  // Signage
  signage_types: [] as string[],
  banner_sizes: '',
  digital_signage: false,
  custom_badges: false,
  directional_signs: false,

  // Fabrication
  materials_list: '',
  fabrication_notes: '',
  assembly_requirements: '',
  transportation_notes: '',
  weight_limitations: '',

  // Mockups
  mockup_files: [] as File[],
  concept_boards: [] as File[],
  technical_drawings: [] as File[],

  // Approval
  client_approval_required: true,
  approval_deadline: '',
  revision_rounds: 1,
  approval_status: 'pending',

  // General
  design_style: '',
  requirements: '',
  references: '',
  notes: ''
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const handleFileUpload = (event: Event, type: string) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return

  const fileArray = Array.from(files)
  switch (type) {
    case 'logo':
      formData.value.logo_file = fileArray[0] || null
      break
    case 'mockups':
      formData.value.mockup_files = [...formData.value.mockup_files, ...fileArray]
      break
    case 'concept_boards':
      formData.value.concept_boards = [...formData.value.concept_boards, ...fileArray]
      break
    case 'technical_drawings':
      formData.value.technical_drawings = [...formData.value.technical_drawings, ...fileArray]
      break
  }
}

const handleSubmit = () => {
  // Dynamic validation based on project type
  if (!formData.value.project_type) {
    alert('Please select a project type first.')
    activeTab.value = 'project-type'
    return
  }

  const projectType = projectTypes.find(pt => pt.id === formData.value.project_type)
  if (!projectType) return

  // Check required fields
  const missingFields = []
  for (const field of projectType.requiredFields) {
    if (!formData.value[field as keyof typeof formData.value]) {
      missingFields.push(field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()))
    }
  }

  if (missingFields.length > 0) {
    alert(`Please fill in the required fields: ${missingFields.join(', ')}`)
    return
  }

  // Here you would typically save the form data
  console.log('Design data:', formData.value)
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset form if needed
watch(() => props.task.id, () => {
  // Reset form for new task
  formData.value = {
    // Project Type
    project_type: '',

    // Branding
    brand_name: '',
    logo_provided: false,
    logo_file: null,
    primary_color: '',
    secondary_color: '',
    accent_colors: '',
    typography: '',
    brand_guidelines: '',

    // Stage Design
    stage_type: '',
    stage_dimensions: '',
    stage_height: '',
    stage_material: '',
    lighting_requirements: '',
    backdrop_design: '',
    flooring_type: '',

    // Booth Design
    booth_type: 'inline',
    booth_size: '',
    booth_height: '',
    booth_configuration: '',
    display_elements: '',
    interactive_elements: '',

    // Signage
    signage_types: [],
    banner_sizes: '',
    digital_signage: false,
    custom_badges: false,
    directional_signs: false,

    // Fabrication
    materials_list: '',
    fabrication_notes: '',
    assembly_requirements: '',
    transportation_notes: '',
    weight_limitations: '',

    // Mockups
    mockup_files: [],
    concept_boards: [],
    technical_drawings: [],

    // Approval
    client_approval_required: true,
    approval_deadline: '',
    revision_rounds: 1,
    approval_status: 'pending',

    // General
    design_style: '',
    requirements: '',
    references: '',
    notes: ''
  }
})
</script>
