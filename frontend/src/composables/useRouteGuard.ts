import { useAuth } from './useAuth'
import { useRouter } from 'vue-router'

export function useRouteGuard() {
  const { permissions, isLoggedIn, user } = useAuth()
  const router = useRouter()

  const canAccessRoute = (routeName: string): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    const userRoles = user.value.roles || []

    // Super Admin can access everything
    if (userRoles.includes('Super Admin')) {
      return true
    }

    switch (routeName) {
      // Admin routes - only Admin and Super Admin
      case 'admin-dashboard':
      case 'admin-users':
      case 'admin-employees':
      case 'admin-roles':
      case 'admin-departments':
        return userRoles.includes('Admin') || userRoles.includes('Super Admin')

      // HR routes - only HR and Super Admin
      case 'hr-dashboard':
      case 'hr-employees':
        return userRoles.includes('HR') || userRoles.includes('Super Admin')

      // Department-specific routes - Managers, Employees, and Super Admin
      default:
        if (routeName.startsWith('department-')) {
          return userRoles.includes('Manager') || userRoles.includes('Employee') || userRoles.includes('Super Admin')
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

    const userRoles = user.value.roles || []

    // Super Admin can access everything
    if (userRoles.includes('Super Admin')) {
      return true
    }

    // Check if user belongs to projects department
    if (permissions.value?.user_department) {
      const deptName = permissions.value.user_department.name.toLowerCase()
      if (deptName === 'projects' || deptName === 'project') {
        return true
      }
    }

    // Check for projects-specific roles
    const projectsRoles = ['Project Officer', 'Project Lead', 'Project Manager']
    return projectsRoles.some(role => userRoles.includes(role))
  }

  const canAccessClientService = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    const userRoles = user.value.roles || []

    // Super Admin can access everything
    if (userRoles.includes('Super Admin')) {
      return true
    }

    // Check if user has Client Service role
    if (userRoles.includes('Client Service')) {
      return true
    }

    // Check if user belongs to client service department
    if (permissions.value?.user_department) {
      const deptName = permissions.value.user_department.name.toLowerCase()
      if (deptName === 'client service' || deptName === 'client-service') {
        return true
      }
    }

    return false
  }

  const canAccessCreatives = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    const userRoles = user.value.roles || []

    // Super Admin can access everything
    if (userRoles.includes('Super Admin')) {
      return true
    }

    // Check if user has Designer role
    if (userRoles.includes('Designer')) {
      return true
    }

    // Check if user belongs to Creatives department
    if (permissions.value?.user_department) {
      const deptName = permissions.value.user_department.name.toLowerCase()
      if (deptName === 'creatives' || deptName === 'creative' || deptName === 'design') {
        return true
      }
    }

    return false
  }

  const canAccessFinance = (requiredRoles: string[]): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    const userRoles = user.value.roles || []

    // Super Admin can access everything
    if (userRoles.includes('Super Admin')) {
      return true
    }

    // Check if user has any of the required roles
    return requiredRoles.some(role => userRoles.includes(role))
  }

  const canAccessProcurement = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    const userRoles = user.value.roles || []

    // Super Admin can access everything
    if (userRoles.includes('Super Admin')) {
      return true
    }

    // Check if user has Procurement role
    if (userRoles.includes('Procurement Officer')) {
      return true
    }

    // Check if user belongs to procurement department
    if (permissions.value?.user_department) {
      const deptName = permissions.value.user_department.name.toLowerCase()
      if (deptName === 'procurement' || deptName === 'purchasing') {
        return true
      }
    }

    return false
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
