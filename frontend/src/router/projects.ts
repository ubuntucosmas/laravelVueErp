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
        path: 'department',
        name: 'projects-department-dashboard',
        component: () => import('../modules/projects/views/ProjectsDepartmentDashboard.vue'),
        meta: { title: 'Project Coordination' }
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
        component: () => import('../modules/projects/views/EnquiryWorkflow.vue'),
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


      // Materials management is now handled through departmental tasks
      {
        path: 'close-out-report/:projectId?',
        name: 'projects-close-out-report',
        component: () => import('../modules/projects/views/ProjectCloseOutReport.vue'),
        meta: { title: 'Project Close-Out Report' }
      },
      {
        path: 'departmental-tasks',
        name: 'projects-departmental-tasks',
        component: () => import('../modules/projects/components/DepartmentalTaskDashboard.vue'),
        meta: { title: 'Departmental Tasks' }
      },
      {
        path: 'projects/:projectId/tasks',
        name: 'projects-project-tasks',
        component: () => import('../modules/projects/components/DepartmentalTaskDashboard.vue'),
        meta: { title: 'Project Departmental Tasks' },
        props: (route) => ({
          projectId: parseInt(route.params.projectId as string)
        })
      },
      {
        path: 'projects/:projectId/phases/:phaseId/tasks',
        name: 'projects-phase-tasks',
        component: () => import('../modules/projects/components/DepartmentalTaskDashboard.vue'),
        meta: { title: 'Phase Departmental Tasks' },
        props: (route) => ({
          projectId: parseInt(route.params.projectId as string),
          phaseId: parseInt(route.params.phaseId as string)
        })
      }
    ],
  },
]
