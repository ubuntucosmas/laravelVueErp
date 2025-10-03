import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

export const projectsRoutes: RouteRecordRaw[] = [
  {
    path: '/projects',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      // requiresProjectsAccess: true // Temporarily disabled for debugging
    },
    children: [
      {
        path: '',
        name: 'projects-coordination',
        component: () => import('../modules/projects/views/ProjectCoordination.vue'),
        meta: { title: 'Project Coordination' }
      },
      {
        path: 'dashboard',
        name: 'projects-dashboard',
        component: () => import('../modules/projects/views/ProjectsDashboard.vue'),
        meta: { title: 'Project Dashboard' }
      },
      {
        path: 'enquiries',
        name: 'projects-enquiries',
        component: () => import('../modules/projects/views/ProjectsEnquiries.vue'),
        meta: { title: 'Project Enquiries' }
      },
      // Future routes can be added here
      // {
      //   path: 'enquiries/:id',
      //   name: 'projects-enquiry-detail',
      //   component: () => import('../modules/projects/views/EnquiryDetailWorkflow.vue'),
      //   meta: { title: 'Enquiry Details' }
      // }
    ],
  },
]
