<template>
  <div class="procurement-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          ]"
        >
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Items Tab -->
    <div v-if="activeTab === 'items'">
      <!-- Procurement Items Table -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Procurement Items</h4>
          <button
            @click="showAddItem = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Item
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit Cost</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(item, index) in procurementItems" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.quantity }} {{ item.unit }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.supplier }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ item.unit_cost }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ (item.quantity * item.unit_cost).toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(item.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editItem(index)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2">Edit</button>
                  <button @click="deleteItem(index)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Budget Tab -->
    <div v-if="activeTab === 'budget'">
      <!-- Budget Summary -->
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 class="text-md font-medium mb-2 text-gray-900 dark:text-white">Budget Summary</h4>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div><strong>Total Budget:</strong> ${{ totalBudget.toFixed(2) }}</div>
          <div><strong>Total Spent:</strong> ${{ totalSpent.toFixed(2) }}</div>
          <div :class="budgetVarianceClass"><strong>Variance:</strong> ${{ budgetVariance.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Item Modal -->
    <div v-if="showAddItem || editingIndex !== null" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ editingIndex !== null ? 'Edit' : 'Add' }} Procurement Item
          </h3>

          <form @submit.prevent="saveItem" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name *</label>
              <input
                v-model="itemForm.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity *</label>
                <input
                  v-model.number="itemForm.quantity"
                  type="number"
                  min="1"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                <input
                  v-model="itemForm.unit"
                  type="text"
                  placeholder="pcs, kg, etc."
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier *</label>
              <select
                v-model="itemForm.supplier"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select supplier</option>
                <option value="Supplier A">Supplier A</option>
                <option value="Supplier B">Supplier B</option>
                <option value="Supplier C">Supplier C</option>
                <option value="Local Vendor">Local Vendor</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Cost *</label>
                <input
                  v-model.number="itemForm.unit_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  v-model="itemForm.status"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="ordered">Ordered</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Delivery Date</label>
              <input
                v-model="itemForm.delivery_date"
                type="date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div class="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {{ editingIndex !== null ? 'Update' : 'Add' }} Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex space-x-2">
        <button
          v-if="task.status === 'pending'"
          @click="updateStatus('in_progress')"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Procurement
        </button>
        <button
          v-if="task.status === 'in_progress'"
          @click="updateStatus('completed')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Complete Procurement
        </button>
      </div>
      <button
        @click="handleSubmit"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
      >
        Save Procurement Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface ProcurementItem {
  name: string
  quantity: number
  unit: string
  supplier: string
  unit_cost: number
  status: string
  delivery_date: string
}

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const activeTab = ref('items')

const tabs = [
  { id: 'items', label: 'Procurement Items', icon: '📦' },
  { id: 'budget', label: 'Budget Summary', icon: '💰' }
]

const procurementItems = ref<ProcurementItem[]>([
  {
    name: 'LED Panels',
    quantity: 10,
    unit: 'pcs',
    supplier: 'Supplier A',
    unit_cost: 150.00,
    status: 'ordered',
    delivery_date: '2025-10-15'
  },
  {
    name: 'Sound System',
    quantity: 1,
    unit: 'set',
    supplier: 'Supplier B',
    unit_cost: 2000.00,
    status: 'pending',
    delivery_date: '2025-10-20'
  }
])

const showAddItem = ref(false)
const editingIndex = ref<number | null>(null)

const itemForm = ref<ProcurementItem>({
  name: '',
  quantity: 1,
  unit: '',
  supplier: '',
  unit_cost: 0,
  status: 'pending',
  delivery_date: ''
})

const totalBudget = ref(10000) // Mock budget

const totalSpent = computed(() => {
  return procurementItems.value.reduce((total, item) => {
    return total + (item.quantity * item.unit_cost)
  }, 0)
})

const budgetVariance = computed(() => {
  return totalBudget.value - totalSpent.value
})

const budgetVarianceClass = computed(() => {
  return budgetVariance.value >= 0 ? 'text-green-600' : 'text-red-600'
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'ordered': 'bg-blue-100 text-blue-800',
    'received': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const saveItem = () => {
  if (editingIndex.value !== null) {
    procurementItems.value[editingIndex.value] = { ...itemForm.value }
    editingIndex.value = null
  } else {
    procurementItems.value.push({ ...itemForm.value })
  }
  closeModal()
}

const editItem = (index: number) => {
  editingIndex.value = index
  itemForm.value = { ...procurementItems.value[index] }
}

const deleteItem = (index: number) => {
  if (confirm('Are you sure you want to delete this item?')) {
    procurementItems.value.splice(index, 1)
  }
}

const closeModal = () => {
  showAddItem.value = false
  editingIndex.value = null
  itemForm.value = {
    name: '',
    quantity: 1,
    unit: '',
    supplier: '',
    unit_cost: 0,
    status: 'pending',
    delivery_date: ''
  }
}

const handleSubmit = () => {
  // Here you would typically save the procurement data
  console.log('Procurement data:', procurementItems.value)
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset data if needed
watch(() => props.task.id, () => {
  // Reset procurement items for new task
  procurementItems.value = []
})
</script>
