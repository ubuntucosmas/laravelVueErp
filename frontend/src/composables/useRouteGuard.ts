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

export function useRouteGuard() {
  const { permissions, isLoggedIn, user } = useAuth()
  const router = useRouter()

  // Helper function to check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!isLoggedIn.value || !user.value) return false

    // Super Admin bypasses all permission checks
    if (user.value.roles?.includes('Super Admin')) return true

    // Check if user has the specific permission in their permissions array
    return permissions.value?.user_permissions?.includes(permission) || false
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
    if (!permissions.value?.permissions) return false
    return permissions.value.permissions.accessible_departments.includes(departmentId)
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

  const canAccessFinance = (): boolean => {
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

  const canAccessProjectsDashboard = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    // Check if user is in Projects department and has Project Manager role
    const userDepartment = permissions.value?.permissions?.user_department?.name
    const userRoles = user.value.roles || []

    return userDepartment === 'Projects' && userRoles.includes('Project Manager')
  }

  const redirectToAppropriateRoute = () => {
    if (!isLoggedIn.value || !user.value) {
      router.push('/login')
      return
    }

    const userRoles = user.value.roles || []

    // Super Admin goes to super admin dashboard
    if (userRoles.includes('Super Admin')) {
      router.push('/super-admin')
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
    if ((userRoles.includes('Manager') || userRoles.includes('Employee')) && permissions.value?.permissions?.user_department) {
      router.push(`/department/${permissions.value.permissions.user_department.id}`)
      return
    }

    // Fallback to HR dashboard
    router.push('/hr')
  }

  const getAllowedRoutes = () => {
    if (!user.value) return []

    const userRoles = user.value.roles || []
    const routes = []

    // Super Admin gets everything categorized by departments
    if (userRoles.includes('Super Admin')) {
      routes.push(
        {
          department: 'Super Admin',
          routes: [
            { name: 'super-admin-dashboard', path: '/super-admin', label: 'Super Admin Dashboard', icon: '👑' }
          ]
        },
        {
          department: 'Administration',
          routes: [
            { name: 'admin-dashboard', path: '/admin', label: 'Admin Dashboard', icon: '📊' },
            { name: 'admin-users', path: '/admin/users', label: 'User Management', icon: '👥' },
            { name: 'admin-employees', path: '/admin/employees', label: 'Employee Management', icon: '👷' },
            { name: 'admin-roles', path: '/admin/roles', label: 'Role Management', icon: '🔐' },
            { name: 'admin-departments', path: '/admin/departments', label: 'Department Management', icon: '🏢' }
          ]
        },
        {
          department: 'Human Resources',
          routes: [
            { name: 'hr-dashboard', path: '/hr', label: 'HR Dashboard', icon: '👥' },
            { name: 'hr-employees', path: '/hr/employees', label: 'Employee Management', icon: '👷' }
          ]
        },
        {
          department: 'Projects',
          routes: [
            { name: 'projects-dashboard', path: '/projects/dashboard', label: 'Project Dashboard', icon: '📈' },
            { name: 'projects-enquiries', path: '/projects/enquiries', label: 'Project Enquiries', icon: '📝' }
          ]
        },
        {
          department: 'Client Service',
          routes: [
            { name: 'client-service-dashboard', path: '/client-service', label: 'Client Service Dashboard', icon: '📊' },
            { name: 'client-service-clients', path: '/client-service/clients', label: 'Client Management', icon: '👥' },
            { name: 'client-service-enquiries', path: '/client-service/enquiries', label: 'Enquiry Management', icon: '📝' }
          ]
        },
        {
          department: 'Creatives',
          routes: [
            { name: 'design-dashboard', path: '/creatives/design', label: 'Design Department', icon: '🎨' },
            { name: 'creatives-materials', path: '/creatives/materials', label: 'Material & Cost Listing', icon: '📦' },
            { name: 'creatives-final-design', path: '/creatives/final-design', label: 'Final Design', icon: '✨' },
            { name: 'creatives-enquiries', path: '/creatives/enquiries', label: 'Enquiries', icon: '📝' },
            { name: 'creatives-element-templates', path: '/creatives/element-templates', label: 'Element Templates', icon: '📋' }
          ]
        },
        {
          department: 'Finance',
          routes: [
            { name: 'finance-dashboard', path: '/finance', label: 'Finance Dashboard', icon: '📊' },
            { name: 'finance-budgeting', path: '/finance/budgeting', label: 'Budget Management', icon: '💰' },
            { name: 'finance-costing', path: '/finance/costing', label: 'Cost Analysis', icon: '🧮' },
            { name: 'finance-invoicing', path: '/finance/invoicing', label: 'Invoice Management', icon: '📄' },
            { name: 'finance-reporting', path: '/finance/reporting', label: 'Financial Reports', icon: '📈' },
            { name: 'finance-enquiries', path: '/finance/enquiries', label: 'Project Enquiries', icon: '📋' },
            { name: 'finance-analytics', path: '/finance/analytics', label: 'Financial Analytics', icon: '📉' }
          ]
        },
        {
          department: 'Procurement',
          routes: [
            { name: 'procurement-dashboard', path: '/procurement', label: 'Procurement Dashboard', icon: '📦' },
            { name: 'procurement-materials', path: '/procurement/materials', label: 'Material Requests', icon: '📋' },
            { name: 'procurement-vendors', path: '/procurement/vendors', label: 'Vendor Management', icon: '🏪' },
            { name: 'procurement-orders', path: '/procurement/orders', label: 'Purchase Orders', icon: '📄' },
            { name: 'procurement-quotations', path: '/procurement/quotations', label: 'Supplier Quotations', icon: '💰' }
          ]
        }
      )
    }
    // Admin gets admin routes
    else if (userRoles.includes('Admin')) {
      routes.push(
        { name: 'admin-dashboard', path: '/admin', label: 'Admin Dashboard', icon: '📊' },
        { name: 'admin-users', path: '/admin/users', label: 'User Management', icon: '👥' },
        { name: 'admin-employees', path: '/admin/employees', label: 'Employee Management', icon: '👷' },
        { name: 'admin-roles', path: '/admin/roles', label: 'Role Management', icon: '🔐' },
        { name: 'admin-departments', path: '/admin/departments', label: 'Department Management', icon: '🏢' }
      )
    }
    // HR gets HR routes
    else if (userRoles.includes('HR')) {
      routes.push(
        { name: 'hr-dashboard', path: '/hr', label: 'HR Dashboard', icon: '👥' },
        { name: 'hr-employees', path: '/hr/employees', label: 'Employee Management', icon: '👷' }
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

    // Add projects routes for authorized users (skip for Super Admin as they're already included in departments)
    if (canAccessProjects() && !userRoles.includes('Super Admin')) {
      routes.push(
        { name: 'projects-dashboard', path: '/projects/dashboard', label: 'Project Dashboard', icon: '📈' },
        { name: 'projects-enquiries', path: '/projects/enquiries', label: 'Project Enquiries', icon: '📝' },
      )
    }

    // Add client service routes for authorized users (skip for Super Admin as they're already included in departments)
    // if (canAccessClientService() && !userRoles.includes('Super Admin')) {
    //   routes.push(
    //     { name: 'client-service-dashboard', path: '/client-service', label: 'Client Service Dashboard', icon: '📊' },
    //     { name: 'client-service-clients', path: '/client-service/clients', label: 'Client Management', icon: '👥' },
    //     { name: 'client-service-enquiries', path: '/client-service/enquiries', label: 'Enquiry Management', icon: '📝' }
    //   )
    // }

    // Add creatives routes for authorized users (skip for Super Admin as they're already included in departments)
    if (canAccessCreatives() && !userRoles.includes('Super Admin')) {
      routes.push(
        { name: 'design-dashboard', path: '/creatives/design', label: 'Design Department', icon: '🎨' },
        { name: 'creatives-materials', path: '/creatives/materials', label: 'Material & Cost Listing', icon: '📦' },
        { name: 'creatives-final-design', path: '/creatives/final-design', label: 'Final Design', icon: '✨' },
        { name: 'creatives-enquiries', path: '/creatives/enquiries', label: 'Enquiries', icon: '📝' },
        { name: 'creatives-element-templates', path: '/creatives/element-templates', label: 'Element Templates', icon: '📋' }
      )
    }

    // Add finance routes for authorized users (skip for Super Admin as they're already included in departments)
    if (canAccessFinance() && !userRoles.includes('Super Admin')) {
      routes.push(
        { name: 'finance-dashboard', path: '/finance', label: 'Finance Dashboard', icon: '📊' },
        { name: 'finance-budgeting', path: '/finance/budgeting', label: 'Budget Management', icon: '💰' },
        { name: 'finance-costing', path: '/finance/costing', label: 'Cost Analysis', icon: '🧮' },
        { name: 'finance-invoicing', path: '/finance/invoicing', label: 'Invoice Management', icon: '📄' },
        { name: 'finance-reporting', path: '/finance/reporting', label: 'Financial Reports', icon: '📈' },
        { name: 'finance-enquiries', path: '/finance/enquiries', label: 'Project Enquiries', icon: '📋' },
        { name: 'finance-analytics', path: '/finance/analytics', label: 'Financial Analytics', icon: '📉' }
      )
    }

    // Add procurement routes for authorized users (skip for Super Admin as they're already included in departments)
    if (canAccessProcurement() && !userRoles.includes('Super Admin')) {
      routes.push(
        { name: 'procurement-dashboard', path: '/procurement', label: 'Procurement Dashboard', icon: '📦' },
        { name: 'procurement-materials', path: '/procurement/materials', label: 'Material Requests', icon: '📋' },
        { name: 'procurement-vendors', path: '/procurement/vendors', label: 'Vendor Management', icon: '🏪' },
        { name: 'procurement-orders', path: '/procurement/orders', label: 'Purchase Orders', icon: '📄' },
        { name: 'procurement-quotations', path: '/procurement/quotations', label: 'Supplier Quotations', icon: '💰' }
      )
    }

    // Add Projects department dashboard for users who work in Projects department (skip for Super Admin)
    if (canAccessProjectsDashboard() && !userRoles.includes('Super Admin')) {
      routes.push(
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
      return 'Projects Dashboard'
    }

    if (canAccessClientService()) {
      return 'Client Service Panel'
    }

    if (canAccessCreatives()) {
      return 'Creatives Panel'
    }

    if (canAccessFinance()) {
      return 'Finance Panel'
    }

    if (canAccessProcurement()) {
      return 'Procurement Panel'
    }

    // Department fallback
    if (permissions.value?.permissions?.user_department) {
      return permissions.value.permissions.user_department.name
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
      return 'Project Coordination'
    }

    if (canAccessClientService()) {
      return 'Client Acquisition & Marketing'
    }

    if (canAccessCreatives()) {
      return 'Creative Design & Production'
    }

    if (canAccessFinance()) {
      return 'Financial Management'
    }

    if (canAccessProcurement()) {
      return 'Procurement & Supply Chain'
    }

    // Department fallback
    if (permissions.value?.permissions?.user_department) {
      return 'Department Dashboard'
    }

    return 'Management Dashboard'
  }

  return {
    canAccessRoute,
    canAccessDepartment,
    canAccessProjects,
    canAccessProjectsDashboard,
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
