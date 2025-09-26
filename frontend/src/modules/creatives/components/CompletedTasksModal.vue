<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Materials & Design Specifications - {{ project?.title || 'Project' }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            View all materials, element templates, and design assets
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>

        <!-- Main Content -->
        <div v-else-if="!loading" class="space-y-6">
          <!-- Element Templates Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Element Templates</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Predefined templates used in this project</p>
            </div>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div v-if="!templatesLoading && displayTemplates.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                No element templates or materials found
                <div v-if="elementTemplates.length === 0" class="mt-2 text-xs">
                  (No templates loaded from useElementTemplates)
                </div>
                <div v-else class="mt-2 text-xs">
                  (Templates exist but none match the current filters)
                </div>
                <!-- Debug information -->
                <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-left text-xs">
                  <div class="font-semibold mb-1">Debug Information:</div>
                  <div>Element Templates Count: {{ elementTemplates.length }}</div>
                  <div>Display Templates Count: {{ displayTemplates.length }}</div>
                  <div>Loading State: {{ templatesLoading ? 'Loading...' : 'Loaded' }}</div>
                  <div class="mt-2">
                    <button 
                      @click="forceReload" 
                      class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Force Reload Templates
                    </button>
                  </div>
                </div>
              </div>
              <div v-else-if="templatesLoading" class="p-4 text-center text-gray-500 dark:text-gray-400">
                Loading templates...
              </div>
              <div v-else-if="!project" class="p-4 text-center">
                <p class="text-gray-500 dark:text-gray-400">No project selected</p>
              </div>
              <div v-else v-for="(template, index) in displayTemplates" :key="index" class="p-4">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ template.name }}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ template.description }}</p>
                    <div v-if="template.tags && template.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
                      <span v-for="(tag, tagIndex) in template.tags" :key="tagIndex" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  <button class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <!-- Elements in this template -->
                <div class="mt-3 space-y-3">
                  <div v-for="(element, elementIndex) in template.elements" :key="elementIndex" class="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                    <h5 class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ element.elementName }}</h5>
                    <p v-if="element.description" class="text-xs text-gray-500 dark:text-gray-400">{{ element.description }}</p>
                    <!-- Sub-items -->
                    <div class="mt-2 space-y-1">
                      <div v-for="(subItem, subItemIndex) in element.subItems" :key="subItemIndex" class="text-xs text-gray-600 dark:text-gray-300">
                        • {{ subItem.quantity }}x {{ subItem.name }} ({{ subItem.unit }}) - KES {{ subItem.unitPrice?.toLocaleString() }}
                        <span v-if="subItem.comment" class="text-gray-400 text-xs ml-2">// {{ subItem.comment }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Uploaded Files Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Uploaded Files</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Design assets and documents for this project</p>
            </div>
            <div class="p-4">
              <div v-if="uploadedFiles.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
                No files have been uploaded yet
              </div>
              <div v-else class="space-y-3">
                <div v-for="(file, index) in uploadedFiles" :key="index" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ file.name || 'Untitled' }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ file.size ? formatFileSize(file.size) : 'Unknown size' }} • {{ file.type || 'Unknown type' }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(file.uploadedAt || new Date().toISOString()) }}
                    </span>
                    <button class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Materials Summary -->
          <div v-if="materialsSummary" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Materials Summary</h3>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p class="text-sm font-medium text-blue-800 dark:text-blue-200">Total Items</p>
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ materialsSummary.totalItems || 0 }}</p>
                </div>
                <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p class="text-sm font-medium text-green-800 dark:text-green-200">Total Cost</p>
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">KES {{ (materialsSummary.totalCost || 0).toLocaleString() }}</p>
                </div>
                <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p class="text-sm font-medium text-purple-800 dark:text-purple-200">Categories</p>
                  <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ materialsSummary.categories?.length || 0 }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { PropType } from 'vue'
import type { Enquiry } from '@/modules/clientService/types'
import { useElementTemplates } from '../composables/useElementTemplates'

// Types
interface UploadedFile {
  id?: string
  name: string
  size?: number
  type?: string
  url?: string
  uploadedAt?: string
  uploadedBy?: string
}

interface MaterialsSummary {
  totalItems: number
  totalCost: number
  categories: string[]
}

interface MaterialItem {
  id: string
  name: string
  description?: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  category: string
  createdAt?: string
  updatedAt?: string
}

interface MaterialGroup {
  id: string
  name: string
  description?: string
  materials: MaterialItem[]
  createdAt?: string
  updatedAt?: string
}

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  project: {
    type: Object as PropType<Enquiry | null>,
    default: null
  },
  materials: {
    type: Array as PropType<MaterialGroup[]>,
    default: () => ([])
  },
  uploadedFiles: {
    type: Array as PropType<UploadedFile[]>,
    default: () => ([])
  }
})

const emit = defineEmits(['close'])

// Element Templates
const { 
  templates: elementTemplates, 
  loading: templatesLoading, 
  fetchTemplates: fetchElementTemplates 
} = useElementTemplates()

// Data
const loading = ref(false)
const localUploadedFiles = ref<UploadedFile[]>([])
const materialsSummary = ref<MaterialsSummary>({
  totalItems: 0,
  totalCost: 0,
  categories: []
})

// Import the ElementTemplate type from the types file
import type { ElementTemplate } from '../types'

// Local type for the materials prop
interface MaterialGroup {
  id: string
  name: string
  description?: string
  materials: Array<{
    id: string
    name: string
    quantity: number
    unit: string
    unitPrice: number
    totalPrice: number
    category: string
    description?: string
    createdAt?: string
    updatedAt?: string
  }>
  createdAt?: string
  updatedAt?: string
}

// Use provided materials or element templates if not provided
const displayTemplates = computed<ElementTemplate[]>(() => {
  // If materials are provided via props, use them
  if (props.materials && props.materials.length > 0) {
    return props.materials.map((group, index) => ({
      id: `group-${index + 1}`,
      name: group.name,
      description: group.description || 'No description',
      category: 'production',
      elements: [
        {
          id: `element-${index + 1}`,
          elementName: group.name,
          description: group.description || 'Material group',
          category: 'production',
          subItems: group.materials.map((material, matIndex) => ({
            id: `mat-${index}-${matIndex}`,
            name: material.name,
            quantity: material.quantity || 1,
            unit: material.unit || 'pcs',
            unitPrice: material.unitPrice || 0,
            category: 'production',
            comment: material.description
          }))
        }
      ],
      tags: [],
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      usage_count: 0
    }));
  }
  // Otherwise use the element templates from useElementTemplates
  return elementTemplates.value;
});

// Use provided uploaded files or empty array
const uploadedFiles = computed(() => {
  return props.uploadedFiles && props.uploadedFiles.length > 0 
    ? props.uploadedFiles 
    : [];
});

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format date for display
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load modal data when project changes
const loadModalData = async () => {
  console.log('loadModalData called');
  loading.value = true;
  try {
    // Always fetch element templates to ensure we have the latest data
    console.log('Fetching element templates...');
    await fetchElementTemplates();
    
    console.log('Element templates after fetch:', {
      count: elementTemplates.value.length,
      templates: elementTemplates.value
    });
    
    // Calculate materials summary
    calculateMaterialsSummary();
    
    // Log the data for debugging
    console.log('Display templates after calculation:', {
      count: displayTemplates.value.length,
      templates: displayTemplates.value
    });
  } catch (error) {
    console.error('Error loading modal data:', error);
  } finally {
    loading.value = false;
    console.log('loadModalData completed');
  }
};

// Calculate materials summary
const calculateMaterialsSummary = () => {
  let totalItems = 0;
  let totalCost = 0;
  const categories = new Set<string>();

  // Use displayTemplates which includes both elementTemplates and materials
  const templates = displayTemplates.value;
  
  if (templates && templates.length > 0) {
    templates.forEach((template) => {
      template.elements.forEach((element) => {
        element.subItems.forEach((subItem) => {
          totalItems += subItem.quantity || 0;
          totalCost += (subItem.quantity || 0) * (subItem.unitPrice || 0);
          if (subItem.category) {
            categories.add(subItem.category);
          }
        });
      });
    });
  }

  materialsSummary.value = {
    totalItems,
    totalCost,
    categories: Array.from(categories)
  };
};

// Watch for project or materials changes
watch([() => props.project, () => props.materials, () => props.uploadedFiles], async () => {
  console.log('Project or materials changed:', {
    hasProject: !!props.project,
    materialsCount: props.materials?.length || 0,
    filesCount: props.uploadedFiles?.length || 0
  });
  
  if (props.project) {
    await loadModalData();
  }
}, { immediate: true, deep: true });

// Force reload templates
const forceReload = async () => {
  console.log('Force reloading templates...');
  await loadModalData();
};

// Watch for modal visibility changes
watch(() => props.isVisible, async (isVisible) => {
  console.log('Modal visibility changed:', isVisible);
  if (isVisible && props.project) {
    await loadModalData();
  }
});
</script>
