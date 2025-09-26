<!-- src/modules/production/components/LaborAssignmentForm.vue -->
<template>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-medium">Assign {{ category }} Labor</h2>
        <button
          @click="showForm = !showForm"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ showForm ? 'Cancel' : 'New Assignment' }}
        </button>
      </div>
  
      <!-- New Assignment Form -->
      <div v-if="showForm" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <form @submit.prevent="submitAssignment" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Labor Type
              </label>
              <div class="flex space-x-4">
                <label class="inline-flex items-center">
                  <input
                    v-model="form.labor_type"
                    type="radio"
                    value="internal"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Internal</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    v-model="form.labor_type"
                    type="radio"
                    value="external"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">External</span>
                </label>
              </div>
            </div>
  
            <!-- Internal Employee Selection -->
            <div v-if="form.labor_type === 'internal'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employee
              </label>
              <select
                v-model="form.employee_id"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              >
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.name }} ({{ emp.position }})
                </option>
              </select>
            </div>
  
            <!-- External Labor Details -->
            <template v-else>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company/Name
                </label>
                <input
                  v-model="form.external_name"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hourly Rate
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    v-model.number="form.external_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    required
                  />
                </div>
              </div>
            </template>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                v-model="form.start_date"
                type="date"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                v-model="form.end_date"
                type="date"
                :min="form.start_date"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hours Allocated
              </label>
              <input
                v-model.number="form.hours_allocated"
                type="number"
                min="1"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              v-model="form.notes"
              rows="2"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              @click="showForm = false"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="loading"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Assigning...' : 'Assign Labor' }}
            </button>
          </div>
        </form>
      </div>
  
      <!-- Existing Assignments -->
      <div class="mt-8">
        <h3 class="text-lg font-medium mb-4">Current Assignments</h3>
        
        <div v-if="existingAssignments.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
          No assignments yet.
        </div>
  
        <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="assignment in existingAssignments" :key="assignment.id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="min-w-0 flex-1 flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <div class="flex items-center text-sm">
                        <p class="font-medium text-blue-600 dark:text-blue-400 truncate">
                          {{ assignment.employee?.name || assignment.external_name }}
                        </p>
                        <p v-if="assignment.employee" class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          {{ assignment.employee.position }}
                        </p>
                        <span v-else class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          External
                        </span>
                      </div>
                      <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <p>
                          {{ formatDate(assignment.start_date) }} - {{ formatDate(assignment.end_date) }}
                          <span class="mx-1">•</span>
                          {{ assignment.hours_allocated }} hours
                          <span v-if="assignment.external_rate" class="ml-1">• ${{ assignment.external_rate }}/hr</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ml-2 flex-shrink-0 flex">
                  <button
                    @click="removeAssignment(assignment.id)"
                    class="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    title="Remove assignment"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, computed, onMounted, watch, withDefaults } from 'vue';
import { useLaborAssignments } from '../composables/useLaborAssignments';
import type { LaborAssignment } from '../types/labor';

interface LaborEmployee {
  id: number;
  name: string;
  position: string;
  department: string;
  avatar?: string;
}

type LaborAssignmentForm = {
  project_id: number;
  labor_category: 'workshop' | 'setup' | 'setdown';
  labor_type: 'internal' | 'external';
  employee_id?: number;
  external_name?: string;
  external_rate?: number;
  start_date: string;
  end_date: string;
  hours_allocated: number;
  notes: string;
  status: string;
  employee?: {
    id: number;
    name: string;
    position: string;
    department: string;
    avatar?: string;
  };
};

  const props = withDefaults(defineProps<{
    category: 'workshop' | 'setup' | 'setdown';
    projectId: number;
    existingAssignments?: LaborAssignment[];
  }>(), {
    existingAssignments: () => []
  });
  
  const emit = defineEmits<{
    (e: 'assigned', assignment?: LaborAssignment): void;
  }>();
  
  const { assignLabor, loading, error } = useLaborAssignments();
  
  const showForm = ref(false);
  const form = ref<LaborAssignmentForm>({
    project_id: props.projectId,
    labor_category: props.category,
    labor_type: 'internal',
    employee_id: undefined,
    external_name: '',
    external_rate: undefined,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hours_allocated: 8,
    notes: '',
    status: 'pending' // Add default status
  });
  
  // Mock employees - in a real app, this would come from the HR module
  const employees = ref<LaborEmployee[]>([
    { id: 1, name: 'John Smith', position: 'Carpenter', department: 'Carpentry' },
    { id: 2, name: 'Sarah Johnson', position: 'Team Lead', department: 'Management' },
    { id: 3, name: 'Mike Brown', position: 'Technician', department: 'Technical' },
    { id: 4, name: 'Emily Davis', position: 'Installer', department: 'Installation' },
    { id: 5, name: 'David Wilson', position: 'Supervisor', department: 'Management' }
  ]);
  
  const submitAssignment = async () => {
    try {
      // Prepare the assignment data with required status
      const assignmentData: LaborAssignmentForm = {
        project_id: props.projectId,
        labor_category: props.category,
        labor_type: form.value.labor_type,
        employee_id: form.value.employee_id,
        external_name: form.value.external_name,
        external_rate: form.value.external_rate,
        start_date: form.value.start_date,
        end_date: form.value.end_date,
        hours_allocated: form.value.hours_allocated,
        notes: form.value.notes,
        status: 'scheduled', // Default status
        employee: form.value.employee_id ? {
          id: form.value.employee_id,
          name: employees.value.find(e => e.id === form.value.employee_id)?.name || '',
          position: employees.value.find(e => e.id === form.value.employee_id)?.position || '',
          department: employees.value.find(e => e.id === form.value.employee_id)?.department || ''
        } : undefined
      };

      // In a real app, this would be an API call
      const newAssignment = await assignLabor(assignmentData);

      // Emit event to parent with the new assignment
      emit('assigned', newAssignment);
      
      // Reset form for next entry
      form.value = {
        project_id: props.projectId,
        labor_category: props.category,
        labor_type: 'internal',
        employee_id: undefined,
        external_name: '',
        external_rate: undefined,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        hours_allocated: 8,
        notes: '',
        status: 'pending'
      };
    } catch (e) {
      console.error('Failed to assign labor:', e);
      throw e; // Re-throw to allow parent to handle the error
    }
  };
  
  const removeAssignment = async (assignmentId: number) => {
    if (confirm('Are you sure you want to remove this assignment?')) {
      try {
        // In a real app, this would be an API call
        console.log('Assignment removed:', assignmentId);
        // Emit event to parent to refresh assignments
        emit('assigned');
      } catch (e) {
        console.error('Failed to remove assignment:', e);
      }
    }
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Define the component's public interface
  interface ComponentPublicInterface {
    removeAssignment: typeof removeAssignment;
    formatDate: typeof formatDate;
    submitAssignment: typeof submitAssignment;
  }

  // Expose methods to parent component with proper typing
  defineExpose<ComponentPublicInterface>({
    removeAssignment,
    formatDate,
    submitAssignment
  } as const);
  </script>