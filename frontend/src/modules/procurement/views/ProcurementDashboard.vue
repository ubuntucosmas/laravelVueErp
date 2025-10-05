<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Procurement Department</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Procurement Department</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Material sourcing, vendor management, and supply chain coordination</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Orders</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ procurementStats.activeOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ procurementStats.delivered }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ procurementStats.pending }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ procurementStats.overdue }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/procurement/materials"
          class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <div class="ml-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Material Requests</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">Browse material specifications</p>
          </div>
        </router-link>

        <router-link
          to="/procurement/vendors"
          class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div class="ml-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Vendor Management</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">Manage suppliers and contracts</p>
          </div>
        </router-link>

        <button
          @click="createPurchaseOrder"
          class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <div class="ml-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">New Purchase Order</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">Create procurement order</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Purchase Orders</h3>
          <router-link to="/procurement/orders" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            View All →
          </router-link>
        </div>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="order in recentOrders" :key="order.id" class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  PO-{{ order.id.toString().padStart(4, '0') }}
                </h4>
                <span :class="getStatusBadgeClass(order.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ order.status.replace('_', ' ') }}
                </span>
              </div>
              <div class="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Vendor: {{ order.vendor_name }}</span>
                <span>Items: {{ order.item_count }}</span>
                <span>Value: KES {{ order.total_value.toLocaleString() }}</span>
                <span>Due: {{ formatDate(order.delivery_date) }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="viewOrder(order)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        <div v-if="recentOrders.length === 0" class="p-6 text-center">
          <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">No orders yet</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Purchase orders will appear here once created</p>
        </div>
      </div>
    </div>

    <!-- Procurement Guidelines -->
    <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Procurement Department Guidelines</h3>
          <div class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p>• <strong>Vendor Selection:</strong> Choose approved vendors based on quality, price, and reliability</p>
            <p>• <strong>Quality Control:</strong> Ensure all materials meet specifications and quality standards</p>
            <p>• <strong>Timeline Management:</strong> Coordinate delivery schedules with project timelines</p>
            <p>• <strong>Cost Optimization:</strong> Negotiate best prices while maintaining quality standards</p>
            <p>• <strong>Documentation:</strong> Maintain complete records of all procurement activities</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Mock data - in real app, this would come from API
const procurementStats = ref({
  activeOrders: 15,
  delivered: 42,
  pending: 8,
  overdue: 2
})

const recentOrders = ref([
  {
    id: 1,
    vendor_name: 'Premium Materials Ltd',
    item_count: 12,
    total_value: 250000,
    delivery_date: '2025-09-30',
    status: 'in_transit'
  },
  {
    id: 2,
    vendor_name: 'Tech Solutions Inc',
    item_count: 8,
    total_value: 180000,
    delivery_date: '2025-09-28',
    status: 'pending'
  },
  {
    id: 3,
    vendor_name: 'Creative Supplies Co',
    item_count: 15,
    total_value: 95000,
    delivery_date: '2025-09-25',
    status: 'delivered'
  }
])

const router = useRouter()

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    in_transit: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const createPurchaseOrder = () => {
  router.push('/procurement/orders/new')
}

const viewOrder = (order: { id: number }) => {
  router.push(`/procurement/orders/${order.id}`)
}

onMounted(() => {
  // Load real data from API
  console.log('Procurement Dashboard mounted')
})
</script>
