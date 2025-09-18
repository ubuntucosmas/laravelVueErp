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
        { name: 'projects-list', path: '/projects/projects', label: 'Approved Projects', icon: '✅' }
      )
    }

    return routes
  }

  return {
    canAccessRoute,
    canAccessDepartment,
    canAccessProjects,
    redirectToAppropriateRoute,
    getAllowedRoutes
  }
}