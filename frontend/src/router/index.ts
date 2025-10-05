import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import modular routes
import { mainRoutes } from './main'
import { adminRoutes } from './admin'
import { hrRoutes } from './hr'
import { projectsRoutes } from './projects'
import { procurementRoutes } from './procurement'
import { clientServiceRoutes } from './clientservice'
import { creativesRoutes } from './creatives'
import financeRoutes from './finance'

// Combine all routes
const routes: RouteRecordRaw[] = [
  ...mainRoutes,
  ...adminRoutes,
  ...hrRoutes,
  ...projectsRoutes,
  ...procurementRoutes,
  ...clientServiceRoutes,
  ...creativesRoutes,
  ...financeRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Simple token-based authentication check
    const token = localStorage.getItem('auth_token')
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

    if (!token || !isLoggedIn) {
      next('/login')
      return
    }
  }

  // Check role-based access - simplified for now
  if (to.meta.requiresRole) {
    // For now, allow access if authenticated
    // Role checking will be handled by components
    const token = localStorage.getItem('auth_token')
    if (!token) {
      next('/login')
      return
    }
  }

  // Check department access
  if (to.meta.requiresDepartment) {
    const { canAccessDepartment } = await import('@/utils/routerGuards')

    const departmentId = parseInt(to.params.departmentId as string)
    if (!(await canAccessDepartment(departmentId))) {
      next('/access-denied')
      return
    }
  }

  // Check projects access
  if (to.meta.requiresProjectsAccess) {
    const { canAccessProjects } = await import('@/utils/routerGuards')

    if (!(await canAccessProjects())) {
      console.log('Access denied to projects - redirecting to appropriate dashboard')
      // Avoid infinite redirect by not redirecting to a projects route
      // Instead, redirect to a safe route based on user permissions
      const token = localStorage.getItem('auth_token')
      if (token) {
        // For now, redirect to HR dashboard as a safe fallback
        // In a real app, you'd determine the appropriate dashboard
        next('/hr')
      } else {
        next('/login')
      }
      return
    }
  }

  // Check client service access
  if (to.meta.requiresClientServiceAccess) {
    const { canAccessClientService } = await import('@/utils/routerGuards')

    if (!(await canAccessClientService())) {
      console.log('Access denied to client service - redirecting to client service dashboard')
      next('/client-service')
      return
    }
  }

  // Check creatives access
  if (to.meta.requiresCreativesAccess) {
    const { canAccessCreatives } = await import('@/utils/routerGuards')

    if (!(await canAccessCreatives())) {
      console.log('Access denied to creatives - redirecting to creatives enquiries')
      next('/creatives/enquiries')
      return
    }
  }

  // Check finance access
  if (to.path.startsWith('/finance') && to.path !== '/finance') {
    const { canAccessFinance } = await import('@/utils/routerGuards')

    if (!(await canAccessFinance())) {
      console.log('Access denied to finance - redirecting to finance dashboard')
      next('/finance')
      return
    }
  }

  // Check procurement access
  if (to.meta.requiresProcurementAccess) {
    const { canAccessProcurement } = await import('@/utils/routerGuards')

    if (!(await canAccessProcurement())) {
      console.log('Access denied to procurement - redirecting to procurement dashboard')
      next('/procurement')
      return
    }
  }

  next()
})

export default router
