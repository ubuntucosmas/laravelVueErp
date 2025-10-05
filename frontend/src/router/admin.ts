import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import AdminDashboard from '../modules/admin/dashboard/AdminDashboard.vue'
import SuperAdminDashboard from '../modules/admin/dashboard/SuperAdminDashboard.vue'
import UserManagement from '../modules/admin/userManagement/UserManagement.vue'
import EmployeeManagement from '../modules/admin/employeeManagement/EmployeeManagement.vue'
import RoleManagement from '../modules/admin/roleManagement/RoleManagement.vue'
import DepartmentManagement from '../modules/admin/departmentManagement/DepartmentManagement.vue'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: MainLayout,
    meta: { requiresAuth: true, requiresRole: 'Admin' },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: AdminDashboard,
        meta: { title: 'Admin Dashboard' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: UserManagement,
        meta: { title: 'User Management' }
      },
      {
        path: 'employees',
        name: 'admin-employees',
        component: EmployeeManagement,
        meta: { title: 'Employee Management' }
      },
      {
        path: 'roles',
        name: 'admin-roles',
        component: RoleManagement,
        meta: { title: 'Role Management' }
      },
      {
        path: 'departments',
        name: 'admin-departments',
        component: DepartmentManagement,
        meta: { title: 'Department Management' }
      },
    ],
  },
  {
    path: '/super-admin',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'super-admin-dashboard',
        component: SuperAdminDashboard,
        meta: { title: 'Super Admin Dashboard' }
      },
    ],
  },
]
