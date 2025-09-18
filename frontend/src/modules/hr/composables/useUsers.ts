import { ref, readonly } from 'vue'
import { useApi } from '../../admin/shared/composables/useApi'

// User interface for HR lookup
export interface UserLookup {
  id: number
  name: string
  email: string
  department?: string
  type: 'user' | 'employee'
  employee_id?: number | null
  department_id?: number | null
  is_active: boolean
}

// API response interfaces
interface UserApiResponse {
  id: number
  name: string
  email: string
  department?: {
    id: number
    name: string
  }
  employee_id: number | null
  department_id: number | null
  is_active: boolean
}

interface EmployeeApiResponse {
  id: number
  first_name: string
  last_name: string
  email: string
  department?: {
    id: number
    name: string
  }
  department_id: number | null
  status: string
}

export function useUsers() {
  const users = ref<UserLookup[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { get } = useApi()

  const searchUsers = async (query: string) => {
    loading.value = true
    error.value = null
    try {
      if (query.length < 2) {
        users.value = []
        return
      }

      // Fetch both users and employees
      const [usersResponse, employeesResponse] = await Promise.all([
        get('/api/admin/users', { search: query }),
        get('/api/hr/employees', { search: query })
      ])

      const usersData = (usersResponse.data as UserApiResponse[]) || []
      const employeesData = (employeesResponse.data as EmployeeApiResponse[]) || []

      // Convert users to UserLookup format
      const usersAsLookup: UserLookup[] = usersData.map((user: UserApiResponse) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department?.name,
        type: 'user' as const,
        employee_id: user.employee_id,
        department_id: user.department_id,
        is_active: user.is_active
      }))

      // Convert employees to UserLookup format
      const employeesAsLookup: UserLookup[] = employeesData.map((employee: EmployeeApiResponse) => ({
        id: employee.id,
        name: `${employee.first_name} ${employee.last_name}`,
        email: employee.email,
        department: employee.department?.name,
        type: 'employee' as const,
        employee_id: employee.id,
        department_id: employee.department_id,
        is_active: employee.status === 'active'
      }))

      // Combine and filter by search query
      const allPeople = [...usersAsLookup, ...employeesAsLookup]
      const filteredPeople = allPeople.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()) ||
        person.email.toLowerCase().includes(query.toLowerCase())
      )

      users.value = filteredPeople.slice(0, 10) // Limit results
    } catch (err) {
      error.value = 'Failed to search users'
      console.error('Error searching users:', err)
    } finally {
      loading.value = false
    }
  }

  const getUserById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      // Try to find in users first
      const userResponse = await get(`/api/admin/users/${id}`)
      if (userResponse.data) {
        const user = userResponse.data as UserApiResponse
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.department?.name,
          type: 'user' as const,
          employee_id: user.employee_id,
          department_id: user.department_id,
          is_active: user.is_active
        }
      }
    } catch {
      // If not found in users, try employees
      try {
        const employeeResponse = await get(`/api/hr/employees/${id}`)
        if (employeeResponse.data) {
          const employee = employeeResponse.data as EmployeeApiResponse
          return {
            id: employee.id,
            name: `${employee.first_name} ${employee.last_name}`,
            email: employee.email,
            department: employee.department?.name,
            type: 'employee' as const,
            employee_id: employee.id,
            department_id: employee.department_id,
            is_active: employee.status === 'active'
          }
        }
      } catch {
        // Not found in either
      }
    }

    return null
  }

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    searchUsers,
    getUserById
  }
}