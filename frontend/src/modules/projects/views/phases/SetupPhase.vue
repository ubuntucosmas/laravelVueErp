<template>
  <div class="setup-phase">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Setup Phase</h2>
        <div class="flex space-x-2">
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            Save Changes
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Setup Overview -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Setup Overview</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Items to Install</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ setupStats.itemsToInstall }}/{{ setupStats.totalItems }}</p>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: (setupStats.installed / setupStats.totalItems * 100) + '%' }"></div>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
              <p class="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{{ setupStats.inProgress }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p class="text-2xl font-semibold text-green-600 dark:text-green-400">{{ setupStats.completed }}</p>
            </div>
          </div>
        </div>

        <!-- Installation Checklist -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Installation Checklist</h3>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="(item, index) in installationChecklist" :key="index" class="p-4 flex items-center">
              <div class="flex items-center h-5">
                <input 
                  :id="'item-' + index" 
                  :checked="item.completed" 
                  @change="toggleChecklistItem(index)"
                  type="checkbox" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                >
              </div>
              <div class="ml-3">
                <label :for="'item-' + index" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ item.description }}
                </label>
                <p v-if="item.notes" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ item.notes }}</p>
              </div>
              <div class="ml-auto flex space-x-2">
                <span :class="getStatusBadgeClass(item.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ item.status }}
                </span>
                <button @click="editChecklistItem(index)" class="text-gray-400 hover:text-gray-500">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button @click="addChecklistItem" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Item
            </button>
          </div>
        </div>

        <!-- Installation Team -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Installation Team</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(member, index) in installationTeam" :key="index" class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-medium">
                  {{ member.name.charAt(0) }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ member.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ member.role }}</p>
                </div>
                <div class="ml-auto">
                  <span :class="getAvailabilityBadgeClass(member.availability)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ member.availability }}
                  </span>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <button @click="manageTeam" class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                + Manage Team Members
              </button>
            </div>
          </div>
        </div>

        <!-- Installation Notes -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Installation Notes</h3>
          </div>
          <div class="p-6">
            <div class="rounded-md bg-gray-50 dark:bg-gray-700 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    Add any important notes or special instructions for the installation team here. These notes will be visible to all team members.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <label for="installation-notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
              <textarea 
                id="installation-notes" 
                rows="4" 
                v-model="installationNotes" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Add any important notes or special instructions for the installation..."
              ></textarea>
            </div>
            <div class="mt-4 flex justify-end">
              <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  phase: {
    type: Object,
    default: () => ({
      id: 'setup',
      name: 'Setup',
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
const installationChecklist = ref([
  { 
    id: 1, 
    description: 'Site preparation completed', 
    status: 'Completed', 
    completed: true,
    notes: 'All areas cleared and prepped',
    dateCompleted: '2023-11-25'
  },
  { 
    id: 2, 
    description: 'Deliver materials to site', 
    status: 'In Progress', 
    completed: true,
    notes: 'Expected delivery by 2pm',
    dateCompleted: ''
  },
  { 
    id: 3, 
    description: 'Install main structure', 
    status: 'Not Started', 
    completed: false,
    notes: 'Requires crane access',
    dateCompleted: ''
  },
  { 
    id: 4, 
    description: 'Install electrical components', 
    status: 'Not Started', 
    completed: false,
    notes: 'Certified electrician required',
    dateCompleted: ''
  },
  { 
    id: 5, 
    description: 'Final inspection and sign-off', 
    status: 'Not Started', 
    completed: false,
    notes: 'Client approval needed',
    dateCompleted: ''
  }
]);

const installationTeam = ref([
  { 
    id: 1, 
    name: 'John Smith', 
    role: 'Lead Installer',
    phone: '(555) 123-4567',
    email: 'john.smith@example.com',
    availability: 'Available',
    image: ''
  },
  { 
    id: 2, 
    name: 'Maria Garcia', 
    role: 'Installation Technician',
    phone: '(555) 234-5678',
    email: 'maria.garcia@example.com',
    availability: 'Available',
    image: ''
  },
  { 
    id: 3, 
    name: 'David Kim', 
    role: 'Electrician',
    phone: '(555) 345-6789',
    email: 'david.kim@example.com',
    availability: 'On Leave',
    image: ''
  }
]);

const installationNotes = ref('Special instructions: Please ensure all electrical work is completed before the end of the day. The client has requested minimal disruption during business hours.');

// Computed properties
const setupStats = computed(() => {
  const totalItems = installationChecklist.value.length;
  const completedItems = installationChecklist.value.filter(item => item.completed).length;
  const inProgressItems = installationChecklist.value.filter(item => item.status === 'In Progress').length;
  
  return {
    totalItems,
    itemsToInstall: totalItems - completedItems,
    installed: completedItems,
    inProgress: inProgressItems,
    completed: completedItems
  };
});

// Methods
const getStatusBadgeClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    'Completed': 'bg-green-100 text-green-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Not Started': 'bg-yellow-100 text-yellow-800',
    'On Hold': 'bg-red-100 text-red-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const getAvailabilityBadgeClass = (availability: string) => {
  const availabilityClasses: Record<string, string> = {
    'Available': 'bg-green-100 text-green-800',
    'On Leave': 'bg-yellow-100 text-yellow-800',
    'On Site': 'bg-blue-100 text-blue-800',
    'Unavailable': 'bg-red-100 text-red-800'
  };
  return availabilityClasses[availability] || 'bg-gray-100 text-gray-800';
};

const toggleChecklistItem = (index: number) => {
  const item = installationChecklist.value[index];
  item.completed = !item.completed;
  item.status = item.completed ? 'Completed' : 'Not Started';
  if (item.completed) {
    item.dateCompleted = new Date().toISOString().split('T')[0];
  } else {
    item.dateCompleted = '';
  }
};

const addChecklistItem = () => {
  const newId = Math.max(0, ...installationChecklist.value.map(i => i.id)) + 1;
  installationChecklist.value.push({
    id: newId,
    description: 'New installation task',
    status: 'Not Started',
    completed: false,
    notes: '',
    dateCompleted: ''
  });
};

const editChecklistItem = (index: number) => {
  // In a real app, this would open a modal or form to edit the checklist item
  console.log('Edit checklist item:', installationChecklist.value[index]);
};

const manageTeam = () => {
  // In a real app, this would open a team management modal
  console.log('Manage installation team');
};

// Watch for changes in local phase and emit updates
watch(localPhase, (newVal) => {
  emit('update:phase', newVal);
}, { deep: true });
</script>

<style scoped>
.setup-phase {
  @apply space-y-6;
}
</style>
