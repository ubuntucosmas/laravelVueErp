import { ref, readonly } from 'vue'
import type { Employee, EmployeeFilters, CreateEmployeeData, UpdateEmployeeData } from '../types/employee'
import { useApi } from '../../admin/shared/composables/useApi'


export function useEmployees() {
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { get, post, put, delete: deleteApi } = useApi()

  const fetchEmployees = async (filters?: EmployeeFilters) => {
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const params: Record<string, string | number | undefined> = {}
      if (filters?.search) params.search = filters.search
      if (filters?.department) params.department_id = filters.department
      if (filters?.department_id) params.department_id = filters.department_id
      if (filters?.position) params.position = filters.position
      if (filters?.status) params.status = filters.status
      if (filters?.is_active !== undefined) params.status = filters.is_active ? 'active' : 'inactive'
      if (filters?.employment_type) params.employment_type = filters.employment_type
      if (filters?.page) params.page = filters.page
      if (filters?.per_page) params.per_page = filters.per_page

      const response = await get('/api/hr/employees', params)
      const responseData = response.data

      // Handle both paginated response {data: [...], meta: ...} and direct array response [...]
      if (Array.isArray(responseData)) {
        // Direct array response
        employees.value = responseData as Employee[]
      } else if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray((responseData as {data: unknown[]}).data)) {
        // Paginated response
        employees.value = (responseData as {data: Employee[]}).data || []
      } else {
        employees.value = []
      }
    } catch (err) {
      error.value = 'Failed to fetch employees'
      console.error('Error fetching employees:', err)
    } finally {
      loading.value = false
    }
  }

  const createEmployee = async (employeeData: CreateEmployeeData) => {
    loading.value = true
    error.value = null
    try {
      const response = await post('/api/hr/employees', employeeData as unknown as Record<string, unknown>)
      const responseData = response.data

      // Handle both direct object response and wrapped response
      const newEmployee = (responseData && typeof responseData === 'object' && 'data' in responseData)
        ? (responseData as {data: Employee}).data
        : responseData as Employee
      employees.value = [newEmployee, ...employees.value]
      return newEmployee
    } catch (err) {
      error.value = 'Failed to create employee'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateEmployee = async (id: number, employeeData: UpdateEmployeeData) => {
    loading.value = true
    error.value = null
    try {
      const response = await put(`/api/hr/employees/${id}`, employeeData as unknown as Record<string, unknown>)
      const responseData = response.data

      // Handle both direct object response and wrapped response
      const updatedEmployee = (responseData && typeof responseData === 'object' && 'data' in responseData)
        ? (responseData as {data: Employee}).data
        : responseData as Employee
      const index = employees.value.findIndex(e => e.id === id)
      if (index !== -1) {
        employees.value[index] = updatedEmployee
      }
      return updatedEmployee
    } catch (err) {
      error.value = 'Failed to update employee'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteEmployee = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await deleteApi(`/api/hr/employees/${id}`)
      employees.value = employees.value.filter(e => e.id !== id)
    } catch (err) {
      error.value = 'Failed to delete employee'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    employees: readonly(employees),
    loading: readonly(loading),
    error: readonly(error),
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  }
}
