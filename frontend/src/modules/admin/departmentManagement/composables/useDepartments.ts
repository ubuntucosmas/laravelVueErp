import { ref, readonly } from 'vue'
import type { Department, DepartmentFilters, CreateDepartmentData, UpdateDepartmentData } from '../types/department'
import { useApi } from '../../shared/composables/useApi'

export function useDepartments() {
  const departments = ref<Department[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { get, post, put, delete: deleteApi } = useApi()

  const fetchDepartments = async (filters?: DepartmentFilters) => {
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const params: Record<string, string | number | boolean | undefined> = {}
      if (filters?.search) params.search = filters.search
      if (filters?.has_manager !== undefined) params.has_manager = filters.has_manager
      if (filters?.page) params.page = filters.page
      // If no per_page specified, fetch all departments (up to 1000)
      if (filters?.per_page) {
        params.per_page = filters.per_page
      } else {
        params.per_page = 1000 // Large number to get all departments
      }

      const response = await get<Department[]>('/api/hr/departments', params)
      departments.value = response.data || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch departments'
      console.error('Error fetching departments:', err)
    } finally {
      loading.value = false
    }
  }

  const createDepartment = async (departmentData: CreateDepartmentData) => {
    loading.value = true
    error.value = null
    try {
      const response = await post('/api/hr/departments', departmentData as unknown as Record<string, unknown>)
      const newDepartment = response.data as Department
      departments.value = [newDepartment, ...departments.value]
      return newDepartment
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create department'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDepartment = async (id: number, departmentData: UpdateDepartmentData) => {
    loading.value = true
    error.value = null
    try {
      const response = await put(`/api/hr/departments/${id}`, departmentData as unknown as Record<string, unknown>)
      const updatedDepartment = response.data as Department
      const index = departments.value.findIndex(d => d.id === id)
      if (index !== -1) {
        departments.value[index] = updatedDepartment
      }
      return updatedDepartment
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update department'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDepartment = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await deleteApi(`/api/hr/departments/${id}`)
      departments.value = departments.value.filter(d => d.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete department'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    departments: readonly(departments),
    loading: readonly(loading),
    error: readonly(error),
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
  }
}