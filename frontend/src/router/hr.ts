import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HRDashboard from '../modules/hr/views/HRDashboard.vue'
import EmployeeManagement from '../modules/hr/views/EmployeeManagement.vue'

export const hrRoutes: RouteRecordRaw[] = [
  {
    path: '/hr',
    component: MainLayout,
    meta: { requiresAuth: true }, // Allow authenticated users, role check handled by backend
    children: [
      {
        path: '',
        name: 'hr-dashboard',
        component: HRDashboard,
        meta: { title: 'HR Dashboard' }
      },
      {
        path: 'employees',
        name: 'hr-employees',
        component: EmployeeManagement,
        meta: { title: 'Employee Management' }
      },
    ],
  },
]