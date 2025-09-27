<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Task Assignment & Prioritization
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Review recommendations and assign priorities to departmental tasks
          </p>
        </div>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
        <!-- Recommendations Section -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <div class="flex items-center space-x-3 mb-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">AI Recommendations</h3>
              <p class="text-xs text-blue-600 dark:text-blue-400">Based on enquiry type and requirements</p>
            </div>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex items-start space-x-2">
              <span class="text-blue-500 mt-0.5">•</span>
              <span class="text-blue-700 dark:text-blue-300">{{ getPriorityRecommendation() }}</span>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-blue-500 mt-0.5">•</span>
              <span class="text-blue-700 dark:text-blue-300">{{ getTimelineRecommendation() }}</span>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-blue-500 mt-0.5">•</span>
              <span class="text-blue-700 dark:text-blue-300">{{ getAssignmentRecommendation() }}</span>
            </div>
          </div>
        </div>

        <!-- Task Assignment Form -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Task Priorities & Assignments</h3>

          <div class="space-y-4">
            <div v-for="task in tasks" :key="task.id" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ task.task_name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ task.task_description }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="getPriorityBadgeClass(task.priority)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ task.priority }}
                  </span>
                  <span :class="getStatusBadgeClass(task.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ task.status.replace('_', ' ') }}
                  </span>
                </div>
              </div>

              <!-- Priority, Due Date, and User Assignment -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Set Priority
                  </label>
                  <select
                    v-model="task.priority"
                    @change="updateTaskPriority(task)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Priority</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    v-model="task.due_date"
                    @change="updateTaskDueDate(task)"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assign to User
                  </label>
                  <select
                    v-model="task.assigned_user_id"
                    @change="updateTaskAssignment(task)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select User</option>
                    <option
                      v-for="user in getDepartmentalUsers(task)"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.name }} ({{ user.role }})
                    </option>
                  </select>
                </div>
              </div>

              <!-- Assignment Recommendation -->
              <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div class="flex items-start space-x-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Recommended Assignment</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ getTaskAssignmentRecommendation(task) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">Assignment Summary</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div class="text-center">
              <div class="text-lg font-semibold text-red-600 dark:text-red-400">{{ getPriorityCount('urgent') }}</div>
              <div class="text-gray-600 dark:text-gray-400">Urgent</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-orange-600 dark:text-orange-400">{{ getPriorityCount('high') }}</div>
              <div class="text-gray-600 dark:text-gray-400">High</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{{ getPriorityCount('medium') }}</div>
              <div class="text-gray-600 dark:text-gray-400">Medium</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-green-600 dark:text-green-400">{{ getPriorityCount('low') }}</div>
              <div class="text-gray-600 dark:text-gray-400">Low</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          @click="closeModal"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="saveAssignments"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Assignments
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DepartmentalTask } from '../types'

// Props
interface Props {
  isVisible: boolean
  tasks: DepartmentalTask[]
  enquiry?: Record<string, unknown>
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  save: [tasks: DepartmentalTask[]]
}>()

// Local state
const localTasks = ref<DepartmentalTask[]>([])

// Watch for prop changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    // Create a deep copy of tasks for local editing
    localTasks.value = JSON.parse(JSON.stringify(props.tasks))
  }
})

watch(() => props.tasks, (newTasks) => {
  if (props.isVisible) {
    localTasks.value = JSON.parse(JSON.stringify(newTasks))
  }
}, { deep: true })

// Methods
const closeModal = () => {
  emit('close')
}

const updateTaskPriority = (task: DepartmentalTask) => {
  // Update local task priority
  const index = localTasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    localTasks.value[index].priority = task.priority
  }
}

const updateTaskDueDate = (task: DepartmentalTask) => {
  // Update local task due date
  const index = localTasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    localTasks.value[index].due_date = task.due_date
  }
}

const updateTaskAssignment = (task: DepartmentalTask) => {
  // Update local task assignment
  const index = localTasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    localTasks.value[index].assigned_user_id = task.assigned_user_id
    // Also update the assigned_user object for display
    const user = getDepartmentalUsers(task).find(u => u.id === task.assigned_user_id)
    localTasks.value[index].assigned_user = user || undefined
  }
}

const saveAssignments = () => {
  emit('save', localTasks.value)
  closeModal()
}

// Recommendation methods
const getPriorityRecommendation = (): string => {
  const enquiry = props.enquiry
  if (!enquiry) return "Set priorities based on project timeline and complexity"

  // Logic based on enquiry type and status
  if (enquiry.status === 'new') {
    return "Start with site survey (high priority) to gather essential information"
  } else if (enquiry.status === 'site_survey_completed') {
    return "Prioritize material specifications next, followed by budget preparation"
  } else {
    return "Focus on completing remaining tasks in logical sequence"
  }
}

const getTimelineRecommendation = (): string => {
  return "Site survey: 3-5 days, Material specs: 5-7 days, Budget: 2-3 days from completion"
}

const getAssignmentRecommendation = (): string => {
  return "Assign survey to project officers, materials to creatives/design, budget to finance"
}

const getTaskAssignmentRecommendation = (task: DepartmentalTask): string => {
  switch (task.task_name) {
    case 'Conduct Site Survey':
      return "Best assigned to: Project Officer or Survey Coordinator"
    case 'Design Assets and Material Specification':
      return "Best assigned to: Creative Designer or Design Officer"
    case 'Prepare Budget & Costing':
      return "Best assigned to: Finance Officer or Project Lead"
    default:
      return "Assign based on department expertise"
  }
}

// Computed helpers
const getPriorityCount = (priority: string) => {
  return localTasks.value.filter(task => task.priority === priority).length
}

const getPriorityBadgeClass = (priority: string) => {
  const classes: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[priority] || classes.medium
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[status] || classes.pending
}

const getDepartmentalUsers = (task: DepartmentalTask) => {
  // Mock departmental users - in a real app, this would fetch from API
  const departmentUsers: Record<string, Array<{id: number, name: string, email: string, role: string}>> = {
    'projects': [
      { id: 1, name: 'John Smith', email: 'john.smith@company.com', role: 'Project Officer' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Survey Coordinator' },
      { id: 3, name: 'Mike Davis', email: 'mike.davis@company.com', role: 'Project Lead' }
    ],
    'creatives': [
      { id: 4, name: 'Emily Chen', email: 'emily.chen@company.com', role: 'Creative Designer' },
      { id: 5, name: 'David Wilson', email: 'david.wilson@company.com', role: 'Design Officer' },
      { id: 6, name: 'Lisa Brown', email: 'lisa.brown@company.com', role: 'Art Director' }
    ],
    'finance': [
      { id: 7, name: 'Robert Taylor', email: 'robert.taylor@company.com', role: 'Finance Officer' },
      { id: 8, name: 'Anna Martinez', email: 'anna.martinez@company.com', role: 'Cost Analyst' }
    ]
  }

  // Determine department based on task
  let department = 'projects' // default
  if (task.task_name === 'Design Assets and Material Specification') {
    department = 'creatives'
  } else if (task.task_name === 'Prepare Budget & Costing') {
    department = 'finance'
  }

  return departmentUsers[department] || departmentUsers.projects
}
</script>
