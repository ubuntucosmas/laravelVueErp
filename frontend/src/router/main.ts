import type { RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AccessDenied from '../views/AccessDenied.vue'

export const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDenied,
    meta: { title: 'Access Denied' }
  },
]
