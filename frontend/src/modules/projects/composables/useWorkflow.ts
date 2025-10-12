import { ref, computed } from 'vue'
import type {
  WorkflowTemplate,
  WorkflowInstance,
  WorkflowTask,
  CreateWorkflowTemplateData,
  CreateWorkflowInstanceData,
  UpdateWorkflowInstanceData,
  CreateWorkflowTaskData,
  UpdateWorkflowTaskData
} from '../types/workflow'
import api from '@/plugins/axios'

const workflowTemplates = ref<WorkflowTemplate[]>([])
const workflowInstances = ref<WorkflowInstance[]>([])
const workflowTasks = ref<WorkflowTask[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useWorkflow() {
  // Workflow Templates
  const fetchWorkflowTemplates = async (filters?: { type?: string; is_active?: boolean }) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/workflow-templates', { params: filters })
      workflowTemplates.value = response.data.data || []
      return workflowTemplates.value
    } catch (err) {
      error.value = 'Failed to fetch workflow templates'
      console.error('Error fetching workflow templates:', err)
      workflowTemplates.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const getWorkflowTemplate = (id: number): WorkflowTemplate | undefined => {
    return workflowTemplates.value.find(template => template.id === id)
  }

  const createWorkflowTemplate = async (data: CreateWorkflowTemplateData): Promise<WorkflowTemplate> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/workflow-templates', data)
      const newTemplate = response.data.data
      workflowTemplates.value.push(newTemplate)
      return newTemplate
    } catch (err) {
      error.value = 'Failed to create workflow template'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWorkflowTemplate = async (id: number, data: Partial<CreateWorkflowTemplateData>): Promise<WorkflowTemplate> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/workflow-templates/${id}`, data)
      const updatedTemplate = response.data.data

      const index = workflowTemplates.value.findIndex(template => template.id === id)
      if (index !== -1) {
        workflowTemplates.value[index] = updatedTemplate
      }

      return updatedTemplate
    } catch (err) {
      error.value = 'Failed to update workflow template'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteWorkflowTemplate = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/api/workflow-templates/${id}`)

      const index = workflowTemplates.value.findIndex(template => template.id === id)
      if (index !== -1) {
        workflowTemplates.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Failed to delete workflow template'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Workflow Instances
  const fetchWorkflowInstances = async (filters?: { entity_type?: string; entity_id?: number; status?: string }) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/workflow-instances', { params: filters })
      workflowInstances.value = response.data.data || []
      return workflowInstances.value
    } catch (err) {
      error.value = 'Failed to fetch workflow instances'
      console.error('Error fetching workflow instances:', err)
      workflowInstances.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const getWorkflowInstance = (id: number): WorkflowInstance | undefined => {
    return workflowInstances.value.find(instance => instance.id === id)
  }

  const createWorkflowInstance = async (data: CreateWorkflowInstanceData): Promise<WorkflowInstance> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/workflow-instances', data)
      const newInstance = response.data.data
      workflowInstances.value.push(newInstance)
      return newInstance
    } catch (err) {
      error.value = 'Failed to create workflow instance'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWorkflowInstance = async (id: number, data: UpdateWorkflowInstanceData): Promise<WorkflowInstance> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/workflow-instances/${id}`, data)
      const updatedInstance = response.data.data

      const index = workflowInstances.value.findIndex(instance => instance.id === id)
      if (index !== -1) {
        workflowInstances.value[index] = updatedInstance
      }

      return updatedInstance
    } catch (err) {
      error.value = 'Failed to update workflow instance'
      throw err
    } finally {
      loading.value = false
    }
  }

  const startWorkflowInstance = async (id: number): Promise<WorkflowInstance> => {
    return updateWorkflowInstance(id, { status: 'in_progress', started_at: new Date().toISOString() })
  }

  const completeWorkflowInstance = async (id: number): Promise<WorkflowInstance> => {
    return updateWorkflowInstance(id, { status: 'completed', completed_at: new Date().toISOString() })
  }

  // Workflow Tasks
  const fetchWorkflowTasks = async (instanceId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/workflow-instances/${instanceId}/tasks`)
      workflowTasks.value = response.data.data || []
      return workflowTasks.value
    } catch (err) {
      error.value = 'Failed to fetch workflow tasks'
      console.error('Error fetching workflow tasks:', err)
      workflowTasks.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const getWorkflowTask = (id: number): WorkflowTask | undefined => {
    return workflowTasks.value.find(task => task.id === id)
  }

  const createWorkflowTask = async (data: CreateWorkflowTaskData): Promise<WorkflowTask> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/workflow-tasks', data)
      const newTask = response.data.data
      workflowTasks.value.push(newTask)
      return newTask
    } catch (err) {
      error.value = 'Failed to create workflow task'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWorkflowTask = async (id: number, data: UpdateWorkflowTaskData): Promise<WorkflowTask> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/workflow-tasks/${id}`, data)
      const updatedTask = response.data.data

      const index = workflowTasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        workflowTasks.value[index] = updatedTask
      }

      return updatedTask
    } catch (err) {
      error.value = 'Failed to update workflow task'
      throw err
    } finally {
      loading.value = false
    }
  }

  const assignWorkflowTask = async (taskId: number, userId: number): Promise<WorkflowTask> => {
    return updateWorkflowTask(taskId, { assigned_user_id: userId })
  }

  const startWorkflowTask = async (taskId: number): Promise<WorkflowTask> => {
    return updateWorkflowTask(taskId, { status: 'in_progress', started_at: new Date().toISOString() })
  }

  const completeWorkflowTask = async (taskId: number): Promise<WorkflowTask> => {
    return updateWorkflowTask(taskId, { status: 'completed', completed_at: new Date().toISOString() })
  }

  // Computed properties
  const activeWorkflowTemplates = computed(() =>
    workflowTemplates.value.filter(template => template.is_active)
  )

  const pendingWorkflowInstances = computed(() =>
    workflowInstances.value.filter(instance => instance.status === 'pending')
  )

  const inProgressWorkflowInstances = computed(() =>
    workflowInstances.value.filter(instance => instance.status === 'in_progress')
  )

  const completedWorkflowInstances = computed(() =>
    workflowInstances.value.filter(instance => instance.status === 'completed')
  )

  const pendingWorkflowTasks = computed(() =>
    workflowTasks.value.filter(task => task.status === 'pending')
  )

  const inProgressWorkflowTasks = computed(() =>
    workflowTasks.value.filter(task => task.status === 'in_progress')
  )

  const completedWorkflowTasks = computed(() =>
    workflowTasks.value.filter(task => task.status === 'completed')
  )

  return {
    // State
    workflowTemplates,
    workflowInstances,
    workflowTasks,
    loading,
    error,

    // Workflow Templates
    fetchWorkflowTemplates,
    getWorkflowTemplate,
    createWorkflowTemplate,
    updateWorkflowTemplate,
    deleteWorkflowTemplate,
    activeWorkflowTemplates,

    // Workflow Instances
    fetchWorkflowInstances,
    getWorkflowInstance,
    createWorkflowInstance,
    updateWorkflowInstance,
    startWorkflowInstance,
    completeWorkflowInstance,
    pendingWorkflowInstances,
    inProgressWorkflowInstances,
    completedWorkflowInstances,

    // Workflow Tasks
    fetchWorkflowTasks,
    getWorkflowTask,
    createWorkflowTask,
    updateWorkflowTask,
    assignWorkflowTask,
    startWorkflowTask,
    completeWorkflowTask,
    pendingWorkflowTasks,
    inProgressWorkflowTasks,
    completedWorkflowTasks
  }
}
