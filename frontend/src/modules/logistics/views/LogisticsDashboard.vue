<template>
  <div class="logistics-dashboard">
    <h1>Logistics Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-700">Active Shipments</h3>
        <p class="text-3xl font-bold text-blue-600">{{ shipmentStats.active }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-700">Available Vehicles</h3>
        <p class="text-3xl font-bold text-green-600">{{ vehicleStats.available }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-700">Active Drivers</h3>
        <p class="text-3xl font-bold text-purple-600">{{ availableDrivers }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-700">Deliveries Today</h3>
        <p class="text-3xl font-bold text-yellow-600">{{ deliveryStats.today }}</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Recent Shipments</h2>
        <div v-if="recentShipments.length === 0" class="text-gray-500">
          No recent shipments found.
        </div>
        <div v-else class="space-y-4">
          <div v-for="shipment in recentShipments" :key="shipment.id" 
               class="border-b pb-2 last:border-b-0">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">#{{ shipment.trackingNumber }}</p>
                <p class="text-sm text-gray-600">{{ shipment.origin }} → {{ shipment.destination }}</p>
              </div>
              <span :class="statusClasses(shipment.status)">
                {{ formatStatus(shipment.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Vehicle Status</h2>
        <div v-if="vehicles.length === 0" class="text-gray-500">
          No vehicle data available.
        </div>
        <div v-else class="space-y-3">
          <div v-for="vehicle in vehicles" :key="vehicle.id" 
               class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <div>
              <p class="font-medium">{{ vehicle.registrationNumber }}</p>
              <p class="text-sm text-gray-600">{{ vehicle.type }} • {{ vehicle.capacity }}</p>
            </div>
            <span :class="vehicleStatusClasses(vehicle.status)">
              {{ formatVehicleStatus(vehicle.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Projects Requiring Assignment</h2>
          <router-link to="/logistics/projects" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All →
          </router-link>
        </div>
        <div v-if="projects.length === 0" class="text-gray-500 text-center py-4">
          No projects requiring logistics assignment.
        </div>
        <div v-else class="space-y-3">
          <div v-for="project in projects.slice(0, 3)" :key="project.id" 
               class="p-3 border rounded-lg hover:bg-gray-50">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="font-medium text-sm">{{ project.name }}</p>
                <p class="text-xs text-gray-600">{{ project.client }}</p>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </div>
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>{{ project.items.length }} items</span>
              <span>{{ project.deliveryAddress }}</span>
            </div>
          </div>
          <div v-if="projects.length > 3" class="text-center pt-2">
            <span class="text-sm text-gray-500">+{{ projects.length - 3 }} more projects</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
        <div class="space-y-3">
          <router-link to="/logistics/projects" 
                       class="block w-full p-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Manage Projects
          </router-link>
          <router-link to="/logistics/vehicles" 
                       class="block w-full p-3 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            Manage Vehicles
          </router-link>
          <router-link to="/logistics/drivers" 
                       class="block w-full p-3 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Manage Drivers
          </router-link>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Assignment Summary</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Available Vehicles</span>
            <span class="text-lg font-semibold text-green-600">{{ vehicleStats.available }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Available Drivers</span>
            <span class="text-lg font-semibold text-blue-600">{{ availableDrivers }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Projects in Transit</span>
            <span class="text-lg font-semibold text-purple-600">{{ inTransitProjects }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Completed Today</span>
            <span class="text-lg font-semibold text-green-600">{{ deliveredProjects }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import type { Shipment, Vehicle } from '../types';
import { useLogistics } from '../composables/useLogistics';

export default defineComponent({
  name: 'LogisticsDashboard',

  setup() {
    // Use the logistics composable
    const {
      projects,
      pendingProjects,
      availableVehicles,
      availableDrivers,
      inTransitProjects,
      deliveredProjects,
      fetchProjects,
      loading,
      error
    } = useLogistics();
    
    // Fetch projects when component is mounted
    onMounted(async () => {
      await fetchProjects();
    });

    // Mock data - in a real app, this would come from an API
    const recentShipments = ref<Shipment[]>([]);
    const vehicles = ref<Vehicle[]>([]);

    const shipmentStats = ref({
      active: 0,
      delivered: 0,
      delayed: 0,
      total: 0
    });

    const vehicleStats = ref({
      available: 0,
      inUse: 0,
      inMaintenance: 0
    });

    const driverStats = ref({
      available: 0,
      onDelivery: 0,
      onLeave: 0
    });

    const deliveryStats = ref({
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    });
    
    // Format status for display
    const formatStatus = (status: string): string => {
      return status.replace(/_/g, ' ').replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };
    
    const formatVehicleStatus = (status: string): string => {
      const statusMap: Record<string, string> = {
        'available': 'Available',
        'in_use': 'In Use',
        'maintenance': 'Maintenance',
        'out_of_service': 'Out of Service'
      };
      return statusMap[status] || status;
    };

    // Status badge classes
    const statusClasses = (status: string): string => {
      const base = 'px-2 py-1 text-xs font-medium rounded-full';
      const statusMap: Record<string, string> = {
        'pending': `${base} bg-yellow-100 text-yellow-800`,
        'in_transit': `${base} bg-blue-100 text-blue-800`,
        'delivered': `${base} bg-green-100 text-green-800`,
        'delayed': `${base} bg-red-100 text-red-800`,
        'cancelled': `${base} bg-gray-100 text-gray-800`
      };
      return statusMap[status] || base;
    };
    
    const vehicleStatusClasses = (status: string): string => {
      const base = 'px-2 py-1 text-xs font-medium rounded-full';
      const statusMap: Record<string, string> = {
        'available': `${base} bg-green-100 text-green-800`,
        'in_use': `${base} bg-blue-100 text-blue-800`,
        'maintenance': `${base} bg-yellow-100 text-yellow-800`,
        'out_of_service': `${base} bg-red-100 text-red-800`
      };
      return statusMap[status] || base;
    };
    
    // Load initial data
    const loadData = () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data
        recentShipments.value = [
          {
            id: 1,
            trackingNumber: 'SHIP123456',
            projectName: 'Office Relocation',
            site: 'Acme Corp HQ',
            loadingTime: '2023-06-10T08:00:00Z',
            departureTime: '2023-06-10T09:30:00Z',
            vehicleAllocated: 'KAA 123A',
            poIncharge: 'John Smith',
            remarks: 'Urgent delivery requested',
            status: 'in_transit',
            origin: 'Nairobi Warehouse',
            destination: 'Mombasa Showroom',
            estimatedDelivery: '2023-06-15',
            carrier: 'Speed Logistics',
            items: [
              { id: 1, name: 'Office Chairs', quantity: 10 }
            ],
            createdAt: '2023-06-10T09:00:00Z',
            updatedAt: '2023-06-11T14:30:00Z'
          },
          {
            id: 2,
            trackingNumber: 'SHIP789012',
            projectName: 'Conference Setup',
            site: 'Kisumu Branch',
            loadingTime: '2023-06-05T10:00:00Z',
            departureTime: '2023-06-05T11:00:00Z',
            vehicleAllocated: 'KAB 456B',
            poIncharge: 'Mary Johnson',
            status: 'delivered',
            origin: 'Nakuru Warehouse',
            destination: 'Kisumu Branch',
            estimatedDelivery: '2023-06-12',
            actualDelivery: '2023-06-12',
            carrier: 'Swift Movers',
            items: [
              { id: 2, name: 'Conference Tables', quantity: 5 }
            ],
            createdAt: '2023-06-05T11:20:00Z',
            updatedAt: '2023-06-12T16:45:00Z'
          }
        ];
        
        vehicles.value = [
          {
            id: 1,
            registrationNumber: 'KAA 123A',
            type: '3-Ton Truck',
            capacity: '5,000 kg',
            status: 'available',
            lastMaintenanceDate: '2023-05-28',
            nextMaintenanceDate: '2023-07-28'
          },
          {
            id: 2,
            registrationNumber: 'KAB 456B',
            type: '5-Ton Truck',
            capacity: '8,000 kg',
            status: 'in_use',
            lastMaintenanceDate: '2023-06-01',
            nextMaintenanceDate: '2023-08-01'
          },
          {
            id: 3,
            registrationNumber: 'KAC 789C',
            type: 'Pickup Truck',
            capacity: '1,500 kg',
            status: 'maintenance',
            lastMaintenanceDate: '2023-05-20',
            nextMaintenanceDate: '2023-06-20'
          }
        ];
        
        // Update stats
        shipmentStats.value = {
          active: 5,
          delivered: 12,
          delayed: 1,
          total: 18
        };
        
        vehicleStats.value = {
          available: 2,
          inUse: 1,
          inMaintenance: 1
        };
        
        driverStats.value = {
          available: 3,
          onDelivery: 2,
          onLeave: 1
        };
        
        deliveryStats.value = {
          today: 3,
          thisWeek: 15,
          thisMonth: 42
        };
      }, 500);
    };
    
    onMounted(() => {
      loadData();
    });
    
    return {
      // From composable
      projects,
      pendingProjects,
      availableVehicles,
      availableDrivers,
      inTransitProjects,
      deliveredProjects,

      // Local data
      recentShipments,
      vehicles,
      shipmentStats,
      vehicleStats,
      deliveryStats,
      formatStatus,
      formatVehicleStatus,
      statusClasses,
      vehicleStatusClasses
    };
  }
});
</script>

<style scoped>
.logistics-dashboard {
  @apply p-4 md:p-6;
}

h1 {
  @apply text-2xl font-bold mb-6 text-gray-800;
}

h2 {
  @apply text-lg font-semibold text-gray-700 mb-3;
}
</style>
