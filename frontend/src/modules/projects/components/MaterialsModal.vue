<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ isDesignMode ? 'Design Concept and Material Specification' : 'Materials & Design Assets Management' }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ isDesignMode ? 'Comprehensive material list management for design workflow' : 'Manage materials and upload design assets for' }} {{ enquiry?.title }}
            <span v-if="department" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 ml-2">
              {{ getDepartmentTitle() }} Department
            </span>
          </p>
          <div v-if="department" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {{ getDepartmentContext() }}
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
      <div class="p-4 overflow-y-auto max-h-[calc(95vh-180px)]">
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

        <!-- Material List Management -->
        <div class="space-y-4">
          <!-- Form Validation Summary -->
          <div v-if="hasValidationErrors" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div class="flex items-center space-x-2 mb-2">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <span class="text-sm font-medium text-red-800 dark:text-red-200">Please fix the following errors:</span>
            </div>
            <ul class="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li v-for="error in validationErrors" :key="error" class="flex items-start space-x-2">
                <span class="text-red-500">•</span>
                <span>{{ error }}</span>
              </li>
            </ul>
          </div>

          <!-- Input Mode Toggle -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <button
                @click="inputMode = 'simple'"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  inputMode === 'simple'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                ]"
              >
                Simple Input
              </button>
              <button
                @click="inputMode = 'detailed'"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  inputMode === 'detailed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                ]"
              >
                Detailed Form
              </button>
            </div>
          </div>

          <!-- Simple Input Mode -->
          <div v-if="inputMode === 'simple'" class="space-y-4">
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-3">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">Quick Material Input</h4>
              </div>
              <p class="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Enter materials one per line in this format: <code class="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded text-xs">Material Name - Quantity Unit - Price each</code>
              </p>
              <textarea
                v-model="materialsText"
                :class="[
                  'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors',
                  materialsText.trim() === '' ? 'border-gray-300 dark:border-gray-600' : 'border-gray-300 dark:border-gray-600'
                ]"
                rows="8"
                placeholder="Aluminum Frame 2x3m - 4 pcs - 15000
LED Panel 50 inch - 2 pcs - 25000
Carpet Tiles - 20 sqm - 5000
Steel Structure - 1 set - 75000"
                @input="parseMaterialsText"
              ></textarea>
              <div class="flex items-center justify-between mt-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ parsedMaterialsCount }} materials parsed
                </p>
                <button
                  @click="clearMaterialsText"
                  class="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear All
                </button>
              </div>
            </div>

            <!-- Parsed Materials Preview -->
            <div v-if="materialItems.length > 0" class="space-y-3">
              <h4 class="font-medium text-gray-900 dark:text-white">Parsed Materials</h4>
              <div v-for="(product, index) in materialItems" :key="product.id"
                    class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ product.elementName }}</span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="product.category === 'production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'">
                      {{ product.category }}
                    </span>
                  </div>
                  <button
                    @click="removeMaterialItem(index)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
                <!-- Show sub-items -->
                <div class="space-y-1 ml-4">
                  <div v-for="(subItem, subIndex) in product.subItems" :key="subItem.id"
                       class="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                    <span>• {{ subItem.name }}</span>
                    <span>Qty: {{ subItem.quantity }}</span>
                    <span>Unit: {{ subItem.unit }}</span>
                    <span>KES {{ subItem.unitPrice.toLocaleString() }}</span>
                  </div>
                </div>
                <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Total: KES {{ getProductTotalCost(product).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Material Summary -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div>
                <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ materialItems.length }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Elements</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-green-600 dark:text-green-400">{{ materialItems.reduce((total, product) => total + product.subItems.length, 0) }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Components</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-purple-600 dark:text-purple-400">{{ productionItemsCount }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Production</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">KES {{ totalMaterialCost.toLocaleString() }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Total Cost</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div class="flex items-center space-x-4">
          <button
            @click="saveDraft"
            :disabled="isSaving"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            <span>Save Draft</span>
          </button>
          <button
            @click="saveMaterials"
            :disabled="isSaving || hasValidationErrors"
            class="inline-flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ isSaving ? 'Saving...' : 'Save Materials' }}</span>
          </button>
          <button
            @click="generateQuotation"
            :disabled="materialItems.length === 0"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Generate Quotation</span>
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

interface Props {
  isVisible: boolean
  enquiry?: any
  department?: string
  isDesignMode?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  materialsUpdated: [data: any]
}>()

// Reactive data
const inputMode = ref('simple')
const materialsText = ref('')
const materialItems = ref<any[]>([])
const error = ref('')
const successMessage = ref('')
const isSaving = ref(false)
const uploadedFiles = ref<any[]>([])
const designNotes = ref('')

// Computed properties
const parsedMaterialsCount = computed(() => materialItems.value.length)

const totalMaterialCost = computed(() => {
  return materialItems.value.reduce((total, product) => {
    return total + getProductTotalCost(product)
  }, 0)
})

const productionItemsCount = computed(() => {
  return materialItems.value.filter(item => item.category === 'production').length
})

const hasValidationErrors = computed(() => {
  return validationErrors.value.length > 0
})

const validationErrors = computed(() => {
  const errors: string[] = []
  // Add validation logic here
  return errors
})

// Methods
const closeModal = () => {
  emit('close')
}

const getDepartmentTitle = () => {
  const titles: Record<string, string> = {
    creatives: 'Creatives',
    design: 'Design',
    procurement: 'Procurement',
    projects: 'Projects'
  }
  return titles[props.department || ''] || 'Department'
}

const getDepartmentContext = () => {
  const contexts: Record<string, string> = {
    creatives: 'Focus on creative material specifications and design concepts',
    design: 'Technical design specifications and material requirements',
    procurement: 'Procurement planning and supplier coordination',
    projects: 'Project management and material tracking'
  }
  return contexts[props.department || ''] || ''
}

const parseMaterialsText = () => {
  const lines = materialsText.value.split('\n').filter(line => line.trim())
  const parsed: any[] = []

  lines.forEach((line, index) => {
    const parts = line.split(' - ').map(p => p.trim())
    if (parts.length >= 3) {
      const [name, qtyUnit, price] = parts
      const qtyParts = qtyUnit.split(' ')
      const quantity = parseInt(qtyParts[0]) || 1
      const unit = qtyParts[1] || 'pcs'
      const unitPrice = parseFloat(price.replace(/[^\d.]/g, '')) || 0

      parsed.push({
        id: `parsed_${index}`,
        elementName: name,
        category: 'production',
        subItems: [{
          id: `sub_${index}`,
          name: name,
          quantity: quantity,
          unit: unit,
          unitPrice: unitPrice,
          category: 'production',
          comment: ''
        }]
      })
    }
  })

  materialItems.value = parsed
}

const clearMaterialsText = () => {
  materialsText.value = ''
  materialItems.value = []
}

const removeMaterialItem = (index: number) => {
  materialItems.value.splice(index, 1)
}

const getProductTotalCost = (product: any) => {
  return product.subItems.reduce((total: number, subItem: any) => {
    return total + (subItem.quantity * subItem.unitPrice)
  }, 0)
}

const saveDraft = () => {
  // Save draft logic
  successMessage.value = 'Draft saved successfully'
  setTimeout(() => successMessage.value = '', 3000)
}

const saveMaterials = () => {
  if (hasValidationErrors.value) return

  isSaving.value = true
  // Save materials logic
  setTimeout(() => {
    isSaving.value = false
    successMessage.value = 'Materials saved successfully'
    emit('materialsUpdated', {
      materialItems: materialItems.value,
      totalMaterialCost: totalMaterialCost.value
    })
    setTimeout(() => successMessage.value = '', 3000)
  }, 1000)
}

const generateQuotation = () => {
  // Generate quotation logic
  successMessage.value = 'Quotation generated successfully'
  setTimeout(() => successMessage.value = '', 3000)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    Array.from(files).forEach(file => {
      uploadedFiles.value.push({
        name: file.name,
        size: file.size
      })
    })
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

// Watch for modal visibility changes
watch(() => props.isVisible, (visible) => {
  if (visible) {
    // Reset state when modal opens
    error.value = ''
    successMessage.value = ''
  }
})
</script>
