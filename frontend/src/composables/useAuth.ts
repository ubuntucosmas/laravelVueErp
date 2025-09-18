// src/composables/useAuth.ts
import { ref } from 'vue'
import api, { setAuthToken, removeAuthToken } from '../plugins/axios'

export interface User {
  id: number
  name: string
  email: string
  department_id?: number
  department?: {
    id: number
    name: string
  }
  roles?: string[]
}

export interface UserPermissions {
  can_access_admin: boolean
  can_access_hr: boolean
  can_manage_users: boolean
  can_manage_employees: boolean
  can_manage_departments: boolean
  can_view_reports: boolean
  accessible_departments: number[]
  user_department: {
    id: number
    name: string
  } | null
}

const isLoggedIn = ref(false)
const user = ref<User | null>(null)
const permissions = ref<UserPermissions | null>(null)

export function useAuth() {

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/login', { email, password })
      if (response.status === 200 && response.data.token) {
        setAuthToken(response.data.token)
        isLoggedIn.value = true
        await fetchUser()
        localStorage.setItem('isLoggedIn', 'true')
        return true
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
    return false
  }

  const register = async (name: string, email: string, password: string, password_confirmation?: string) => {
    try {
      const response = await api.post('/api/register', {
        name,
        email,
        password,
        password_confirmation: password_confirmation || password
      })
      if (response.status === 201 && response.data.token) {
        setAuthToken(response.data.token)
        isLoggedIn.value = true
        await fetchUser()
        localStorage.setItem('isLoggedIn', 'true')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      removeAuthToken()
      isLoggedIn.value = false
      user.value = null
      permissions.value = null
      localStorage.removeItem('isLoggedIn')
      // Navigation will be handled by the component using this composable
      window.location.href = '/login'
    }
  }

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/user')
      const userData = response.data

      // Extract role names from the roles relationship
      userData.roles = userData.roles?.map((role: { name: string }) => role.name) || []

      user.value = userData
      isLoggedIn.value = true

      // Fetch permissions after user data
      await fetchPermissions()
    } catch (error) {
      console.error('Failed to fetch user:', error)
      isLoggedIn.value = false
      user.value = null
      permissions.value = null
      removeAuthToken()
    }
  }

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/api/user/permissions')
      permissions.value = response.data.permissions
      // Update user with additional data from permissions
      if (user.value && response.data.departments) {
        user.value.department = response.data.departments.find((d: { id: number }) =>
          d.id === permissions.value?.user_department?.id
        ) || null
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
      permissions.value = null
    }
  }

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token')
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (token && loggedIn) {
      fetchUser()
    } else if (!token && loggedIn) {
      // Token is missing but user thinks they're logged in
      localStorage.removeItem('isLoggedIn')
    }
  }

  return {
    isLoggedIn,
    user,
    permissions,
    login,
    register,
    logout,
    fetchUser,
    fetchPermissions,
    checkAuth
  }
}
