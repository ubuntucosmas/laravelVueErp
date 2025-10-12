import { ref, computed } from 'vue'
import type { Project, CreateProjectData, UpdateProjectData } from '../types/project'
import api from '@/plugins/axios'

const projects = ref<Project[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useProjects() {
  const fetchProjects = async (filters?: {
    search?: string;
    status?: string;
    client_id?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/projects', { params: filters })
      let apiProjects = response.data.data

      // Handle pagination - if it's a paginated response, get the data array
      if (apiProjects && typeof apiProjects === 'object' && 'data' in apiProjects) {
        apiProjects = apiProjects.data
      }

      projects.value = apiProjects || []
    } catch (err) {
      error.value = 'Failed to fetch projects'
      console.error('Error fetching projects:', err)
      projects.value = []
    } finally {
      loading.value = false
    }
  }

  const getProject = (id: number): Project | undefined => {
    return projects.value.find((project) => project.id === id)
  }

  const fetchProject = async (id: number): Promise<Project> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/projects/${id}`)
      return response.data.data
    } catch (err) {
      error.value = 'Failed to fetch project'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProject = async (data: CreateProjectData): Promise<Project> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/projects', data)
      const newProject = response.data.data

      projects.value.push(newProject)

      return newProject
    } catch (err) {
      error.value = 'Failed to create project'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id: number, data: UpdateProjectData): Promise<Project> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/projects/${id}`, data)
      const updatedProject = response.data.data

      const index = projects.value.findIndex(project => project.id === id)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }

      return updatedProject
    } catch (err) {
      error.value = 'Failed to update project'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/api/projects/${id}`)

      const index = projects.value.findIndex(project => project.id === id)
      if (index !== -1) {
        projects.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Failed to delete project'
      throw err
    } finally {
      loading.value = false
    }
  }

  const assignUsersToProject = async (projectId: number, userIds: number[]): Promise<Project> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/api/projects/${projectId}/assign-users`, { user_ids: userIds })
      const updatedProject = response.data.data

      const index = projects.value.findIndex(project => project.id === projectId)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }

      return updatedProject
    } catch (err) {
      error.value = 'Failed to assign users to project'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProjectPhase = async (projectId: number, phase: number): Promise<Project> => {
    return updateProject(projectId, { current_phase: phase })
  }

  const completeProject = async (projectId: number): Promise<Project> => {
    return updateProject(projectId, { status: 'completed', end_date: new Date().toISOString().split('T')[0] })
  }

  const activeProjects = computed(() => projects.value.filter(project => project.status === 'in_progress'))
  const completedProjects = computed(() => projects.value.filter(project => project.status === 'completed'))
  const planningProjects = computed(() => projects.value.filter(project => project.status === 'planning'))
  const totalProjects = computed(() => projects.value.length)

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    assignUsersToProject,
    updateProjectPhase,
    completeProject,
    activeProjects,
    completedProjects,
    planningProjects,
    totalProjects
  }
}
