<template>
  <div class="planning-phase">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Planning Phase</h2>
        <div class="flex space-x-2">
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            Save Changes
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Project Details -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Project Details</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                <input type="text" v-model="project.name" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
                <input type="text" v-model="project.client" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input type="date" v-model="project.startDate" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input type="date" v-model="project.endDate" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
              </div>
            </div>
          </div>

          <!-- Team Members -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Team Members</h3>
              <button class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                + Add Member
              </button>
            </div>
            <div class="space-y-3">
              <div v-for="member in project.team" :key="member.id" class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-md">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-medium">
                    {{ member.name.charAt(0) }}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ member.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ member.role }}</p>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-gray-500">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Project Scope -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Project Scope</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea v-model="project.description" rows="4" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"></textarea>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Objectives</label>
              <div v-for="(objective, index) in project.objectives" :key="index" class="flex items-center mt-2">
                <input type="text" v-model="project.objectives[index]" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <button @click="removeObjective(index)" class="ml-2 text-red-600 hover:text-red-500">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <button @click="addObjective" class="mt-2 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Objective
              </button>
            </div>
          </div>

          <!-- Attachments -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Attachments</h3>
              <button class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                + Upload File
              </button>
            </div>
            <div class="space-y-2">
              <div v-for="(file, index) in project.attachments" :key="index" class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-md">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ file.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ file.size }}</p>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-gray-500">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

// Types
interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
}

interface ProjectScope {
  description: string;
  deliverables: string[];
  constraints: string[];
  assumptions: string[];
}

interface Project {
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  team: TeamMember[];
  scope: ProjectScope;
  objectives: string[];
  status: string;
  description?: string;
  attachments?: Array<{ id: string; name: string; url: string; size?: string }>;
}

interface Phase {
  id: string;
  name: string;
  status: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
  [key: string]: any;
}

const props = defineProps<{
  phase: Phase;
}>();

const emit = defineEmits<{
  (e: 'update:phase', phase: Phase): void;
}>();

// Initialize local phase data
const localPhase = ref<Phase>({ ...props.phase });

// Initialize project data
const project = ref<Project>({
  name: 'New Project',
  client: 'Client Name',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  team: [
    { id: 1, name: 'John Doe', role: 'Project Manager', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', role: 'Designer', email: 'jane@example.com' }
  ],
  scope: {
    description: '',
    deliverables: [],
    constraints: [],
    assumptions: []
  },
  objectives: [],
  status: 'planning'
});

const addObjective = () => {
  project.value.objectives.push('');
};

const removeObjective = (index: number) => {
  project.value.objectives.splice(index, 1);
};

// Watch for changes in local phase and emit updates
watch(() => localPhase.value, (newVal: Phase) => {
  emit('update:phase', newVal);
}, { deep: true });

// Watch for changes in project and update local phase
watch(() => project.value, (newVal: Project) => {
  // Update any relevant phase data based on project changes
  localPhase.value = {
    ...localPhase.value,
    startDate: newVal.startDate,
    endDate: newVal.endDate
  };
}, { deep: true });
</script>

<style scoped>
.planning-phase {
  /* Using standard CSS instead of @apply for better compatibility */
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* space-y-6 equivalent */
}

/* Add any additional styles here */
</style>
