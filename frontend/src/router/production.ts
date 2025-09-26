// src/router/production.ts
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

export const productionRoutes: RouteRecordRaw[] = [
  {
    path: '/production',
    component: MainLayout,
    meta: { 
      requiresAuth: true,
      requiresRole: true
    },
    children: [
      {
        path: '',
        name: 'production-dashboard',
        component: () => import('../modules/production/views/Dashboard.vue'),
        meta: { 
          title: 'Production Dashboard',
          requiresAuth: true
        },
      },
      {
        path: 'work-orders',
        name: 'production-work-orders',
        component: () => import('../modules/production/views/work-orders/Index.vue'),
        meta: { 
          title: 'Work Orders',
          requiresAuth: true
        },
      },
      {
        path: 'work-orders/create',
        name: 'production-work-orders-create',
        component: () => import('../modules/production/views/work-orders/Create.vue'),
        meta: { 
          title: 'Create Work Order',
          requiresAuth: true
        },
      },
      {
        path: 'work-orders/:id',
        name: 'production-work-order-detail',
        component: () => import('../modules/production/views/work-orders/Detail.vue'),
        meta: { 
          title: 'Work Order Details',
          requiresAuth: true
        },
      },
      {
        path: 'reports',
        name: 'production-reports',
        component: () => import('../modules/production/views/reports/Index.vue'),
        meta: { 
          title: 'Production Reports',
          requiresAuth: true
        },
      },
      {
        path: 'labor-assignments',
        name: 'labor-assignments',
        component: () => import('@/modules/production/views/labor-assignments/Index.vue'),
        meta: { 
          title: 'Labor Assignments',
          requiresAuth: true 
        }
      },
      {
        path: 'labor-assignments/:id',
        name: 'labor-assignments-assign',
        component: () => import('@/modules/production/views/labor-assignments/Assign.vue'),
        meta: { 
          title: 'Assign Labor',
          requiresAuth: true 
        },
        props: true
      },
    ]
  }
]