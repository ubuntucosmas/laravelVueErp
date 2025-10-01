<template>
  <div class="loading-sheet-detail">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Loading Sheet #{{ loadingSheet?.loadingSheetNumber || '...' }}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ loadingSheet?.type === 'outbound' ? 'Outbound' : 'Return' }} - {{ loadingSheet?.status || 'Loading...' }}
        </p>
      </div>
      <div class="flex space-x-2">
        <button
          v-if="!isEditing"
          @click="enableEditMode"
          class="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          Edit
        </button>
        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          v-if="isEditing"
          @click="saveChanges"
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSaving"
        >
          <span v-if="!isSaving">Save Changes</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        </button>
        <button
          @click="goBack"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Back to List
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Loading sheet details...</p>
    </div>

    <div v-else-if="loadingSheet" class="space-y-6">
      <!-- Sheet Information -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Sheet Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Project -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
            <template v-if="!isEditing">
              <p class="text-gray-900 dark:text-white">{{ loadingSheet.projectName }}</p>
            </template>
            <select 
              v-else
              v-model="editedSheet.projectId"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option v-for="project in projectOptions" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          
          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <template v-if="!isEditing">
              <p class="text-gray-900 dark:text-white">{{ formatDate(loadingSheet.date) }}</p>
            </template>
            <input
              v-else
              v-model="editedSheet.date"
              type="date"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <!-- Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
            <template v-if="!isEditing">
              <p class="text-gray-900 dark:text-white">{{ loadingSheet.time }}</p>
            </template>
            <input
              v-else
              v-model="editedSheet.time"
              type="time"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <!-- Driver -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver</label>
            <template v-if="!isEditing">
              <p class="text-gray-900 dark:text-white">{{ loadingSheet.driver }}</p>
            </template>
            <select 
              v-else
              v-model="editedSheet.driver"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option v-for="driver in driverOptions" :key="driver" :value="driver">
                {{ driver }}
              </option>
            </select>
          </div>
          
          <!-- Vehicle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle</label>
            <template v-if="!isEditing">
              <p class="text-gray-900 dark:text-white">{{ loadingSheet.vehicle }}</p>
            </template>
            <select 
              v-else
              v-model="editedSheet.vehicle"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option v-for="vehicle in vehicleOptions" :key="vehicle" :value="vehicle">
                {{ vehicle }}
              </option>
            </select>
          </div>
          
          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <template v-if="!isEditing">
              <span 
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  loadingSheet.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  loadingSheet.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                ]"
              >
                {{ loadingSheet.status }}
              </span>
            </template>
            <select 
              v-else
              v-model="editedSheet.status"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Items List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Items</h2>
          <button
            v-if="isEditing"
            @click="addNewItem"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Unit
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th v-if="isEditing" class="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <template v-if="!isEditing">
                <tr v-for="item in loadingSheet.items" :key="item.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                    {{ item.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                    {{ item.unit }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <span 
                      :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        item.loaded ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      ]"
                    >
                      {{ item.loaded ? 'Loaded' : 'Pending' }}
                    </span>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(item, index) in editedSheet?.items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model="item.name"
                      type="text"
                      class="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Item name"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      class="block w-full text-right border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <select
                      v-model="item.unit"
                      class="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="pieces">Pieces</option>
                      <option value="kg">Kilograms</option>
                      <option value="liters">Liters</option>
                      <option value="boxes">Boxes</option>
                      <option value="bags">Bags</option>
                    </select>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <label class="inline-flex items-center">
                      <input
                        v-model="item.loaded"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      >
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {{ item.loaded ? 'Loaded' : 'Pending' }}
                      </span>
                    </label>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="removeItem(index)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Notes -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Notes</h2>
        <template v-if="!isEditing">
          <p v-if="loadingSheet.notes" class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ loadingSheet.notes }}</p>
          <p v-else class="text-gray-500 dark:text-gray-400 italic">No notes available</p>
        </template>
        <textarea
          v-else
          v-model="editedSheet.notes"
          rows="3"
          class="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Add any additional notes here..."
        ></textarea>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No sheet found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The requested loading sheet could not be found.</p>
      <div class="mt-6">
        <button
          @click="goBack"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go back to list
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { LoadingSheet, LoadingSheetItem } from '../types/loadingSheet';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const isEditing = ref(false);
const isSaving = ref(false);
const loadingSheet = ref<LoadingSheet | null>(null);
const editedSheet = ref<Partial<LoadingSheet> | null>(null);

// Computed property to get project options
const projectOptions = computed(() => [
  { id: 'PRJ-001', name: 'Nairobi Mall Construction' },
  { id: 'PRJ-002', name: 'Mombasa Highway Expansion' },
  { id: 'PRJ-003', name: 'Kisumu Office Complex' }
]);

// Computed property to get driver options
const driverOptions = computed(() => [
  'John Doe',
  'Jane Smith',
  'Michael Johnson',
  'Sarah Williams'
]);

// Computed property to get vehicle options
const vehicleOptions = computed(() => [
  'KAA 123A',
  'KBB 456B',
  'KCC 789C',
  'KDD 012D'
]);

// Enable edit mode
const enableEditMode = () => {
  if (loadingSheet.value) {
    editedSheet.value = { ...loadingSheet.value };
    isEditing.value = true;
  }
};

// Cancel edit mode
const cancelEdit = () => {
  isEditing.value = false;
  editedSheet.value = null;
};

// Save changes
const saveChanges = async () => {
  if (!editedSheet.value) return;
  
  isSaving.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (loadingSheet.value) {
      // In a real app, you would make an API call here
      // const response = await updateLoadingSheet(editedSheet.value);
      
      // For now, just update the local state
      Object.assign(loadingSheet.value, editedSheet.value);
      loadingSheet.value.updatedAt = new Date().toISOString();
      
      // Show success message
      // You might want to use a toast notification library
      alert('Loading sheet updated successfully!');
      
      // Exit edit mode
      isEditing.value = false;
      editedSheet.value = null;
    }
  } catch (error) {
    console.error('Error updating loading sheet:', error);
    alert('Failed to update loading sheet. Please try again.');
  } finally {
    isSaving.value = false;
  }
};

// Add new item
const addNewItem = () => {
  if (!editedSheet.value) return;
  
  const newItem: LoadingSheetItem = {
    id: `item-${Date.now()}`,
    name: '',
    quantity: 1,
    unit: 'pieces',
    loaded: false
  };
  
  if (!editedSheet.value.items) {
    editedSheet.value.items = [];
  }
  
  editedSheet.value.items = [...editedSheet.value.items, newItem];
};

// Remove item
const removeItem = (index: number) => {
  if (!editedSheet.value?.items) return;
  editedSheet.value.items.splice(index, 1);
};

// Fetch loading sheet data
const fetchLoadingSheet = async () => {
  try {
    // In a real app, you would fetch this from your API
    // const response = await fetch(`/api/loading-sheets/${route.params.id}`);
    // loadingSheet.value = await response.json();
    
    // For now, we'll use a timeout to simulate API call
    setTimeout(() => {
      // This is just mock data - replace with actual API call
      loadingSheet.value = {
        id: route.params.id as string,
        loadingSheetNumber: `LS-${route.params.id}`,
        type: 'outbound',
        status: 'completed',
        projectId: 'PRJ-001',
        projectName: 'Sample Project',
        date: '2025-10-01',
        time: '10:00',
        items: [
          { id: '1', name: 'Cement Bags', quantity: 50, unit: 'bags', loaded: true },
          { id: '2', name: 'Steel Bars', quantity: 100, unit: 'pieces', loaded: true },
          { id: '3', name: 'Wooden Planks', quantity: 200, unit: 'pieces', loaded: true },
        ],
        driver: 'John Doe',
        vehicle: 'KAA 123A',
        notes: 'All items loaded and verified by site supervisor.',
        createdAt: '2025-10-01T09:30:00Z',
        updatedAt: '2025-10-01T09:45:00Z',
      };
      loading.value = false;
    }, 500);
  } catch (error) {
    console.error('Error fetching loading sheet:', error);
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const goBack = () => {
  router.push('/logistics/loading-sheets');
};

// Lifecycle hooks
onMounted(() => {
  fetchLoadingSheet();
});
</script>

<style scoped>
.loading-sheet-detail {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6;
}
</style>