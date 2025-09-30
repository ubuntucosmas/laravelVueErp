<template>
  <div class="production-phase">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Production Phase</h2>
        <div class="flex space-x-2">
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            Save Changes
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Production Overview -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Production Overview</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ productionStats.tasks }}/{{ productionStats.totalTasks }}</p>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: (productionStats.tasks / productionStats.totalTasks * 100) + '%' }"></div>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
              <p class="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{{ productionStats.inProgress }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p class="text-2xl font-semibold text-green-600 dark:text-green-400">{{ productionStats.completed }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Behind Schedule</p>
              <p class="text-2xl font-semibold text-red-600 dark:text-red-400">{{ productionStats.behindSchedule }}</p>
            </div>
          </div>
        </div>

        <!-- Tasks -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Production Tasks</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(task, index) in tasks" :key="index">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ task.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ task.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-medium">
                          {{ task.assignedTo.charAt(0) }}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ task.assignedTo }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(task.dueDate) }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ getDaysRemaining(task.dueDate) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusBadgeClass(task.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ task.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="viewTask(task)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">View</button>
                    <button @click="editTask(task)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button @click="addTask" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Task
            </button>
          </div>
        </div>

        <!-- Production Timeline -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Production Timeline</h3>
          </div>
          <div class="p-6">
            <div class="relative">
              <!-- Timeline -->
              <div class="space-y-8">
                <div v-for="(milestone, index) in timeline" :key="index" class="relative">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white">
                      <svg v-if="milestone.completed" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span v-else class="text-xs">{{ index + 1 }}</span>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-base font-medium text-gray-900 dark:text-white">{{ milestone.title }}</h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ milestone.date }}</p>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ milestone.description }}</p>
                    </div>
                  </div>
                  <!-- Connector line -->
                  <div v-if="index < timeline.length - 1" class="absolute top-6 left-3 w-0.5 h-full bg-gray-300 dark:bg-gray-600" aria-hidden="true"></div>
                </div>
              </div>
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
      id: 'production',
      name: 'Production',
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
const tasks = ref([
  { 
    id: 1, 
    name: 'Fabricate wooden panels', 
    description: 'Cut and prepare all wooden panels according to specifications',
    assignedTo: 'John Doe',
    dueDate: '2023-11-10',
    status: 'In Progress',
    priority: 'High'
  },
  { 
    id: 2, 
    name: 'Assemble main structure', 
    description: 'Put together the main frame and structure',
    assignedTo: 'Jane Smith',
    dueDate: '2023-11-15',
    status: 'Not Started',
    priority: 'High'
  },
  { 
    id: 3, 
    name: 'Apply finish', 
    description: 'Sand and apply finish to all wooden surfaces',
    assignedTo: 'Mike Johnson',
    dueDate: '2023-11-20',
    status: 'Not Started',
    priority: 'Medium'
  },
  { 
    id: 4, 
    name: 'Quality check', 
    description: 'Inspect all components for quality and completeness',
    assignedTo: 'Sarah Williams',
    dueDate: '2023-11-22',
    status: 'Not Started',
    priority: 'High'
  }
]);

const timeline = ref([
  {
    title: 'Materials Received',
    date: 'November 1, 2023',
    description: 'All materials have been received and inspected',
    completed: true
  },
  {
    title: 'Production Started',
    date: 'November 5, 2023',
    description: 'Production has officially begun',
    completed: true
  },
  {
    title: '50% Completion',
    date: 'November 12, 2023',
    description: 'Half of the production tasks are complete',
    completed: false
  },
  {
    title: 'Quality Control',
    date: 'November 22, 2023',
    description: 'Final quality control checks',
    completed: false
  },
  {
    title: 'Production Complete',
    date: 'November 30, 2023',
    description: 'All production tasks completed',
    completed: false
  }
]);

// Computed properties
const productionStats = computed(() => {
  const totalTasks = tasks.value.length;
  const completedTasks = tasks.value.filter(task => task.status === 'Completed').length;
  const inProgressTasks = tasks.value.filter(task => task.status === 'In Progress').length;
  const behindSchedule = tasks.value.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return task.status !== 'Completed' && dueDate < today;
  }).length;

  return {
    tasks: completedTasks,
    totalTasks,
    inProgress: inProgressTasks,
    completed: completedTasks,
    behindSchedule
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

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getDaysRemaining = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Due today';
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  return `${diffDays} days remaining`;
};

const addTask = () => {
  // In a real app, this would open a task creation form
  console.log('Add new task');
};

const editTask = (task: any) => {
  // In a real app, this would open a task edit form
  console.log('Edit task:', task);
};

const viewTask = (task: any) => {
  // In a real app, this would open a task details view
  console.log('View task:', task);
};

// Watch for changes in local phase and emit updates
watch(localPhase, (newVal) => {
  emit('update:phase', newVal);
}, { deep: true });
</script>

<style scoped>
.production-phase {
  @apply space-y-6;
}
</style>
