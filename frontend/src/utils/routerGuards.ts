import api from '../plugins/axios'
import type { User, UserPermissions } from '../composables/useAuth'

// Permission constants (mirroring backend - only implemented permissions)
const PERMISSIONS = {
  // User Management
  USER_READ: 'user.read',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_ASSIGN_ROLE: 'user.assign_role',

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
  DEPARTMENT_ACCESS: 'department.access',
  DEPARTMENT_MANAGE: 'department.manage',

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
  PROJECT_ASSIGN_USERS: 'project.assign_users',
  PROJECT_VIEW_REPORTS: 'project.view_reports',
  PROJECT_CLOSE: 'project.close',

  // Enquiry Management
  ENQUIRY_READ: 'enquiry.read',
  ENQUIRY_CREATE: 'enquiry.create',
  ENQUIRY_UPDATE: 'enquiry.update',

  // Finance Permissions (currently implemented)
  FINANCE_VIEW: 'finance.view',
  FINANCE_BUDGET_READ: 'finance.budget.read',
  FINANCE_BUDGET_UPDATE: 'finance.budget.update',

  // Future Finance Permissions (commented out - not yet implemented)
  // FINANCE_BUDGET_CREATE: 'finance.budget.create',
  // FINANCE_BUDGET_APPROVE: 'finance.budget.approve',
  // FINANCE_BUDGET_DELETE: 'finance.budget.delete',
  // FINANCE_QUOTE_CREATE: 'finance.quote.create',
  // FINANCE_QUOTE_READ: 'finance.quote.read',
  // FINANCE_QUOTE_UPDATE: 'finance.quote.update',
  // FINANCE_QUOTE_APPROVE: 'finance.quote.approve',
  // FINANCE_QUOTE_DELETE: 'finance.quote.delete',
  // FINANCE_INVOICE_CREATE: 'finance.invoice.create',
  // FINANCE_INVOICE_READ: 'finance.invoice.read',
  // FINANCE_INVOICE_UPDATE: 'finance.invoice.update',
  // FINANCE_INVOICE_DELETE: 'finance.invoice.delete',
  // FINANCE_REPORTS_VIEW: 'finance.reports.view',
  // FINANCE_ANALYTICS_VIEW: 'finance.analytics.view',
  // FINANCE_PETTY_CASH_VIEW: 'finance.petty_cash.view',
  // FINANCE_PETTY_CASH_CREATE: 'finance.petty_cash.create',
  // FINANCE_PETTY_CASH_UPDATE: 'finance.petty_cash.update',
  // FINANCE_PETTY_CASH_VOID: 'finance.petty_cash.void',
  // FINANCE_PETTY_CASH_CREATE_TOP_UP: 'finance.petty_cash.create_top_up',
  // FINANCE_PETTY_CASH_ADMIN: 'finance.petty_cash.admin',

  // HR
  HR_VIEW_EMPLOYEES: 'hr.view_employees',
  // Future HR Permissions (commented out - not yet implemented)
  // HR_MANAGE_PAYROLL: 'hr.manage_payroll',
  // HR_CREATE_POSITION: 'hr.create_position',
  // HR_MANAGE_ATTENDANCE: 'hr.manage_attendance',

  // Creatives
  CREATIVES_VIEW: 'creatives.view',
  // Future Creatives Permissions (commented out - not yet implemented)
  // CREATIVES_DESIGN_CREATE: 'creatives.design.create',
  // CREATIVES_DESIGN_UPDATE: 'creatives.design.update',
  // CREATIVES_DESIGN_APPROVE: 'creatives.design.approve',
  // CREATIVES_MATERIALS_MANAGE: 'creatives.materials.manage',

  // Client Service
  CLIENT_READ: 'client.read',
  CLIENT_CREATE: 'client.create',
  // Future Client Service Permissions (commented out - not yet implemented)
  // CLIENT_UPDATE: 'client.update',
  // CLIENT_DELETE: 'client.delete',

  // Procurement (Future - not yet implemented)
  // PROCUREMENT_VIEW: 'procurement.view',
  // PROCUREMENT_MATERIALS_REQUEST: 'procurement.materials.request',
  // PROCUREMENT_ORDERS_CREATE: 'procurement.orders.create',
  // PROCUREMENT_VENDORS_MANAGE: 'procurement.vendors.manage',
  // PROCUREMENT_QUOTATIONS_MANAGE: 'procurement.quotations.manage',

  // Admin
  ADMIN_ACCESS: 'admin.access',
  // Future Admin Permissions (commented out - not yet implemented)
  // ADMIN_LOGS_VIEW: 'admin.logs.view',
  // ADMIN_SETTINGS: 'admin.settings',
  // ADMIN_BACKUP: 'admin.backup',
  // ADMIN_MAINTENANCE: 'admin.maintenance',

  // Task Management
  TASK_READ: 'task.read',
  TASK_UPDATE: 'task.update',
  TASK_ASSIGN: 'task.assign',
  TASK_CREATE: 'task.create',
  TASK_DELETE: 'task.delete',
  TASK_COMPLETE: 'task.complete',
  TASK_SKIP: 'task.skip',

  // Dashboard Permissions
  DASHBOARD_VIEW: 'dashboard.view',
  DASHBOARD_ADMIN: 'dashboard.admin',
  DASHBOARD_HR: 'dashboard.hr',
  DASHBOARD_FINANCE: 'dashboard.finance',
  DASHBOARD_PROJECTS: 'dashboard.projects',
}

// Cache for user data and permissions to avoid multiple API calls in guards
let cachedUser: User | null = null
let cachedPermissions: UserPermissions | null = null
let cachedUserPermissions: string[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function fetchUserData(): Promise<{ user: User | null, permissions: UserPermissions | null, userPermissions: string[] | null }> {
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

export async function canAccessFinance(): Promise<boolean> {
  const { user, userPermissions } = await fetchUserData()
  if (!user) return false

  // Super Admin can access everything
  if (user.roles?.includes('Super Admin')) return true

  // Check finance view permission (any finance permission grants access)
  const financePermissions = [
    'finance.view',
    'finance.budget.view',
    'finance.budget.read',
    'finance.budget.update'
  ]

  return financePermissions.some(permission => hasPermission(user, userPermissions, permission))
}


// Clear cache when user logs out or token changes
export function clearGuardCache(): void {
  cachedUser = null
  cachedPermissions = null
  cachedUserPermissions = null
  cacheTimestamp = 0
}
