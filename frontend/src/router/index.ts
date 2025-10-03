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
    const { useRouteGuard } = await import('@/composables/useRouteGuard')
    const { canAccessDepartment } = useRouteGuard()

    const departmentId = parseInt(to.params.departmentId as string)
    if (!canAccessDepartment(departmentId)) {
      next('/access-denied')
      return
    }
  }

  // Check projects access
  if (to.meta.requiresProjectsAccess) {
    const { useRouteGuard } = await import('@/composables/useRouteGuard')
    const { canAccessProjects } = useRouteGuard()

    if (!canAccessProjects()) {
      console.log('Access denied to projects - redirecting to dashboard')
      next('/dashboard')
      return
    }
  }

  // Check client service access
  if (to.meta.requiresClientServiceAccess) {
    const { useRouteGuard } = await import('@/composables/useRouteGuard')
    const { canAccessClientService } = useRouteGuard()

    if (!canAccessClientService()) {
      console.log('Access denied to client service - redirecting to dashboard')
      next('/dashboard')
      return
    }
  }

  // Check creatives access
  if (to.meta.requiresCreativesAccess) {
    const { useRouteGuard } = await import('@/composables/useRouteGuard')
    const { canAccessCreatives } = useRouteGuard()

    if (!canAccessCreatives()) {
      console.log('Access denied to creatives - redirecting to dashboard')
      next('/dashboard')
      return
    }
  }

  // Check finance access
  if (to.path.startsWith('/finance') && to.path !== '/finance') {
    const { useRouteGuard } = await import('@/composables/useRouteGuard')
    const { canAccessFinance } = useRouteGuard()

    if (!canAccessFinance()) {
      console.log('Access denied to finance - redirecting to dashboard')
      next('/dashboard')
      return
    }
  }

  // Check procurement access
  if (to.meta.requiresProcurementAccess) {
    const { useRouteGuard } = await import('@/composables/useRouteGuard')
    const { canAccessProcurement } = useRouteGuard()

    if (!canAccessProcurement()) {
      console.log('Access denied to procurement - redirecting to dashboard')
      next('/dashboard')
      return
    }
  }

  next()
})

export default router
