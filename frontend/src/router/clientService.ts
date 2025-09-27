import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

export const clientServiceRoutes: RouteRecordRaw[] = [
  {
    path: '/client-service',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      // requiresClientServiceAccess: true // Temporarily disabled for debugging
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
        component: () => import('../modules/clientService/views/EnquiriesManagement.vue'),
        meta: { title: 'Enquiry Management' }
      },
      {
        path: 'enquiries/:id',
        name: 'client-service-enquiry-detail',
        component: () => import('../modules/clientService/views/EnquiryDetail.vue'),
        meta: { title: 'Enquiry Details' }
      }
    ],
  },
]
