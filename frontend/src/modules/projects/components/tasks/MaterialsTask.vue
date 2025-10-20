<template>
  <div class="materials-task-content">
    <!-- Project Header Section -->
    <div class="mb-6">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Materials Task - {{ task.title }}
      </h4>

      <!-- Project Information Display -->
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Project Information</h5>
        <!-- Project Information Grid - 3 per row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Project Title</label>
            <p class="text-sm text-gray-900 dark:text-white font-semibold">{{ materialsData.projectInfo.enquiryTitle }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Enquiry Number</label>
            <p class="text-sm text-gray-900 dark:text-white font-medium">{{ materialsData.projectInfo.projectId }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Client Name</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ materialsData.projectInfo.clientName }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Event Venue</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ materialsData.projectInfo.eventVenue }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Expected Delivery Date</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(materialsData.projectInfo.setupDate) }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Set Down Date</label>
            <p class="text-sm text-gray-900 dark:text-white text-gray-500 italic">{{ materialsData.projectInfo.setDownDate }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Elements Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h5 class="text-md font-medium text-gray-700 dark:text-gray-300">Project Elements</h5>
        <button
          @click="openAddElementModal"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Add Element</span>
        </button>
      </div>

      <!-- Elements Display -->
      <div class="space-y-4">
        <div v-for="element in materialsData.projectElements" :key="element.id" class="border border-gray-200 dark:border-gray-700 rounded-lg">
          <!-- Element Header -->
          <div :class="getElementHeaderClass(element.templateId)" class="px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <input
                type="checkbox"
                v-model="element.isIncluded"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <h6 class="text-sm font-semibold">{{ element.name }}</h6>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-xs opacity-75">{{ getIncludedMaterialsCount(element) }} materials</span>
              <button
                @click="openEditElementModal(element)"
                class="text-xs opacity-75 hover:opacity-100 transition-opacity flex items-center space-x-1"
                title="Edit Element"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>Edit</span>
              </button>
            </div>
          </div>

          <!-- Materials Table (only show if element is included) -->
          <div v-if="element.isIncluded" class="p-4">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300 w-8">Include</th>
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300">Description</th>
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300">Unit</th>
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="material in element.materials" :key="material.id" class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2">
                      <input
                        type="checkbox"
                        v-model="material.isIncluded"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td class="py-2" :class="material.isIncluded ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 line-through'">
                      {{ material.description }}
                    </td>
                    <td class="py-2" :class="material.isIncluded ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'">
                      {{ material.unitOfMeasurement }}
                    </td>
                    <td class="py-2" :class="material.isIncluded ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'">
                      <input
                        v-if="material.isIncluded"
                        type="number"
                        v-model.number="material.quantity"
                        step="0.1"
                        min="0"
                        class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span v-else>{{ material.quantity }}</span>
                    </td>
                  </tr>
                  <tr v-if="element.materials.length === 0">
                    <td colspan="4" class="py-4 text-center text-gray-500 dark:text-gray-400 italic">
                      No materials defined for this element
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Collapsed state message -->
          <div v-else class="p-4 text-center text-gray-500 dark:text-gray-400 italic">
            Element not included in project
          </div>
        </div>
      </div>
    </div>

    <!-- Materials Actions -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <button
          @click="saveMaterialsList"
          :disabled="isSaving"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
          <span>{{ isSaving ? 'Saving...' : 'Save Materials List' }}</span>
        </button>

        <button
          @click="viewMaterialsList"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>View & Print List</span>
        </button>
      </div>

      <div v-if="lastSaved" class="text-xs text-gray-500 dark:text-gray-400">
        Last saved: {{ formatDateTime(lastSaved) }}
      </div>
    </div>

    <!-- Task Status and Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
        <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full font-medium">
          {{ getStatusLabel(task.status) }}
        </span>
      </div>

      <div class="flex space-x-3">
        <button
          v-if="task.status !== 'completed' && task.status !== 'cancelled'"
          @click="$emit('update-status', 'completed')"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Mark Complete</span>
        </button>

        <div v-if="task.status === 'completed'" class="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium">Task Completed</span>
        </div>
      </div>
    </div>

    <!-- Materials List View Modal -->
    <div v-if="isViewModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 print:hidden">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Materials List - {{ materialsData.projectInfo.enquiryTitle }}
          </h3>
          <div class="flex items-center space-x-3">
            <button
              @click="printMaterialsList"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              <span>Print</span>
            </button>
            <button
              @click="closeViewModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Printable Content -->
        <div id="printable-materials-list" class="p-6 overflow-y-auto max-h-[calc(95vh-140px)] print:overflow-visible print:max-h-none">
          <!-- Project Header for Print -->
          <div class="mb-8 print:mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 print:text-black">
              Materials List
            </h1>

            <!-- Project Information -->
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg print:bg-white print:border print:border-gray-300">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Project Title</label>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white print:text-black">{{ materialsData.projectInfo.enquiryTitle }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Enquiry Number</label>
                  <p class="text-sm font-medium text-gray-900 dark:text-white print:text-black">{{ materialsData.projectInfo.projectId }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Client Name</label>
                  <p class="text-sm text-gray-900 dark:text-white print:text-black">{{ materialsData.projectInfo.clientName }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Event Venue</label>
                  <p class="text-sm text-gray-900 dark:text-white print:text-black">{{ materialsData.projectInfo.eventVenue }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Expected Delivery Date</label>
                  <p class="text-sm text-gray-900 dark:text-white print:text-black">{{ formatDate(materialsData.projectInfo.setupDate) }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Generated On</label>
                  <p class="text-sm text-gray-900 dark:text-white print:text-black">{{ formatDateTime(new Date()) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Materials by Element -->
          <div class="space-y-6 print:space-y-4">
            <div v-for="element in getIncludedElements()" :key="element.id" class="print:break-inside-avoid">
              <!-- Element Header -->
              <div class="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-t-lg print:bg-gray-100 print:border print:border-gray-300">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white print:text-black">
                  {{ element.name }}
                </h3>
              </div>

              <!-- Materials Table -->
              <div class="border border-gray-200 dark:border-gray-600 rounded-b-lg overflow-hidden print:border-gray-300">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 dark:bg-gray-600 print:bg-gray-50">
                    <tr>
                      <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 print:text-black border-b print:border-gray-300">Description</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 print:text-black border-b print:border-gray-300">Unit</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 print:text-black border-b print:border-gray-300">Quantity</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 print:text-black border-b print:border-gray-300">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="material in getIncludedMaterials(element)" :key="material.id" class="border-b border-gray-100 dark:border-gray-700 print:border-gray-200">
                      <td class="py-3 px-4 text-gray-900 dark:text-white print:text-black">{{ material.description }}</td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400 print:text-black">{{ material.unitOfMeasurement }}</td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400 print:text-black font-medium">{{ material.quantity }}</td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400 print:text-black">{{ material.notes || '-' }}</td>
                    </tr>
                    <tr v-if="getIncludedMaterials(element).length === 0">
                      <td colspan="4" class="py-4 text-center text-gray-500 dark:text-gray-400 print:text-gray-600 italic">
                        No materials included for this element
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="getIncludedElements().length === 0" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400 print:text-gray-600 italic">
                No elements are currently included in this project
              </p>
            </div>
          </div>

          <!-- Summary Section -->
          <div v-if="getIncludedElements().length > 0" class="mt-8 print:mt-6 print:break-inside-avoid">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg print:bg-white print:border print:border-gray-300">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white print:text-black mb-3">Summary</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Total Elements</label>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white print:text-black">{{ getIncludedElements().length }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Total Materials</label>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white print:text-black">{{ getTotalMaterialsCount() }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Prepared By</label>
                  <p class="text-sm text-gray-900 dark:text-white print:text-black">_________________</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Materials Modal -->
    <MaterialsModal
      :is-open="isModalOpen"
      :edit-element="editingElement"
      @close="closeModal"
      @add-element="addElement"
      @update-element="updateElement"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import MaterialsModal from '../MaterialsModal.vue'

/**
 * Props interface for the MaterialsTask component
 */
interface Props {
  /** The enquiry task object containing task details and metadata */
  task: EnquiryTask
}

/**
 * Events emitted by the MaterialsTask component
 */
interface Emits {
  /** Emitted when task status needs to be updated */
  'update-status': [status: EnquiryTask['status']]
  /** Emitted when materials data is saved */
  'save-materials': [data: MaterialsTaskData]
}

/**
 * Core data structure for materials task management
 * Contains project information, elements list, and available element templates
 */
interface MaterialsTaskData {
  /** Project header information */
  projectInfo: ProjectInfo
  /** List of project elements (Stage, Backdrop, etc.) */
  projectElements: ProjectElement[]
  /** Available element templates that can be added to projects */
  availableElements: ElementTemplate[]
}

/**
 * Project information structure for the materials task
 * Contains essential project details displayed in the header section
 */
interface ProjectInfo {
  /** Unique project identifier */
  projectId: string
  /** Title/name of the enquiry/project */
  enquiryTitle: string
  /** Name of the client for this project */
  clientName: string
  /** Venue where the event will take place */
  eventVenue: string
  /** Date when project setup begins (ISO date string) */
  setupDate: string
  /** Date when project set down occurs (ISO date string or "tbc") */
  setDownDate: string
}

/**
 * Project element structure - represents a main element in the project
 * Each element contains multiple materials/components
 */
interface ProjectElement {
  /** Unique identifier for this project element instance */
  id: string
  /** Reference to the element template this is based on */
  templateId: string
  /** Display name for this element in the project */
  name: string
  /** Whether this element is included in the current project */
  isIncluded: boolean
  /** List of materials/components for this element */
  materials: MaterialItem[]
  /** Custom notes for this element in this project */
  notes?: string
  /** Timestamp when added to project */
  addedAt: Date
}

/**
 * Element template structure - defines available elements that can be added to projects
 * Templates serve as blueprints for project elements
 */
interface ElementTemplate {
  /** Unique identifier for the template */
  id: string
  /** Template name (e.g., "Stage", "Backdrop") */
  name: string
  /** Display name shown in UI */
  displayName: string
  /** Description of what this element includes */
  description: string
  /** Default materials/components for this element */
  defaultMaterials: MaterialTemplate[]
  /** Category for grouping templates */
  category: string
  /** Color theme for styling */
  color: string
  /** Sort order for display */
  order: number
}

/**
 * Individual material item structure
 * Represents a specific material/component within an element
 */
interface MaterialItem {
  /** Unique identifier for the material item */
  id: string
  /** Descriptive name or description of the material */
  description: string
  /** Unit of measurement (e.g., "Pcs", "Ltrs", "Mtrs", "sqm") */
  unitOfMeasurement: string
  /** Quantity required (supports decimal values) */
  quantity: number
  /** Whether this material is included in the current project */
  isIncluded: boolean
  /** Optional additional notes about the material */
  notes?: string
  /** Timestamp when the material was created */
  createdAt: Date
  /** Timestamp when the material was last updated */
  updatedAt: Date
}

/**
 * Material template structure - defines default materials for element templates
 */
interface MaterialTemplate {
  /** Unique identifier for the material template */
  id: string
  /** Default description for this material */
  description: string
  /** Default unit of measurement */
  unitOfMeasurement: string
  /** Default quantity (can be customized per project) */
  defaultQuantity: number
  /** Whether this material is typically included by default */
  isDefaultIncluded: boolean
  /** Sort order within the element */
  order: number
}

/**
 * Default element templates available for projects
 * These templates define the main elements that can be included in projects
 */
const DEFAULT_ELEMENT_TEMPLATES: ElementTemplate[] = [
  {
    id: 'stage',
    name: 'stage',
    displayName: 'STAGE',
    description: 'Main stage structure and components',
    category: 'structure',
    color: 'green',
    order: 1,
    defaultMaterials: [
      { id: 'stage-boards', description: 'Stage Boards', unitOfMeasurement: 'Pcs', defaultQuantity: 8, isDefaultIncluded: true, order: 1 },
      { id: 'stage-legs', description: 'Stage Legs', unitOfMeasurement: 'Pcs', defaultQuantity: 16, isDefaultIncluded: true, order: 2 },
      { id: 'stage-screws', description: 'Stage Screws', unitOfMeasurement: 'Pcs', defaultQuantity: 32, isDefaultIncluded: true, order: 3 },
      { id: 'stage-brackets', description: 'Stage Brackets', unitOfMeasurement: 'Pcs', defaultQuantity: 8, isDefaultIncluded: true, order: 4 }
    ]
  },
  {
    id: 'stage-skirting',
    name: 'stage-skirting',
    displayName: 'STAGE SKIRTING',
    description: 'Stage skirting and decorative elements',
    category: 'decoration',
    color: 'blue',
    order: 2,
    defaultMaterials: [
      { id: 'skirting-fabric', description: 'Skirting Fabric', unitOfMeasurement: 'Mtrs', defaultQuantity: 12, isDefaultIncluded: true, order: 1 },
      { id: 'skirting-clips', description: 'Skirting Clips', unitOfMeasurement: 'Pcs', defaultQuantity: 24, isDefaultIncluded: true, order: 2 },
      { id: 'velcro-strips', description: 'Velcro Strips', unitOfMeasurement: 'Mtrs', defaultQuantity: 6, isDefaultIncluded: false, order: 3 }
    ]
  },
  {
    id: 'stage-backdrop',
    name: 'stage-backdrop',
    displayName: 'STAGE BACKDROP',
    description: 'Backdrop structure and materials',
    category: 'decoration',
    color: 'purple',
    order: 3,
    defaultMaterials: [
      { id: 'backdrop-frame', description: 'Backdrop Frame', unitOfMeasurement: 'Pcs', defaultQuantity: 1, isDefaultIncluded: true, order: 1 },
      { id: 'backdrop-fabric', description: 'Backdrop Fabric', unitOfMeasurement: 'sqm', defaultQuantity: 20, isDefaultIncluded: true, order: 2 },
      { id: 'backdrop-weights', description: 'Backdrop Weights', unitOfMeasurement: 'Pcs', defaultQuantity: 4, isDefaultIncluded: true, order: 3 }
    ]
  },
  {
    id: 'entrance-arc',
    name: 'entrance-arc',
    displayName: 'ENTRANCE ARC',
    description: 'Entrance archway and decorations',
    category: 'decoration',
    color: 'orange',
    order: 4,
    defaultMaterials: [
      { id: 'arc-frame', description: 'Arc Frame', unitOfMeasurement: 'Pcs', defaultQuantity: 1, isDefaultIncluded: true, order: 1 },
      { id: 'arc-flowers', description: 'Decorative Flowers', unitOfMeasurement: 'Pcs', defaultQuantity: 50, isDefaultIncluded: false, order: 2 },
      { id: 'arc-fabric', description: 'Arc Fabric Draping', unitOfMeasurement: 'Mtrs', defaultQuantity: 8, isDefaultIncluded: true, order: 3 }
    ]
  },
  {
    id: 'walkway-dance-floor',
    name: 'walkway-dance-floor',
    displayName: 'WALKWAY AND DANCE FLOOR',
    description: 'Walkway and dance floor components',
    category: 'flooring',
    color: 'teal',
    order: 5,
    defaultMaterials: [
      { id: 'dance-floor-panels', description: 'Dance Floor Panels', unitOfMeasurement: 'sqm', defaultQuantity: 36, isDefaultIncluded: true, order: 1 },
      { id: 'walkway-carpet', description: 'Walkway Carpet', unitOfMeasurement: 'Mtrs', defaultQuantity: 15, isDefaultIncluded: true, order: 2 },
      { id: 'floor-tape', description: 'Floor Marking Tape', unitOfMeasurement: 'Mtrs', defaultQuantity: 20, isDefaultIncluded: false, order: 3 }
    ]
  }
]

/**
 * Common units of measurement available for materials
 * Provides standardized options with descriptive labels
 */
const COMMON_UNITS = [
  { value: 'Pcs', label: 'Pieces (Pcs)' },
  { value: 'Ltrs', label: 'Liters (Ltrs)' },
  { value: 'Mtrs', label: 'Meters (Mtrs)' },
  { value: 'sqm', label: 'Square Meters (sqm)' },
  { value: 'custom', label: 'Custom Unit' }
]

// Component setup
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * Initialize project information from the task/enquiry data
 * Auto-populates project details from the existing enquiry information
 */
const initializeProjectInfo = (): ProjectInfo => {
  const enquiry = props.task.enquiry

  return {
    projectId: enquiry?.enquiry_number || `ENQ-${props.task.enquiry_id}`,
    enquiryTitle: enquiry?.title || 'Untitled Project',
    clientName: enquiry?.client?.full_name || enquiry?.client?.FullName || enquiry?.contact_person || 'Unknown Client',
    eventVenue: enquiry?.venue || 'Venue TBC',
    setupDate: enquiry?.expected_delivery_date || 'Date TBC',
    setDownDate: 'TBC'
  }
}

/**
 * Initialize project elements from available templates
 * Creates project elements based on templates with default materials
 */
const initializeProjectElements = (): ProjectElement[] => {
  return DEFAULT_ELEMENT_TEMPLATES.map(template => ({
    id: `${template.id}-${Date.now()}`,
    templateId: template.id,
    name: template.displayName,
    isIncluded: true, // Default to included, can be toggled
    materials: template.defaultMaterials.map(materialTemplate => ({
      id: `${materialTemplate.id}-${Date.now()}`,
      description: materialTemplate.description,
      unitOfMeasurement: materialTemplate.unitOfMeasurement,
      quantity: materialTemplate.defaultQuantity,
      isIncluded: materialTemplate.isDefaultIncluded,
      createdAt: new Date(),
      updatedAt: new Date()
    })),
    addedAt: new Date()
  }))
}

/**
 * Reactive materials data structure
 * Initialized with auto-populated project info and default elements
 */
const materialsData = reactive<MaterialsTaskData>({
  projectInfo: initializeProjectInfo(),
  projectElements: initializeProjectElements(),
  availableElements: [...DEFAULT_ELEMENT_TEMPLATES]
})

/**
 * Watch for changes in the task prop and update project info accordingly
 * This ensures the component stays in sync if the task data is updated externally
 */
watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      Object.assign(materialsData.projectInfo, initializeProjectInfo())
    }
  },
  { deep: true }
)

// Modal state management
const isModalOpen = ref(false)
const editingElement = ref<ProjectElement | null>(null)

// View modal state
const isViewModalOpen = ref(false)

// Save state
const isSaving = ref(false)
const lastSaved = ref<Date | null>(null)

/**
 * Open the modal for adding a new element
 */
const openAddElementModal = () => {
  editingElement.value = null
  isModalOpen.value = true
}

/**
 * Open the modal for editing an existing element
 */
const openEditElementModal = (element: ProjectElement) => {
  editingElement.value = element
  isModalOpen.value = true
}

/**
 * Close the modal
 */
const closeModal = () => {
  isModalOpen.value = false
  editingElement.value = null
}

/**
 * Add a new element to the project
 */
const addElement = (element: ProjectElement) => {
  materialsData.projectElements.push(element)
  emit('save-materials', materialsData)
}

/**
 * Update an existing element in the project
 */
const updateElement = (updatedElement: ProjectElement) => {
  const index = materialsData.projectElements.findIndex(el => el.id === updatedElement.id)
  if (index !== -1) {
    materialsData.projectElements[index] = updatedElement
    emit('save-materials', materialsData)
  }
}

/**
 * Save the materials list
 */
const saveMaterialsList = async () => {
  isSaving.value = true
  try {
    // Simulate API call - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('save-materials', materialsData)
    lastSaved.value = new Date()

    // You could add a toast notification here
    console.log('Materials list saved successfully')
  } catch (error) {
    console.error('Failed to save materials list:', error)
    // You could add error handling/toast notification here
  } finally {
    isSaving.value = false
  }
}

/**
 * Open the materials list view modal
 */
const viewMaterialsList = () => {
  isViewModalOpen.value = true
}

/**
 * Close the view modal
 */
const closeViewModal = () => {
  isViewModalOpen.value = false
}

/**
 * Print the materials list
 */
const printMaterialsList = () => {
  const printContent = document.getElementById('printable-materials-list')
  if (printContent) {
    const originalContent = document.body.innerHTML
    const printableContent = printContent.innerHTML

    document.body.innerHTML = `
      <div style="font-family: Arial, sans-serif;">
        ${printableContent}
      </div>
    `

    window.print()
    document.body.innerHTML = originalContent

    // Reload the page to restore Vue reactivity
    window.location.reload()
  }
}

/**
 * Get only included elements
 */
const getIncludedElements = (): ProjectElement[] => {
  return materialsData.projectElements.filter(element => element.isIncluded)
}

/**
 * Get only included materials for an element
 */
const getIncludedMaterials = (element: ProjectElement): MaterialItem[] => {
  return element.materials.filter(material => material.isIncluded)
}

/**
 * Get total count of included materials across all elements
 */
const getTotalMaterialsCount = (): number => {
  return getIncludedElements().reduce((total, element) => {
    return total + getIncludedMaterials(element).length
  }, 0)
}

/**
 * Format date and time for display
 */
const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Get the count of included materials for an element
 * @param element - The project element to count materials for
 * @returns Number of included materials
 */
const getIncludedMaterialsCount = (element: ProjectElement): number => {
  return element.materials.filter(material => material.isIncluded).length
}

/**
 * Get CSS classes for element header based on template
 * @param templateId - The template ID to get styling for
 * @returns CSS class string for element header styling
 */
const getElementHeaderClass = (templateId: string): string => {
  const template = DEFAULT_ELEMENT_TEMPLATES.find(t => t.id === templateId)
  const colorClasses: Record<string, string> = {
    'green': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    'blue': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    'purple': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    'orange': 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    'teal': 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200',
  }
  return colorClasses[template?.color || 'green'] || colorClasses.green
}

/**
 * Get CSS classes for task status display
 * @param status - The current task status
 * @returns CSS class string for status styling
 */
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

/**
 * Get human-readable label for task status
 * @param status - The current task status
 * @returns Human-readable status label
 */
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
  }
  return labels[status] || status
}

/**
 * Format date string for display
 * @param dateString - ISO date string or 'Date TBC'
 * @returns Formatted date or original string if not a valid date
 */
const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'Date TBC') {
    return 'Date TBC'
  }

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}
</script>

<style>
@media print {
  @page {
    margin: 1in;
    size: A4;
  }

  body {
    font-size: 12pt;
    line-height: 1.4;
  }

  .print\:hidden {
    display: none !important;
  }

  .print\:block {
    display: block !important;
  }

  .print\:break-inside-avoid {
    break-inside: avoid;
  }

  .print\:break-after-page {
    break-after: page;
  }

  table {
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #f5f5f5 !important;
    font-weight: bold;
  }
}
</style>
