<template>
  <div class="setdown-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>

      <!-- Task Completion Toggle -->
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
        <div class="flex items-center space-x-2">
          <span :class="task.status === 'completed' ? 'text-green-600' : 'text-gray-500'" class="text-sm font-medium">
            {{ task.status === 'completed' ? 'Completed' : 'In Progress' }}
          </span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="isCompleted"
              type="checkbox"
              class="sr-only peer"
              @change="toggleTaskCompletion"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

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

    <!-- Overview Tab -->
    <div v-if="activeTab === 'overview'">
      <!-- Event Summary -->
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 class="text-md font-medium mb-2 text-gray-900 dark:text-white">Event Summary</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Event Date:</strong> {{ eventSummary.event_date }}</div>
          <div><strong>Venue:</strong> {{ eventSummary.venue }}</div>
          <div><strong>Setdown Start:</strong> {{ eventSummary.setdown_start }}</div>
          <div><strong>Equipment Count:</strong> {{ equipmentList.length }} items</div>
        </div>
      </div>
    </div>

    <!-- Inventory Tab -->
    <div v-if="activeTab === 'inventory'">
      <!-- Equipment Inventory -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Equipment Inventory & Condition</h4>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Equipment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Condition</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Damage</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Return Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(equipment, index) in equipmentList" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ equipment.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    v-model="equipment.condition"
                    class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    v-model="equipment.damage_description"
                    type="text"
                    placeholder="Describe damage"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    :class="{ 'border-red-500': equipment.condition === 'damaged' }"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    v-model="equipment.return_status"
                    class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="returned">Returned</option>
                    <option value="lost">Lost</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <input
                    v-model="equipment.notes"
                    type="text"
                    placeholder="Notes"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Checklist Tab -->
    <div v-if="activeTab === 'checklist'">
      <!-- Setdown Checklist -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Setdown Checklist</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="category in setdownChecklist" :key="category.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h5 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{{ category.category }}</h5>

            <div class="space-y-2">
              <div v-for="item in category.items" :key="item.id" class="flex items-center">
                <input
                  :id="`setdown-${category.id}-${item.id}`"
                  v-model="item.completed"
                  type="checkbox"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label :for="`setdown-${category.id}-${item.id}`" class="ml-2 block text-sm text-gray-900 dark:text-white">
                  {{ item.label }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Maintenance Tab -->
    <div v-if="activeTab === 'maintenance'">
      <!-- Cleaning & Maintenance -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Cleaning & Maintenance</h4>

          <div class="space-y-4">
            <div v-for="task in cleaningTasks" :key="task.id" class="border border-gray-200 dark:border-gray-600 rounded p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ task.task }}</span>
                <input
                  :id="`clean-${task.id}`"
                  v-model="task.completed"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <textarea
                v-model="task.notes"
                rows="2"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Cleaning/maintenance notes..."
              ></textarea>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Storage & Transport</h4>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Storage Location</label>
              <select
                v-model="setdownData.storage_location"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select storage location</option>
                <option value="warehouse_a">Warehouse A</option>
                <option value="warehouse_b">Warehouse B</option>
                <option value="external_storage">External Storage</option>
                <option value="client_storage">Client Storage</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Transport Method</label>
              <select
                v-model="setdownData.transport_method"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select transport method</option>
                <option value="company_truck">Company Truck</option>
                <option value="rental_truck">Rental Truck</option>
                <option value="courier">Courier Service</option>
                <option value="client_transport">Client Transport</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Return Date</label>
              <input
                v-model="setdownData.return_date"
                type="date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Transport Cost</label>
              <input
                v-model.number="setdownData.transport_cost"
                type="number"
                step="0.01"
                min="0"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Documentation Tab -->
    <div v-if="activeTab === 'documentation'">
      <!-- Damage Assessment -->
      <div class="mb-6" v-if="damagedEquipment.length > 0">
        <h4 class="text-md font-medium mb-3 text-red-800 dark:text-red-200">Damage Assessment</h4>

        <div class="space-y-3">
          <div v-for="equipment in damagedEquipment" :key="equipment.name" class="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
            <div class="flex justify-between items-start mb-2">
              <span class="text-sm font-medium text-red-800 dark:text-red-200">{{ equipment.name }}</span>
              <span class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Damaged</span>
            </div>
            <p class="text-sm text-red-700 dark:text-red-300 mb-2">{{ equipment.damage_description }}</p>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-red-700 dark:text-red-300">Repair Required</label>
                <select
                  v-model="equipment.repair_required"
                  class="mt-1 block w-full px-2 py-1 text-sm border border-red-300 dark:border-red-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="replace">Replace</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-red-700 dark:text-red-300">Estimated Cost</label>
                <input
                  v-model.number="equipment.repair_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  class="mt-1 block w-full px-2 py-1 text-sm border border-red-300 dark:border-red-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Documentation -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Documentation & Photos</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Setdown Photos</label>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Upload before/after photos</p>
              <input type="file" multiple accept="image/*" class="hidden" />
              <button class="mt-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600">
                Upload Photos
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Setdown Report</label>
            <textarea
              v-model="setdownData.setdown_report"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Detailed setdown report, issues encountered, special notes..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Completion Tab -->
    <div v-if="activeTab === 'completion'">
      <!-- Completion Sign-off -->
      <div class="mb-6 p-4 border-2 border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
        <h4 class="text-md font-medium mb-3 text-green-800 dark:text-green-200">Setdown Completion Sign-off</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-green-700 dark:text-green-300">Setdown Completed By</label>
            <input
              v-model="setdownData.completed_by"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-green-700 dark:text-green-300">Completion Date & Time</label>
            <input
              v-model="setdownData.completion_datetime"
              type="datetime-local"
              class="mt-1 block w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <div class="flex items-center">
            <input
              id="inventory_complete"
              v-model="setdownData.inventory_complete"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
            />
            <label for="inventory_complete" class="ml-2 block text-sm text-green-800 dark:text-green-200">
              All equipment inventoried and accounted for
            </label>
          </div>

          <div class="flex items-center">
            <input
              id="cleaning_complete"
              v-model="setdownData.cleaning_complete"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
            />
            <label for="cleaning_complete" class="ml-2 block text-sm text-green-800 dark:text-green-200">
              Cleaning and maintenance tasks completed
            </label>
          </div>

          <div class="flex items-center">
            <input
              id="setdown_signoff"
              v-model="setdownData.setdown_signoff"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
            />
            <label for="setdown_signoff" class="ml-2 block text-sm text-green-800 dark:text-green-200">
              I confirm that setdown is complete and all equipment is ready for return/storage
            </label>
          </div>
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
          Start Setdown
        </button>
        <button
          v-if="task.status === 'in_progress' && setdownData.setdown_signoff"
          @click="updateStatus('completed')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Complete Setdown
        </button>
      </div>
      <button
        @click="handleSubmit"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
      >
        Save Setdown Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface Equipment {
  name: string
  condition: string
  damage_description: string
  return_status: string
  notes: string
  repair_required?: string
  repair_cost?: number
}

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

interface ChecklistCategory {
  id: string
  category: string
  items: ChecklistItem[]
}

interface CleaningTask {
  id: string
  task: string
  completed: boolean
  notes: string
}

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'checklist', label: 'Checklist', icon: '✅' },
  { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { id: 'documentation', label: 'Documentation', icon: '📄' },
  { id: 'completion', label: 'Completion', icon: '🏁' }
]

const isCompleted = computed({
  get: () => props.task.status === 'completed',
  set: (value) => {
    if (value && props.task.status !== 'completed') {
      toggleTaskCompletion()
    }
  }
})

const toggleTaskCompletion = async () => {
  try {
    const response = await fetch(`/api/projects/enquiry-tasks/${props.task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        status: 'completed'
      })
    })

    if (response.ok) {
      emit('update-status', 'completed')

      // Show success notification
      alert(`Task "${props.task.title}" has been marked as completed! All users have been notified.`)

      // Refresh notifications (if notification system is available)
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('task-completed', {
          detail: { task: props.task }
        }))
      }
    } else {
      throw new Error('Failed to update task status')
    }
  } catch (error) {
    console.error('Error updating task status:', error)
    alert('Failed to mark task as completed. Please try again.')
  }
}

const eventSummary = ref({
  event_date: '2025-10-25',
  venue: 'Grand Ballroom, Nairobi',
  setdown_start: '11:00 PM'
})

const equipmentList = ref<Equipment[]>([
  {
    name: 'LED Display Panel A',
    condition: 'good',
    damage_description: '',
    return_status: 'pending',
    notes: ''
  },
  {
    name: 'Sound System Main Unit',
    condition: 'excellent',
    damage_description: '',
    return_status: 'pending',
    notes: ''
  },
  {
    name: 'Lighting Rig',
    condition: 'fair',
    damage_description: 'Minor scratches on casing',
    return_status: 'pending',
    notes: ''
  },
  {
    name: 'Cable Management System',
    condition: 'good',
    damage_description: '',
    return_status: 'pending',
    notes: ''
  }
])

const setdownChecklist = ref<ChecklistCategory[]>([
  {
    id: 'dismantling',
    category: 'Dismantling',
    items: [
      { id: 'equipment_disconnect', label: 'All equipment safely disconnected', completed: false },
      { id: 'cables_coiled', label: 'Cables properly coiled and secured', completed: false },
      { id: 'components_sorted', label: 'Components sorted by type', completed: false },
      { id: 'fragile_items', label: 'Fragile items identified and protected', completed: false }
    ]
  },
  {
    id: 'inventory',
    category: 'Inventory',
    items: [
      { id: 'item_count', label: 'All items counted and verified', completed: false },
      { id: 'serial_numbers', label: 'Serial numbers recorded', completed: false },
      { id: 'missing_items', label: 'Missing items identified', completed: false },
      { id: 'condition_assessment', label: 'Equipment condition assessed', completed: false }
    ]
  },
  {
    id: 'preparation',
    category: 'Return Preparation',
    items: [
      { id: 'packaging', label: 'Equipment properly packaged', completed: false },
      { id: 'labels_attached', label: 'Return labels attached', completed: false },
      { id: 'documentation', label: 'Return documentation prepared', completed: false },
      { id: 'transport_arranged', label: 'Transport arrangements made', completed: false }
    ]
  }
])

const cleaningTasks = ref<CleaningTask[]>([
  { id: 'surface_cleaning', task: 'Surface cleaning and dusting', completed: false, notes: '' },
  { id: 'cable_cleaning', task: 'Cable and connector cleaning', completed: false, notes: '' },
  { id: 'component_check', task: 'Component functionality check', completed: false, notes: '' },
  { id: 'preventive_maintenance', task: 'Preventive maintenance performed', completed: false, notes: '' }
])

const setdownData = ref({
  storage_location: '',
  transport_method: '',
  return_date: '',
  transport_cost: null as number | null,
  setdown_report: '',
  completed_by: '',
  completion_datetime: '',
  inventory_complete: false,
  cleaning_complete: false,
  setdown_signoff: false
})

const damagedEquipment = computed(() => {
  return equipmentList.value.filter(equipment => equipment.condition === 'damaged' || equipment.condition === 'poor')
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const handleSubmit = () => {
  // Here you would typically save the setdown data
  console.log('Setdown data:', {
    equipmentList: equipmentList.value,
    setdownChecklist: setdownChecklist.value,
    cleaningTasks: cleaningTasks.value,
    setdownData: setdownData.value
  })
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset data if needed
watch(() => props.task.id, () => {
  // Reset setdown data for new task
  equipmentList.value.forEach(equipment => {
    equipment.condition = 'good'
    equipment.damage_description = ''
    equipment.return_status = 'pending'
    equipment.notes = ''
  })
  setdownChecklist.value.forEach(category => {
    category.items.forEach(item => item.completed = false)
  })
  cleaningTasks.value.forEach(task => {
    task.completed = false
    task.notes = ''
  })
  setdownData.value = {
    storage_location: '',
    transport_method: '',
    return_date: '',
    transport_cost: null,
    setdown_report: '',
    completed_by: '',
    completion_datetime: '',
    inventory_complete: false,
    cleaning_complete: false,
    setdown_signoff: false
  }
})
</script>
