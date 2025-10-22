<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ isEditMode ? 'Edit Element' : 'Add New Element' }}
        </h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <!-- Element Information Section -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Element Information</h4>
          
          <!-- Element Type -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Element Type *
              </label>
              <button
                @click="showAddElementTypeModal = true"
                type="button"
                class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Create New Type</span>
              </button>
            </div>
            <select
              v-model="elementForm.elementType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': errors.elementType }"
            >
              <option value="">Select Element Type</option>
              <option v-for="type in availableElementTypes" :key="type.id" :value="type.name">
                {{ type.displayName }}
              </option>
            </select>
            <p v-if="errors.elementType" class="mt-1 text-sm text-red-600">{{ errors.elementType }}</p>
          </div>

          <!-- Element Dimensions -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dimensions <span class="text-xs text-gray-500 dark:text-gray-400">(All measurements in millimeters - mm)</span>
            </label>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Length (mm)</label>
                <input
                  v-model="elementForm.dimensions.length"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="e.g., 4000"
                  class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width (mm)</label>
                <input
                  v-model="elementForm.dimensions.width"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="e.g., 3000"
                  class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height (mm)</label>
                <input
                  v-model="elementForm.dimensions.height"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="e.g., 1000"
                  class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter dimensions in millimeters only (e.g., 4000mm = 4m, 1500mm = 1.5m)
            </p>
          </div>

          <!-- Element Category -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Element Category *
            </label>
            <select
              v-model="elementForm.category"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': errors.category }"
            >
              <option value="">Select Category</option>
              <option value="production">Production Materials (Built In-house)</option>
              <option value="hire">Items for Hire (We hire to customer)</option>
              <option value="outsourced">Outsourced (Items we don't have)</option>
            </select>
            <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
          </div>

          <!-- Element Description -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              v-model="elementForm.description"
              rows="2"
              placeholder="Brief description of this element and what it includes"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
        </div>

        <!-- Materials Section -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-md font-medium text-gray-700 dark:text-gray-300">Materials List</h4>
            <button
              @click="addMaterial"
              class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Add Material</span>
            </button>
          </div>

          <!-- Materials Table -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Particulars *</th>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit *</th>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Quantity *</th>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Default Include</th>
                    <th class="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(material, index) in elementForm.materials" :key="material.tempId" class="border-t border-gray-200 dark:border-gray-700">
                    <!-- Particulars -->
                    <td class="py-3 px-4">
                      <input
                        v-model="material.description"
                        type="text"
                        placeholder="e.g., Wooden Boards, Steel Screws"
                        class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        :class="{ 'border-red-500': errors[`materials.${index}.description`] }"
                      />
                      <p v-if="errors[`materials.${index}.description`]" class="mt-1 text-xs text-red-600">
                        {{ errors[`materials.${index}.description`] }}
                      </p>
                    </td>

                    <!-- Unit of Measurement -->
                    <td class="py-3 px-4">
                      <select
                        v-model="material.unitOfMeasurement"
                        class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        :class="{ 'border-red-500': errors[`materials.${index}.unit`] }"
                      >
                        <option value="">Select Unit</option>
                        <option value="Pcs">Pieces (Pcs)</option>
                        <option value="Ltrs">Liters (Ltrs)</option>
                        <option value="Mtrs">Meters (Mtrs)</option>
                        <option value="sqm">Square Meters (sqm)</option>
                        <option value="Kgs">Kilograms (Kgs)</option>
                        <option value="Sets">Sets</option>
                        <option value="Rolls">Rolls</option>
                      </select>
                      <p v-if="errors[`materials.${index}.unit`]" class="mt-1 text-xs text-red-600">
                        {{ errors[`materials.${index}.unit`] }}
                      </p>
                    </td>

                    <!-- Quantity -->
                    <td class="py-3 px-4">
                      <input
                        v-model.number="material.defaultQuantity"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="0"
                        class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        :class="{ 'border-red-500': errors[`materials.${index}.quantity`] }"
                      />
                      <p v-if="errors[`materials.${index}.quantity`]" class="mt-1 text-xs text-red-600">
                        {{ errors[`materials.${index}.quantity`] }}
                      </p>
                    </td>

                    <!-- Default Include -->
                    <td class="py-3 px-4 text-center">
                      <input
                        v-model="material.isDefaultIncluded"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>

                    <!-- Actions -->
                    <td class="py-3 px-4 text-center">
                      <button
                        @click="removeMaterial(index)"
                        class="text-red-500 hover:text-red-700 transition-colors"
                        :disabled="elementForm.materials.length === 1"
                        :class="{ 'opacity-50 cursor-not-allowed': elementForm.materials.length === 1 }"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="elementForm.materials.length === 0">
                    <td colspan="5" class="py-8 text-center text-gray-500 dark:text-gray-400 italic">
                      No materials added yet. Click "Add Material" to get started.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="closeModal"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          @click="saveElement"
          :disabled="!isFormValid"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {{ isEditMode ? 'Update Element' : 'Add Element' }}
        </button>
      </div>
    </div>

    <!-- Add Element Type Modal -->
    <div v-if="showAddElementTypeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Element Type
          </h3>
          <button
            @click="closeAddElementTypeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type Name *
            </label>
            <input
              v-model="newElementType.name"
              type="text"
              placeholder="e.g., Custom Stage Setup"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': newElementTypeErrors.name }"
            />
            <p v-if="newElementTypeErrors.name" class="mt-1 text-sm text-red-600">{{ newElementTypeErrors.name }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              v-model="newElementType.category"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': newElementTypeErrors.category }"
            >
              <option value="">Select Category</option>
              <option value="structure">Structure</option>
              <option value="decoration">Decoration</option>
              <option value="flooring">Flooring</option>
              <option value="technical">Technical</option>
              <option value="furniture">Furniture</option>
              <option value="branding">Branding</option>
              <option value="custom">Custom</option>
            </select>
            <p v-if="newElementTypeErrors.category" class="mt-1 text-sm text-red-600">{{ newElementTypeErrors.category }}</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="closeAddElementTypeModal"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveNewElementType"
            :disabled="!isNewElementTypeValid"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Create Type
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

/**
 * Props interface for the MaterialsModal component
 */
interface Props {
  /** Whether the modal is open */
  isOpen: boolean
  /** Element data for editing (optional) */
  editElement?: ProjectElement | null
}

/**
 * Events emitted by the MaterialsModal component
 */
interface Emits {
  /** Emitted when modal should be closed */
  'close': []
  /** Emitted when a new element is added */
  'add-element': [element: ProjectElement]
  /** Emitted when an existing element is updated */
  'update-element': [element: ProjectElement]
}

/**
 * Material form structure for the modal
 */
interface MaterialForm {
  tempId: string
  description: string
  unitOfMeasurement: string
  defaultQuantity: number
  isDefaultIncluded: boolean
}

/**
 * Element form structure for the modal
 */
interface ElementForm {
  category: 'production' | 'hire' | 'outsourced' | ''
  elementType: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  description: string
  materials: MaterialForm[]
}

/**
 * Element type structure for standardized element types
 */
interface ElementType {
  id: string
  name: string
  displayName: string
  category: string
}

/**
 * Project element structure (matching the main component)
 */
interface ProjectElement {
  id: string
  templateId: string
  elementType: string
  name: string
  category: 'production' | 'hire' | 'outsourced'
  dimensions: {
    length: string
    width: string
    height: string
  }
  isIncluded: boolean
  materials: MaterialItem[]
  notes?: string
  addedAt: Date
}

/**
 * Material item structure (matching the main component)
 */
interface MaterialItem {
  id: string
  description: string
  unitOfMeasurement: string
  quantity: number
  isIncluded: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Component setup
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Available element types (reactive so we can add new ones)
const availableElementTypes = ref<ElementType[]>([
  { id: 'stage', name: 'stage', displayName: 'Stage', category: 'structure' },
  { id: 'backdrop', name: 'backdrop', displayName: 'Backdrop', category: 'decoration' },
  { id: 'skirting', name: 'skirting', displayName: 'Stage Skirting', category: 'decoration' },
  { id: 'entrance-arc', name: 'entrance-arc', displayName: 'Entrance Arc', category: 'decoration' },
  { id: 'dance-floor', name: 'dance-floor', displayName: 'Dance Floor', category: 'flooring' },
  { id: 'walkway', name: 'walkway', displayName: 'Walkway', category: 'flooring' },
  { id: 'lighting', name: 'lighting', displayName: 'Lighting Setup', category: 'technical' },
  { id: 'sound', name: 'sound', displayName: 'Sound System', category: 'technical' },
  { id: 'seating', name: 'seating', displayName: 'Seating Arrangement', category: 'furniture' },
  { id: 'tables', name: 'tables', displayName: 'Tables', category: 'furniture' },
  { id: 'decor', name: 'decor', displayName: 'Decorative Elements', category: 'decoration' },
  { id: 'signage', name: 'signage', displayName: 'Signage & Branding', category: 'branding' }
])

// Form state
const elementForm = reactive<ElementForm>({
  category: '',
  elementType: '',
  dimensions: {
    length: '',
    width: '',
    height: ''
  },
  description: '',
  materials: []
})

// Modal state for adding new element types
const showAddElementTypeModal = ref(false)

// New element type form
const newElementType = reactive({
  name: '',
  category: ''
})

// Validation errors
const errors = reactive<Record<string, string>>({})
const newElementTypeErrors = reactive<Record<string, string>>({})

// Computed properties
const isEditMode = computed(() => !!props.editElement)

const isFormValid = computed(() => {
  return elementForm.elementType.trim() !== '' && 
         elementForm.category !== '' &&
         elementForm.materials.length > 0 &&
         elementForm.materials.every(m => 
           m.description.trim() !== '' && 
           m.unitOfMeasurement !== '' && 
           m.defaultQuantity > 0
         )
})

const isNewElementTypeValid = computed(() => {
  return newElementType.name.trim() !== '' && newElementType.category !== ''
})

/**
 * Initialize form with default material
 */
const initializeForm = () => {
  elementForm.category = ''
  elementForm.elementType = ''
  elementForm.dimensions = { length: '', width: '', height: '' }
  elementForm.description = ''
  elementForm.materials = [createEmptyMaterial()]
  clearErrors()
}

/**
 * Create an empty material form object
 */
const createEmptyMaterial = (): MaterialForm => ({
  tempId: `temp-${Date.now()}-${Math.random()}`,
  description: '',
  unitOfMeasurement: '',
  defaultQuantity: 1,
  isDefaultIncluded: true
})

/**
 * Add a new material to the form
 */
const addMaterial = () => {
  elementForm.materials.push(createEmptyMaterial())
}

/**
 * Remove a material from the form
 */
const removeMaterial = (index: number) => {
  if (elementForm.materials.length > 1) {
    elementForm.materials.splice(index, 1)
  }
}

/**
 * Validate the form and return validation status
 */
const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  // Validate element category
  if (!elementForm.category) {
    errors.category = 'Element category is required'
    isValid = false
  }

  // Validate element type
  if (!elementForm.elementType) {
    errors.elementType = 'Element type is required'
    isValid = false
  }

  // Validate materials
  elementForm.materials.forEach((material, index) => {
    if (!material.description.trim()) {
      errors[`materials.${index}.description`] = 'Particulars is required'
      isValid = false
    }
    
    if (!material.unitOfMeasurement) {
      errors[`materials.${index}.unit`] = 'Unit is required'
      isValid = false
    }
    
    if (!material.defaultQuantity || material.defaultQuantity <= 0) {
      errors[`materials.${index}.quantity`] = 'Quantity must be greater than 0'
      isValid = false
    }
  })

  return isValid
}

/**
 * Clear all validation errors
 */
const clearErrors = () => {
  Object.keys(errors).forEach(key => delete errors[key])
}

/**
 * Save the element (add or update)
 */
const saveElement = () => {
  if (!validateForm()) {
    return
  }

  const now = new Date()
  
  if (isEditMode.value && props.editElement) {
    // Update existing element
    const selectedType = availableElementTypes.value.find(type => type.name === elementForm.elementType)
    const updatedElement: ProjectElement = {
      ...props.editElement,
      elementType: elementForm.elementType,
      name: selectedType?.displayName || elementForm.elementType,
      category: elementForm.category as 'production' | 'hire' | 'outsourced',
      dimensions: { ...elementForm.dimensions },
      materials: elementForm.materials.map(material => ({
        id: `${material.tempId}-${now.getTime()}`,
        description: material.description,
        unitOfMeasurement: material.unitOfMeasurement,
        quantity: material.defaultQuantity,
        isIncluded: material.isDefaultIncluded,
        createdAt: now,
        updatedAt: now
      }))
    }
    
    emit('update-element', updatedElement)
  } else {
    // Create new element
    const selectedType = availableElementTypes.value.find(type => type.name === elementForm.elementType)
    const newElement: ProjectElement = {
      id: `custom-${now.getTime()}`,
      templateId: `custom-${elementForm.elementType}`,
      elementType: elementForm.elementType,
      name: selectedType?.displayName || elementForm.elementType,
      category: elementForm.category as 'production' | 'hire' | 'outsourced',
      dimensions: { ...elementForm.dimensions },
      isIncluded: true,
      materials: elementForm.materials.map(material => ({
        id: `${material.tempId}-${now.getTime()}`,
        description: material.description,
        unitOfMeasurement: material.unitOfMeasurement,
        quantity: material.defaultQuantity,
        isIncluded: material.isDefaultIncluded,
        createdAt: now,
        updatedAt: now
      })),
      notes: elementForm.description,
      addedAt: now
    }
    
    emit('add-element', newElement)
  }
  
  closeModal()
}

/**
 * Close the modal and reset form
 */
const closeModal = () => {
  emit('close')
  initializeForm()
}

/**
 * Load element data for editing
 */
const loadElementForEdit = (element: ProjectElement) => {
  elementForm.category = element.category || 'production'
  elementForm.elementType = element.elementType || ''
  elementForm.dimensions = element.dimensions || { length: '', width: '', height: '' }
  elementForm.description = element.notes || ''
  elementForm.materials = element.materials.map(material => ({
    tempId: `edit-${material.id}`,
    description: material.description,
    unitOfMeasurement: material.unitOfMeasurement,
    defaultQuantity: material.quantity,
    isDefaultIncluded: material.isIncluded
  }))
}

/**
 * Close the add element type modal and reset form
 */
const closeAddElementTypeModal = () => {
  showAddElementTypeModal.value = false
  newElementType.name = ''
  newElementType.category = ''
  Object.keys(newElementTypeErrors).forEach(key => delete newElementTypeErrors[key])
}

/**
 * Validate new element type form
 */
const validateNewElementType = (): boolean => {
  Object.keys(newElementTypeErrors).forEach(key => delete newElementTypeErrors[key])
  let isValid = true

  if (!newElementType.name.trim()) {
    newElementTypeErrors.name = 'Type name is required'
    isValid = false
  }

  if (!newElementType.category) {
    newElementTypeErrors.category = 'Category is required'
    isValid = false
  }

  // Check if type already exists
  const existingType = availableElementTypes.value.find(type => 
    type.name.toLowerCase() === newElementType.name.toLowerCase().replace(/\s+/g, '-')
  )
  if (existingType) {
    newElementTypeErrors.name = 'This element type already exists'
    isValid = false
  }

  return isValid
}

/**
 * Save new element type
 */
const saveNewElementType = () => {
  if (!validateNewElementType()) {
    return
  }

  const newType: ElementType = {
    id: `custom-${Date.now()}`,
    name: newElementType.name.toLowerCase().replace(/\s+/g, '-'),
    displayName: newElementType.name,
    category: newElementType.category
  }

  // Add to available types
  availableElementTypes.value.push(newType)
  
  // Select the new type in the main form
  elementForm.elementType = newType.name
  
  closeAddElementTypeModal()
}

// Watch for edit element changes
watch(() => props.editElement, (newElement) => {
  if (newElement && props.isOpen) {
    loadElementForEdit(newElement)
  }
}, { immediate: true })

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && !props.editElement) {
    initializeForm()
  }
})

// Initialize form on component mount
initializeForm()
</script>