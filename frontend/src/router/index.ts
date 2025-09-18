import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import modular routes
import { mainRoutes } from './main'
import { adminRoutes } from './admin'
import { hrRoutes } from './hr'
import { projectsRoutes } from './projects'

// Combine all routes
const routes: RouteRecordRaw[] = [
  ...mainRoutes,
  ...adminRoutes,
  ...hrRoutes,
  ...projectsRoutes,
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

  next()
})

export default router
