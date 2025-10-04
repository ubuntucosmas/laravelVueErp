<template>
  <div class="conversion-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
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

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Details Tab -->
      <div v-if="activeTab === 'details'">
        <!-- Project Details Section -->
        <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Project Details</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name *</label>
              <input
                v-model="formData.project_name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Budget *</label>
              <input
                v-model.number="formData.project_budget"
                type="number"
                step="0.01"
                min="0"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date *</label>
              <input
                v-model="formData.start_date"
                type="date"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date *</label>
              <input
                v-model="formData.end_date"
                type="date"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Description</label>
            <textarea
              v-model="formData.project_description"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Brief description of the project scope and objectives"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Team Tab -->
      <div v-if="activeTab === 'team'">
        <!-- Team Assignments Section -->
        <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Team Assignments</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Manager *</label>
              <select
                v-model="formData.project_manager_id"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select project manager</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
                <option value="3">Mike Johnson</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Lead Designer</label>
              <select
                v-model="formData.lead_designer_id"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select lead designer</option>
                <option value="4">Sarah Wilson</option>
                <option value="5">Tom Brown</option>
              </select>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department Assignments</label>
            <div class="space-y-2">
              <div v-for="dept in departments" :key="dept.id" class="flex items-center">
                <input
                  :id="`dept-${dept.id}`"
                  v-model="formData.assigned_departments"
                  :value="dept.id"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label :for="`dept-${dept.id}`" class="ml-2 block text-sm text-gray-900 dark:text-white">
                  {{ dept.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Checklist Tab -->
      <div v-if="activeTab === 'checklist'">
        <!-- Conversion Checklist Section -->
        <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Conversion Checklist</h4>

          <div class="space-y-3">
            <div v-for="item in checklistItems" :key="item.id" class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  :id="`check-${item.id}`"
                  v-model="formData.checklist_completed"
                  :value="item.id"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label :for="`check-${item.id}`" class="text-gray-700 dark:text-gray-300 font-medium">
                  {{ item.label }}
                </label>
                <p class="text-gray-500 dark:text-gray-400">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Tab -->
      <div v-if="activeTab === 'notes'">
        <!-- Project Kickoff Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Kickoff Notes</label>
          <textarea
            v-model="formData.kickoff_notes"
            rows="4"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Notes for project kickoff meeting, initial planning, or special instructions"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Conversion
          </button>
          <button
            v-if="task.status === 'in_progress' && isConversionReady"
            @click="convertToProject"
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Convert to Project
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Conversion
          </button>
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          Save Conversion Data
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const activeTab = ref('details')

const tabs = [
  { id: 'details', label: 'Project Details', icon: '📋' },
  { id: 'team', label: 'Team', icon: '👥' },
  { id: 'checklist', label: 'Checklist', icon: '✅' },
  { id: 'notes', label: 'Notes', icon: '📝' }
]

const departments = ref([
  { id: 1, name: 'Design' },
  { id: 2, name: 'Procurement' },
  { id: 3, name: 'Production' },
  { id: 4, name: 'Logistics' },
  { id: 5, name: 'Finance' }
])

const checklistItems = ref([
  {
    id: 'documents',
    label: 'All required documents collected',
    description: 'Contracts, permits, specifications, and client approvals'
  },
  {
    id: 'budget_approved',
    label: 'Budget approved',
    description: 'Final budget has been reviewed and approved'
  },
  {
    id: 'resources_allocated',
    label: 'Resources allocated',
    description: 'Team members and equipment assigned to project'
  },
  {
    id: 'timeline_set',
    label: 'Project timeline established',
    description: 'Key milestones and deadlines have been set'
  },
  {
    id: 'client_signoff',
    label: 'Client sign-off obtained',
    description: 'Client has approved project plan and scope'
  }
])

const formData = ref({
  project_name: '',
  project_budget: null as number | null,
  start_date: '',
  end_date: '',
  project_description: '',
  project_manager_id: '',
  lead_designer_id: '',
  assigned_departments: [] as string[],
  checklist_completed: [] as string[],
  kickoff_notes: ''
})

const isConversionReady = computed(() => {
  return formData.value.checklist_completed.length === checklistItems.value.length &&
         formData.value.project_name &&
         formData.value.project_budget &&
         formData.value.start_date &&
         formData.value.end_date &&
         formData.value.project_manager_id
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const convertToProject = () => {
  // Here you would trigger the actual project creation
  console.log('Converting enquiry to project:', formData.value)
  alert('Project conversion initiated! This would create a new project record.')
  updateStatus('completed')
}

const handleSubmit = () => {
  // Here you would typically save the conversion data
  console.log('Conversion data:', formData.value)
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset form if needed
watch(() => props.task.id, () => {
  // Reset form for new task
  formData.value = {
    project_name: '',
    project_budget: null,
    start_date: '',
    end_date: '',
    project_description: '',
    project_manager_id: '',
    lead_designer_id: '',
    assigned_departments: [],
    checklist_completed: [],
    kickoff_notes: ''
  }
})
</script>
