import api from '../plugins/axios'
import type { User, UserPermissions } from '../composables/useAuth'

// Permission constants (mirroring backend)
const PERMISSIONS = {
  // User Management
  USER_READ: 'user.read',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_ASSIGN_ROLE: 'user.assign_role',
  USER_ASSIGN_DEPARTMENT: 'user.assign_department',

  // Role Management
  ROLE_READ: 'role.read',
  ROLE_CREATE: 'role.create',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',

  // Department Management
  DEPARTMENT_READ: 'department.read',
  DEPARTMENT_CREATE: 'department.create',
  DEPARTMENT_UPDATE: 'department.update',
  DEPARTMENT_DELETE: 'department.delete',

  // Employee Management
  EMPLOYEE_READ: 'employee.read',
  EMPLOYEE_CREATE: 'employee.create',
  EMPLOYEE_UPDATE: 'employee.update',
  EMPLOYEE_DELETE: 'employee.delete',

  // Project Management
  PROJECT_READ: 'project.read',
  PROJECT_CREATE: 'project.create',
  PROJECT_UPDATE: 'project.update',
  PROJECT_DELETE: 'project.delete',

  // Enquiry Management
  ENQUIRY_READ: 'enquiry.read',
  ENQUIRY_CREATE: 'enquiry.create',
  ENQUIRY_UPDATE: 'enquiry.update',

  // Task Management
  TASK_READ: 'task.read',
  TASK_UPDATE: 'task.update',
  TASK_ASSIGN: 'task.assign',

  // HR
  HR_VIEW_EMPLOYEES: 'hr.view_employees',
  HR_MANAGE_PAYROLL: 'hr.manage_payroll',

  // Creatives
  CREATIVES_VIEW: 'creatives.view',
  CREATIVES_DESIGN_CREATE: 'creatives.design.create',

  // Client Service
  CLIENT_READ: 'client.read',
  CLIENT_CREATE: 'client.create',
  CLIENT_UPDATE: 'client.update',

  // Admin
  ADMIN_ACCESS: 'admin.access',
  ADMIN_LOGS_VIEW: 'admin.logs.view',
}

// Cache for user data and permissions to avoid multiple API calls in guards
let cachedUser: User | null = null
let cachedPermissions: UserPermissions | null = null
let cachedUserPermissions: string[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchUserData(): Promise<{ user: User | null, permissions: UserPermissions | null, userPermissions: string[] | null }> {
  const now = Date.now()

  // Return cached data if still valid
  if (cachedUser && cachedPermissions && cachedUserPermissions && (now - cacheTimestamp) < CACHE_DURATION) {
    return { user: cachedUser, permissions: cachedPermissions, userPermissions: cachedUserPermissions }
  }

  try {
    // Fetch user data
    const userResponse = await api.get('/api/user')
    const userData = userResponse.data

    // Extract role names from the roles relationship
    userData.roles = userData.roles?.map((role: { name: string }) => role.name) || []

    // Fetch permissions
    const permissionsResponse = await api.get('/api/user/permissions')
    const permissions = permissionsResponse.data.permissions
    const userPermissions = permissionsResponse.data.user_permissions || []

    // Update user with additional data from permissions
    if (userData && permissionsResponse.data.departments) {
      userData.department = permissionsResponse.data.departments.find((d: { id: number }) =>
        d.id === permissions?.user_department?.id
      ) || null
    }

    // Cache the data
    cachedUser = userData
    cachedPermissions = permissions
    cachedUserPermissions = userPermissions
    cacheTimestamp = now

    return { user: userData, permissions, userPermissions }
  } catch (error) {
    console.error('Failed to fetch user data for guard:', error)
    // Clear cache on error
    cachedUser = null
    cachedPermissions = null
    cachedUserPermissions = null
    return { user: null, permissions: null, userPermissions: null }
  }
}

function hasPermission(user: User | null, userPermissions: string[] | null, permission: string): boolean {
  if (!user) return false

  // Super Admin bypasses all permission checks
  if (user.roles?.includes('Super Admin')) return true

  // Check if user has the specific permission in their permissions array
  return userPermissions?.includes(permission) || false
}

export async function canAccessDepartment(departmentId: number): Promise<boolean> {
  const { permissions } = await fetchUserData()
  if (!permissions) return false
  return permissions.accessible_departments.includes(departmentId)
}

export async function canAccessProjects(): Promise<boolean> {
  const { user, userPermissions } = await fetchUserData()
  if (!user) return false

  // Super Admin can access everything
  if (user.roles?.includes('Super Admin')) return true

  // Check project read permission
  return hasPermission(user, userPermissions, PERMISSIONS.PROJECT_READ)
}

export async function canAccessClientService(): Promise<boolean> {
  const { user, userPermissions } = await fetchUserData()
  if (!user) return false

  // Super Admin can access everything
  if (user.roles?.includes('Super Admin')) return true

  // Check client read permission
  return hasPermission(user, userPermissions, PERMISSIONS.CLIENT_READ)
}

export async function canAccessCreatives(): Promise<boolean> {
  const { user, userPermissions } = await fetchUserData()
  if (!user) return false

  // Super Admin can access everything
  if (user.roles?.includes('Super Admin')) return true

  // Check creatives view permission
  return hasPermission(user, userPermissions, PERMISSIONS.CREATIVES_VIEW)
}


// Clear cache when user logs out or token changes
export function clearGuardCache(): void {
  cachedUser = null
  cachedPermissions = null
  cachedUserPermissions = null
  cacheTimestamp = 0
}
