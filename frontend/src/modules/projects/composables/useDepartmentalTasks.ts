import { ref, computed, reactive, readonly } from 'vue'
import type {
  DepartmentalTask,
  ProjectPhaseEntity,
  TaskFilters,
  TaskSorting,
  CreateDepartmentalTaskData,
  UpdateDepartmentalTaskData,
  TaskActionRequest,
  TaskActionResponse,
  DepartmentalTaskStats,
  TaskUpdateMessage
} from '../types'
import { useApi } from '../../admin/shared/composables/useApi'

export function useDepartmentalTasks(projectId?: number, phaseId?: number) {
  const { get, post, put, delete: deleteRequest } = useApi()

  // State
  const tasks = ref<DepartmentalTask[]>([])
  const currentProjectPhase = ref<ProjectPhaseEntity | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = reactive<TaskFilters>({})
  const sorting = reactive<TaskSorting>({
    field: 'due_date',
    direction: 'asc'
  })

  // Computed
  const filteredTasks = computed(() => {
    let filtered = [...tasks.value]

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status!.includes(task.status))
    }

    // Apply priority filter
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority!.includes(task.priority))
    }

    // Apply assignment filter
    if (filters.assignment) {
      const currentUserId = getCurrentUserId()
      switch (filters.assignment) {
        case 'assigned_to_me':
          filtered = filtered.filter(task => task.assigned_user_id === currentUserId)
          break
        case 'unassigned':
          filtered = filtered.filter(task => !task.assigned_user_id)
          break
        case 'assigned_to_others':
          filtered = filtered.filter(task => task.assigned_user_id && task.assigned_user_id !== currentUserId)
          break
      }
    }

    // Apply due date filter
    if (filters.dueDate && filters.dueDate !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const weekFromNow = new Date(today)
      weekFromNow.setDate(weekFromNow.getDate() + 7)
      const monthFromNow = new Date(today)
      monthFromNow.setMonth(monthFromNow.getMonth() + 1)

      filtered = filtered.filter(task => {
        if (!task.due_date) return false
        const dueDate = new Date(task.due_date)

        switch (filters.dueDate) {
          case 'overdue':
            return dueDate < today
          case 'due_today':
            return dueDate >= today && dueDate < tomorrow
          case 'due_this_week':
            return dueDate >= today && dueDate <= weekFromNow
          case 'due_this_month':
            return dueDate >= today && dueDate <= monthFromNow
          default:
            return true
        }
      })
    }

    // Apply project phase filter
    if (filters.projectPhase === 'current' && currentProjectPhase.value) {
      filtered = filtered.filter(task => task.project_phase_id === currentProjectPhase.value!.id)
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(task =>
        task.task_name.toLowerCase().includes(searchTerm) ||
        task.task_description?.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sorting.field) {
        case 'due_date':
          aValue = a.due_date ? new Date(a.due_date).getTime() : Infinity
          bValue = b.due_date ? new Date(b.due_date).getTime() : Infinity
          break
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        case 'task_name':
          aValue = a.task_name.toLowerCase()
          bValue = b.task_name.toLowerCase()
          break
        default:
          return 0
      }

      if (sorting.direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    return filtered
  })

  const taskStats = computed((): DepartmentalTaskStats => {
    const total = tasks.value.length
    const completed = tasks.value.filter(t => t.status === 'completed').length
    const inProgress = tasks.value.filter(t => t.status === 'in_progress').length
    const pending = tasks.value.filter(t => t.status === 'pending').length
    const overdue = tasks.value.filter(t => {
      if (!t.due_date || t.status === 'completed') return false
      return new Date(t.due_date) < new Date()
    }).length

    // Group by department
    const departmentMap = new Map<number, { name: string; tasks: DepartmentalTask[] }>()
    tasks.value.forEach(task => {
      if (task.department) {
        const dept = departmentMap.get(task.department.id) || { name: task.department.name, tasks: [] }
        dept.tasks.push(task)
        departmentMap.set(task.department.id, dept)
      }
    })

    const departmentBreakdown = Array.from(departmentMap.entries()).map(([id, dept]) => ({
      department_id: id,
      department_name: dept.name,
      task_count: dept.tasks.length,
      completed_count: dept.tasks.filter(t => t.status === 'completed').length,
      completion_rate: dept.tasks.length > 0 ? Math.round((dept.tasks.filter(t => t.status === 'completed').length / dept.tasks.length) * 100) : 0
    }))

    return {
      total_tasks: total,
      completed_tasks: completed,
      in_progress_tasks: inProgress,
      pending_tasks: pending,
      overdue_tasks: overdue,
      completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      average_completion_time: 0, // TODO: Calculate from actual vs estimated hours
      department_breakdown: departmentBreakdown
    }
  })

  // Methods
  const fetchTasks = async (projectPhaseId?: number) => {
    try {
      loading.value = true
      error.value = null

      const params = new URLSearchParams()
      if (projectId) params.append('project_id', projectId.toString())
      if (phaseId) params.append('phase_id', phaseId.toString())
      if (projectPhaseId) params.append('project_phase_id', projectPhaseId.toString())

      const response = await get<DepartmentalTask[]>(`/api/departmental-tasks`, { project_id: projectId, phase_id: phaseId, project_phase_id: projectPhaseId })
      tasks.value = response.data || []

      // Update current project phase if we have tasks
      if (tasks.value.length > 0 && tasks.value[0].project_phase) {
        currentProjectPhase.value = tasks.value[0].project_phase
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      console.error('Error fetching departmental tasks:', err)
    } finally {
      loading.value = false
    }
  }

  const createTask = async (data: CreateDepartmentalTaskData): Promise<DepartmentalTask> => {
    try {
      const response = await post<DepartmentalTask>('/api/departmental-tasks', data as unknown as Record<string, unknown>)
      const newTask = response.data
      tasks.value.push(newTask)
      return newTask
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } }
      error.value = apiError.response?.data?.message || 'Failed to create task'
      throw err
    }
  }

  const updateTask = async (taskId: number, data: UpdateDepartmentalTaskData): Promise<DepartmentalTask> => {
    try {
      const response = await put<DepartmentalTask>(`/api/departmental-tasks/${taskId}`, data as Record<string, unknown>)
      const updatedTask = response.data

      // Update in local state
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }

      return updatedTask
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } }
      error.value = apiError.response?.data?.message || 'Failed to update task'
      throw err
    }
  }

  const deleteTask = async (taskId: number): Promise<void> => {
    try {
      await deleteRequest(`/api/departmental-tasks/${taskId}`)
      tasks.value = tasks.value.filter(t => t.id !== taskId)
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } }
      error.value = apiError.response?.data?.message || 'Failed to delete task'
      throw err
    }
  }

  const performTaskAction = async (request: TaskActionRequest): Promise<TaskActionResponse> => {
    try {
      const response = await post<TaskActionResponse>(`/api/departmental-tasks/${request.task_id}/action`, request as unknown as Record<string, unknown>)
      const result = response.data

      // Update local task state
      if (result.task) {
        const index = tasks.value.findIndex(t => t.id === request.task_id)
        if (index !== -1) {
          tasks.value[index] = result.task
        }
      }

      return result
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } }
      error.value = apiError.response?.data?.message || 'Failed to perform task action'
      throw err
    }
  }

  const claimTask = async (taskId: number): Promise<TaskActionResponse> => {
    return performTaskAction({ task_id: taskId, action: 'claim' })
  }

  const startTask = async (taskId: number): Promise<TaskActionResponse> => {
    return performTaskAction({ task_id: taskId, action: 'start' })
  }

  const completeTask = async (taskId: number, actualHours?: number, notes?: string): Promise<TaskActionResponse> => {
    return performTaskAction({
      task_id: taskId,
      action: 'complete',
      actual_hours: actualHours,
      notes
    })
  }

  const submitTask = async (taskId: number, notes?: string): Promise<TaskActionResponse> => {
    return performTaskAction({
      task_id: taskId,
      action: 'submit',
      notes
    })
  }

  const getTaskById = (taskId: number): DepartmentalTask | undefined => {
    return tasks.value.find(t => t.id === taskId)
  }

  const setFilters = (newFilters: Partial<TaskFilters>) => {
    Object.assign(filters, newFilters)
  }

  const setSorting = (newSorting: Partial<TaskSorting>) => {
    Object.assign(sorting, newSorting)
  }

  const clearFilters = () => {
    Object.keys(filters).forEach(key => {
      delete (filters as Record<string, unknown>)[key]
    })
  }

  const refreshTasks = () => {
    const projectPhaseId = currentProjectPhase.value?.id
    return fetchTasks(projectPhaseId)
  }

  // Real-time updates (placeholder for WebSocket integration)
  const setupRealTimeUpdates = () => {
    // TODO: Implement WebSocket connection for real-time updates
    console.log('Setting up real-time updates for departmental tasks')
  }

  const handleTaskUpdate = (message: TaskUpdateMessage) => {
    switch (message.type) {
      case 'task_updated':
      case 'task_created':
        if (message.task) {
          const existingIndex = tasks.value.findIndex(t => t.id === message.task!.id)
          if (existingIndex !== -1) {
            tasks.value[existingIndex] = message.task
          } else {
            tasks.value.push(message.task)
          }
        }
        break
      case 'task_deleted':
        if (message.task) {
          tasks.value = tasks.value.filter(t => t.id !== message.task!.id)
        }
        break
      case 'phase_updated':
        if (message.project_phase) {
          currentProjectPhase.value = message.project_phase
        }
        break
    }
  }

  // Utility functions
  const getCurrentUserId = (): number => {
    // TODO: Get from auth store/context
    return 1 // Placeholder
  }

  const canPerformAction = (task: DepartmentalTask, action: string): boolean => {
    const currentUserId = getCurrentUserId()

    switch (action) {
      case 'claim':
        return !task.assigned_user_id && task.status === 'pending'
      case 'start':
        return task.assigned_user_id === currentUserId && task.status === 'pending'
      case 'complete':
        return task.assigned_user_id === currentUserId && task.status === 'in_progress'
      case 'submit':
        return task.assigned_user_id === currentUserId && task.status === 'completed'
      case 'edit':
        return task.assigned_user_id === currentUserId || hasPermission('departmental_tasks.manage')
      case 'delete':
        return hasPermission('departmental_tasks.manage')
      default:
        return false
    }
  }

  const hasPermission = (_permission: string): boolean => {
    // TODO: Check user permissions
    // console.log('Checking permission:', _permission)
    return true // Placeholder
  }

  // Initialize
  if (projectId || phaseId) {
    fetchTasks()
  }

  return {
    // State
    tasks: readonly(tasks),
    currentProjectPhase: readonly(currentProjectPhase),
    loading: readonly(loading),
    error: readonly(error),
    filters: readonly(filters),
    sorting: readonly(sorting),

    // Computed
    filteredTasks,
    taskStats,

    // Methods
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    performTaskAction,
    claimTask,
    startTask,
    completeTask,
    submitTask,
    getTaskById,
    setFilters,
    setSorting,
    clearFilters,
    refreshTasks,
    setupRealTimeUpdates,
    handleTaskUpdate,
    canPerformAction
  }
}
