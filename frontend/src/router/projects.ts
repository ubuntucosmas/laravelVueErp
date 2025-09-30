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
        path: 'clients',
        name: 'projects-clients',
        component: () => import('../modules/projects/views/ClientsManagement.vue'),
        meta: { title: 'Client Management' }
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
        path: 'projectoverview',
        redirect: '/projects'
      },
      {
        path: 'projectoverview/:id',
        name: 'projects-projectoverview',
        component: () => import('../modules/projects/views/ProjectOverview.vue'),
        meta: { title: 'Project Overview' },
        children: [
          {
            path: '',
            name: 'project-summary',
            component: () => import('../modules/projects/views/ProjectOverview.vue'),
            meta: { title: 'Project Overview' }
          },
          {
            path: 'planning',
            name: 'project-planning',
            component: () => import('../modules/projects/views/phases/PlanningPhase.vue'),
            meta: { title: 'Planning Phase' }
          },
          {
            path: 'procurement',
            name: 'project-procurement',
            component: () => import('../modules/projects/views/phases/ProcurementPhase.vue'),
            meta: { title: 'Procurement Phase' }
          },
          {
            path: 'logistics',
            name: 'project-logistics',
            component: () => import('../modules/projects/views/phases/LogisticsPhase.vue'),
            meta: { title: 'Logistics Phase' }
          },
          {
            path: 'production',
            name: 'project-production',
            component: () => import('../modules/projects/views/phases/ProductionPhase.vue'),
            meta: { title: 'Production Phase' }
          },
          {
            path: 'setup',
            name: 'project-setup',
            component: () => import('../modules/projects/views/phases/SetupPhase.vue'),
            meta: { title: 'Setup Phase' }
          },
          {
            path: 'handover',
            name: 'project-handover',
            component: () => import('../modules/projects/views/phases/HandoverPhase.vue'),
            meta: { title: 'Handover Phase' }
          },
          {
            path: 'setdown',
            name: 'project-setdown',
            component: () => import('../modules/projects/views/phases/SetdownPhase.vue'),
            meta: { title: 'Setdown Phase' }
          },
          {
            path: 'report',
            name: 'project-report',
            component: () => import('../modules/projects/views/phases/ReportPhase.vue'),
            meta: { title: 'Final Report' }
          }
        ]
      },
      {
        path: 'projects/:id',
        redirect: (to) => {
          // Redirect to project overview when accessing project by ID
          return `/projects/projectoverview/${to.params.id}`
        }
      },

      {
        path: 'site-surveys',
        name: 'projects-site-surveys',
        component: () => import('../modules/projects/views/SiteSurveysManagement.vue'),
        meta: { title: 'Site Surveys Management' }
      },
      {
        path: 'matrix',
        name: 'projects-matrix',
        component: () => import('../modules/projects/views/ProjectsMatrix.vue'),
        meta: { title: 'Projects Matrix' }
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
