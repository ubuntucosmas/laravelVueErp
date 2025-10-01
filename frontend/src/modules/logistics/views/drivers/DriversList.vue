<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Driver Management</h1>
      <button
        @click="openAddModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add New Driver
      </button>
    </div>

    <!-- Drivers Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="driver in drivers" :key="driver.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ driver.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ driver.license }}</div>
                <div class="text-xs text-gray-500">Exp: {{ driver.licenseExpiry }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ driver.contact }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ driver.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(driver.hireDate) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="{
                    'px-2 py-1 text-xs font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': driver.status === 'available',
                    'bg-yellow-100 text-yellow-800': driver.status === 'on_leave',
                    'bg-blue-100 text-blue-800': driver.status === 'assigned'
                  }"
                >
                  {{ formatStatus(driver.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editDriver(driver)" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                <button @click="confirmDelete(driver)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Driver Modal -->
    <div v-if="showAddModal || editingDriver" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">{{ editingDriver ? 'Edit Driver' : 'Add New Driver' }}</h2>
          
          <form @submit.prevent="saveDriver">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input v-model="formData.name" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <input v-model="formData.license" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">License Expiry</label>
                  <input v-model="formData.licenseExpiry" type="date" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input v-model="formData.contact" type="tel" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input v-model="formData.email" type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                  <input v-model="formData.hireDate" type="date" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select v-model="formData.status" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="available">Available</option>
                    <option value="assigned">Assigned</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea v-model="formData.address" rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                {{ editingDriver ? 'Update' : 'Save' }} Driver
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
        <p class="text-gray-600 mb-6">Are you sure you want to delete driver <span class="font-semibold">{{ driverToDelete?.name }}</span>? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button @click="deleteDriver"
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
import type { Driver } from '../../types/logistics';
import { mockDrivers } from '../../mock/logisticsMockData';

// State
const drivers = ref<Driver[]>([]);
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const editingDriver = ref<Driver | null>(null);
const driverToDelete = ref<Driver | null>(null);

const formData = ref<Omit<Driver, 'id'>>({
  name: '',
  license: '',
  status: 'available',
  contact: '',
  email: '',
  hireDate: new Date().toISOString().split('T')[0],
  licenseExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
  address: ''
});

// Lifecycle Hooks
onMounted(() => {
  // In a real app, this would be an API call
  drivers.value = [...mockDrivers];
});

// Methods
const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'available': 'Available',
    'assigned': 'Assigned',
    'on_leave': 'On Leave'
  };
  return statusMap[status] || status;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const resetForm = () => {
  formData.value = {
    name: '',
    license: '',
    status: 'available',
    contact: '',
    email: '',
    hireDate: new Date().toISOString().split('T')[0],
    licenseExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    address: ''
  };
};

const openAddModal = () => {
  resetForm();
  editingDriver.value = null;
  showAddModal.value = true;
};

const editDriver = (driver: Driver) => {
  editingDriver.value = driver;
  formData.value = { ...driver };
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  editingDriver.value = null;
};

const saveDriver = () => {
  if (editingDriver.value) {
    // Update existing driver
    const index = drivers.value.findIndex(d => d.id === editingDriver.value?.id);
    if (index !== -1) {
      drivers.value[index] = { ...editingDriver.value, ...formData.value };
    }
  } else {
    // Add new driver
    const newDriver: Driver = {
      id: Math.max(0, ...drivers.value.map(d => d.id)) + 1,
      ...formData.value
    };
    drivers.value.push(newDriver);
  }
  
  closeModal();
  // In a real app, you would call an API here to save the data
};

const confirmDelete = (driver: Driver) => {
  driverToDelete.value = driver;
  showDeleteModal.value = true;
};

const deleteDriver = () => {
  if (driverToDelete.value) {
    drivers.value = drivers.value.filter(d => d.id !== driverToDelete.value?.id);
    showDeleteModal.value = false;
    driverToDelete.value = null;
    // In a real app, you would call an API here to delete the data
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>