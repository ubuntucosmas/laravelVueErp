<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Vehicle Maintenance</h1>
      <button
        @click="openAddModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Schedule Maintenance
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            v-model="filters.status" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select 
            v-model="filters.type" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="scheduled">Scheduled</option>
            <option value="repair">Repair</option>
            <option value="inspection">Inspection</option>
            <option value="accident">Accident</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
          <select 
            v-model="filters.vehicleId" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Vehicles</option>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.registration }} ({{ vehicle.model }})
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="resetFilters"
            class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Maintenance Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="item in filteredMaintenance" 
              :key="item.id" 
              class="hover:bg-gray-50"
              :class="{
                'bg-yellow-50': item.status === 'scheduled',
                'bg-blue-50': item.status === 'in_progress',
                'bg-green-50': item.status === 'completed',
                'bg-red-50': item.status === 'delayed'
              }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ item.vehicleRegistration }}</div>
                <div class="text-xs text-gray-500">{{ getVehicleModel(item.vehicleId) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full" :class="getTypeBadgeClass(item.maintenanceType)">
                  {{ formatType(item.maintenanceType) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ item.description }}</div>
                <div v-if="item.odometerReading" class="text-xs text-gray-500">
                  {{ item.odometerReading.toLocaleString() }} km
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(item.startDate) }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(item.endDate) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ item.cost ? `KSh ${item.cost.toLocaleString()}` : 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full" 
                  :class="getStatusBadgeClass(item.status)"
                >
                  {{ formatStatus(item.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="viewDetails(item)" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                <button @click="editMaintenance(item)" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button @click="confirmDelete(item)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
            <tr v-if="filteredMaintenance.length === 0">
              <td :colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                No maintenance records found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Maintenance Modal -->
    <div v-if="showMaintenanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">{{ editingMaintenance ? 'Edit Maintenance' : 'Schedule New Maintenance' }}</h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveMaintenance">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle <span class="text-red-500">*</span></label>
                <select 
                  v-model="formData.vehicleId" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!!editingMaintenance"
                >
                  <option value="">Select Vehicle</option>
                  <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
                    {{ vehicle.registration }} ({{ vehicle.model }})
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Maintenance Type <span class="text-red-500">*</span></label>
                <select 
                  v-model="formData.maintenanceType" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scheduled">Scheduled Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                  <option value="accident">Accident Repair</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date <span class="text-red-500">*</span></label>
                <input 
                  v-model="formData.startDate" 
                  type="date" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date <span class="text-red-500">*</span></label>
                <input 
                  v-model="formData.endDate" 
                  type="date" 
                  :min="formData.startDate"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status <span class="text-red-500">*</span></label>
                <select 
                  v-model="formData.status" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cost (KSh)</label>
                <input 
                  v-model.number="formData.cost" 
                  type="number" 
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
                <input 
                  v-model="formData.serviceProvider" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Odometer Reading (km)</label>
                <input 
                  v-model.number="formData.odometerReading" 
                  type="number" 
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description <span class="text-red-500">*</span></label>
                <textarea 
                  v-model="formData.description" 
                  rows="2"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  v-model="formData.notes" 
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <div v-if="formData.status === 'completed'" class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Next Service Date</label>
                <input 
                  v-model="formData.nextServiceDate" 
                  type="date" 
                  :min="formData.endDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                {{ editingMaintenance ? 'Update' : 'Save' }} Maintenance
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete the maintenance record for 
          <span class="font-semibold">{{ maintenanceToDelete?.vehicleRegistration }}</span>?
          This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button @click="deleteMaintenance"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { Maintenance, Vehicle } from '../../types/logistics';
import { mockMaintenance } from '../../mock/logisticsMockData';
import { mockVehicles } from '../../mock/logisticsMockData';

// State
const maintenanceRecords = ref<Maintenance[]>([]);
const vehicles = ref<Vehicle[]>([]);
const showMaintenanceModal = ref(false);
const showDeleteModal = ref(false);
const editingMaintenance = ref<Maintenance | null>(null);
const maintenanceToDelete = ref<Maintenance | null>(null);

// Filters
const filters = ref({
  status: '',
  type: '',
  vehicleId: ''
});

// Form Data
const formData = ref<Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>>({
  vehicleId: 0,
  vehicleRegistration: '',
  maintenanceType: 'scheduled',
  description: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  status: 'scheduled',
  cost: 0,
  serviceProvider: '',
  notes: '',
  odometerReading: 0,
  nextServiceDate: ''
});

// Computed
const filteredMaintenance = computed(() => {
  return maintenanceRecords.value.filter(item => {
    const matchesStatus = !filters.value.status || item.status === filters.value.status;
    const matchesType = !filters.value.type || item.maintenanceType === filters.value.type;
    const matchesVehicle = !filters.value.vehicleId || item.vehicleId.toString() === filters.value.vehicleId;
    
    return matchesStatus && matchesType && matchesVehicle;
  });
});

// Lifecycle Hooks
onMounted(() => {
  // In a real app, this would be an API call
  maintenanceRecords.value = [...mockMaintenance];
  vehicles.value = [...mockVehicles];
});

// Methods
const openAddModal = () => {
  resetForm();
  showMaintenanceModal.value = true;
};

const editMaintenance = (maintenance: Maintenance) => {
  editingMaintenance.value = { ...maintenance };
  formData.value = { ...maintenance };
  showMaintenanceModal.value = true;
};

const viewDetails = (maintenance: Maintenance) => {
  // In a real app, this would navigate to a detail view
  console.log('View maintenance details:', maintenance);
  alert(`Maintenance Details:\nVehicle: ${maintenance.vehicleRegistration}\nType: ${formatType(maintenance.maintenanceType)}\nStatus: ${formatStatus(maintenance.status)}\n\n${maintenance.description}`);
};

const saveMaintenance = () => {
  if (editingMaintenance.value) {
    // Update existing maintenance
    const index = maintenanceRecords.value.findIndex(m => m.id === editingMaintenance.value?.id);
    if (index !== -1) {
      const updatedMaintenance: Maintenance = {
        ...formData.value,
        id: editingMaintenance.value.id,
        createdAt: editingMaintenance.value.createdAt, // Preserve original creation date
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, this would be an API call
      maintenanceRecords.value[index] = updatedMaintenance;
      
      // Update vehicle status if needed
      updateVehicleStatus(updatedMaintenance);
    }
  } else {
    // Add new maintenance
    const newMaintenance: Maintenance = {
      ...formData.value,
      id: Date.now(), // In a real app, the ID would come from the server
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, this would be an API call
    maintenanceRecords.value.unshift(newMaintenance);
    
    // Update vehicle status if needed
    updateVehicleStatus(newMaintenance);
  }
  
  closeModal();
};

const updateVehicleStatus = (maintenance: Maintenance) => {
  // In a real app, this would update the vehicle status in the backend
  const vehicle = vehicles.value.find(v => v.id === maintenance.vehicleId);
  if (vehicle) {
    vehicle.status = maintenance.status === 'in_progress' ? 'maintenance' : 'available';
  }
};

const confirmDelete = (maintenance: Maintenance) => {
  maintenanceToDelete.value = maintenance;
  showDeleteModal.value = true;
};

const deleteMaintenance = () => {
  if (!maintenanceToDelete.value) return;
  
  // In a real app, this would be an API call
  maintenanceRecords.value = maintenanceRecords.value.filter(
    m => m.id !== maintenanceToDelete.value?.id
  );
  
  showDeleteModal.value = false;
  maintenanceToDelete.value = null;
};

const closeModal = () => {
  showMaintenanceModal.value = false;
  editingMaintenance.value = null;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    vehicleId: 0,
    vehicleRegistration: '',
    maintenanceType: 'scheduled',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: 'scheduled',
    cost: 0,
    serviceProvider: '',
    notes: '',
    odometerReading: 0,
    nextServiceDate: ''
  };
};

const resetFilters = () => {
  filters.value = {
    status: '',
    type: '',
    vehicleId: ''
  };
};

// Formatting helpers
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'scheduled': 'Scheduled',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'delayed': 'Delayed'
  };
  return statusMap[status] || status;
};

const formatType = (type: string) => {
  const typeMap: Record<string, string> = {
    'scheduled': 'Scheduled',
    'repair': 'Repair',
    'inspection': 'Inspection',
    'accident': 'Accident'
  };
  return typeMap[type] || type;
};

const getStatusBadgeClass = (status: string) => {
  return {
    'bg-yellow-100 text-yellow-800': status === 'scheduled',
    'bg-blue-100 text-blue-800': status === 'in_progress',
    'bg-green-100 text-green-800': status === 'completed',
    'bg-red-100 text-red-800': status === 'delayed'
  };
};

const getTypeBadgeClass = (type: string) => {
  return {
    'bg-blue-100 text-blue-800': type === 'scheduled',
    'bg-red-100 text-red-800': type === 'repair',
    'bg-purple-100 text-purple-800': type === 'inspection',
    'bg-orange-100 text-orange-800': type === 'accident'
  };
};

const getVehicleModel = (vehicleId: number) => {
  const vehicle = vehicles.value.find(v => v.id === vehicleId);
  return vehicle ? `${vehicle.model} (${vehicle.type})` : 'N/A';
};

// Watch for vehicle selection to update registration
watch(() => formData.value.vehicleId, (newVal: number | undefined) => {
  if (newVal) {
    const vehicle = vehicles.value.find(v => v.id === newVal);
    if (vehicle) {
      formData.value.vehicleRegistration = vehicle.registration;
    }
  } else {
    formData.value.vehicleRegistration = '';
  }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
