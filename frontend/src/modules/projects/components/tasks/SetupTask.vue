<template>
  <div class="setup-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
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
      <!-- Event Details -->
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 class="text-md font-medium mb-2 text-gray-900 dark:text-white">Event Setup Details</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Event Date:</strong> {{ eventDetails.event_date }}</div>
          <div><strong>Venue:</strong> {{ eventDetails.venue }}</div>
          <div><strong>Setup Start:</strong> {{ eventDetails.setup_start_time }}</div>
          <div><strong>Event Start:</strong> {{ eventDetails.event_start_time }}</div>
        </div>
      </div>
    </div>

    <!-- Checklist Tab -->
    <div v-if="activeTab === 'checklist'">
      <!-- Setup Checklist -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Setup Checklist</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in setupChecklist" :key="item.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.category }}</span>
              <span :class="getChecklistStatusClass(item.status)" class="px-2 py-1 text-xs rounded-full">
                {{ item.status }}
              </span>
            </div>

            <div class="space-y-2">
              <div v-for="subItem in item.items" :key="subItem.id" class="flex items-center">
                <input
                  :id="`check-${item.id}-${subItem.id}`"
                  v-model="subItem.completed"
                  type="checkbox"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label :for="`check-${item.id}-${subItem.id}`" class="ml-2 block text-sm text-gray-900 dark:text-white">
                  {{ subItem.label }}
                </label>
              </div>
            </div>

            <select
              v-model="item.status"
              class="mt-2 w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline Tab -->
    <div v-if="activeTab === 'timeline'">
      <!-- Timeline Scheduler -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Setup Timeline</h4>

        <div class="space-y-3">
          <div v-for="slot in timelineSlots" :key="slot.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <input
                  :id="`timeline-${slot.id}`"
                  v-model="slot.completed"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label :for="`timeline-${slot.id}`" class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                  {{ slot.time }} - {{ slot.activity }}
                </label>
              </div>
              <span class="text-sm text-gray-500">{{ slot.assigned_to }}</span>
            </div>

            <div class="mt-2">
              <label class="block text-xs text-gray-600 dark:text-gray-400">Notes</label>
              <textarea
                v-model="slot.notes"
                rows="2"
                class="mt-1 block w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Setup notes..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Tab -->
    <div v-if="activeTab === 'team'">
      <!-- Team Assignments & Safety -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Team Assignments</h4>

          <div class="space-y-3">
            <div v-for="member in setupTeam" :key="member.id" class="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-600 rounded">
              <div class="flex items-center">
                <input
                  :id="`team-${member.id}`"
                  v-model="member.present"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label :for="`team-${member.id}`" class="ml-2 text-sm text-gray-900 dark:text-white">
                  {{ member.name }}
                </label>
              </div>
              <span class="text-xs text-gray-500">{{ member.role }}</span>
            </div>
          </div>

          <button
            @click="addTeamMember"
            class="mt-3 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Team Member
          </button>
        </div>

        <div>
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Safety & Contingency</h4>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weather Conditions</label>
              <select
                v-model="setupData.weather_condition"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="clear">Clear</option>
                <option value="cloudy">Cloudy</option>
                <option value="rain">Rain</option>
                <option value="windy">Windy</option>
                <option value="storm">Storm</option>
              </select>
            </div>

            <div class="flex items-center">
              <input
                id="contingency_plan"
                v-model="setupData.contingency_plan_activated"
                type="checkbox"
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label for="contingency_plan" class="ml-2 block text-sm text-gray-900 dark:text-white">
                Contingency plan activated
              </label>
            </div>

            <div v-if="setupData.contingency_plan_activated">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contingency Details</label>
              <textarea
                v-model="setupData.contingency_details"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Details of contingency measures..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emergency Contacts</label>
              <div class="space-y-2">
                <input
                  v-model="setupData.emergency_contact1"
                  type="text"
                  placeholder="Primary emergency contact"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  v-model="setupData.emergency_contact2"
                  type="text"
                  placeholder="Secondary emergency contact"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Documentation Tab -->
    <div v-if="activeTab === 'documentation'">
      <!-- Documentation -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Documentation & Photos</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Setup Photos</label>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Drop setup photos here or click to upload</p>
              <input type="file" multiple accept="image/*" class="hidden" />
              <button class="mt-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600">
                Upload Photos
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Setup Completion Notes</label>
            <textarea
              v-model="setupData.completion_notes"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Final setup notes, issues encountered, completion status..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Completion Tab -->
    <div v-if="activeTab === 'completion'">
      <!-- Setup Completion Sign-off -->
      <div class="mb-6 p-4 border-2 border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
        <h4 class="text-md font-medium mb-3 text-green-800 dark:text-green-200">Setup Completion Sign-off</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-green-700 dark:text-green-300">Setup Completed By</label>
            <input
              v-model="setupData.completed_by"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-green-700 dark:text-green-300">Completion Time</label>
            <input
              v-model="setupData.completion_time"
              type="datetime-local"
              class="mt-1 block w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div class="mt-4 flex items-center">
          <input
            id="setup_signoff"
            v-model="setupData.setup_signoff"
            type="checkbox"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
          />
          <label for="setup_signoff" class="ml-2 block text-sm text-green-800 dark:text-green-200">
            I confirm that setup is complete and ready for the event
          </label>
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
          Start Setup
        </button>
        <button
          v-if="task.status === 'in_progress' && setupData.setup_signoff"
          @click="updateStatus('completed')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Complete Setup
        </button>
      </div>
      <button
        @click="handleSubmit"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
      >
        Save Setup Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

interface ChecklistCategory {
  id: string
  category: string
  status: string
  items: ChecklistItem[]
}

interface TimelineSlot {
  id: string
  time: string
  activity: string
  assigned_to: string
  completed: boolean
  notes: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  present: boolean
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
  { id: 'checklist', label: 'Checklist', icon: '✅' },
  { id: 'timeline', label: 'Timeline', icon: '⏰' },
  { id: 'team', label: 'Team', icon: '👥' },
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

const eventDetails = ref({
  event_date: '2025-10-25',
  venue: 'Grand Ballroom, Nairobi',
  setup_start_time: '06:00 AM',
  event_start_time: '07:00 PM'
})

const setupChecklist = ref<ChecklistCategory[]>([
  {
    id: 'equipment',
    category: 'Equipment Setup',
    status: 'pending',
    items: [
      { id: 'led_panels', label: 'LED display panels installed', completed: false },
      { id: 'sound_system', label: 'Sound system configured', completed: false },
      { id: 'lighting', label: 'Lighting equipment positioned', completed: false },
      { id: 'power_backup', label: 'Power backup tested', completed: false }
    ]
  },
  {
    id: 'venue',
    category: 'Venue Preparation',
    status: 'pending',
    items: [
      { id: 'staging', label: 'Staging area prepared', completed: false },
      { id: 'seating', label: 'Seating arrangement completed', completed: false },
      { id: 'decor', label: 'Decorations and signage installed', completed: false },
      { id: 'access', label: 'Access routes cleared', completed: false }
    ]
  },
  {
    id: 'safety',
    category: 'Safety Checks',
    status: 'pending',
    items: [
      { id: 'fire_exits', label: 'Fire exits accessible', completed: false },
      { id: 'emergency_lights', label: 'Emergency lighting tested', completed: false },
      { id: 'first_aid', label: 'First aid kit available', completed: false },
      { id: 'crowd_control', label: 'Crowd control measures in place', completed: false }
    ]
  }
])

const timelineSlots = ref<TimelineSlot[]>([
  {
    id: '1',
    time: '6:00 AM',
    activity: 'Equipment arrival and unloading',
    assigned_to: 'Logistics Team',
    completed: false,
    notes: ''
  },
  {
    id: '2',
    time: '8:00 AM',
    activity: 'Basic setup and positioning',
    assigned_to: 'Setup Crew',
    completed: false,
    notes: ''
  },
  {
    id: '3',
    time: '12:00 PM',
    activity: 'Technical testing and calibration',
    assigned_to: 'Technical Team',
    completed: false,
    notes: ''
  },
  {
    id: '4',
    time: '4:00 PM',
    activity: 'Final checks and dress rehearsal',
    assigned_to: 'All Teams',
    completed: false,
    notes: ''
  }
])

const setupTeam = ref<TeamMember[]>([
  { id: '1', name: 'John Doe', role: 'Setup Lead', present: false },
  { id: '2', name: 'Jane Smith', role: 'Technical Support', present: false },
  { id: '3', name: 'Mike Johnson', role: 'Equipment Specialist', present: false }
])

const setupData = ref({
  weather_condition: 'clear',
  contingency_plan_activated: false,
  contingency_details: '',
  emergency_contact1: '',
  emergency_contact2: '',
  completion_notes: '',
  completed_by: '',
  completion_time: '',
  setup_signoff: false
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const getChecklistStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'bg-gray-100 text-gray-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const addTeamMember = () => {
  const newId = (setupTeam.value.length + 1).toString()
  setupTeam.value.push({
    id: newId,
    name: 'New Team Member',
    role: 'Assistant',
    present: false
  })
}

const handleSubmit = () => {
  // Here you would typically save the setup data
  console.log('Setup data:', {
    setupChecklist: setupChecklist.value,
    timelineSlots: timelineSlots.value,
    setupTeam: setupTeam.value,
    setupData: setupData.value
  })
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset data if needed
watch(() => props.task.id, () => {
  // Reset setup data for new task
  setupChecklist.value.forEach(category => {
    category.status = 'pending'
    category.items.forEach(item => item.completed = false)
  })
  timelineSlots.value.forEach(slot => {
    slot.completed = false
    slot.notes = ''
  })
  setupTeam.value.forEach(member => member.present = false)
  setupData.value = {
    weather_condition: 'clear',
    contingency_plan_activated: false,
    contingency_details: '',
    emergency_contact1: '',
    emergency_contact2: '',
    completion_notes: '',
    completed_by: '',
    completion_time: '',
    setup_signoff: false
  }
})
</script>
