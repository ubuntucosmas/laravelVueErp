import { useAuth } from './useAuth'
import { useRouter } from 'vue-router'

// Permission constants (mirroring backend)
const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user.create',
  USER_READ: 'user.read',
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

  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  DASHBOARD_ADMIN: 'dashboard.admin',
  DASHBOARD_HR: 'dashboard.hr',
  DASHBOARD_FINANCE: 'dashboard.finance',
  DASHBOARD_PROJECTS: 'dashboard.projects',
}

export function useRouteGuard() {
  const { permissions, isLoggedIn, user } = useAuth()
  const router = useRouter()

  // Helper function to check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!isLoggedIn.value || !user.value) return false

    // Super Admin bypasses all permission checks
    if (user.value.roles?.includes('Super Admin')) return true

    // Check if user has the specific permission
    // Note: Frontend permissions are checked via backend API response
    // For now, we'll use role-based fallback until full permission sync is implemented
    return checkPermissionViaRoles(permission)
  }

  // Temporary function to check permissions via roles (until full permission sync)
  const checkPermissionViaRoles = (permission: string): boolean => {
    if (!user.value?.roles) return false

    const userRoles = user.value.roles

    // Super Admin has all permissions
    if (userRoles.includes('Super Admin')) return true

    // Map permissions to roles (temporary mapping)
    const permissionRoleMap: Record<string, string[]> = {
      [PERMISSIONS.USER_READ]: ['Admin', 'Super Admin'],
      [PERMISSIONS.USER_CREATE]: ['Admin', 'Super Admin'],
      [PERMISSIONS.USER_UPDATE]: ['Admin', 'Super Admin'],
      [PERMISSIONS.USER_DELETE]: ['Admin', 'Super Admin'],
      [PERMISSIONS.ROLE_READ]: ['Admin', 'Super Admin'],
      [PERMISSIONS.DEPARTMENT_READ]: ['Admin', 'HR', 'Super Admin'],
      [PERMISSIONS.EMPLOYEE_READ]: ['Admin', 'HR', 'Super Admin'],
      [PERMISSIONS.PROJECT_READ]: ['Project Manager', 'Project Officer', 'Super Admin'],
      [PERMISSIONS.ENQUIRY_READ]: ['Client Service', 'Project Manager', 'Super Admin'],
      [PERMISSIONS.FINANCE_VIEW]: ['Accounts', 'Costing', 'Super Admin'],
      [PERMISSIONS.HR_VIEW_EMPLOYEES]: ['HR', 'Super Admin'],
      [PERMISSIONS.CREATIVES_VIEW]: ['Designer', 'Super Admin'],
      [PERMISSIONS.CLIENT_READ]: ['Client Service', 'Super Admin'],
      [PERMISSIONS.PROCUREMENT_VIEW]: ['Procurement Officer', 'Super Admin'],
      [PERMISSIONS.ADMIN_ACCESS]: ['Admin', 'Super Admin'],
      [PERMISSIONS.DASHBOARD_ADMIN]: ['Admin', 'Super Admin'],
      [PERMISSIONS.DASHBOARD_HR]: ['HR', 'Super Admin'],
      [PERMISSIONS.DASHBOARD_FINANCE]: ['Accounts', 'Costing', 'Super Admin'],
      [PERMISSIONS.DASHBOARD_PROJECTS]: ['Project Manager', 'Project Officer', 'Super Admin'],
    }

    const allowedRoles = permissionRoleMap[permission] || []
    return allowedRoles.some(role => userRoles.includes(role))
  }

  const canAccessRoute = (routeName: string): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    switch (routeName) {
      // Admin routes - require admin access permission
      case 'admin-dashboard':
      case 'admin-users':
      case 'admin-employees':
      case 'admin-roles':
      case 'admin-departments':
        return hasPermission(PERMISSIONS.ADMIN_ACCESS)

      // HR routes - require HR permissions
      case 'hr-dashboard':
      case 'hr-employees':
        return hasPermission(PERMISSIONS.HR_VIEW_EMPLOYEES)

      // Department-specific routes - Managers, Employees, and Super Admin
      default:
        if (routeName.startsWith('department-')) {
          return hasPermission(PERMISSIONS.DEPARTMENT_READ)
        }
        return true
    }
  }

  const canAccessDepartment = (departmentId: number): boolean => {
    if (!permissions.value) return false
    return permissions.value.accessible_departments.includes(departmentId)
  }

  const canAccessProjects = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    // Check project read permission
    return hasPermission(PERMISSIONS.PROJECT_READ)
  }

  const canAccessClientService = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    // Check client read permission
    return hasPermission(PERMISSIONS.CLIENT_READ)
  }

  const canAccessCreatives = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    // Check creatives view permission
    return hasPermission(PERMISSIONS.CREATIVES_VIEW)
  }

  const canAccessFinance = (requiredRoles: string[]): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    // Check finance view permission
    return hasPermission(PERMISSIONS.FINANCE_VIEW)
  }

  const canAccessProcurement = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    // Check procurement view permission
    return hasPermission(PERMISSIONS.PROCUREMENT_VIEW)
  }

  const redirectToAppropriateRoute = () => {
    if (!isLoggedIn.value || !user.value) {
      router.push('/login')
      return
    }

    const userRoles = user.value.roles || []

    // Super Admin goes to admin dashboard
    if (userRoles.includes('Super Admin')) {
      router.push('/admin')
      return
    }

    // Admin goes to admin dashboard
    if (userRoles.includes('Admin')) {
      router.push('/admin')
      return
    }

    // HR goes to HR dashboard
    if (userRoles.includes('HR')) {
      router.push('/hr')
      return
    }

    // Creatives/Designers go to Design dashboard
    if (userRoles.includes('Designer')) {
      router.push('/creatives/design')
      return
    }

    // Department users go to their department
    if ((userRoles.includes('Manager') || userRoles.includes('Employee')) && permissions.value?.user_department) {
      router.push(`/department/${permissions.value.user_department.id}`)
      return
    }

    // Fallback to general dashboard
    router.push('/dashboard')
  }

  const getAllowedRoutes = () => {
    if (!user.value) return []

    const userRoles = user.value.roles || []
    const routes = []

    // Super Admin gets everything
    if (userRoles.includes('Super Admin')) {
      routes.push(
        { name: 'admin-dashboard', path: '/admin', label: 'Admin Dashboard', icon: '📊' },
        { name: 'admin-users', path: '/admin/users', label: 'User Management', icon: '👥' },
        { name: 'admin-employees', path: '/admin/employees', label: 'Employee Management', icon: '👷' },
        { name: 'admin-roles', path: '/admin/roles', label: 'Role Management', icon: '🔐' },
        { name: 'admin-departments', path: '/admin/departments', label: 'Department Management', icon: '🏢' },
        { name: 'hr-dashboard', path: '/hr', label: 'HR Dashboard', icon: '👥' },
        { name: 'hr-employees', path: '/hr/employees', label: 'HR Employees', icon: '👷' },
        { name: 'projects-department-dashboard', path: '/projects/department', label: 'Project Coordination', icon: '🎯' }
      )
    }
    // Admin gets admin routes
    else if (userRoles.includes('Admin')) {
      routes.push(
        { name: 'admin-dashboard', path: '/admin', label: 'Admin Dashboard', icon: '📊' },
        { name: 'admin-users', path: '/admin/users', label: 'User Management', icon: '👥' },
        { name: 'admin-employees', path: '/admin/employees', label: 'Employee Management', icon: '👷' },
        { name: 'admin-roles', path: '/admin/roles', label: 'Role Management', icon: '🔐' },
        { name: 'admin-departments', path: '/admin/departments', label: 'Department Management', icon: '🏢' },
        { name: 'projects-department-dashboard', path: '/projects/department', label: 'Project Coordination', icon: '🎯' }
      )
    }
    // HR gets HR routes
    else if (userRoles.includes('HR')) {
      routes.push(
        { name: 'hr-dashboard', path: '/hr', label: 'HR Dashboard', icon: '👥' },
        { name: 'hr-employees', path: '/hr/employees', label: 'Employee Management', icon: '👷' },
        { name: 'projects-department-dashboard', path: '/projects/department', label: 'Project Coordination', icon: '🎯' }
      )
    }
    // Department users get department routes
    // else if (userRoles.includes('Manager') || userRoles.includes('Employee')) {
    //   if (permissions.value?.user_department) {
    //     routes.push({
    //       name: `department-${permissions.value.user_department.id}`,
    //       path: `/department/${permissions.value.user_department.id}`,
    //       label: `${permissions.value.user_department.name} Dashboard`,
    //       icon: '🏢'
    //     })
    //   }
    // }

    // Add projects routes for authorized users
    if (canAccessProjects()) {
      routes.push(
        { name: 'projects-department-dashboard', path: '/projects/department', label: 'Project Coordination', icon: '🎯' },
        { name: 'projects-enquiries', path: '/projects/enquiries', label: 'Enquiries', icon: '📝' },
        { name: 'projects-list', path: '/projects/projects', label: 'Approved Projects', icon: '✅' },
        { name: 'projects-close-out-report', path: '/projects/close-out-report', label: 'Close-Out Report', icon: '📋' }
      )
    }

    // Add client service routes for authorized users
    if (canAccessClientService()) {
      routes.push(
        { name: 'client-service-dashboard', path: '/client-service', label: 'Client Service Dashboard', icon: '📊' },
        { name: 'client-service-clients', path: '/client-service/clients', label: 'Client Management', icon: '👥' },
        { name: 'client-service-enquiries', path: '/client-service/enquiries', label: 'Enquiry Management', icon: '📝' },
        { name: 'projects-department-dashboard', path: '/projects/department', label: 'Project Coordination', icon: '🎯' }
      )
    }

    // Add creatives routes for authorized users
    if (canAccessCreatives()) {
      routes.push(
        { name: 'design-dashboard', path: '/creatives/design', label: 'Design Department', icon: '🎨' },
        { name: 'creatives-materials', path: '/creatives/materials', label: 'Material & Cost Listing', icon: '📦' },
        { name: 'creatives-final-design', path: '/creatives/final-design', label: 'Final Design', icon: '✨' },
        { name: 'creatives-enquiries', path: '/creatives/enquiries', label: 'Enquiries', icon: '📝' },
        { name: 'creatives-element-templates', path: '/creatives/element-templates', label: 'Element Templates', icon: '📋' },
        { name: 'projects-department-dashboard', path: '/projects/department', label: 'Project Coordination', icon: '🎯' }
      )
    }

    // Add finance routes for authorized users
    if (canAccessFinance(['Accounts', 'Costing'])) {
      routes.push(
        { name: 'finance-dashboard', path: '/finance', label: 'Finance Dashboard', icon: '📊' },
        { name: 'finance-budgeting', path: '/finance/budgeting', label: 'Budget Management', icon: '💰' },
        { name: 'finance-costing', path: '/finance/costing', label: 'Cost Analysis', icon: '🧮' },
        { name: 'finance-invoicing', path: '/finance/invoicing', label: 'Invoice Management', icon: '📄' },
        { name: 'finance-reporting', path: '/finance/reporting', label: 'Financial Reports', icon: '📈' },
        { name: 'finance-enquiries', path: '/finance/enquiries', label: 'Project Enquiries', icon: '📋' },
        { name: 'finance-analytics', path: '/finance/analytics', label: 'Financial Analytics', icon: '📉' },
        { name: 'projects-department-dashboard', path: '/projects/department', label: 'Project Coordination', icon: '🎯' }
      )
    }

    // Add procurement routes for authorized users
    if (canAccessProcurement()) {
      routes.push(
        { name: 'procurement-dashboard', path: '/procurement', label: 'Procurement Dashboard', icon: '📦' },
        { name: 'procurement-materials', path: '/procurement/materials', label: 'Material Requests', icon: '📋' },
        { name: 'procurement-vendors', path: '/procurement/vendors', label: 'Vendor Management', icon: '🏪' },
        { name: 'procurement-orders', path: '/procurement/orders', label: 'Purchase Orders', icon: '📄' },
        { name: 'procurement-quotations', path: '/procurement/quotations', label: 'Supplier Quotations', icon: '💰' },
        { name: 'projects-department-dashboard', path: '/projects/department', label: 'Project Coordination', icon: '🎯' }
      )
    }

    return routes
  }

  const getPanelTitle = (): string => {
    if (!user.value) return 'ERP System'

    const userRoles = user.value.roles || []

    // Super Admin
    if (userRoles.includes('Super Admin')) {
      return 'Super Admin Panel'
    }

    // Admin
    if (userRoles.includes('Admin')) {
      return 'Admin Panel'
    }

    // HR
    if (userRoles.includes('HR')) {
      return 'HR Panel'
    }

    // Check feature access in priority order
    if (canAccessProjects()) {
      return 'Projects Panel'
    }

    if (canAccessClientService()) {
      return 'Client Service Panel'
    }

    if (canAccessCreatives()) {
      return 'Creatives Panel'
    }

    if (canAccessFinance(['Accounts', 'Costing'])) {
      return 'Finance Panel'
    }

    if (canAccessProcurement()) {
      return 'Procurement Panel'
    }

    // Department fallback
    if (permissions.value?.user_department) {
      return permissions.value.user_department.name
    }

    return 'ERP System'
  }

  const getPanelSubtitle = (): string => {
    if (!user.value) return 'Management Dashboard'

    const userRoles = user.value.roles || []

    // Super Admin
    if (userRoles.includes('Super Admin')) {
      return 'Full System Access'
    }

    // Admin
    if (userRoles.includes('Admin')) {
      return 'System Administration'
    }

    // HR
    if (userRoles.includes('HR')) {
      return 'Human Resources'
    }

    // Check feature access in priority order
    if (canAccessProjects()) {
      return 'Project Management'
    }

    if (canAccessClientService()) {
      return 'Client Acquisition & Marketing'
    }

    if (canAccessCreatives()) {
      return 'Creative Design & Production'
    }

    if (canAccessFinance(['Accounts', 'Costing'])) {
      return 'Financial Management'
    }

    if (canAccessProcurement()) {
      return 'Procurement & Supply Chain'
    }

    // Department fallback
    if (permissions.value?.user_department) {
      return 'Department Dashboard'
    }

    return 'Management Dashboard'
  }

  return {
    canAccessRoute,
    canAccessDepartment,
    canAccessProjects,
    canAccessClientService,
    canAccessCreatives,
    canAccessFinance,
    canAccessProcurement,
    redirectToAppropriateRoute,
    getAllowedRoutes,
    getPanelTitle,
    getPanelSubtitle
  }
}
