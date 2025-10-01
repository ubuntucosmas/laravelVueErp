// frontend/src/router/logistics.ts
import type { RouteRecordRaw } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

// Dashboard
const LogisticsDashboard = () => import('../modules/logistics/views/LogisticsDashboard.vue');

// Projects
const ProjectsIndex = () => import('../modules/logistics/views/ProjectsIndex.vue');

// Shipments
const ShipmentsList = () => import('../modules/logistics/views/shipments/ShipmentsList.vue');
const ShipmentDetail = () => import('../modules/logistics/components/ShipmentDetail.vue');

// Vehicles
const VehiclesList = () => import('../modules/logistics/views/vehicles/VehiclesList.vue');

// Drivers
const DriversList = () => import('../modules/logistics/views/drivers/DriversList.vue');

// Routes
const RoutesList = () => import('../modules/logistics/views/routes/RoutesList.vue');

// Loading Sheets
const LoadingSheetList = () => import('../modules/logistics/views/loading/LoadingSheetList.vue');
const LoadingSheetForm = () => import('../modules/logistics/views/loading/LoadingSheetForm.vue');
const LoadingSheetDetail = () => import('../modules/logistics/views/loading/LoadingSheetDetail.vue');

// Reports
const LogisticsReports = () => import('../modules/logistics/views/reports/LogisticsReports.vue');

// Maintenance
const MaintenanceList = () => import('../modules/logistics/views/maintenance/MaintenanceList.vue');

// Expiry Tracking
const ExpiryList = () => import('../modules/logistics/views/expiry/ExpiryList.vue');

export const logisticsRoutes: RouteRecordRaw[] = [
  {
    path: '/logistics',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      title: 'Logistics'
    },
    children: [
      {
        path: '',
        name: 'logistics-dashboard',
        component: LogisticsDashboard,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'projects',
        name: 'projects',
        component: ProjectsIndex,
        meta: { title: 'Projects' }
      },
      {
        path: 'shipments',
        name: 'shipments',
        component: ShipmentsList,
        meta: { title: 'Shipments' }
      },
      {
        path: 'vehicles',
        name: 'vehicles',
        component: VehiclesList,
        meta: { title: 'Vehicles' }
      },
      {
        path: 'drivers',
        name: 'drivers',
        component: DriversList,
        meta: { title: 'Drivers' }
      },
      {
        path: 'routes',
        name: 'routes',
        component: RoutesList,
        meta: { title: 'Routes' }
      },
      // Loading Sheets Routes
      {
        path: 'loading-sheets',
        name: 'loading-sheets',
        component: LoadingSheetList,
        meta: { title: 'Loading Sheets' }
      },
      {
        path: 'loading-sheets/new/outbound',
        name: 'new-outbound-loading-sheet',
        component: LoadingSheetForm,
        props: { type: 'outbound' },
        meta: { title: 'New Outbound Loading Sheet' }
      },
      {
        path: 'loading-sheets/new/return',
        name: 'new-return-loading-sheet',
        component: LoadingSheetForm,
        props: { type: 'return' },
        meta: { title: 'New Return Loading Sheet' }
      },
      {
        path: 'loading-sheets/:id',
        name: 'view-loading-sheet',
        component: LoadingSheetDetail,
        props: true,
        meta: { title: 'Loading Sheet Details' }
      },
      {
        path: 'loading-sheets/:id/edit',
        name: 'edit-loading-sheet',
        component: LoadingSheetForm,
        props: (route) => ({ id: route.params.id }),
        meta: { title: 'Edit Loading Sheet' }
      },
      {
        path: 'reports',
        name: 'logistics-reports',
        component: LogisticsReports,
        meta: { title: 'Reports' }
      },
      {
        path: 'maintenance',
        name: 'maintenance',
        component: MaintenanceList,
        meta: { title: 'Maintenance' }
      },
      {
        path: 'expiries',
        name: 'expiries',
        component: ExpiryList,
        meta: { title: 'Expiry Tracking' }
      }
    ]
  }
];

export default logisticsRoutes;