<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Vehicle Management</h1>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add New Vehicle
      </button>
    </div>

    <!-- Vehicles Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity (kg)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="vehicle in vehicles" :key="vehicle.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ vehicle.registration }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ vehicle.type }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ vehicle.model }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ vehicle.year }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ vehicle.capacity.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ vehicle.currentLocation }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="{
                    'px-2 py-1 text-xs font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': vehicle.status === 'available',
                    'bg-yellow-100 text-yellow-800': vehicle.status === 'in_use',
                    'bg-red-100 text-red-800': vehicle.status === 'maintenance'
                  }"
                >
                  {{ formatStatus(vehicle.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editVehicle(vehicle)" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                <button @click="confirmDelete(vehicle)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Vehicle Modal -->
    <div v-if="showAddModal || editingVehicle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">{{ editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle' }}</h2>
          
          <form @submit.prevent="saveVehicle">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Registration</label>
                <input v-model="formData.registration" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <select v-model="formData.type" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Type</option>
                  <option value="Large Truck">Large Truck</option>
                  <option value="Small Lorry">Small Lorry</option>
                  <option value="Van">Van</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input v-model="formData.model" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input v-model.number="formData.year" type="number" min="2000" :max="new Date().getFullYear() + 1" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Capacity (kg)</label>
                  <input v-model.number="formData.capacity" type="number" min="1" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select v-model="formData.status" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="available">Available</option>
                    <option value="in_use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                <input v-model="formData.currentLocation" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                {{ editingVehicle ? 'Update' : 'Save' }} Vehicle
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
        <p class="text-gray-600 mb-6">Are you sure you want to delete vehicle <span class="font-semibold">{{ vehicleToDelete?.registration }}</span>? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button @click="deleteVehicle"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Vehicle } from '../../types/logistics';
import { mockVehicles } from '../../mock/logisticsMockData';

// State
const vehicles = ref<Vehicle[]>([]);
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const editingVehicle = ref<Vehicle | null>(null);
const vehicleToDelete = ref<Vehicle | null>(null);

const formData = ref<Omit<Vehicle, 'id'>>({
  registration: '',
  type: '',
  model: '',
  year: new Date().getFullYear(),
  capacity: 0,
  status: 'available',
  currentLocation: '',
  lastServiceDate: new Date().toISOString().split('T')[0],
  insuranceExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
});

// Lifecycle Hooks
onMounted(() => {
  // In a real app, this would be an API call
  vehicles.value = [...mockVehicles];
});

// Methods
const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'available': 'Available',
    'in_use': 'In Use',
    'maintenance': 'In Maintenance'
  };
  return statusMap[status] || status;
};

const resetForm = () => {
  formData.value = {
    registration: '',
    type: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: 0,
    status: 'available',
    currentLocation: '',
    lastServiceDate: new Date().toISOString().split('T')[0],
    insuranceExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  };
};

const openAddModal = () => {
  resetForm();
  editingVehicle.value = null;
  showAddModal.value = true;
};

const editVehicle = (vehicle: Vehicle) => {
  editingVehicle.value = vehicle;
  formData.value = { ...vehicle };
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  editingVehicle.value = null;
};

const saveVehicle = () => {
  if (editingVehicle.value) {
    // Update existing vehicle
    const index = vehicles.value.findIndex((v: Vehicle) => v.id === editingVehicle.value?.id);
    if (index !== -1) {
      vehicles.value[index] = { ...editingVehicle.value, ...formData.value };
    }
  } else {
    // Add new vehicle
    const newVehicle: Vehicle = {
      id: Math.max(0, ...vehicles.value.map((v: Vehicle) => v.id)) + 1,
      ...formData.value
    };
    vehicles.value.push(newVehicle);
  }
  
  closeModal();
  // In a real app, you would call an API here to save the data
};

const confirmDelete = (vehicle: Vehicle) => {
  vehicleToDelete.value = vehicle;
  showDeleteModal.value = true;
};

const deleteVehicle = () => {
  if (vehicleToDelete.value) {
    vehicles.value = vehicles.value.filter((v: Vehicle) => v.id !== vehicleToDelete.value?.id);
    showDeleteModal.value = false;
    vehicleToDelete.value = null;
    // In a real app, you would call an API here to delete the data
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>