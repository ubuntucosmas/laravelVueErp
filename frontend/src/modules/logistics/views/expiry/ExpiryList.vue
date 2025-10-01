<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Expiry Tracking</h1>
      <button
        @click="showExpiryForm = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        + Add Expiry
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
          <select
            v-model="filters.type"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Types</option>
            <option v-for="type in expiryTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="valid">Valid</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
          <input
            type="date"
            v-model="filters.startDate"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
          <input
            type="date"
            v-model="filters.endDate"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    </div>

    <!-- Expiry List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                v-for="header in headers"
                :key="header.key"
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {{ header.label }}
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in filteredExpiries" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full" :class="getStatusBgColor(item.status)">
                    <span class="text-white">{{ getTypeIcon(item.type) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.documentNumber }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ getTypeLabel(item.type) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ item.vehicleRegistration }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.vehicleModel }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusBadgeClass(item.status)">
                  {{ formatStatus(item.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(item.issueDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getExpiryClass(item.expiryDate)">
                {{ formatDate(item.expiryDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ item.daysUntilExpiry }} days
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="editExpiry(item)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                  Edit
                </button>
                <button @click="deleteExpiry(item)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="filteredExpiries.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No expiry records found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing <span class="font-medium">{{ pagination.from }}</span> to
        <span class="font-medium">{{ pagination.to }}</span> of
        <span class="font-medium">{{ pagination.total }}</span> results
      </div>
      <div class="flex space-x-2">
        <button
          @click="prevPage"
          :disabled="pagination.currentPage === 1"
          class="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="pagination.currentPage >= pagination.lastPage"
          class="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add/Edit Expiry Form Modal -->
    <ExpiryForm
      v-if="showExpiryForm"
      :item="editingItem"
      :vehicles="vehicles"
      @save="handleSave"
      @close="closeForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ExpiryForm from './ExpiryForm.vue';
import type { ExpiryItem, Vehicle } from '../../types/logistics';
import { mockExpiries as mockExpiryData } from '../../mock/logisticsMockData';
import { mockVehicles } from '../../mock/logisticsMockData';

// Component state
const showExpiryForm = ref(false);
const editingItem = ref<ExpiryItem | null>(null);
const expiries = ref<ExpiryItem[]>(mockExpiryData);
const vehicles = ref<Vehicle[]>([]);

// Filters
const filters = ref({
  type: '',
  status: '',
  startDate: '',
  endDate: ''
});

// Pagination
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
  from: 0,
  to: 0,
  lastPage: 1
});

// Table headers
const headers = [
  { key: 'document', label: 'Document' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'status', label: 'Status' },
  { key: 'issueDate', label: 'Issue Date' },
  { key: 'expiryDate', label: 'Expiry Date' },
  { key: 'daysLeft', label: 'Days Left' },
  { key: 'actions', label: 'Actions' }
];

// Expiry types
const expiryTypes = [
  { value: 'insurance', label: 'Insurance' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'tracking', label: 'Car Tracking' },
  { value: 'license', label: 'License' }
];

// Computed properties
const filteredExpiries = computed(() => {
  let result = [...expiries.value];
  
  // Apply filters
  if (filters.value.type) {
    result = result.filter(item => item.type === filters.value.type);
  }
  
  if (filters.value.status) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    result = result.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filters.value.status === 'valid') return daysUntilExpiry > 30;
      if (filters.value.status === 'expiring') return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
      if (filters.value.status === 'expired') return daysUntilExpiry < 0;
      return true;
    });
  }
  
  if (filters.value.startDate) {
    const startDate = new Date(filters.value.startDate);
    result = result.filter(item => new Date(item.expiryDate) >= startDate);
  }
  
  if (filters.value.endDate) {
    const endDate = new Date(filters.value.endDate);
    endDate.setHours(23, 59, 59, 999);
    result = result.filter(item => new Date(item.expiryDate) <= endDate);
  }
  
  // Update pagination
  updatePagination(result.length);
  
  // Apply pagination
  const start = (pagination.value.currentPage - 1) * pagination.value.perPage;
  const end = start + pagination.value.perPage;
  
  return result.slice(start, end);
});

// Methods
const loadData = () => {
  // In a real app, this would be an API call
  expiries.value = mockExpiryData.map(item => ({
    ...item,
    daysUntilExpiry: getDaysUntilExpiry(item.expiryDate)
  }));
  
  vehicles.value = mockVehicles;
  updatePagination(expiries.value.length);
};

const getDaysUntilExpiry = (expiryDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const updatePagination = (totalItems: number) => {
  pagination.value.total = totalItems;
  pagination.value.lastPage = Math.ceil(totalItems / pagination.value.perPage);
  pagination.value.from = (pagination.value.currentPage - 1) * pagination.value.perPage + 1;
  pagination.value.to = Math.min(
    pagination.value.currentPage * pagination.value.perPage,
    totalItems
  );
};

const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.lastPage) {
    pagination.value.currentPage++;
  }
};

const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--;
  }
};

const addExpiry = () => {
  editingItem.value = null;
  showExpiryForm.value = true;
};

const editExpiry = (item: ExpiryItem) => {
  editingItem.value = { ...item };
  showExpiryForm.value = true;
};

const deleteExpiry = (item: ExpiryItem) => {
  if (confirm(`Are you sure you want to delete this ${item.type} record?`)) {
    // In a real app, this would be an API call
    expiries.value = expiries.value.filter(e => e.id !== item.id);
    updatePagination(expiries.value.length);
  }
};

const handleSave = (savedItem: ExpiryItem) => {
  if (savedItem.id) {
    // Update existing
    const index = expiries.value.findIndex(e => e.id === savedItem.id);
    if (index !== -1) {
      expiries.value[index] = {
        ...savedItem,
        daysUntilExpiry: getDaysUntilExpiry(savedItem.expiryDate)
      };
    }
  } else {
    // Add new
    const newItem = {
      ...savedItem,
      id: Math.max(0, ...expiries.value.map(e => e.id)) + 1,
      daysUntilExpiry: getDaysUntilExpiry(savedItem.expiryDate)
    };
    expiries.value.unshift(newItem);
  }
  
  updatePagination(expiries.value.length);
  closeForm();
};

const closeForm = () => {
  showExpiryForm.value = false;
  editingItem.value = null;
};

// Helper methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatStatus = (status: string) => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getStatusBadgeClass = (status: 'valid' | 'expiring_soon' | 'expired') => {
  const classes = {
    valid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    expiring_soon: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const getStatusBgColor = (status: 'valid' | 'expiring_soon' | 'expired') => {
  const classes = {
    valid: 'bg-green-500',
    expiring_soon: 'bg-yellow-500',
    expired: 'bg-red-500'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-500';
};

const getTypeIcon = (type: string) => {
  const icons = {
    insurance: '🛡️',
    inspection: '🔍',
    tracking: '📡',
    license: '📝'
  };
  return icons[type as keyof typeof icons] || '📄';
};

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    insurance: 'Insurance',
    inspection: 'Inspection',
    tracking: 'Car Tracking',
    license: 'License'
  };
  return typeMap[type] || type;
};

const getExpiryClass = (expiryDate: string) => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  
  if (daysUntilExpiry < 0) return 'text-red-600 dark:text-red-400 font-semibold';
  if (daysUntilExpiry <= 30) return 'text-yellow-600 dark:text-yellow-400 font-semibold';
  return 'text-gray-900 dark:text-white';
};

// Lifecycle hooks
onMounted(() => {
  loadData();
});
</script>
