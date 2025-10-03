import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
// import DesignDashboard from '../modules/creatives/views/DesignDashboard.vue' // Commented out - creatives module not implemented

export const creativesRoutes: RouteRecordRaw[] = [
  {
    path: '/creatives',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      requiresRole: true,
      // requiresCreativesAccess: true // Will be implemented when backend is ready
    },
    children: [
      {
        path: '',
        redirect: '/creatives/design'
      },
      // Commented out - creatives module not implemented
      // {
      //   path: 'design',
      //   name: 'design-dashboard',
      //   component: DesignDashboard,
      //   meta: {
      //     title: 'Creatives and Design Dashboard',
      //     requiresAuth: true,
      //     requiresRole: true
      //   }
      // },
      {
        path: 'enquiries',
        name: 'creatives-enquiries',
        component: () => import('../modules/shared/views/ProjectEnquiries.vue'),
        props: {
          department: 'creatives',
          pageTitle: 'Creatives Enquiries',
          pageDescription: 'Manage enquiries for creative design and development',
          breadcrumbText: 'Creatives',
          breadcrumbLink: '/creatives'
        },
        meta: {
          title: 'Creatives Enquiries',
          requiresAuth: true,
          requiresRole: true
        }
      },
      // Commented out - creatives module not implemented
      // {
      //   path: 'tasks',
      //   name: 'creatives-tasks',
      //   component: () => import('../modules/creatives/views/TaskManagement.vue'),
      //   meta: { title: 'Task Management' }
      // },
      // {
      //   path: 'materials',
      //   name: 'creatives-materials',
      //   component: () => import('../modules/creatives/views/TaskManagement.vue'),
      //   meta: { title: 'Material & Cost Listing' },
      //   props: { taskType: 'materials' }
      // },
      // {
      //   path: 'final-design',
      //   name: 'creatives-final-design',
      //   component: () => import('../modules/creatives/views/TaskManagement.vue'),
      //   meta: { title: 'Final Design' },
      //   props: { taskType: 'final-design' }
      // },
      // {
      //   path: 'element-templates',
      //   name: 'creatives-element-templates',
      //   component: () => import('../modules/creatives/views/ElementTemplates.vue'),
      //   meta: { title: 'Element Templates' }
      // },
      // Management routes - only dashboard exists for now
      // TODO: Create individual management components
      // {
      //   path: 'designs',
      //   name: 'creatives-designs',
      //   component: () => import('../modules/creatives/views/DesignsManagement.vue'),
      //   meta: { title: 'Designs Management' }
      // },
      // {
      //   path: 'designs/:id',
      //   name: 'creatives-design-detail',
      //   component: () => import('../modules/creatives/views/DesignDetail.vue'),
      //   meta: { title: 'Design Detail' }
      // },
      // {
      //   path: 'mockups',
      //   name: 'creatives-mockups',
      //   component: () => import('../modules/creatives/views/MockupsManagement.vue'),
      //   meta: { title: 'Mockups Management' }
      // },
      // {
      //   path: 'mockups/:id',
      //   name: 'creatives-mockup-detail',
      //   component: () => import('../modules/creatives/views/MockupDetail.vue'),
      //   meta: { title: 'Mockup Detail' }
      // },
      // {
      //   path: 'renders',
      //   name: 'creatives-renders',
      //   component: () => import('../modules/creatives/views/RendersManagement.vue'),
      //   meta: { title: 'Renders Management' }
      // },
      // {
      //   path: 'renders/:id',
      //   name: 'creatives-render-detail',
      //   component: () => import('../modules/creatives/views/RenderDetail.vue'),
      //   meta: { title: 'Render Detail' }
      // },
      // {
      //   path: 'materials',
      //   name: 'creatives-materials',
      //   component: () => import('../modules/creatives/views/MaterialsManagement.vue'),
      //   meta: { title: 'Materials Management' }
      // },
      // {
      //   path: 'materials/:id',
      //   name: 'creatives-material-detail',
      //   component: () => import('../modules/creatives/views/MaterialDetail.vue'),
      //   meta: { title: 'Material List Detail' }
      // }
    ],
  },
]
