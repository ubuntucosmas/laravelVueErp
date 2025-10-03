import { ref, readonly } from 'vue'
import type { User, UserFilters, CreateUserData, UpdateUserData } from '../types/user'
import { useApi, handleApiError } from '../../shared/composables/useApi'

// Employee interface for HR data
export interface Employee {
  id: number
  name: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  position: string
  department_id: number
  department?: {
    id: number
    name: string
    description?: string
  }
  status: string
  hire_date: string
  created_at: string
  updated_at: string
}

// Combined user/employee interface
export interface Person {
  id: number
  name: string
  email: string
  department?: {
    id: number
    name: string
    description?: string | null
  }
  roles: ReadonlyArray<{
    id: number
    name: string
    description?: string | null
  }>
  is_active: boolean
  type: 'user' | 'employee'
  full_name?: string
  employee_id?: number | null
  department_id?: number | null
  last_login_at?: string | null
  email_verified_at?: string | null
  created_at?: string
  updated_at?: string
}

export function useUsers() {
  const users = ref<User[]>([])
  const employees = ref<Employee[]>([])
  const availableEmployees = ref<Employee[]>([])
  const allPeople = ref<Person[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { get, post, put, delete: deleteApi } = useApi()

  const fetchUsers = async (filters?: UserFilters) => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const params: Record<string, string | number | boolean | undefined> = {}
      if (filters?.search) params.search = filters.search
      if (filters?.department_id) params.department_id = filters.department_id
      if (filters?.role_id) params.role_id = filters.role_id
      if (filters?.is_active !== undefined) params.is_active = filters.is_active
      if (filters?.page) params.page = filters.page
      if (filters?.per_page) params.per_page = filters.per_page

      const response = await get('/api/admin/users', params)
      users.value = (response.data as User[]) || []
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to fetch users')
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchEmployees = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await get('/api/hr/employees')
      employees.value = (response.data as Employee[]) || []
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to fetch employees')
      console.error('Error fetching employees:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAvailableEmployees = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await get('/api/admin/users/available-employees')
      availableEmployees.value = (response.data as Employee[]) || []
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to fetch available employees')
      console.error('Error fetching available employees:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAllPeople = async (filters?: UserFilters) => {
    if (loading.value) return
    loading.value = true
    error.value = null

    try {
      // Fetch both users and employees in parallel
      const [usersResponse, employeesResponse] = await Promise.all([
        get('/api/admin/users', filters ? {
          search: filters.search,
          department_id: filters.department_id,
          is_active: filters.is_active
        } : {}),
        get('/api/hr/employees')
      ])

      const usersData = (usersResponse.data as User[]) || []
      const employeesData = (employeesResponse.data as Employee[]) || []

      // Convert users to Person format
      const usersAsPeople: Person[] = usersData.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department ? {
          id: user.department.id,
          name: user.department.name,
          description: user.department.description || undefined
        } : undefined,
        roles: user.roles,
        is_active: user.is_active,
        type: 'user' as const,
        full_name: user.name,
        employee_id: null,
        department_id: user.department_id,
        last_login_at: user.last_login_at,
        email_verified_at: null,
        created_at: user.created_at,
        updated_at: user.updated_at
      }))

      // Convert employees to Person format
      const employeesAsPeople: Person[] = employeesData.map(employee => ({
        id: employee.id,
        name: `${employee.first_name} ${employee.last_name}`,
        email: employee.email,
        department: employee.department ? {
          id: employee.department.id,
          name: employee.department.name,
          description: employee.department.description || undefined
        } : undefined,
        roles: [],
        is_active: employee.status === 'active',
        type: 'employee' as const,
        full_name: `${employee.first_name} ${employee.last_name}`,
        employee_id: null,
        department_id: employee.department_id,
        last_login_at: null,
        email_verified_at: null,
        created_at: employee.created_at,
        updated_at: employee.updated_at
      }))

      // Combine and sort by name
      allPeople.value = [...usersAsPeople, ...employeesAsPeople].sort((a, b) =>
        a.name.localeCompare(b.name)
      )

    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to fetch data')
      console.error('Error fetching people:', err)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: CreateUserData) => {
    loading.value = true
    error.value = null
    try {
      const response = await post('/api/admin/users', userData as unknown as Record<string, unknown>)
      const newUser = response.data as User
      users.value = [newUser, ...users.value]
      return newUser
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to create user')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, userData: UpdateUserData) => {
    loading.value = true
    error.value = null
    try {
      const response = await put(`/api/admin/users/${id}`, userData as unknown as Record<string, unknown>)
      const updatedUser = response.data as User
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      return updatedUser
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to update user')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await deleteApi(`/api/admin/users/${id}`)
      users.value = users.value.filter(u => u.id !== id)
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to delete user')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users: readonly(users),
    employees: readonly(employees),
    availableEmployees: readonly(availableEmployees),
    allPeople: readonly(allPeople),
    loading: readonly(loading),
    error: readonly(error),
    fetchUsers,
    fetchEmployees,
    fetchAvailableEmployees,
    fetchAllPeople,
    createUser,
    updateUser,
    deleteUser
  }
}
