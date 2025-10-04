import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

export const clientServiceRoutes: RouteRecordRaw[] = [
  {
    path: '/client-service',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      requiresClientServiceAccess: true
    },
    children: [
      {
        path: '',
        name: 'client-service-dashboard',
        component: () => import('../modules/clientservice/views/ClientServiceDashboard.vue'),
        meta: { title: 'Client Service Dashboard' }
      },
      {
        path: 'clients',
        name: 'client-service-clients',
        component: () => import('../modules/clientService/views/ClientsManagement.vue'),
        meta: { title: 'Client Management' }
      },
      {
        path: 'enquiries',
        name: 'client-service-enquiries',
        component: () => import('../modules/shared/views/ProjectEnquiries.vue'),
        props: {
          department: 'client-service',
          pageTitle: 'Client Service Enquiries',
          pageDescription: 'Manage client enquiries and service requests',
          breadcrumbText: 'Client Service',
          breadcrumbLink: '/client-service'
        },
        meta: { title: 'Enquiry Management' }
      },
    ],
  },
]
