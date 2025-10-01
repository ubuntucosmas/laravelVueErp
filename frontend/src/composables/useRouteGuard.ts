import { useAuth } from './useAuth'
import { useRouter } from 'vue-router'
import type { Ref } from 'vue'

// Types
interface RouteItem {
  name: string
  path: string
  label: string
  icon: string
  children?: RouteItem[]
}

type UserRole = 'Super Admin' | 'Admin' | 'HR' | 'Designer' | 'Project Officer' | 'Project Lead' | 'Project Manager' | 'Client Service' | 'Logistics Manager' | 'Logistics Officer' | 'Dispatcher' | 'Production Manager' | 'Production Staff' | 'Accounts' | 'Costing' | 'Manager' | 'Employee'

// Constants
const SUPER_ADMIN: UserRole = 'Super Admin'
const ADMIN: UserRole = 'Admin'
const DESIGNER: UserRole = 'Designer'
const CLIENT_SERVICE: UserRole = 'Client Service'

export function useRouteGuard() {
  const { permissions, isLoggedIn, user } = useAuth()
  const router = useRouter()

  /**
   * Checks if the current user has any of the specified roles
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!isLoggedIn.value || !user.value) return false
    const userRoles = user.value.roles || []
    return roles.some(role => userRoles.includes(role))
  }

  /**
   * Checks if the current user has super admin access
   */
  const isSuperAdmin = (): boolean => hasAnyRole([SUPER_ADMIN])

  /**
   * Checks if the current user has admin access
   */
  const isAdmin = (): boolean => hasAnyRole([SUPER_ADMIN, ADMIN])

  /**
   * Checks if the current user belongs to a specific department
   */
  const isInDepartment = (departmentNames: string[]): boolean => {
    if (!permissions.value?.user_department) return false
    const userDept = permissions.value.user_department.name.toLowerCase()
    return departmentNames.some(dept => dept.toLowerCase() === userDept)
  }

  /**
   * Main route access control function
   */
  const canAccessRoute = (routeName: string): boolean => {
    if (!isLoggedIn.value || !user.value) return false
    if (isSuperAdmin()) return true

    const routeAccessMap: Record<string, () => boolean> = {
      // Admin routes
      'admin-dashboard': isAdmin,
      'admin-users': isAdmin,
      'admin-employees': isAdmin,
      'admin-roles': isAdmin,
      'admin-departments': isAdmin,
      
      // HR routes
      'hr-dashboard': () => hasAnyRole(['HR']),
      'hr-employees': () => hasAnyRole(['HR']),
      
      // Department routes
      'department-*': () => hasAnyRole(['Manager', 'Employee'])
    }

    // Check exact match first
    const exactMatch = routeAccessMap[routeName]
    if (exactMatch) return exactMatch()

    // Check wildcard matches (e.g., department-*)
    for (const [pattern, check] of Object.entries(routeAccessMap)) {
      if (pattern.endsWith('*') && routeName.startsWith(pattern.slice(0, -1))) {
        return check()
      }
    }

    // Default deny for unknown routes
    return false
  }

  /**
   * Checks if the user can access a specific department
   */
  const canAccessDepartment = (departmentId: number): boolean => {
    if (!permissions.value) return false
    return (permissions.value.accessible_departments || []).includes(departmentId)
  }

  /**
   * Checks if the user can access projects
   */
  const canAccessProjects = (): boolean => {
    if (!isLoggedIn.value || !user.value) return false
    if (isSuperAdmin()) return true

    // Check department access
    if (isInDepartment(['projects', 'project'])) return true

    // Check project-specific roles
    const projectRoles: UserRole[] = ['Project Officer', 'Project Lead', 'Project Manager']
    return hasAnyRole(projectRoles)
  }

  /**
   * Checks if the user can access client service features
   */
  const canAccessClientService = (): boolean => {
    if (!isLoggedIn.value || !user.value) return false
    if (isSuperAdmin()) return true

    // Check role
    if (hasAnyRole([CLIENT_SERVICE])) return true

    // Check department
    return isInDepartment(['client service', 'client-service'])
  }

  /**
   * Checks if the user can access creatives/design features
   */
  const canAccessCreatives = (): boolean => {
    if (!isLoggedIn.value || !user.value) return false
    if (isSuperAdmin()) return true

    // Check role
    if (hasAnyRole([DESIGNER])) return true

    // Check department
    return isInDepartment(['creatives', 'creative', 'design'])
  }

  /**
   * Checks if the user can access finance features with required roles
   */
  const canAccessFinance = (requiredRoles: UserRole[]): boolean => {
    if (!isLoggedIn.value || !user.value) return false
    if (isSuperAdmin()) return true
    return hasAnyRole(requiredRoles)
  }

  /**
   * Checks if the user can access logistics features
   */
  const canAccessLogistics = (): boolean => {
    if (!isLoggedIn.value || !user.value) return false
    
    // Admins don't automatically get logistics access
    if (isAdmin()) return false
    
    // Check if user has logistics role
    const userRoles = user.value.roles || []
    if (userRoles.includes('Logistics')) return true
    
    // Check department
    if (isInDepartment(['logistics'])) return true
    
    // Check specific logistics-related roles
    const logisticsRoles: UserRole[] = ['Logistics Manager', 'Logistics Officer', 'Dispatcher']
    return hasAnyRole(logisticsRoles)
  }

  /**
   * Checks if the user can access production features with allowed roles
   */
  const canAccessProduction = (allowedRoles: UserRole[]): boolean => {
    if (!isLoggedIn.value || !user.value) return false
    if (isSuperAdmin()) return true
    return hasAnyRole(allowedRoles)
  }

  /**
   * Redirects the user to the appropriate route based on their role
   */
  const redirectToAppropriateRoute = (): void => {
    if (!isLoggedIn.value || !user.value) {
      router.push('/login')
      return
    }

    // Check access in order of priority
    if (isAdmin()) {
      router.push('/admin')
    } else if (hasAnyRole(['HR'])) {
      router.push('/hr')
    } else if (hasAnyRole(['Designer'])) {
      router.push('/creatives/design')
    } else if (hasAnyRole(['Manager', 'Employee']) && permissions.value?.user_department) {
      router.push(`/department/${permissions.value.user_department.id}`)
    } else {
      // Fallback to dashboard
      router.push('/dashboard')
    }
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
        { name: 'hr-employees', path: '/hr/employees', label: 'HR Employees', icon: '👷' }
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
    else if (userRoles.includes('Manager') || userRoles.includes('Employee')) {
      if (permissions.value?.user_department) {
        routes.push({
          name: `department-${permissions.value.user_department.id}`,
          path: `/department/${permissions.value.user_department.id}`,
          label: `${permissions.value.user_department.name} Dashboard`,
          icon: '🏢'
        })
      }
    }

    // Add projects routes for authorized users
    if (canAccessProjects()) {
      routes.push(
        { name: 'projects-dashboard', path: '/projects', label: 'Projects Dashboard', icon: '📊' },
        { name: 'projects-clients', path: '/projects/clients', label: 'Client Management', icon: '👥' },
        { name: 'projects-enquiries', path: '/projects/enquiries', label: 'Enquiries', icon: '📝' },
        { name: 'projects-list', path: '/projects/projects', label: 'Approved Projects', icon: '✅' },
        { name: 'projects-close-out-report', path: '/projects/close-out-report', label: 'Close-Out Report', icon: '📋' },
        { name: 'projects-matrix', path: '/projects/matrix', label: 'Matrix', icon: '📋' }
      )
    }

    // Add client service routes for authorized users
    if (canAccessClientService()) {
      routes.push(
        { name: 'client-service-dashboard', path: '/client-service', label: 'Client Service Dashboard', icon: '📊' },
        { name: 'client-service-clients', path: '/client-service/clients', label: 'Client Management', icon: '👥' },
        { name: 'client-service-enquiries', path: '/client-service/enquiries', label: 'Enquiry Management', icon: '📝' }
      )
    }

    // Add creatives routes for authorized users
    if (canAccessCreatives()) {
      routes.push(
        { name: 'design-dashboard', path: '/creatives/design', label: 'Design Department', icon: '📐' },
        { name: 'creatives-enquiries', path: '/creatives/enquiries', label: 'Enquiries', icon: '📝' },
        { name: 'creatives-element-templates', path: '/creatives/element-templates', label: 'Element Templates', icon: '📋' },
        { name: 'creatives-task-management', path: '/creatives/task-management', label: 'Task Management', icon: '📋' },

        // TODO: Add individual management routes when components are created
        // { name: 'creatives-designs', path: '/creatives/designs', label: 'Designs', icon: '📐' },
        // { name: 'creatives-mockups', path: '/creatives/mockups', label: 'Mockups', icon: '🏗️' },
        // { name: 'creatives-renders', path: '/creatives/renders', label: 'Renders', icon: '🎬' },
        // { name: 'creatives-materials', path: '/creatives/materials', label: 'Materials', icon: '📦' }
      )
    }

    // Add logistics routes for authorized users
    if (canAccessLogistics(['Logistics'])) {
      routes.push(
        { name: 'logistics-dashboard', path: '/logistics', label: 'Logistics Dashboard', icon: '🚚' },
        { name: 'logistics-shipments', path: '/logistics/shipments', label: 'Shipments', icon: '📦' },
        { name: 'logistics-vehicles', path: '/logistics/vehicles', label: 'Vehicles', icon: '🚛' },
        { name: 'logistics-drivers', path: '/logistics/drivers', label: 'Drivers', icon: '👤' },
        { name: 'logistics-routes', path: '/logistics/routes', label: 'Routes', icon: '🗺️' },
        { name: 'logistics-reports', path: '/logistics/reports', label: 'Reports', icon: '📊' },
        { name: 'logistics-loading-sheets', path: '/logistics/loading-sheets', label: 'Loading Sheets', icon: '📋' },
        { name: 'logistics-maintenance', path: '/logistics/maintenance', label: 'Maintenance', icon: '🛠️' },
        { name: 'logistics-expiries', path: '/logistics/expiries', label: 'Expiry Tracking', icon: '📅' }
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
        { name: 'finance-analytics', path: '/finance/analytics', label: 'Financial Analytics', icon: '📉' }
      )
    }
    // Add production routes for authorized users
    if (canAccessProduction(['Super Admin', 'Production Manager', 'Production Staff'])) {
      routes.push(
        { 
          name: 'production-dashboard', 
          path: '/production', 
          label: 'Production Dashboard', 
          icon: '🏭' 
        },
        { 
          name: 'production-work-orders', 
          path: '/production/work-orders', 
          label: 'Work Orders', 
          icon: '📋' 
        },
        { 
          name: 'production-reports', 
          path: '/production/reports', 
          label: 'Production Reports', 
          icon: '📊' 
        },
        {
          name: 'labor-assignments',
          path: '/production/labor-assignments',
          label: 'Labor Assignments',
          icon: '👷'
        },
      )
    }
    return routes
  }

  /**
   * Returns the appropriate panel title based on user's role and access
   */
  const getPanelTitle = (): string => {
    if (!user.value) return 'ERP System'

    // Check in order of priority
    if (isSuperAdmin()) return 'Super Admin Panel'
    if (isAdmin()) return 'Admin Panel'
    if (hasAnyRole(['HR'])) return 'HR Panel'
    if (canAccessProjects()) return 'Projects Panel'
    if (canAccessClientService()) return 'Client Service Panel'
    if (canAccessCreatives()) return 'Creatives Panel'
    if (canAccessFinance(['Accounts', 'Costing'])) return 'Finance Panel'

    if (canAccessProduction(['Production Manager', 'Production Staff'])) {
      return 'Production Panel'
    }

    // Department fallback
    if (permissions.value?.user_department) {
      return permissions.value.user_department.name
    }

    return 'ERP System'
  }

  /**
   * Returns the panel subtitle based on user's role
   */
  const getPanelSubtitle = (): string => {
    if (!user.value) return 'Management Dashboard'

    // Check in order of priority
    if (isSuperAdmin()) return 'Full System Access'
    if (isAdmin()) return 'System Administration'
    if (hasAnyRole(['HR'])) return 'Human Resources'

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

    // Department fallback
    if (permissions.value?.user_department) {
      return 'Department Dashboard'
    }

    return 'Management Dashboard'
  }

  // Expose only necessary functions
  return {
    // Access control
    canAccessRoute,
    canAccessDepartment,
    
    // Module access checks
    canAccessProjects,
    canAccessClientService,
    canAccessCreatives,
    canAccessFinance,
    canAccessLogistics,
    canAccessProduction,
    
    // Navigation
    redirectToAppropriateRoute,
    getAllowedRoutes,
    
    // UI helpers
    getPanelTitle,
    getPanelSubtitle
  }
}
