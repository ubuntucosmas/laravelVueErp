<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Logistics Reports</h1>
      <div class="flex space-x-2">
        <DateRangePicker v-model="dateRange" />
        <Button @click="exportToExcel" variant="outline">
          <Download class="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard 
        title="Total Shipments" 
        :value="shipmentStats.total" 
        :change="shipmentStats.change" 
        icon="Package"
      />
      <StatCard 
        title="On Time Delivery" 
        :value="`${deliveryStats.onTimeRate}%`" 
        :change="deliveryStats.change"
        icon="CheckCircle"
        variant="success"
      />
      <StatCard 
        title="Vehicle Utilization" 
        :value="`${vehicleStats.utilization}%`" 
        :change="vehicleStats.change"
        icon="Truck"
        variant="info"
      />
      <StatCard 
        title="Loading Sheets" 
        :value="loadingSheetStats.completed" 
        :subtext="`of ${loadingSheetStats.total}`"
        icon="ClipboardList"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart :data="shipmentStatusData" />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart :data="vehicleUtilizationData" />
          </CardContent>
        </Card>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Loading Sheets</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            :columns="loadingSheetColumns" 
            :data="recentLoadingSheets" 
            :pagination="true"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-vue-next';
import DateRangePicker from '@/components/DateRangePicker.vue';
import StatCard from '@/components/StatCard.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import DataTable from '@/components/DataTable.vue';
import { useLoadingSheetStore } from '@/stores/loadingSheetStore';
import { useShipmentStore } from '@/stores/shipmentStore';
import { useVehicleStore } from '@/stores/vehicleStore';

// Date range for filtering reports
const dateRange = ref({
  from: new Date(new Date().setDate(new Date().getDate() - 30)),
  to: new Date()
});

// Mock data - Replace with actual API calls
const shipmentStats = ref({
  total: 124,
  change: 12.5
});

const deliveryStats = ref({
  onTimeRate: 87.5,
  change: 2.3
});

const vehicleStats = ref({
  utilization: 65,
  change: -5.2
});

const loadingSheetStats = ref({
  completed: 42,
  total: 58,
  change: 8.1
});

// Chart data
const shipmentStatusData = computed(() => ({
  labels: ['Pending', 'In Transit', 'Delivered', 'Delayed', 'Cancelled'],
  datasets: [
    {
      label: 'Shipments',
      data: [15, 28, 67, 12, 2],
      backgroundColor: ['#3b82f6', '#60a5fa', '#10b981', '#f59e0b', '#ef4444']
    }
  ]
}));

const vehicleUtilizationData = computed(() => ({
  labels: ['In Use', 'Available', 'Maintenance', 'Assigned'],
  datasets: [
    {
      data: [15, 8, 3, 5],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
    }
  ]
}));

// Table data
const loadingSheetColumns = [
  { key: 'loadingSheetNumber', header: 'Sheet #' },
  { key: 'projectName', header: 'Project' },
  { key: 'date', header: 'Date' },
  { key: 'driver', header: 'Driver' },
  { key: 'vehicle', header: 'Vehicle' },
  { 
    key: 'status', 
    header: 'Status',
    cell: (row: any) => ({
      component: 'Badge',
      props: {
        variant: row.status === 'completed' ? 'success' : 
                row.status === 'in-progress' ? 'warning' : 'secondary'
      },
      text: row.status
    })
  }
];

const recentLoadingSheets = ref([]);

// Methods
const fetchLoadingSheets = async () => {
  try {
    // Replace with actual API call
    // const response = await loadingSheetStore.fetchLoadingSheets({
    //   startDate: dateRange.value.from,
    //   endDate: dateRange.value.to,
    //   limit: 5
    // });
    // recentLoadingSheets.value = response.data;
  } catch (error) {
    console.error('Error fetching loading sheets:', error);
  }
};

const exportToExcel = () => {
  // Implement export to Excel functionality
  console.log('Exporting to Excel...');
};

// Lifecycle hooks
onMounted(() => {
  fetchLoadingSheets();
});
</script>