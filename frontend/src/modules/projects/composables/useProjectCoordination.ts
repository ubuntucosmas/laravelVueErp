import { ref, computed } from 'vue'
import type { ProjectEnquiry, EnquiryTask } from '../types/enquiry'
import api from '@/plugins/axios'
import { useAuth } from '@/composables/useAuth'

const departmentEnquiries = ref<ProjectEnquiry[]>([])
const departmentTasks = ref<EnquiryTask[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useProjectCoordination() {
  const { user } = useAuth()

  const fetchDepartmentEnquiries = async () => {
    if (!user.value?.department_id) return

    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/projects/enquiries', {
        params: {
          department_id: user.value.department_id,
          has_pending_tasks: true
        }
      })
      const apiEnquiries = response.data.data.data || []
      departmentEnquiries.value = apiEnquiries
    } catch (err) {
      error.value = 'Failed to fetch department enquiries'
      console.error('Error fetching department enquiries:', err)
      departmentEnquiries.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchDepartmentTasks = async () => {
    if (!user.value?.department_id) return

    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/projects/tasks', {
        params: {
          department_id: user.value.department_id,
          status: ['pending', 'in_progress']
        }
      })
      const apiTasks = response.data.data.data || []
      departmentTasks.value = apiTasks
    } catch (err) {
      error.value = 'Failed to fetch department tasks'
      console.error('Error fetching department tasks:', err)
      departmentTasks.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchCoordinationData = async () => {
    await Promise.all([
      fetchDepartmentEnquiries(),
      fetchDepartmentTasks()
    ])
  }

  const updateTaskStatus = async (taskId: number, status: EnquiryTask['status']) => {
    try {
      await api.put(`/api/projects/tasks/${taskId}/status`, { status })
      // Update local state
      const task = departmentTasks.value.find(t => t.id === taskId)
      if (task) {
        task.status = status
      }
      // Refresh data to ensure consistency (task completion may create new tasks and update enquiry status)
      await fetchCoordinationData()
    } catch (err) {
      error.value = 'Failed to update task status'
      throw err
    }
  }

  const enquiriesWithPendingTasks = computed(() =>
    departmentEnquiries.value.filter(enquiry =>
      enquiry.enquiryTasks?.some(task => task.status === 'pending' || task.status === 'in_progress')
    )
  )

  const pendingTasks = computed(() =>
    departmentTasks.value.filter(task => task.status === 'pending')
  )

  const inProgressTasks = computed(() =>
    departmentTasks.value.filter(task => task.status === 'in_progress')
  )

  return {
    departmentEnquiries,
    departmentTasks,
    loading,
    error,
    fetchDepartmentEnquiries,
    fetchDepartmentTasks,
    fetchCoordinationData,
    updateTaskStatus,
    enquiriesWithPendingTasks,
    pendingTasks,
    inProgressTasks
  }
}
