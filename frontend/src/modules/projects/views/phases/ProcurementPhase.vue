<template>
  <div class="procurement-phase">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Procurement Phase</h2>
        <div class="flex space-x-2">
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            Save Changes
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Procurement Status -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Procurement Status</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Items to Order</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ procurementStats.itemsToOrder }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">On Order</p>
              <p class="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{{ procurementStats.onOrder }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Received</p>
              <p class="text-2xl font-semibold text-green-600 dark:text-green-400">{{ procurementStats.received }}</p>
            </div>
          </div>
        </div>

        <!-- Materials List -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Materials</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in materials" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ item.quantity }} {{ item.unit }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusBadgeClass(item.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ item.supplier || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="editItem(item)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">Edit</button>
                    <button @click="deleteItem(item)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button @click="addNewItem" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Material
            </button>
          </div>
        </div>

        <!-- Purchase Orders -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Purchase Orders</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PO Number</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(order, index) in purchaseOrders" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-indigo-600 dark:text-indigo-400">{{ order.poNumber }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ order.supplier }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(order.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatCurrency(order.amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusBadgeClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button @click="createPO" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Create Purchase Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  phase: {
    type: Object,
    default: () => ({
      id: 'procurement',
      name: 'Procurement',
      status: 'pending',
      startDate: '',
      endDate: '',
      progress: 0
    })
  }
});

const emit = defineEmits(['update:phase']);

const localPhase = ref({
  ...props.phase,
  status: props.phase.status || 'pending',
  progress: props.phase.progress || 0
});

// Sample data - in a real app, this would come from an API
const materials = ref([
  { 
    id: 1, 
    name: 'Wooden Panels', 
    description: 'High-quality oak panels', 
    quantity: 20, 
    unit: 'pcs', 
    status: 'Ordered', 
    supplier: 'TimberCo',
    poNumber: 'PO-2023-001'
  },
  { 
    id: 2, 
    name: 'Steel Beams', 
    description: '5m length, galvanized', 
    quantity: 15, 
    unit: 'pcs', 
    status: 'Delivered', 
    supplier: 'MetalWorks Inc',
    poNumber: 'PO-2023-002'
  },
  { 
    id: 3, 
    name: 'Concrete Mix', 
    description: 'High-strength, 30 MPa', 
    quantity: 50, 
    unit: 'bags', 
    status: 'To Order', 
    supplier: 'BuildRight',
    poNumber: ''
  }
]);

const purchaseOrders = ref([
  { 
    id: 1, 
    poNumber: 'PO-2023-001', 
    supplier: 'TimberCo', 
    date: '2023-10-15', 
    amount: 2450.00, 
    status: 'Approved' 
  },
  { 
    id: 2, 
    poNumber: 'PO-2023-002', 
    supplier: 'MetalWorks Inc', 
    date: '2023-10-18', 
    amount: 1850.50, 
    status: 'Delivered' 
  },
  { 
    id: 3, 
    poNumber: 'PO-2023-003', 
    supplier: 'BuildRight', 
    date: '2023-10-20', 
    amount: 1250.75, 
    status: 'Pending' 
  }
]);

// Computed properties
const procurementStats = computed(() => {
  return {
    itemsToOrder: materials.value.filter(item => item.status === 'To Order').length,
    onOrder: materials.value.filter(item => item.status === 'Ordered').length,
    received: materials.value.filter(item => item.status === 'Delivered').length
  };
});

// Methods
const getStatusBadgeClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    'To Order': 'bg-yellow-100 text-yellow-800',
    'Ordered': 'bg-blue-100 text-blue-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Approved': 'bg-purple-100 text-purple-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Rejected': 'bg-red-100 text-red-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const addNewItem = () => {
  // In a real app, this would open a modal or form
  console.log('Add new material item');
};

const editItem = (item: any) => {
  // In a real app, this would open a modal or form with the item data
  console.log('Edit item:', item);
};

const deleteItem = (item: any) => {
  // In a real app, this would show a confirmation dialog first
  const index = materials.value.findIndex(m => m.id === item.id);
  if (index !== -1) {
    materials.value.splice(index, 1);
  }
};

const createPO = () => {
  // In a real app, this would open a purchase order creation form
  console.log('Create purchase order');
};

// Watch for changes in local phase and emit updates
watch(localPhase, (newVal) => {
  emit('update:phase', newVal);
}, { deep: true });
</script>

<style scoped>
.procurement-phase {
  @apply space-y-6;
}
</style>
