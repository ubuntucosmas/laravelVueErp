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
            <router-link to="/client-service" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Client Service
            </router-link>
          </div>
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

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Enquiry Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Log and manage client enquiries</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Log Enquiry
      </button>
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
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="enquiry in enquiries" :key="enquiry.id">
               <td class="px-6 py-4 whitespace-nowrap">
                 <div class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry.project_name }}</div>
                 <div class="text-sm text-gray-500 dark:text-gray-400">{{ (enquiry.project_deliverables || '').substring(0, 50) }}{{ (enquiry.project_deliverables || '').length > 50 ? '...' : '' }}</div>
                 <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                   {{ new Date(enquiry.created_at).toLocaleDateString() }}
                 </div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                 {{ enquiry.client_name }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                   {{ enquiry.contact_person }}
                 </span>
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span :class="getStatusColor(enquiry.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                   {{ getStatusLabel(enquiry.status) }}
                 </span>
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
                  v-if="canConvertToProject(enquiry)"
                  @click="convertToProject(enquiry.id)"
                  class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Convert to Project
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Enquiry Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {{ editingEnquiry ? 'Edit Enquiry' : 'Log New Enquiry' }}
        </h2>

        <form @submit.prevent="handleFormSubmit" class="space-y-4">
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
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Name *</label>
             <input
               v-model="enquiryFormData.client_name"
               type="text"
               required
               class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
             />
           </div>

           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name *</label>
             <input
               v-model="enquiryFormData.project_name"
               type="text"
               required
               class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
             />
           </div>

           <div>
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Deliverables *</label>
             <textarea
               v-model="enquiryFormData.project_deliverables"
               required
               rows="3"
               class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
             ></textarea>
           </div>

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
                 <option value="cancelled">Cancelled</option>
               </select>
             </div>
           </div>

           <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned PO</label>
               <input
                 v-model="enquiryFormData.assigned_po"
                 type="text"
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
            {{ saving ? 'Saving...' : (editingEnquiry ? 'Update Enquiry' : 'Log Enquiry') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Enquiry, CreateEnquiryData, UpdateEnquiryData } from '../types/enquiry'
import { useEnquiries } from '../composables/useEnquiries'

const { enquiries, loading, error, fetchEnquiries, createEnquiry, updateEnquiry, convertToProject, canConvertToProject } = useEnquiries()
const filters = ref({ search: '', status: '', client_name: '' })
const showCreateModal = ref(false)
const editingEnquiry = ref<Enquiry | null>(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const enquiryFormData = ref<CreateEnquiryData>({
  date_received: new Date().toISOString().split('T')[0],
  expected_delivery_date: '',
  client_name: '',
  project_name: '',
  project_deliverables: '',
  contact_person: '',
  status: 'enquiry_logged',
  assigned_po: '',
  follow_up_notes: '',
  venue: '',
  site_survey_skipped: false,
  site_survey_skip_reason: ''
})

const applyFilters = () => {
  fetchEnquiries(filters.value)
}

const editEnquiry = (enquiry: Enquiry) => {
  editingEnquiry.value = enquiry
  enquiryFormData.value = {
    date_received: enquiry.date_received,
    expected_delivery_date: enquiry.expected_delivery_date || '',
    client_name: enquiry.client_name,
    project_name: enquiry.project_name,
    project_deliverables: enquiry.project_deliverables,
    contact_person: enquiry.contact_person,
    status: enquiry.status,
    assigned_po: enquiry.assigned_po || '',
    follow_up_notes: enquiry.follow_up_notes || '',
    venue: enquiry.venue || '',
    site_survey_skipped: enquiry.site_survey_skipped,
    site_survey_skip_reason: enquiry.site_survey_skip_reason || ''
  }
  showCreateModal.value = true
}

const viewEnquiryDetails = (enquiry: Enquiry) => {
  console.log('View enquiry details:', enquiry.project_name)
  // Could navigate to enquiry detail view
}

const closeModal = () => {
  showCreateModal.value = false
  editingEnquiry.value = null
  formError.value = ''
  formSuccess.value = ''
  enquiryFormData.value = {
    date_received: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    client_name: '',
    project_name: '',
    project_deliverables: '',
    contact_person: '',
    status: 'enquiry_logged',
    assigned_po: '',
    follow_up_notes: '',
    venue: '',
    site_survey_skipped: false,
    site_survey_skip_reason: ''
  }
}

const handleFormSubmit = async () => {
  // Basic validation
  if (!enquiryFormData.value.date_received || !enquiryFormData.value.client_name ||
      !enquiryFormData.value.project_name || !enquiryFormData.value.project_deliverables ||
      !enquiryFormData.value.contact_person) {
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
      formSuccess.value = 'Enquiry logged successfully!'
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

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'client_registered': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'enquiry_logged': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'site_survey_completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'design_completed': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'design_approved': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'materials_specified': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'budget_created': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'quote_prepared': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    'quote_approved': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    'converted_to_project': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'client_registered': 'Client Registered',
    'enquiry_logged': 'Enquiry Logged',
    'site_survey_completed': 'Site Survey Done',
    'design_completed': 'Design Completed',
    'design_approved': 'Design Approved',
    'materials_specified': 'Materials Specified',
    'budget_created': 'Budget Created',
    'quote_prepared': 'Quote Prepared',
    'quote_approved': 'Quote Approved',
    'converted_to_project': 'Converted to Project',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

onMounted(async () => {
  await fetchEnquiries()
})
</script>
