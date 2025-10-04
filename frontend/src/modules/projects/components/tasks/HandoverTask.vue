<template>
  <div class="handover-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
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
      <!-- Client Information -->
      <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <h4 class="text-md font-medium mb-2 text-blue-800 dark:text-blue-200">Client Information</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Client Name:</strong> {{ clientInfo.name }}</div>
          <div><strong>Contact Person:</strong> {{ clientInfo.contact_person }}</div>
          <div><strong>Email:</strong> {{ clientInfo.email }}</div>
          <div><strong>Phone:</strong> {{ clientInfo.phone }}</div>
        </div>
      </div>
    </div>

    <!-- Checklist Tab -->
    <div v-if="activeTab === 'checklist'">
      <!-- Handover Checklist -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Handover Checklist</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="category in handoverChecklist" :key="category.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h5 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{{ category.category }}</h5>

            <div class="space-y-2">
              <div v-for="item in category.items" :key="item.id" class="flex items-start">
                <input
                  :id="`handover-${category.id}-${item.id}`"
                  v-model="item.completed"
                  type="checkbox"
                  class="h-4 w-4 mt-0.5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <div class="ml-2">
                  <label :for="`handover-${category.id}-${item.id}`" class="text-sm text-gray-900 dark:text-white font-medium">
                    {{ item.label }}
                  </label>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Meeting Tab -->
    <div v-if="activeTab === 'meeting'">
      <!-- Handover Meeting -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Handover Meeting</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Meeting Date & Time *</label>
            <input
              v-model="handoverData.meeting_datetime"
              type="datetime-local"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Meeting Location</label>
            <select
              v-model="handoverData.meeting_location"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select location</option>
              <option value="venue">At the venue</option>
              <option value="office">Client office</option>
              <option value="virtual">Virtual meeting</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Attendees</label>
          <div class="mt-2 space-y-2">
            <div v-for="(attendee, index) in handoverData.attendees" :key="index" class="flex items-center space-x-2">
              <input
                v-model="attendee.name"
                type="text"
                placeholder="Attendee name"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <select
                v-model="attendee.role"
                class="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="client">Client</option>
                <option value="project_manager">Project Manager</option>
                <option value="technical_lead">Technical Lead</option>
                <option value="other">Other</option>
              </select>
              <button
                v-if="handoverData.attendees.length > 1"
                @click="removeAttendee(index)"
                class="px-2 py-1 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
          <button
            @click="addAttendee"
            class="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Attendee
          </button>
        </div>
      </div>
    </div>

    <!-- Documentation Tab -->
    <div v-if="activeTab === 'documentation'">
      <!-- Documentation & Training -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Documentation Provided</h4>

          <div class="space-y-3">
            <div v-for="doc in handoverDocuments" :key="doc.id" class="flex items-center">
              <input
                :id="`doc-${doc.id}`"
                v-model="doc.provided"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label :for="`doc-${doc.id}`" class="ml-2 block text-sm text-gray-900 dark:text-white">
                {{ doc.name }}
              </label>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Documents</label>
            <textarea
              v-model="handoverData.additional_docs"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="List any additional documents provided..."
            ></textarea>
          </div>
        </div>

        <div>
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Training Provided</h4>

          <div class="space-y-3">
            <div v-for="training in handoverTraining" :key="training.id" class="border border-gray-200 dark:border-gray-600 rounded p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ training.topic }}</span>
                <input
                  :id="`training-${training.id}`"
                  v-model="training.completed"
                  type="checkbox"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400">{{ training.description }}</p>
              <div class="mt-2">
                <label class="block text-xs text-gray-600 dark:text-gray-400">Trainer</label>
                <input
                  v-model="training.trainer"
                  type="text"
                  class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Trainer name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Support Tab -->
    <div v-if="activeTab === 'support'">
      <!-- Warranty & Support -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Warranty & Support Information</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Warranty Period</label>
            <select
              v-model="handoverData.warranty_period"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select warranty period</option>
              <option value="1_year">1 Year</option>
              <option value="2_years">2 Years</option>
              <option value="3_years">3 Years</option>
              <option value="5_years">5 Years</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Support Contact</label>
            <input
              v-model="handoverData.support_contact"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Support hotline/email"
            />
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Warranty Terms</label>
          <textarea
            v-model="handoverData.warranty_terms"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Specific warranty terms and conditions..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Feedback Tab -->
    <div v-if="activeTab === 'feedback'">
      <!-- Client Feedback -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Client Feedback</h4>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Overall Satisfaction (1-5)</label>
            <div class="flex space-x-2 mt-1">
              <button
                v-for="rating in 5"
                :key="rating"
                @click="handoverData.client_rating = rating"
                :class="handoverData.client_rating >= rating ? 'bg-yellow-400 text-yellow-800' : 'bg-gray-200 text-gray-600'"
                class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                {{ rating }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Comments</label>
            <textarea
              v-model="handoverData.client_comments"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Client feedback and comments..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Areas for Improvement</label>
            <textarea
              v-model="handoverData.improvement_areas"
              rows="2"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Any areas that need improvement..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Sign-off -->
      <div class="mb-6 p-4 border-2 border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
        <h4 class="text-md font-medium mb-3 text-green-800 dark:text-green-200">Handover Sign-off</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-green-700 dark:text-green-300">Client Representative</label>
            <input
              v-model="handoverData.client_signatory"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Client representative name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-green-700 dark:text-green-300">Handover Date</label>
            <input
              v-model="handoverData.handover_date"
              type="date"
              class="mt-1 block w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <div class="flex items-center">
            <input
              id="client_acknowledgment"
              v-model="handoverData.client_acknowledgment"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
            />
            <label for="client_acknowledgment" class="ml-2 block text-sm text-green-800 dark:text-green-200">
              Client acknowledges receipt of all deliverables and training
            </label>
          </div>

          <div class="flex items-center">
            <input
              id="project_signoff"
              v-model="handoverData.project_signoff"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
            />
            <label for="project_signoff" class="ml-2 block text-sm text-green-800 dark:text-green-200">
              Project team confirms handover completion
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Follow-up Tab -->
    <div v-if="activeTab === 'followup'">
      <!-- Follow-up -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Post-Handover Follow-up</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Date</label>
            <input
              v-model="handoverData.followup_date"
              type="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Method</label>
            <select
              v-model="handoverData.followup_method"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select method</option>
              <option value="phone">Phone Call</option>
              <option value="email">Email</option>
              <option value="visit">Site Visit</option>
              <option value="virtual">Virtual Meeting</option>
            </select>
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
          Start Handover
        </button>
        <button
          v-if="task.status === 'in_progress' && handoverData.client_acknowledgment && handoverData.project_signoff"
          @click="updateStatus('completed')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Complete Handover
        </button>
      </div>
      <button
        @click="handleSubmit"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
      >
        Save Handover Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface ChecklistItem {
  id: string
  label: string
  description: string
  completed: boolean
}

interface ChecklistCategory {
  id: string
  category: string
  items: ChecklistItem[]
}

interface Attendee {
  name: string
  role: string
}

interface Document {
  id: string
  name: string
  provided: boolean
}

interface Training {
  id: string
  topic: string
  description: string
  completed: boolean
  trainer: string
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
  { id: 'overview', label: 'Overview', icon: '👥' },
  { id: 'checklist', label: 'Checklist', icon: '✅' },
  { id: 'meeting', label: 'Meeting', icon: '📅' },
  { id: 'documentation', label: 'Documentation', icon: '📄' },
  { id: 'support', label: 'Support', icon: '🛠️' },
  { id: 'feedback', label: 'Feedback', icon: '💬' },
  { id: 'followup', label: 'Follow-up', icon: '📞' }
]

const clientInfo = ref({
  name: 'ABC Corporation',
  contact_person: 'Jane Doe',
  email: 'jane.doe@abc.com',
  phone: '+1-234-567-8900'
})

const handoverChecklist = ref<ChecklistCategory[]>([
  {
    id: 'deliverables',
    category: 'Deliverables',
    items: [
      { id: 'equipment', label: 'All equipment delivered', description: 'Complete setup as specified', completed: false },
      { id: 'documentation', label: 'User manuals provided', description: 'Technical and user documentation', completed: false },
      { id: 'spare_parts', label: 'Spare parts delivered', description: 'Essential spare parts included', completed: false },
      { id: 'tools', label: 'Maintenance tools provided', description: 'Tools for basic maintenance', completed: false }
    ]
  },
  {
    id: 'training',
    category: 'Training',
    items: [
      { id: 'operation', label: 'Operation training completed', description: 'Basic operation procedures', completed: false },
      { id: 'maintenance', label: 'Maintenance training provided', description: 'Basic maintenance procedures', completed: false },
      { id: 'safety', label: 'Safety training completed', description: 'Safety protocols and procedures', completed: false },
      { id: 'troubleshooting', label: 'Troubleshooting training', description: 'Basic troubleshooting techniques', completed: false }
    ]
  },
  {
    id: 'documentation',
    category: 'Documentation',
    items: [
      { id: 'contracts', label: 'Contracts signed', description: 'All contractual documents executed', completed: false },
      { id: 'warranties', label: 'Warranty documents provided', description: 'Warranty certificates and terms', completed: false },
      { id: 'certificates', label: 'Certificates of compliance', description: 'Safety and performance certificates', completed: false },
      { id: 'contacts', label: 'Support contacts provided', description: 'Technical support contact information', completed: false }
    ]
  }
])

const handoverDocuments = ref<Document[]>([
  { id: 'user_manual', name: 'User Manual', provided: false },
  { id: 'technical_specs', name: 'Technical Specifications', provided: false },
  { id: 'warranty_card', name: 'Warranty Card', provided: false },
  { id: 'maintenance_guide', name: 'Maintenance Guide', provided: false },
  { id: 'emergency_contacts', name: 'Emergency Contact List', provided: false }
])

const handoverTraining = ref<Training[]>([
  {
    id: 'system_operation',
    topic: 'System Operation',
    description: 'How to operate the equipment safely and effectively',
    completed: false,
    trainer: ''
  },
  {
    id: 'basic_maintenance',
    topic: 'Basic Maintenance',
    description: 'Routine maintenance procedures',
    completed: false,
    trainer: ''
  },
  {
    id: 'emergency_procedures',
    topic: 'Emergency Procedures',
    description: 'What to do in case of equipment failure',
    completed: false,
    trainer: ''
  }
])

const handoverData = ref({
  meeting_datetime: '',
  meeting_location: '',
  attendees: [{ name: '', role: 'client' }] as Attendee[],
  additional_docs: '',
  warranty_period: '',
  support_contact: '',
  warranty_terms: '',
  client_rating: 0,
  client_comments: '',
  improvement_areas: '',
  client_signatory: '',
  handover_date: new Date().toISOString().split('T')[0],
  client_acknowledgment: false,
  project_signoff: false,
  followup_date: '',
  followup_method: ''
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const addAttendee = () => {
  handoverData.value.attendees.push({ name: '', role: 'client' })
}

const removeAttendee = (index: number) => {
  if (handoverData.value.attendees.length > 1) {
    handoverData.value.attendees.splice(index, 1)
  }
}

const handleSubmit = () => {
  // Here you would typically save the handover data
  console.log('Handover data:', {
    handoverChecklist: handoverChecklist.value,
    handoverDocuments: handoverDocuments.value,
    handoverTraining: handoverTraining.value,
    handoverData: handoverData.value
  })
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset data if needed
watch(() => props.task.id, () => {
  // Reset handover data for new task
  handoverChecklist.value.forEach(category => {
    category.items.forEach(item => item.completed = false)
  })
  handoverDocuments.value.forEach(doc => doc.provided = false)
  handoverTraining.value.forEach(training => {
    training.completed = false
    training.trainer = ''
  })
  handoverData.value = {
    meeting_datetime: '',
    meeting_location: '',
    attendees: [{ name: '', role: 'client' }],
    additional_docs: '',
    warranty_period: '',
    support_contact: '',
    warranty_terms: '',
    client_rating: 0,
    client_comments: '',
    improvement_areas: '',
    client_signatory: '',
    handover_date: new Date().toISOString().split('T')[0],
    client_acknowledgment: false,
    project_signoff: false,
    followup_date: '',
    followup_method: ''
  }
})
</script>
