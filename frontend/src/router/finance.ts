import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

export const financeRoutes: RouteRecordRaw[] = [
  {
    path: '/finance',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      requiresFinanceAccess: true
    },
    children: [
      {
        path: '',
        redirect: '/finance/dashboard'
      },
      {
        path: 'dashboard',
        name: 'finance-dashboard',
        component: () => import('../views/Dashboard.vue'), // Placeholder for now
        meta: {
          title: 'Finance Dashboard',
          requiresAuth: true
        }
      },
      {
        path: 'petty-cash',
        name: 'finance-petty-cash',
        component: () => import('../modules/finance/petty-cash/views/PettyCashIndex.vue'),
        meta: {
          title: 'Petty Cash Management'
        }
      },
      {
        path: 'petty-cash/reports',
        name: 'finance-petty-cash-reports',
        component: () => import('../modules/finance/petty-cash/views/PettyCashReports.vue'),
        meta: {
          title: 'Petty Cash Reports'
        }
      }
    ],
  },
]
