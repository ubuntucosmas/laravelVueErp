<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/projects" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Projects
          </router-link>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Enquiries</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Enquiries Table View -->
    <div>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Project Enquiries</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage project enquiries and track progress</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Log Enquiry
        </button>
      </div>

    <!-- Status Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="flex space-x-1">
        <button
          v-for="status in statusTabs"
          :key="status.key"
          @click="activeTab = status.key"
          :class="activeTab === status.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {{ status.label }} ({{ status.count }})
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search enquiries..."
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="client_registered">Client Registered</option>
          <option value="enquiry_logged">Enquiry Logged</option>
          <option value="site_survey_completed">Site Survey Completed</option>
          <option value="design_completed">Design Completed</option>
          <option value="design_approved">Design Approved</option>
          <option value="materials_specified">Materials Specified</option>
          <option value="budget_created">Budget Created</option>
          <option value="quote_prepared">Quote Prepared</option>
          <option value="quote_approved">Quote Approved</option>
          <option value="converted_to_project">Converted to Project</option>
          <option value="planning">Planning</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          @click="applyFilters"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Filter
        </button>
      </div>
    </div>

    <!-- Enquiries Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading enquiries...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Enquiry
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact Person
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Enquiry Number
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
           <template v-for="enquiry in filteredEnquiries" :key="enquiry.id">
             <tr>
               <td class="px-6 py-4 whitespace-nowrap">
                 <div class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry.title }}</div>
                 <div class="text-sm text-gray-500 dark:text-gray-400">{{ (enquiry.description || '').substring(0, 50) }}{{ (enquiry.description || '').length > 50 ? '...' : '' }}</div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                 {{ enquiry.client?.full_name || enquiry.client?.FullName || 'Unknown Client' }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                   {{ enquiry.contact_person }}
                 </span>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                 {{ enquiry.department?.name || 'No Department' }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span :class="getStatusColor(enquiry.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                   {{ getStatusLabel(enquiry.status) }}
                 </span>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                 {{ enquiry.enquiry_number }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <button
                   @click="editEnquiry(enquiry)"
                   class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                 >
                   Edit
                 </button>
                 <button
                   @click="viewEnquiryDetails(enquiry)"
                   class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                 >
                   View
                 </button>
                 <button
                   @click="openTaskAssignment(enquiry)"
                   class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                 >
                   Assign Tasks
                 </button>
                 <router-link
                   :to="`/projects/tasks?enquiry_id=${enquiry.id}`"
                   class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3"
                 >
                   View All Tasks
                 </router-link>
                 <button
                   v-if="canConvertToProject(enquiry)"
                   @click="convertToProject(enquiry.id)"
                   class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                 >
                   Convert to Project
                 </button>
               </td>
             </tr>

           </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="pagination.total > PAGINATION_PER_PAGE"
        :current-page="pagination.current_page"
        :total-items="pagination.total"
        :items-per-page="PAGINATION_PER_PAGE"
        @page-change="handlePageChange"
      />
    </div>
    </div>

    <!-- Create/Edit Enquiry Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {{ editingEnquiry ? 'Edit Enquiry' : 'Log New Enquiry' }}
        </h2>

        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in modalTabs"
              :key="tab.key"
              @click="activeModalTab = tab.key"
              :class="activeModalTab === tab.key
                ? 'border-primary text-primary dark:text-primary-light'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <form @submit.prevent="handleFormSubmit" @keydown.enter.prevent="handleFormSubmit" class="space-y-4">
          <!-- Basic Information Tab -->
          <div v-if="activeModalTab === 'basic'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Received *</label>
                <input
                  v-model="enquiryFormData.date_received"
                  type="date"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Delivery Date</label>
                <input
                  v-model="enquiryFormData.expected_delivery_date"
                  type="date"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client *</label>
              <select
                v-model="enquiryFormData.client_id"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a client</option>
                <option v-for="client in activeClients" :key="client.id" :value="client.id">
                  {{ client.FullName }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Title *</label>
              <input
                ref="titleInputRef"
                v-model="enquiryFormData.title"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Description *</label>
              <textarea
                v-model="enquiryFormData.description"
                required
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Scope</label>
              <textarea
                v-model="enquiryFormData.project_scope"
                rows="2"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>
          </div>

          <!-- Contact & Priority Tab -->
          <div v-if="activeModalTab === 'contact'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person *</label>
                <input
                  v-model="enquiryFormData.contact_person"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                <select
                  v-model="enquiryFormData.priority"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status *</label>
              <select
                v-model="enquiryFormData.status"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="client_registered">Client Registered</option>
                <option value="enquiry_logged">Enquiry Logged</option>
                <option value="site_survey_completed">Site Survey Completed</option>
                <option value="design_completed">Design Completed</option>
                <option value="design_approved">Design Approved</option>
                <option value="materials_specified">Materials Specified</option>
                <option value="budget_created">Budget Created</option>
                <option value="quote_prepared">Quote Prepared</option>
                <option value="quote_approved">Quote Approved</option>
                <option value="converted_to_project">Converted to Project</option>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <!-- Assignment & Venue Tab -->
          <div v-if="activeModalTab === 'assignment'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Budget</label>
                <input
                  v-model="enquiryFormData.estimated_budget"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Venue</label>
                <input
                  v-model="enquiryFormData.venue"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Notes</label>
              <textarea
                v-model="enquiryFormData.follow_up_notes"
                rows="2"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>
          </div>

          <!-- Site Survey Tab -->
          <div v-if="activeModalTab === 'survey'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    v-model="enquiryFormData.site_survey_skipped"
                    type="checkbox"
                    class="mr-2"
                  />
                  Skip Site Survey
                </label>
              </div>
              <div v-if="enquiryFormData.site_survey_skipped">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Skip Reason</label>
                <input
                  v-model="enquiryFormData.site_survey_skip_reason"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </form>

        <!-- Tab Navigation Buttons -->
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="previousTab"
            :disabled="activeModalTab === 'basic'"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div class="flex space-x-3">
            <button
              v-if="activeModalTab !== 'survey'"
              @click="nextTab"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
            <button
              v-if="activeModalTab === 'survey'"
              @click="handleFormSubmit"
              :disabled="saving"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ saving ? 'Saving...' : (editingEnquiry ? 'Update Enquiry' : 'Log Enquiry') }}
            </button>
          </div>
        </div>

        <div v-if="formError" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {{ formError }}
        </div>

        <div v-if="formSuccess" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
          {{ formSuccess }}
        </div>

        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            :disabled="saving"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Task Assignment Modal -->
    <TaskAssignmentModal
      :show="showTaskAssignmentModal"
      :enquiry-id="selectedEnquiry?.id || 0"
      :enquiry="selectedEnquiry || undefined"
      @close="closeTaskAssignmentModal"
      @task-assigned="handleTaskAssigned"
    />

    <!-- Sliding Task Dashboard -->
    <SlidingTaskDashboard
      :key="selectedEnquiryForTasks?.id"
      :enquiry-id="selectedEnquiryForTasks?.id"
      :enquiry="selectedEnquiryForTasks || undefined"
      :is-open="taskSidebarOpen"
      @assign-tasks="selectedEnquiryForTasks && openTaskAssignment(selectedEnquiryForTasks)"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { ProjectEnquiry, CreateProjectEnquiryData, UpdateProjectEnquiryData } from '../types/enquiry'
import { useProjectsEnquiries } from '../composables/useProjectsEnquiries'
import { useClients } from '../../clientService/composables/useClients'
import TaskAssignmentModal from '../components/TaskAssignmentModal.vue'
import SlidingTaskDashboard from '../components/SlidingTaskDashboard.vue'
import Pagination from '@/components/Pagination.vue'
import { ENQUIRY_STATUS_LABELS, ENQUIRY_STATUS_COLORS, PAGINATION_PER_PAGE } from '../constants/enquiryConstants'

const router = useRouter()

const { enquiries, pagination, loading, error, fetchEnquiries, goToPage, createEnquiry, updateEnquiry, convertToProject, canConvertToProject, newEnquiries, inProgressEnquiries, convertedEnquiries } = useProjectsEnquiries()
const { activeClients, fetchClients } = useClients()

// Status Tabs
const activeTab = ref('all')
const filters = ref({ search: '', status: '', client_name: '' })
const showCreateModal = ref(false)
const titleInputRef = ref<HTMLInputElement | null>(null)
const editingEnquiry = ref<ProjectEnquiry | null>(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')

// Task Assignment Modal
const showTaskAssignmentModal = ref(false)
const selectedEnquiry = ref<ProjectEnquiry | null>(null)

// Sliding Task Dashboard
const taskSidebarOpen = ref(false)
const selectedEnquiryForTasks = ref<ProjectEnquiry | null>(null)

// Modal Tabs
const activeModalTab = ref('basic')
const modalTabs = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'contact', label: 'Contact & Priority' },
  { key: 'assignment', label: 'Assignment & Venue' },
  { key: 'survey', label: 'Site Survey' }
]

const previousTab = () => {
  const currentIndex = modalTabs.findIndex(tab => tab.key === activeModalTab.value)
  if (currentIndex > 0) {
    activeModalTab.value = modalTabs[currentIndex - 1].key
  }
}

const nextTab = () => {
  const currentIndex = modalTabs.findIndex(tab => tab.key === activeModalTab.value)
  if (currentIndex < modalTabs.length - 1) {
    activeModalTab.value = modalTabs[currentIndex + 1].key
  }
}



const enquiryFormData = ref<CreateProjectEnquiryData>({
  date_received: new Date().toISOString().split('T')[0],
  expected_delivery_date: '',
  client_id: null as number | null,
  title: '',
  description: '',
  project_scope: '',
  priority: 'medium',
  status: 'enquiry_logged',
  contact_person: '',
  follow_up_notes: '',
  venue: '',
  site_survey_skipped: false,
  site_survey_skip_reason: '',
  estimated_budget: undefined
})

const statusTabs = computed(() => [
  { key: 'all', label: 'All', count: pagination.value.total },
  { key: 'new', label: 'New', count: newEnquiries.value.length },
  { key: 'in_progress', label: 'In Progress', count: inProgressEnquiries.value.length },
  { key: 'converted', label: 'Converted', count: convertedEnquiries.value.length }
])

const filteredEnquiries = computed(() => {
  let filtered = enquiries.value.filter(e => e !== undefined && e !== null)

  if (activeTab.value !== 'all') {
    if (activeTab.value === 'new') {
      filtered = newEnquiries.value.filter(e => e !== undefined && e !== null)
    } else if (activeTab.value === 'in_progress') {
      filtered = inProgressEnquiries.value.filter(e => e !== undefined && e !== null)
    } else if (activeTab.value === 'converted') {
      filtered = convertedEnquiries.value.filter(e => e !== undefined && e !== null)
    }
  }

  return filtered
})

const applyFilters = () => {
  fetchEnquiries({ ...filters.value, page: 1 }) // Reset to page 1 when applying filters
}

const handlePageChange = async (page: number) => {
  await goToPage(page)
}

const editEnquiry = (enquiry: ProjectEnquiry) => {
  editingEnquiry.value = enquiry

  enquiryFormData.value = {
    date_received: enquiry.date_received || new Date().toISOString().split('T')[0],
    expected_delivery_date: enquiry.expected_delivery_date || '',
    client_id: enquiry.client_id,
    title: enquiry.title || '',
    description: enquiry.description || '',
    project_scope: enquiry.project_scope || '',
    priority: enquiry.priority || 'medium',
    status: enquiry.status || 'enquiry_logged',
    contact_person: enquiry.contact_person || '',
    follow_up_notes: enquiry.follow_up_notes || '',
    venue: enquiry.venue || '',
    site_survey_skipped: enquiry.site_survey_skipped ?? false,
    site_survey_skip_reason: enquiry.site_survey_skip_reason || '',
    estimated_budget: enquiry.estimated_budget
  }
  showCreateModal.value = true
}

const viewEnquiryDetails = (enquiry: ProjectEnquiry) => {
  router.push(`/projects/enquiries/${enquiry.id}`)
}

const openTaskAssignment = (enquiry: ProjectEnquiry) => {
  selectedEnquiry.value = enquiry
  showTaskAssignmentModal.value = true
}

const closeTaskAssignmentModal = () => {
  showTaskAssignmentModal.value = false
  selectedEnquiry.value = null
}



const handleTaskAssigned = () => {
  // Refresh enquiries to show updated task information
  fetchEnquiries()
}


const closeModal = () => {
  showCreateModal.value = false
  editingEnquiry.value = null
  activeModalTab.value = 'basic'
  formError.value = ''
  formSuccess.value = ''

  enquiryFormData.value = {
    date_received: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    client_id: null,
    title: '',
    description: '',
    project_scope: '',
    priority: 'medium',
    status: 'enquiry_logged',
    contact_person: '',
    follow_up_notes: '',
    venue: '',
    site_survey_skipped: false,
    site_survey_skip_reason: '',
    estimated_budget: undefined
  }
}

const handleFormSubmit = async () => {
  try {
    saving.value = true
    if (editingEnquiry.value) {
      // Update mode
      await updateEnquiry(editingEnquiry.value.id, enquiryFormData.value as UpdateProjectEnquiryData)
    } else {
      // Create mode
      await createEnquiry(enquiryFormData.value as CreateProjectEnquiryData)
    }

    showCreateModal.value = false
    editingEnquiry.value = null

    // Refresh enquiries after save
    await fetchEnquiries()
  } catch {
    // Error is handled by the composable
  } finally {
    saving.value = false
  }
}

const getStatusColor = (status: string) => {
  return ENQUIRY_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusLabel = (status: string) => {
  return ENQUIRY_STATUS_LABELS[status] || status
}



watch(showCreateModal, (newVal) => {
  if (newVal && titleInputRef.value) {
    nextTick(() => {
      titleInputRef.value?.focus()
    })
  }
})

onMounted(async () => {
  await fetchEnquiries()
  await fetchClients()
})
</script>
