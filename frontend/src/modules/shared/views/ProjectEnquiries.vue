<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Dashboard
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link :to="breadcrumbLink" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              {{ breadcrumbText }}
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Project Enquiries</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Task Dashboard View - Commented out due to deleted projects module -->
    <!-- <div v-if="showTaskDashboard && selectedEnquiryForTasks">
      <div class="flex items-center justify-between mb-6">
        <div>
          <button
            @click="closeTaskDashboard"
            class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Enquiries
          </button>
        </div>
      </div>

      <DepartmentalTaskDashboard
        :context="'enquiry'"
        :context-id="selectedEnquiryForTasks.id"
        :title="`Tasks for ${selectedEnquiryForTasks.title}`"
        :enquiry="selectedEnquiryForTasks"
        :department="selectedEnquiryForTasks.assigned_department || selectedEnquiryForTasks.department?.name || 'projects'"
        @taskAssigned="handleTaskAssigned"
        @quoteApproved="handleQuoteApproved"
      />
    </div> -->

    <!-- Enquiries Table View -->
    <div>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ pageTitle }}</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ pageDescription }}</p>
        </div>
        <button
          v-if="showCreateButton"
          @click="showCreateModal = true"
          class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          New Enquiry
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
          v-model="filters.priority"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select
          v-model="filters.client_id"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Clients</option>
          <option v-for="client in activeClients" :key="client.id" :value="client.id">
            {{ client.FullName }}
          </option>
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
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Enquiry Number
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Departmental Tasks
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="enquiry in paginatedEnquiries" :key="enquiry.id">
               <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span class="text-sm font-medium text-white">{{ enquiry.title.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry.title }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ enquiry.date_received.split('T')[0] }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ enquiry.client?.full_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {{ enquiry.contact_person }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusClass(enquiry.status)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ enquiry.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ enquiry.enquiry_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="openTaskDashboard(enquiry)"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  :title="`View departmental tasks for ${enquiry.title}`"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <span class="mr-1">Tasks</span>
                  <span class="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[1.25rem] h-4">
                    3
                  </span>
                </button>
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
              <!-- Tasks button commented out due to deleted projects module -->
              <!-- <button
                v-if="canAccessTasks(enquiry)"
                @click="navigateToDepartmentTasks(enquiry)"
                class="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-3"
              >
                Tasks
              </button> -->
              <!-- Convert to Project button commented out due to deleted projects module -->
              <!-- <button
                v-if="canConvertToProject(enquiry)"
                @click="convertToProject(enquiry.id)"
                class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3"
              >
                Convert to Project
              </button> -->
              <button
                @click="updateStatus(enquiry, 'site_survey_completed')"
                v-if="enquiry.status === 'enquiry_logged'"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Start Progress
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="filteredEnquiries.length > itemsPerPage"
      :current-page="currentPage"
      :total-items="filteredEnquiries.length"
      :items-per-page="itemsPerPage"
      @page-change="handlePageChange"
    />

    <!-- Create/Edit Enquiry Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {{ editingEnquiry ? 'Edit Enquiry' : 'Create New Enquiry' }}
        </h2>

        <form @submit.prevent="handleFormSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client *</label>
              <select
                v-model="enquiryFormData.client_id"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Client</option>
                <option v-for="client in activeClients" :key="client.id" :value="client.id">
                  {{ client.FullName }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority *</label>
              <select
                v-model="enquiryFormData.priority"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Enquiry Title *</label>
            <input
              v-model="enquiryFormData.title"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Scope *</label>
            <textarea
              v-model="enquiryFormData.project_scope"
              required
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
            <textarea
              v-model="enquiryFormData.description"
              required
              rows="4"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Delivery Date</label>
              <input
                v-model="enquiryFormData.expected_delivery_date"
                type="date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person *</label>
              <input
                v-model="enquiryFormData.contact_person"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Enquiry Received Date *</label>
            <input
              v-model="enquiryFormData.date_received"
              type="date"
              required
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

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Notes</label>
            <textarea
              v-model="enquiryFormData.follow_up_notes"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            ></textarea>
          </div>

          <div class="flex items-center">
            <input
              v-model="enquiryFormData.site_survey_skipped"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Skip Site Survey
            </label>
          </div>

          <div v-if="enquiryFormData.site_survey_skipped">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Skip Reason</label>
            <textarea
              v-model="enquiryFormData.site_survey_skip_reason"
              rows="2"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            ></textarea>
          </div>


        </form>

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
          <button
            @click="handleFormSubmit"
            :disabled="saving"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ saving ? 'Saving...' : (editingEnquiry ? 'Update Enquiry' : 'Create Enquiry') }}
          </button>
        </div>
      </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// Removed imports from deleted projects module
// import type { Enquiry, CreateEnquiryData, UpdateEnquiryData, DepartmentalTask } from '../../projects/types'
// import type { CreateProjectData } from '../../projects/types/project'
import { useEnquiries } from '../../clientService/composables/useEnquiries'
import { useClients } from '../../clientService/composables/useClients'
// import { useDepartmentWorkflow } from '../../projects/composables/useDepartmentWorkflow'
// import { useProjects } from '../../projects/composables/useProjects' // Removed - projects module deleted
// import DepartmentalTaskDashboard from '../../projects/components/DepartmentalTaskDashboard.vue' // Removed - projects module deleted
import Pagination from '../../../components/Pagination.vue'

// Local type definitions
interface Enquiry {
  id: number
  title: string
  client_id: number
  client?: { full_name: string }
  contact_person: string
  status: 'enquiry_logged' | 'converted_to_project' | 'site_survey_completed' | 'design_completed' | 'cancelled' | 'client_registered' | 'design_approved' | 'materials_specified' | 'budget_created' | 'quote_prepared' | 'quote_approved'
  enquiry_number: string
  date_received: string
  description?: string
  project_scope?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  department_id?: number
  assigned_department?: string
  project_deliverables?: string
  follow_up_notes?: string
  venue?: string
  site_survey_skipped: boolean
  site_survey_skip_reason?: string
  expected_delivery_date?: string
}

interface CreateEnquiryData {
  date_received: string
  client_id: number
  title: string
  contact_person: string
  site_survey_skipped: boolean
  status: 'enquiry_logged' | 'converted_to_project' | 'site_survey_completed' | 'design_completed' | 'cancelled' | 'client_registered' | 'design_approved' | 'materials_specified' | 'budget_created' | 'quote_prepared' | 'quote_approved'
  expected_delivery_date?: string
  description?: string
  project_scope?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_department?: string
  project_deliverables?: string
  follow_up_notes?: string
  venue?: string
  site_survey_skip_reason?: string
}

interface UpdateEnquiryData extends Partial<CreateEnquiryData> {
  id?: number
}

console.log('🔍 DEBUG: ProjectEnquiries component module loaded successfully')

// Props for configuration
interface Props {
  department?: string
  showCreateButton?: boolean
  pageTitle?: string
  pageDescription?: string
  breadcrumbText?: string
  breadcrumbLink?: string
}

const props = withDefaults(defineProps<Props>(), {
  department: 'projects',
  showCreateButton: true,
  pageTitle: 'Project Enquiries',
  pageDescription: 'Manage client enquiries and project requests',
  breadcrumbText: 'Projects',
  breadcrumbLink: '/projects'
})

// Emits - commented out due to deleted projects module
// const emit = defineEmits<{
//   taskAssigned: [data: {
//     userId: number
//     userName: string
//     userEmail: string
//     taskCount: number
//     taskNames: string
//     message: string
//     tasks: any[]
//   }]
// }>()

const router = useRouter()
const route = useRoute()

const { enquiries, loading, error, fetchEnquiries, createEnquiry, updateEnquiry } = useEnquiries()
const { activeClients, fetchClients } = useClients()
// const { navigateToDepartmentWorkflow, getAvailablePhases, getNextAvailablePhase } = useDepartmentWorkflow()
// const { createProject } = useProjects()

// Placeholder for projects functionality - removed with projects module
// const convertToProject = async () => {}
// const canConvertToProject = () => false
const newEnquiries = computed(() => enquiries.value.filter((enquiry: any) => enquiry.status === 'enquiry_logged'))
const inProgressEnquiries = computed(() => enquiries.value.filter((enquiry: any) => enquiry.status === 'in_progress'))
const convertedEnquiries = computed(() => enquiries.value.filter((enquiry: any) => enquiry.status === 'converted_to_project'))

const filters = ref({ search: '', priority: '', client_id: '' })
const activeTab = ref('all')
const showCreateModal = ref(false)
const editingEnquiry = ref<Enquiry | null>(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const showTaskDashboard = ref(false)
const selectedEnquiryForTasks = ref<Enquiry | null>(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const enquiryFormData = ref<CreateEnquiryData>({
  date_received: new Date().toISOString().split('T')[0],
  client_id: 0,
  title: '',
  contact_person: '',
  site_survey_skipped: false,
  status: 'enquiry_logged',
  expected_delivery_date: undefined,
  description: undefined,
  project_scope: undefined,
  priority: 'medium',
  assigned_department: undefined,
  project_deliverables: undefined,
  follow_up_notes: undefined,
  venue: undefined,
  site_survey_skip_reason: undefined
})

const statusTabs = computed(() => [
  { key: 'all', label: 'All', count: enquiries.value.length },
  { key: 'new', label: 'New', count: newEnquiries.value.length },
  { key: 'in_progress', label: 'In Progress', count: inProgressEnquiries.value.length },
  { key: 'converted', label: 'Converted', count: convertedEnquiries.value.length }
])

const filteredEnquiries = computed(() => {
  let filtered = enquiries.value

  if (activeTab.value !== 'all') {
    if (activeTab.value === 'new') {
      filtered = newEnquiries.value
    } else if (activeTab.value === 'in_progress') {
      filtered = inProgressEnquiries.value
    } else if (activeTab.value === 'converted') {
      filtered = convertedEnquiries.value
    }
  }

  return filtered
})

// Paginated enquiries
const paginatedEnquiries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredEnquiries.value.slice(start, end)
})

// Pagination handlers
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const applyFilters = () => {
  const filterData = {
    ...filters.value,
    client_id: filters.value.client_id ? parseInt(filters.value.client_id) : undefined
  }
  fetchEnquiries(filterData)
}

const getPriorityClass = (priority: string) => {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return classes[priority as keyof typeof classes] || classes.medium
}

const getStatusClass = (status: string) => {
  const classes = {
    new: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    site_survey_completed: 'bg-green-100 text-green-800',
    design_completed: 'bg-pink-100 text-pink-800',
    materials_created: 'bg-purple-100 text-purple-800',
    quoted: 'bg-indigo-100 text-indigo-800',
    approved: 'bg-green-100 text-green-800',
    converted_to_project: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || classes.new
}


const editEnquiry = (enquiry: Enquiry) => {
  editingEnquiry.value = enquiry
  enquiryFormData.value = {
    date_received: enquiry.date_received,
    client_id: enquiry.client_id,
    title: enquiry.title,
    contact_person: enquiry.contact_person,
    site_survey_skipped: enquiry.site_survey_skipped,
    status: enquiry.status,
    expected_delivery_date: enquiry.expected_delivery_date,
    description: enquiry.description,
    project_scope: enquiry.project_scope,
    priority: enquiry.priority,
    assigned_department: enquiry.assigned_department,
    project_deliverables: enquiry.project_deliverables,
    follow_up_notes: enquiry.follow_up_notes,
    venue: enquiry.venue,
    site_survey_skip_reason: enquiry.site_survey_skip_reason
  }
  showCreateModal.value = true
}

const viewEnquiryDetails = (enquiry: Enquiry) => {
  // Navigate to the detailed workflow view
  router.push(`/projects/enquiries/${enquiry.id}`)
}

// Commented out task-related functions due to deleted projects module
// const canAccessTasks = (enquiry: Enquiry) => {
//   // Check if user has permission to access tasks for this enquiry
//   // For now, allow access if enquiry has a department assigned
//   return enquiry.department_id || enquiry.assigned_department
// }

// const navigateToDepartmentTasks = (enquiry: Enquiry) => {
//   // Use the department workflow composable for intelligent routing
//   const department = enquiry.assigned_department

//   if (department) {
//     // Try to navigate using the department workflow system
//     const success = navigateToDepartmentWorkflow(enquiry, department.toLowerCase())

//     if (success) {
//       return
//     }
//   }

//   // Fallback to manual routing if department workflow fails
//   const departmentLower = department?.toLowerCase() || ''

//   if (departmentLower.includes('creative')) {
//     // Route to Design Concept phase for creatives
//     router.push(`/projects/enquiries/${enquiry.id}?phase=design_concept&department=creatives`)
//   } else if (departmentLower.includes('design')) {
//     // Route to Material Specification phase for design
//     router.push(`/projects/enquiries/${enquiry.id}?phase=material_specification&department=design`)
//   } else if (departmentLower.includes('survey') || departmentLower.includes('site')) {
//     // Route to Site Survey phase
//     router.push(`/projects/enquiries/${enquiry.id}?phase=survey&department=survey`)
//   } else if (departmentLower.includes('procurement')) {
//     // Route to Procurement phase
//     router.push(`/projects/enquiries/${enquiry.id}?phase=procurement&department=procurement`)
//   } else if (departmentLower.includes('project')) {
//     // Route to Project Management phase
//     router.push(`/projects/enquiries/${enquiry.id}?phase=project_management&department=projects`)
//   } else {
//     // Default to general workflow view with intelligent phase detection
//     const availablePhases = getAvailablePhases(enquiry)
//     const nextPhase = getNextAvailablePhase(enquiry)

//     if (nextPhase) {
//       router.push(`/projects/enquiries/${enquiry.id}?phase=${nextPhase.phase}&department=${nextPhase.department}`)
//     } else {
//       router.push(`/projects/enquiries/${enquiry.id}`)
//     }
//   }
// }

const updateStatus = async (enquiry: Enquiry, status: Enquiry['status']) => {
  await updateEnquiry(enquiry.id, { status })
  await fetchEnquiries()
}

const openTaskDashboard = (enquiry: Enquiry) => {
  selectedEnquiryForTasks.value = enquiry
  showTaskDashboard.value = true
}

const closeTaskDashboard = () => {
  showTaskDashboard.value = false
  selectedEnquiryForTasks.value = null
}

// Commented out due to deleted projects module
// const handleTaskAssigned = (data: {
//   userId: number
//   userName: string
//   userEmail: string
//   taskCount: number
//   taskNames: string
//   message: string
//   tasks: any[]
// }) => {
//   // Emit the event up to the parent (MainLayout)
//   // emit('taskAssigned', data)
// }

// Commented out due to deleted projects module
// const handleQuoteApproved = async (data: { enquiryId: number; quotationData: { summary: { totalQuoteAmount: number } } }) => {
//   try {
//     // Find the enquiry
//     const enquiry = enquiries.value.find((e: any) => e.id === data.enquiryId)
//     if (!enquiry) {
//       console.error('Enquiry not found for quote approval')
//       return
//     }

//     // Generate project ID
//     const projectId = await generateProjectId()

//     // Create project data - commented out
//     // const projectData: any = {
//     //   enquiry_id: data.enquiryId,
//     //   name: enquiry.title,
//     //   description: enquiry.project_deliverables || enquiry.description || 'Project created from approved quote',
//     //   start_date: new Date().toISOString().split('T')[0],
//     //   budget: data.quotationData.summary.totalQuoteAmount,
//     //   assigned_users: []
//     // }

//     // Create the project (this would need to be updated to include project_id in the backend)
//     // await createProject(projectData)

//     // Update enquiry status to converted
//     await updateEnquiry(data.enquiryId, { status: 'converted_to_project' })

//     // Refresh enquiries
//     await fetchEnquiries()

//     console.log('Project created successfully:', projectId)
//   } catch (error) {
//     console.error('Error creating project from approved quote:', error)
//   }
// }

// Generate project ID in format WNG-YYYYMM-JOB_NUMBER(001)
const generateProjectId = async (): Promise<string> => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // getMonth() returns 0-11
  const datePrefix = `${year}${month}`

  // For now, simulate getting the last project number
  // In a real app, this would query the backend
  const mockLastProjectNumber = 0 // This should come from API

  // Increment job number
  const nextJobNumber = mockLastProjectNumber + 1
  const formattedJobNumber = String(nextJobNumber).padStart(3, '0')

  return `WNG-${datePrefix}-${formattedJobNumber}`
}

const closeModal = () => {
  showCreateModal.value = false
  editingEnquiry.value = null
  formError.value = ''
  formSuccess.value = ''
  enquiryFormData.value = {
    date_received: new Date().toISOString().split('T')[0],
    client_id: 0,
    title: '',
    contact_person: '',
    site_survey_skipped: false,
    status: 'enquiry_logged',
    expected_delivery_date: undefined,
    description: undefined,
    project_scope: undefined,
    priority: 'medium',
    assigned_department: undefined,
    project_deliverables: undefined,
    follow_up_notes: undefined,
    venue: undefined,
    site_survey_skip_reason: undefined
  }
}

const handleFormSubmit = async () => {
  // Basic validation
  if (!enquiryFormData.value.client_id || !enquiryFormData.value.title ||
      !enquiryFormData.value.description || !enquiryFormData.value.contact_person ||
      !enquiryFormData.value.date_received) {
    formError.value = 'Please fill in all required fields'
    return
  }

  saving.value = true
  formError.value = ''
  formSuccess.value = ''

  try {
    if (editingEnquiry.value) {
      // Update existing enquiry
      await updateEnquiry(editingEnquiry.value.id, enquiryFormData.value as UpdateEnquiryData)
      formSuccess.value = 'Enquiry updated successfully!'
    } else {
      // Create new enquiry
      await createEnquiry(enquiryFormData.value)
      formSuccess.value = 'Enquiry created successfully!'
    }

    // Refresh enquiry list
    await fetchEnquiries()

    // Close modal after a short delay
    setTimeout(() => {
      closeModal()
    }, 1500)

  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      formError.value = axiosError.response?.data?.message || 'An error occurred'
    } else if (err instanceof Error) {
      formError.value = err.message
    } else {
      formError.value = 'An error occurred'
    }
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  console.log('ProjectEnquiries onMounted starting')
  try {
    console.log('Fetching enquiries...')
    await fetchEnquiries()
    console.log('Enquiries fetched:', enquiries.value.length)

    console.log('Fetching clients...')
    await fetchClients()
    console.log('Clients fetched:', activeClients.value.length)

    // Check for query parameters to auto-open task dashboard
    const openTasksEnquiryId = route.query.open_tasks as string
    const highlightTaskId = route.query.highlight_task as string

    if (openTasksEnquiryId) {
      // Find the enquiry and open its task dashboard
      const enquiry = enquiries.value.find((e: any) => e.id === parseInt(openTasksEnquiryId))
      if (enquiry) {
        // openTaskDashboard(enquiry) // Commented out

        // If we have a task to highlight, we could scroll to it or highlight it
        if (highlightTaskId) {
          // Store the task ID to highlight (could be used in DepartmentalTaskDashboard)
          // For now, we'll just open the dashboard
        }
      }
    }

    console.log('ProjectEnquiries onMounted completed successfully')
  } catch (error) {
    console.error('Error in ProjectEnquiries onMounted:', error)
  }
})
</script>
