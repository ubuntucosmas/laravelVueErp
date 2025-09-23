import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const financeRoutes: RouteRecordRaw[] = [
  {
    path: '/finance',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      roles: ['Accounts', 'Costing'],
    },
    children: [
      {
        path: '',
        name: 'finance-dashboard',
        component: () => import('../modules/finance/views/FinanceDashboard.vue'),
        meta: { title: 'Finance Dashboard' }
      },
      {
        path: 'budgeting',
        name: 'finance-budgeting',
        component: () => import('../modules/finance/views/BudgetManagement.vue'),
        meta: { title: 'Budget Management' }
      },
      {
        path: 'costing',
        name: 'finance-costing',
        component: () => import('../modules/finance/views/CostAnalysis.vue'),
        meta: { title: 'Cost Analysis' }
      },
      {
        path: 'invoicing',
        name: 'finance-invoicing',
        component: () => import('../modules/finance/views/InvoiceManagement.vue'),
        meta: { title: 'Invoice Management' }
      },
      {
        path: 'reporting',
        name: 'finance-reporting',
        component: () => import('../modules/finance/views/FinancialReports.vue'),
        meta: { title: 'Financial Reports' }
      },
      {
        path: 'enquiries',
        name: 'finance-enquiries',
        component: () => import('../modules/finance/views/FinanceEnquiries.vue'),
        meta: { title: 'Financial Enquiries' }
      },
      {
        path: 'analytics',
        name: 'finance-analytics',
        component: () => import('../modules/finance/views/FinancialAnalytics.vue'),
        meta: { title: 'Financial Analytics' }
      }
    ],
  },
]

export default financeRoutes
