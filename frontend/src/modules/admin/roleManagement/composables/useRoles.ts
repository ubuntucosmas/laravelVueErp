import { ref, readonly } from 'vue'
import type { Role, RoleFilters, CreateRoleData, UpdateRoleData, Permission } from '../types/role'
import { useApi, handleApiError } from '../../shared/composables/useApi'


export function useRoles() {
  const roles = ref<Role[]>([])
  const permissions = ref<Permission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { get, post, put, delete: deleteApi } = useApi()


  const fetchRoles = async (filters?: RoleFilters) => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const params: Record<string, string | number | boolean | undefined> = {}
      if (filters?.search) params.search = filters.search

      const response = await get('/api/admin/roles', params)
      roles.value = response.data as Role[] || []
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to fetch roles')
      console.error('Error fetching roles:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchPermissions = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await get('/api/admin/permissions')
      permissions.value = response.data as Permission[] || []
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to fetch permissions')
      console.error('Error fetching permissions:', err)
    } finally {
      loading.value = false
    }
  }

  const createRole = async (roleData: CreateRoleData) => {
    loading.value = true
    error.value = null
    try {
      const response = await post('/api/admin/roles', roleData as unknown as Record<string, unknown>)
      const newRole = response.data as Role
      roles.value = [newRole, ...roles.value]
      return newRole
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to create role')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRole = async (id: number, roleData: UpdateRoleData) => {
    loading.value = true
    error.value = null
    try {
      const response = await put(`/api/admin/roles/${id}`, roleData as unknown as Record<string, unknown>)
      const updatedRole = response.data as Role
      const index = roles.value.findIndex(r => r.id === id)
      if (index !== -1) {
        roles.value[index] = updatedRole
      }
      return updatedRole
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to update role')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRole = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await deleteApi(`/api/admin/roles/${id}`)
      roles.value = roles.value.filter(r => r.id !== id)
    } catch (err: unknown) {
      error.value = handleApiError(err, 'Failed to delete role')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    roles: readonly(roles),
    permissions: readonly(permissions),
    loading: readonly(loading),
    error: readonly(error),
    fetchRoles,
    fetchPermissions,
    createRole,
    updateRole,
    deleteRole
  }
}
