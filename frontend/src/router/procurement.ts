import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

export const procurementRoutes: RouteRecordRaw[] = [
  {
    path: '/procurement',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      requiresProcurementAccess: true
    },
    children: [
      {
        path: '',
        name: 'procurement-dashboard',
        component: () => import('../modules/procurement/views/ProcurementDashboard.vue'),
        meta: { title: 'Procurement Department Dashboard' }
      },
      {
        path: 'materials',
        name: 'procurement-materials',
        component: () => import('../modules/projects/components/DepartmentalTaskDashboard.vue'),
        meta: { title: 'Material Specifications' },
        props: { departmentId: 'procurement' }
      },
      {
        path: 'vendors',
        name: 'procurement-vendors',
        component: () => import('../modules/projects/components/DepartmentalTaskDashboard.vue'),
        meta: { title: 'Vendor Management' },
        props: { departmentId: 'procurement' }
      },
      {
        path: 'orders',
        name: 'procurement-orders',
        component: () => import('../modules/projects/components/DepartmentalTaskDashboard.vue'),
        meta: { title: 'Purchase Orders' },
        props: { departmentId: 'procurement' }
      },
      {
        path: 'orders/new',
        name: 'procurement-new-order',
        component: () => import('../modules/projects/components/MaterialsModal.vue'), // Placeholder - would need order creation component
        meta: { title: 'Create Purchase Order' }
      },
      {
        path: 'orders/:id',
        name: 'procurement-order-detail',
        component: () => import('../modules/projects/components/MaterialsModal.vue'), // Placeholder - would need order detail component
        meta: { title: 'Purchase Order Details' },
        props: true
      },
      {
        path: 'quotations',
        name: 'procurement-quotations',
        component: () => import('../modules/projects/components/DepartmentalTaskDashboard.vue'),
        meta: { title: 'Supplier Quotations' },
        props: { departmentId: 'procurement' }
      },
      {
        path: 'tasks',
        name: 'procurement-tasks',
        component: () => import('../modules/projects/components/DepartmentalTaskDashboard.vue'),
        meta: { title: 'My Procurement Tasks' },
        props: { departmentId: 'procurement' }
      }
    ]
  }
]
