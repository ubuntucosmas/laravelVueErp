
<!-- frontend/src/modules/logistics/views/loading-sheets/LoadingSheetForm.vue -->
<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEdit ? 'Edit' : 'New' }} Loading Sheet - {{ formData.type === 'outbound' ? 'Outbound' : 'Return' }}
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ formData.type === 'outbound' ? 'Items being taken to the site' : 'Items being returned from the site' }}
          </p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="saveAsDraft"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Save as Draft
          </button>
          <button
            @click="markAsComplete"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Mark as Complete
          </button>
        </div>
      </div>
  
      <!-- Main Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.projectId"
              required
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              :disabled="isEdit"
            >
              <option value="" disabled>Select Project</option>
              <option
                v-for="project in projects"
                :key="project.id"
                :value="project.id"
              >
                {{ project.name }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vehicle <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.vehicleId"
              required
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              :disabled="isEdit"
            >
              <option value="" disabled>Select Vehicle</option>
              <option
                v-for="vehicle in availableVehicles"
                :key="vehicle.id"
                :value="vehicle.id"
              >
                {{ vehicle.name }} ({{ vehicle.registration }})
              </option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Driver <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.driverId"
              required
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              :disabled="isEdit"
            >
              <option value="" disabled>Select Driver</option>
              <option
                v-for="driver in availableDrivers"
                :key="driver.id"
                :value="driver.id"
              >
                {{ driver.name }} ({{ driver.license }})
              </option>
            </select>
          </div>
        </div>
  
        <!-- Date and Template -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.date"
              type="datetime-local"
              required
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
  
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Template (Optional)
            </label>
            <div class="flex space-x-2">
              <select
                v-model="selectedTemplate"
                class="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @change="applyTemplate"
              >
                <option value="" disabled>Select a template</option>
                <option
                  v-for="template in templates"
                  :key="template.id"
                  :value="template.id"
                >
                  {{ template.name }}
                </option>
              </select>
              <button
                type="button"
                @click="saveAsTemplate"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Save as Template
              </button>
            </div>
          </div>
        </div>
  
        <!-- Items Table -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Items</h3>
            <button
              type="button"
              @click="addItem"
              class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              + Add Item
            </button>
          </div>
  
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Item
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th v-if="formData.type === 'return'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Returned
                  </th>
                  <th v-if="formData.type === 'return'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Condition
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Notes
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in formData.items" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model="item.itemName"
                      type="text"
                      required
                      class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Item name"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      required
                      class="w-20 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td v-if="formData.type === 'return'" class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model.number="item.quantityReturned"
                      type="number"
                      min="0"
                      :max="getOutboundQuantity(item.itemName)"
                      required
                      class="w-20 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <div v-if="getOutboundQuantity(item.itemName) !== null" class="text-xs text-gray-500 dark:text-gray-400">
                      Out: {{ getOutboundQuantity(item.itemName) }}
                    </div>
                  </td>
                  <td v-if="formData.type === 'return'" class="px-6 py-4 whitespace-nowrap">
                    <select
                      v-model="item.condition"
                      class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="good">Good</option>
                      <option value="damaged">Damaged</option>
                      <option value="missing">Missing</option>
                    </select>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model="item.notes"
                      type="text"
                      class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Notes"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      @click="removeItem(index)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      :disabled="formData.items.length <= 1"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <!-- Summary -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Summary</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Items</h4>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formData.items.reduce((sum, item) => sum + item.quantity, 0) }}
              </p>
            </div>
            <div v-if="formData.type === 'return'">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Items Returned</h4>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ formData.items.filter(item => item.quantityReturned > 0).length }}
              </p>
            </div>
            <div v-if="formData.type === 'return'">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Items Missing/Damaged</h4>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">
                {{ formData.items.filter(item => item.condition !== 'good' || item.quantityReturned < item.quantity).length }}
              </p>
            </div>
          </div>
        </div>
  
        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Additional Notes
          </label>
          <textarea
            v-model="formData.notes"
            rows="3"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Any additional notes or special instructions..."
          ></textarea>
        </div>
  
        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="cancel"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveAsDraft"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
          >
            Save as Draft
          </button>
          <button
            type="button"
            @click="markAsComplete"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Mark as Complete
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { mockLoadingSheets } from '../../mock/loadingSheetMockData'
  import type { LoadingSheet, LoadingSheetFormData } from '../../types/loadingSheet'
  
  const route = useRoute()
  const router = useRouter()
  
  // Props
  const props = defineProps<{
    type: 'outbound' | 'return'
    id?: string
  }>()
  
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isEdit = computed(() => !!props.id)
  const selectedTemplate = ref('')
  
  // Mock data - in a real app, these would come from an API
  const projects = ref([
    { id: 1, name: 'Westlands Office Park' },
    { id: 2, name: 'Gigiri Apartments' },
    { id: 3, name: 'Karen Mall' }
  ])
  
  const availableVehicles = ref([
    { id: 1, name: 'Toyota Hilux', registration: 'KAA 123A', status: 'available' },
    { id: 2, name: 'Isuzu D-Max', registration: 'KBB 456B', status: 'available' },
    { id: 3, name: 'Mitsubishi L200', registration: 'KCC 789C', status: 'in_use' }
  ])
  
  const availableDrivers = ref([
    { id: 1, name: 'John Doe', license: 'BC12345', status: 'available' },
    { id: 2, name: 'Jane Smith', license: 'BC67890', status: 'available' },
    { id: 3, name: 'Mike Johnson', license: 'BC54321', status: 'on_leave' }
  ])
  
  const templates = ref([
    { id: 1, name: 'Standard Office Equipment' },
    { id: 2, name: 'Construction Tools' }
  ])
  
  // Form data
  const formData = ref<LoadingSheetFormData>({
    projectId: null,
    vehicleId: null,
    driverId: null,
    type: props.type,
    date: new Date().toISOString().slice(0, 16),
    notes: '',
    items: [
      {
        itemId: null,
        itemName: '',
        quantity: 1,
        quantityReturned: 0,
        condition: 'good',
        notes: ''
      }
    ]
  })
  
  // Computed
  const outboundSheets = computed(() => {
    return mockLoadingSheets.filter(sheet => 
      sheet.type === 'outbound' && 
      sheet.projectId === formData.value.projectId
    )
  })
  
  // Methods
  const getOutboundQuantity = (itemName: string) => {
    // In a real app, this would find the corresponding outbound item
    // For now, we'll just return a random number for demonstration
    return Math.floor(Math.random() * 10) + 1
  }
  
  const addItem = () => {
    formData.value.items.push({
      itemId: null,
      itemName: '',
      quantity: 1,
      quantityReturned: 0,
      condition: 'good',
      notes: ''
    })
  }
  
  const removeItem = (index: number) => {
    if (formData.value.items.length > 1) {
      formData.value.items.splice(index, 1)
    }
  }
  
  const applyTemplate = (templateId: string) => {
    // In a real app, this would load the template items from the API
    // For now, we'll just add some sample items
    if (templateId === '1') {
      formData.value.items = [
        { itemId: 1, itemName: 'Office Chairs', quantity: 10, quantityReturned: 0, condition: 'good', notes: '' },
        { itemId: 2, itemName: 'Desks', quantity: 5, quantityReturned: 0, condition: 'good', notes: '' },
        { itemId: 3, itemName: 'Computers', quantity: 8, quantityReturned: 0, condition: 'good', notes: '' }
      ]
    } else if (templateId === '2') {
      formData.value.items = [
        { itemId: 4, itemName: 'Hammer', quantity: 5, quantityReturned: 0, condition: 'good', notes: '' },
        { itemId: 5, itemName: 'Drill', quantity: 3, quantityReturned: 0, condition: 'good', notes: '' },
        { itemId: 6, itemName: 'Saw', quantity: 2, quantityReturned: 0, condition: 'good', notes: '' }
      ]
    }
  }
  
  const saveAsTemplate = () => {
    const templateName = prompt('Enter a name for this template:')
    if (templateName) {
      // In a real app, this would save the template to the API
      templates.value.push({
        id: templates.value.length + 1,
        name: templateName
      })
      alert('Template saved successfully!')
    }
  }
  
  const saveAsDraft = async () => {
    await saveLoadingSheet('draft')
  }
  
  const markAsComplete = async () => {
    if (confirm('Are you sure you want to mark this loading sheet as complete?')) {
      await saveLoadingSheet('completed')
    }
  }
  
  const saveLoadingSheet = async (status: 'draft' | 'completed') => {
    try {
      loading.value = true
      
      // In a real app, this would call an API to save the loading sheet
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newSheet: LoadingSheet = {
        id: Math.max(0, ...mockLoadingSheets.map(s => s.id)) + 1,
        projectId: formData.value.projectId!,
        projectName: projects.value.find(p => p.id === formData.value.projectId)?.name || 'Unknown Project',
        vehicleId: formData.value.vehicleId!,
        vehicleName: availableVehicles.value.find(v => v.id === formData.value.vehicleId)?.name || 'Unknown Vehicle',
        driverId: formData.value.driverId!,
        driverName: availableDrivers.value.find(d => d.id === formData.value.driverId)?.name || 'Unknown Driver',
        type: formData.value.type,
        date: formData.value.date,
        status,
        notes: formData.value.notes,
        items: formData.value.items.map((item, index) => ({
          id: index + 1,
          loadingSheetId: 0,
          itemId: item.itemId || 0,
          itemName: item.itemName,
          quantityOut: formData.value.type === 'outbound' ? item.quantity : 0,
          quantityReturned: formData.value.type === 'return' ? item.quantityReturned : 0,
          condition: item.condition as 'good' | 'damaged' | 'missing',
          notes: item.notes
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // In a real app, this would be handled by the API
      mockLoadingSheets.push(newSheet)
      
      router.push({
        path: `/logistics/loading-sheets/${newSheet.id}`,
        query: { saved: 'true' }
      })
    } catch (err) {
      console.error('Error saving loading sheet:', err)
      error.value = 'Failed to save loading sheet. Please try again.'
    } finally {
      loading.value = false
    }
  }
  
  const cancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/logistics/loading-sheets')
    }
  }
  
  // Lifecycle
  onMounted(() => {
    if (isEdit.value) {
      loadLoadingSheet()
    }
    
    // If this is a return sheet, try to load the corresponding outbound sheet
    if (props.type === 'return' && route.query.outboundId) {
      loadOutboundSheet(parseInt(route.query.outboundId as string))
    }
  })
  
  const loadLoadingSheet = () => {
    // In a real app, this would load the loading sheet from the API
    const sheet = mockLoadingSheets.find(s => s.id === parseInt(props.id!))
    if (sheet) {
      formData.value = {
        projectId: sheet.projectId,
        vehicleId: sheet.vehicleId,
        driverId: sheet.driverId,
        type: sheet.type,
        date: sheet.date,
        notes: sheet.notes,
        items: sheet.items.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: sheet.type === 'outbound' ? item.quantityOut : item.quantityReturned,
          quantityReturned: item.quantityReturned,
          condition: item.condition,
          notes: item.notes
        }))
      }
    }
  }
  
  const loadOutboundSheet = (outboundId: number) => {
    // In a real app, this would load the outbound sheet from the API
    const sheet = mockLoadingSheets.find(s => s.id === outboundId && s.type === 'outbound')
    if (sheet) {
      formData.value = {
        ...formData.value,
        projectId: sheet.projectId,
        vehicleId: sheet.vehicleId,
        driverId: sheet.driverId,
        items: sheet.items.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantityOut,
          quantityReturned: 0,
          condition: 'good',
          notes: ''
        }))
      }
    }
  }
  </script>