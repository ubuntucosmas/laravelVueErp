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

  // Finance
  FINANCE_VIEW: 'finance.view',
  FINANCE_BUDGET_CREATE: 'finance.budget.create',
  FINANCE_BUDGET_APPROVE: 'finance.budget.approve',
  FINANCE_QUOTE_CREATE: 'finance.quote.create',
  FINANCE_QUOTE_APPROVE: 'finance.quote.approve',
  FINANCE_INVOICE_CREATE: 'finance.invoice.create',
  FINANCE_REPORTS_VIEW: 'finance.reports.view',

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

  // Procurement
  PROCUREMENT_VIEW: 'procurement.view',
  PROCUREMENT_ORDERS_CREATE: 'procurement.orders.create',

  // Admin
  ADMIN_ACCESS: 'admin.access',
  ADMIN_LOGS_VIEW: 'admin.logs.view',
}

// Cache for user data and permissions to avoid multiple API calls in guards
let cachedUser: User | null = null
let cachedPermissions: UserPermissions | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchUserData(): Promise<{ user: User | null, permissions: UserPermissions | null }> {
  const now = Date.now()

  // Return cached data if still valid
  if (cachedUser && cachedPermissions && (now - cacheTimestamp) < CACHE_DURATION) {
    return { user: cachedUser, permissions: cachedPermissions }
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

    // Update user with additional data from permissions
    if (userData && permissionsResponse.data.departments) {
      userData.department = permissionsResponse.data.departments.find((d: { id: number }) =>
        d.id === permissions?.user_department?.id
      ) || null
    }

    // Cache the data
    cachedUser = userData
    cachedPermissions = permissions
    cacheTimestamp = now

    return { user: userData, permissions }
  } catch (error) {
    console.error('Failed to fetch user data for guard:', error)
    // Clear cache on error
    cachedUser = null
    cachedPermissions = null
    return { user: null, permissions: null }
  }
}

function hasPermission(user: User | null, permissions: UserPermissions | null, permission: string): boolean {
  if (!user) return false

  // Super Admin bypasses all permission checks
  if (user.roles?.includes('Super Admin')) return true

  // Check if user has the specific permission via roles (temporary mapping)
  const permissionRoleMap: Record<string, string[]> = {
    [PERMISSIONS.USER_READ]: ['Admin', 'Super Admin'],
    [PERMISSIONS.USER_CREATE]: ['Admin', 'Super Admin'],
    [PERMISSIONS.USER_UPDATE]: ['Admin', 'Super Admin'],
    [PERMISSIONS.USER_DELETE]: ['Admin', 'Super Admin'],
    [PERMISSIONS.ROLE_READ]: ['Admin', 'Super Admin'],
    [PERMISSIONS.DEPARTMENT_READ]: ['Admin', 'HR', 'Super Admin'],
    [PERMISSIONS.EMPLOYEE_READ]: ['Admin', 'HR', 'Super Admin'],
    [PERMISSIONS.PROJECT_READ]: ['Project Manager', 'Project Officer', 'Manager', 'Employee', 'Client Service', 'HR', 'Accounts', 'Costing', 'Designer', 'Procurement Officer', 'Super Admin', 'Admin'],
    [PERMISSIONS.ENQUIRY_READ]: ['Client Service', 'Project Manager', 'Super Admin'],
    [PERMISSIONS.ENQUIRY_CREATE]: ['Client Service', 'Project Manager', 'Super Admin'],
    [PERMISSIONS.ENQUIRY_UPDATE]: ['Client Service', 'Project Manager', 'Super Admin'],
    [PERMISSIONS.TASK_READ]: ['Project Manager', 'Project Officer', 'Super Admin'],
    [PERMISSIONS.TASK_UPDATE]: ['Project Manager', 'Project Officer', 'Super Admin'],
    [PERMISSIONS.TASK_ASSIGN]: ['Project Manager', 'Project Officer', 'Super Admin'],
    [PERMISSIONS.FINANCE_VIEW]: ['Accounts', 'Costing', 'Super Admin'],
    [PERMISSIONS.HR_VIEW_EMPLOYEES]: ['HR', 'Super Admin'],
    [PERMISSIONS.CREATIVES_VIEW]: ['Designer', 'Super Admin'],
    [PERMISSIONS.CLIENT_READ]: ['Client Service', 'Super Admin'],
    [PERMISSIONS.PROCUREMENT_VIEW]: ['Procurement Officer', 'Super Admin'],
    [PERMISSIONS.ADMIN_ACCESS]: ['Admin', 'Super Admin'],
  }

  const allowedRoles = permissionRoleMap[permission] || []
  return allowedRoles.some(role => user.roles?.includes(role))
}

export async function canAccessDepartment(departmentId: number): Promise<boolean> {
  const { permissions } = await fetchUserData()
  if (!permissions) return false
  return permissions.accessible_departments.includes(departmentId)
}

export async function canAccessProjects(): Promise<boolean> {
  const { user } = await fetchUserData()
  if (!user) return false

  // Super Admin can access everything
  if (user.roles?.includes('Super Admin')) return true

  // Check project read permission
  return hasPermission(user, null, PERMISSIONS.PROJECT_READ)
}

export async function canAccessClientService(): Promise<boolean> {
  const { user } = await fetchUserData()
  if (!user) return false

  // Super Admin can access everything
  if (user.roles?.includes('Super Admin')) return true

  // Check client read permission
  return hasPermission(user, null, PERMISSIONS.CLIENT_READ)
}

export async function canAccessCreatives(): Promise<boolean> {
  const { user } = await fetchUserData()
  if (!user) return false

  // Super Admin can access everything
  if (user.roles?.includes('Super Admin')) return true

  // Check creatives view permission
  return hasPermission(user, null, PERMISSIONS.CREATIVES_VIEW)
}

export async function canAccessFinance(): Promise<boolean> {
  const { user } = await fetchUserData()
  if (!user) return false

  // Super Admin can access everything
  if (user.roles?.includes('Super Admin')) return true

  // Check finance view permission
  return hasPermission(user, null, PERMISSIONS.FINANCE_VIEW)
}

export async function canAccessProcurement(): Promise<boolean> {
  const { user } = await fetchUserData()
  if (!user) return false

  // Super Admin can access everything
  if (user.roles?.includes('Super Admin')) return true

  // Check procurement view permission
  return hasPermission(user, null, PERMISSIONS.PROCUREMENT_VIEW)
}

// Clear cache when user logs out or token changes
export function clearGuardCache(): void {
  cachedUser = null
  cachedPermissions = null
  cacheTimestamp = 0
}
