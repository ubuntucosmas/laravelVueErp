import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import ProjectsDashboard from '../modules/projects/views/ProjectsDashboard.vue'

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
        name: 'projects-dashboard',
        component: ProjectsDashboard,
        meta: { title: 'Projects Dashboard' }
      },
      {
        path: 'enquiries',
        name: 'projects-enquiries',
        component: () => import('../modules/projects/views/EnquiriesManagement.vue'),
        meta: { title: 'Enquiries Management' }
      },
      {
        path: 'enquiries/:id',
        name: 'projects-enquiry-detail',
        component: () => import('../modules/projects/views/EnquiryDetailWorkflow.vue'),
        meta: { title: 'Enquiry Workflow' }
      },
      {
        path: 'projects',
        name: 'projects-list',
        component: () => import('../modules/projects/views/ProjectsManagement.vue'),
        meta: { title: 'Approved Projects' }
      },
      {
        path: 'projects/:id',
        redirect: (to) => {
          // Assuming project id can be used to find enquiry id, or if project id == enquiry id
          return `/projects/enquiries/${to.params.id}`
        }
      },

      {
        path: 'site-surveys',
        name: 'projects-site-surveys',
        component: () => import('../modules/projects/views/SiteSurveysManagement.vue'),
        meta: { title: 'Site Surveys Management' }
      },
      {
        path: 'materials',
        redirect: '/projects/enquiries'
      },
      {
        path: 'close-out-report/:projectId?',
        name: 'projects-close-out-report',
        component: () => import('../modules/projects/views/ProjectCloseOutReport.vue'),
        meta: { title: 'Project Close-Out Report' }
      }
    ],
  },
]
