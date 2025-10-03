<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Assign Tasks - {{ enquiry?.title || 'Enquiry' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading tasks...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <!-- Tasks List -->
      <div v-else>
        <div v-if="enquiryTasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          No tasks available for assignment
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="task in enquiryTasks"
            :key="task.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">{{ task.title }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ task.type }}</p>
              </div>
              <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full">
                {{ getStatusLabel(task.status) }}
              </span>
            </div>

            <!-- Assignment Form -->
            <form @submit.prevent="assignTask(task)" class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assign to User *
                </label>
                <select
                  v-model="assignmentData[task.id].assigned_user_id"
                  required
                  :disabled="loadingUsers"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  <option value="">{{ loadingUsers ? 'Loading users...' : 'Select user' }}</option>
                  <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                    {{ user.name }}{{ user.department ? ` (${user.department})` : '' }}
                  </option>
                </select>
                <div v-if="loadingUsers" class="text-xs text-gray-500 mt-1">
                  🔍 Loading available users...
                </div>
                <div v-else-if="availableUsers.length === 0" class="text-xs text-amber-600 mt-1">
                  ⚠️ No users available for assignment
                </div>
                <div v-else class="text-xs text-gray-500 mt-1">
                  👥 {{ availableUsers.length }} users available
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  v-model="assignmentData[task.id].priority"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  v-model="assignmentData[task.id].due_date"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  v-model="assignmentData[task.id].notes"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Optional notes for the assignment"
                ></textarea>
              </div>

              <div class="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  :disabled="!assignmentData[task.id].assigned_user_id || assigningTask === task.id"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="assigningTask === task.id" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  {{ assigningTask === task.id ? 'Assigning...' : 'Assign Task' }}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { EnquiryTask } from '../types/enquiry'
import { useTaskAssignment } from '../composables/useTaskAssignment'
import api from '@/plugins/axios'

interface Props {
  show: boolean
  enquiryId: number
  enquiry?: {
    id: number
    title: string
  }
}

interface AssignmentFormData {
  assigned_user_id: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string
  notes: string
}

interface User {
  id: number
  name: string
  department?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  taskAssigned: [task: EnquiryTask]
}>()

const { enquiryTasks, loading, error, fetchEnquiryTasks, assignTask: assignTaskApi } = useTaskAssignment()

const availableUsers = ref<User[]>([])
const assignmentData = reactive<Record<number, AssignmentFormData>>({})
const assigningTask = ref<number | null>(null)
const loadingUsers = ref(false)

const initializeAssignmentData = () => {
  enquiryTasks.value.forEach(task => {
    if (!assignmentData[task.id]) {
      assignmentData[task.id] = {
        assigned_user_id: 0,
        priority: task.priority || 'medium',
        due_date: task.due_date || '',
        notes: task.notes || '',
      }
    }
  })
}

const fetchAvailableUsers = async () => {
  loadingUsers.value = true
  try {
    console.log('🔍 [TaskAssignmentModal] Starting fetchAvailableUsers')
    console.log('🔍 [TaskAssignmentModal] Current auth token:', api.defaults.headers.common['Authorization'])
    console.log('🔍 [TaskAssignmentModal] API base URL:', api.defaults.baseURL)
    console.log('🔍 [TaskAssignmentModal] Fetching users from /api/users')

    const response = await api.get('/api/users')
    console.log('✅ [TaskAssignmentModal] Users response status:', response.status)
    console.log('✅ [TaskAssignmentModal] Users response headers:', response.headers)
    console.log('✅ [TaskAssignmentModal] Users response data:', JSON.stringify(response.data, null, 2))

    const users = response.data.data || []
    console.log('✅ [TaskAssignmentModal] Extracted users array:', users)
    console.log('✅ [TaskAssignmentModal] Users count:', users.length)

    // Validate user data structure
    if (users.length > 0) {
      console.log('✅ [TaskAssignmentModal] First user structure:', JSON.stringify(users[0], null, 2))
      const hasRequiredFields = users.every((user: User) => user.id && user.name)
      console.log('✅ [TaskAssignmentModal] All users have required fields (id, name):', hasRequiredFields)
    }

    availableUsers.value = users
    console.log('✅ [TaskAssignmentModal] Available users loaded:', availableUsers.value.length, 'users')
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; response?: { status?: number; data?: unknown }; config?: unknown }
    console.error('❌ [TaskAssignmentModal] Error fetching available users:', error)
    console.error('❌ [TaskAssignmentModal] Error name:', error.name)
    console.error('❌ [TaskAssignmentModal] Error message:', error.message)
    console.error('❌ [TaskAssignmentModal] Error response status:', error.response?.status)
    console.error('❌ [TaskAssignmentModal] Error response data:', JSON.stringify(error.response?.data, null, 2))
    console.error('❌ [TaskAssignmentModal] Error config:', JSON.stringify(error.config, null, 2))

    // Check for specific error types
    const status = error.response?.status
    if (status === 401) {
      console.error('❌ [TaskAssignmentModal] Authentication failed - user not logged in or token expired')
    } else if (status === 403) {
      console.error('❌ [TaskAssignmentModal] Permission denied - user lacks USER_READ or TASK_ASSIGN permissions')
    } else if (status && status >= 500) {
      console.error('❌ [TaskAssignmentModal] Server error - check backend logs')
    }

    availableUsers.value = []
  } finally {
    loadingUsers.value = false
    console.log('🔍 [TaskAssignmentModal] fetchAvailableUsers completed, loadingUsers:', loadingUsers.value)
  }
}

const assignTask = async (task: EnquiryTask) => {
  try {
    console.log('[DEBUG] TaskAssignmentModal assignTask called for task:', task.id, task.title)
    assigningTask.value = task.id
    const data = assignmentData[task.id]
    console.log('[DEBUG] TaskAssignmentModal assignment data:', data)

    const updatedTask = await assignTaskApi(task.id, {
      assigned_user_id: data.assigned_user_id,
      priority: data.priority,
      due_date: data.due_date,
      notes: data.notes,
    })

    console.log('[DEBUG] TaskAssignmentModal assignTaskApi returned:', updatedTask)
    console.log('[DEBUG] TaskAssignmentModal updatedTask assignmentHistory:', updatedTask.assignmentHistory)

    emit('taskAssigned', updatedTask)

    // Reset form
    assignmentData[task.id] = {
      assigned_user_id: 0,
      priority: 'medium',
      due_date: '',
      notes: '',
    }
    console.log('[DEBUG] TaskAssignmentModal form reset for task:', task.id)
  } catch (err) {
    console.error('[DEBUG] TaskAssignmentModal assignTask error:', err)
  } finally {
    assigningTask.value = null
    console.log('[DEBUG] TaskAssignmentModal assignTask completed for task:', task.id)
  }
}


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
  }
  return labels[status] || status
}

watch(() => props.show, async (newShow) => {
  console.log('🔍 [TaskAssignmentModal] Modal visibility changed:', newShow)
  if (newShow && props.enquiryId) {
    console.log('🔍 [TaskAssignmentModal] Fetching enquiry tasks for ID:', props.enquiryId)
    await fetchEnquiryTasks(props.enquiryId)
    initializeAssignmentData()
  }
})

onMounted(async () => {
  console.log('🔍 [TaskAssignmentModal] Component mounted, fetching available users')
  await fetchAvailableUsers()
})
</script>
