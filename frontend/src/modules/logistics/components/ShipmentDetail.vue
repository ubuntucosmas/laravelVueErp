<template>
  <div class="shipment-detail">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading shipment details...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Error loading shipment
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error.message }}</p>
          </div>
          <div class="mt-4">
            <button 
              @click="fetchShipment"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Shipment Details -->
    <div v-else-if="shipment" class="space-y-6">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Shipment #{{ shipment.trackingNumber }}
            </h1>
            <span :class="[statusClasses(shipment.status), 'ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium']">
              {{ formatStatus(shipment.status) }}
            </span>
          </div>
          <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              Created on {{ formatDate(shipment.createdAt) }}
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Estimated delivery: {{ formatDate(shipment.estimatedDelivery) }}
              <template v-if="shipment.actualDelivery">
                (Delivered on {{ formatDate(shipment.actualDelivery) }})
              </template>
            </div>
          </div>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button 
            @click="printShipment"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
            </svg>
            Print
          </button>
          <button 
            @click="editShipment"
            type="button"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Shipment Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipment Info -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Shipment Information
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Details about the shipment and its current status.
              </p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl class="sm:divide-y sm:divide-gray-200">
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Tracking Number
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ shipment.trackingNumber }}
                  </dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Status
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span :class="statusClasses(shipment.status)">
                      {{ formatStatus(shipment.status) }}
                    </span>
                  </dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Carrier
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ shipment.carrier }}
                  </dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Origin
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ shipment.origin }}
                  </dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Destination
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ shipment.destination }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Items -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Items in Shipment
              </h3>
            </div>
            <div class="bg-white overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in shipment.items" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ item.description || 'No description' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {{ formatCurrency(item.value) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="shipment.items.length > 0">
                  <tr>
                    <td colspan="3" class="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Total:
                    </td>
                    <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {{ formatCurrency(shipment.items.reduce((sum, item) => sum + (item.value || 0) * item.quantity, 0)) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Notes -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Notes & Additional Information
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <p v-if="shipment.notes" class="text-sm text-gray-700 whitespace-pre-line">
                {{ shipment.notes }}
              </p>
              <p v-else class="text-sm text-gray-500 italic">
                No additional notes for this shipment.
              </p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status Timeline -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Shipment Status
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <div class="flow-root">
                <ul class="-mb-8">
                  <li v-for="(status, index) in statusHistory" :key="index">
                    <div class="relative pb-8">
                      <span v-if="index !== statusHistory.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div class="relative flex space-x-3">
                        <div>
                          <span :class="[status.iconBackground, 'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white']">
                            <component :is="status.icon" class="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p class="text-sm text-gray-500">
                              {{ status.description }}
                              <span v-if="status.comment" class="font-medium text-gray-900">{{ status.comment }}</span>
                            </p>
                          </div>
                          <div class="text-right text-sm whitespace-nowrap text-gray-500">
                            <time :datetime="status.datetime">{{ status.time }}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6 space-y-4">
              <button
                @click="updateStatus('in_transit')"
                :disabled="shipment.status === 'in_transit'"
                :class="[
                  'w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
                  shipment.status === 'in_transit' 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                ]"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 12a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h8a1 1 0 011 1v6z" />
                  <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V4a1 1 0 00-1-1H3zm13 0a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V4a1 1 0 00-1-1h-1zM3 15a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H3zm13 0a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1z" clip-rule="evenodd" />
                </svg>
                Mark as In Transit
              </button>
              
              <button
                @click="updateStatus('delivered')"
                :disabled="shipment.status === 'delivered'"
                :class="[
                  'w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
                  shipment.status === 'delivered' 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                ]"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Mark as Delivered
              </button>
              
              <button
                @click="updateStatus('delayed')"
                :disabled="shipment.status === 'delayed'"
                :class="[
                  'w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
                  shipment.status === 'delayed' 
                    ? 'bg-yellow-400 cursor-not-allowed' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                ]"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                Mark as Delayed
              </button>
              
              <button
                @click="cancelShipment"
                :disabled="shipment.status === 'cancelled'"
                :class="[
                  'w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
                  shipment.status === 'cancelled' 
                    ? 'bg-red-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                ]"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Cancel Shipment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLogistics } from '../composables/useLogistics';
import type { Shipment } from '../types';

export default defineComponent({
  name: 'ShipmentDetail',
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { 
      currentShipment, 
      isLoading, 
      error, 
      fetchShipmentById,
      updateShipment
    } = useLogistics();
    
    const shipment = computed(() => currentShipment.value);
    
    // Status history timeline data
    const statusHistory = computed(() => {
      if (!shipment.value) return [];
      
      const history = [
        {
          id: 1,
          status: 'created',
          description: 'Shipment created',
          time: formatTimeAgo(shipment.value.createdAt),
          datetime: shipment.value.createdAt,
          icon: ClockIcon,
          iconBackground: 'bg-gray-400',
        },
      ];
      
      // Add status updates
      if (shipment.value.status === 'in_transit') {
        history.push({
          id: 2,
          status: 'in_transit',
          description: 'Shipment is in transit',
          time: formatTimeAgo(shipment.value.updatedAt),
          datetime: shipment.value.updatedAt,
          icon: TruckIcon,
          iconBackground: 'bg-blue-500',
        });
      } else if (shipment.value.status === 'delivered') {
        history.push(
          {
            id: 2,
            status: 'in_transit',
            description: 'Shipment was in transit',
            time: formatTimeAgo(shipment.value.updatedAt),
            datetime: shipment.value.updatedAt,
            icon: TruckIcon,
            iconBackground: 'bg-blue-500',
          },
          {
            id: 3,
            status: 'delivered',
            description: 'Shipment was delivered',
            time: formatTimeAgo(shipment.value.actualDelivery || shipment.value.updatedAt),
            datetime: shipment.value.actualDelivery || shipment.value.updatedAt,
            icon: CheckCircleIcon,
            iconBackground: 'bg-green-500',
          }
        );
      } else if (shipment.value.status === 'delayed') {
        history.push({
          id: 2,
          status: 'delayed',
          description: 'Shipment is delayed',
          time: formatTimeAgo(shipment.value.updatedAt),
          datetime: shipment.value.updatedAt,
          icon: ExclamationIcon,
          iconBackground: 'bg-yellow-500',
        });
      } else if (shipment.value.status === 'cancelled') {
        history.push({
          id: 2,
          status: 'cancelled',
          description: 'Shipment was cancelled',
          time: formatTimeAgo(shipment.value.updatedAt),
          datetime: shipment.value.updatedAt,
          icon: XCircleIcon,
          iconBackground: 'bg-red-500',
        });
      }
      
      return history;
    });
    
    // Fetch shipment data when component mounts
    onMounted(async () => {
      const shipmentId = Number(route.params.id);
      if (shipmentId) {
        await fetchShipmentById(shipmentId);
      }
    });
    
    // Format date for display
    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    // Format time ago
    const formatTimeAgo = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
      };
      
      for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval >= 1) {
          return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
      }
      
      return 'Just now';
    };
    
    // Format currency
    const formatCurrency = (value: number | undefined) => {
      if (value === undefined) return 'N/A';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    };
    
    // Format status for display
    const formatStatus = (status: string): string => {
      return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
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
    
    // Update shipment status
    const updateStatus = async (newStatus: string) => {
      if (!shipment.value) return;
      
      const updates: Partial<Shipment> = {
        status: newStatus as any,
      };
      
      if (newStatus === 'delivered') {
        updates.actualDelivery = new Date().toISOString();
      }
      
      try {
        await updateShipment(shipment.value.id, updates);
        // Refresh the shipment data
        await fetchShipmentById(shipment.value.id);
      } catch (err) {
        console.error('Failed to update shipment status:', err);
      }
    };
    
    // Cancel shipment
    const cancelShipment = async () => {
      if (!shipment.value) return;
      if (!confirm('Are you sure you want to cancel this shipment?')) return;
      
      try {
        await updateShipment(shipment.value.id, { status: 'cancelled' });
        // Refresh the shipment data
        await fetchShipmentById(shipment.value.id);
      } catch (err) {
        console.error('Failed to cancel shipment:', err);
      }
    };
    
    // Print shipment
    const printShipment = () => {
      window.print();
    };
    
    // Edit shipment
    const editShipment = () => {
      if (shipment.value) {
        router.push({ 
          name: 'logistics-shipment-edit', 
          params: { id: shipment.value.id } 
        });
      }
    };
    
    // Icons for the timeline
    const CheckCircleIcon = {
      template: `
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      `
    };
    
    const ClockIcon = {
      template: `
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>
      `
    };
    
    const TruckIcon = {
      template: `
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 12a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h8a1 1 0 011 1v6z" />
          <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V4a1 1 0 00-1-1H3zm13 0a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V4a1 1 0 00-1-1h-1zM3 15a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H3zm13 0a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1z" clip-rule="evenodd" />
        </svg>
      `
    };
    
    const ExclamationIcon = {
      template: `
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      `
    };
    
    const XCircleIcon = {
      template: `
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      `
    };
    
    return {
      // State
      shipment,
      isLoading,
      error,
      statusHistory,
      
      // Icons
      CheckCircleIcon,
      ClockIcon,
      TruckIcon,
      ExclamationIcon,
      XCircleIcon,
      
      // Methods
      fetchShipment: () => fetchShipmentById(Number(route.params.id)),
      formatDate,
      formatStatus,
      statusClasses,
      updateStatus,
      cancelShipment,
      printShipment,
      editShipment,
      formatCurrency
    };
  }
});
</script>

<style scoped>
.shipment-detail {
  @apply p-4 md:p-6;
}

/* Print styles */
@media print {
  .shipment-detail {
    padding: 0;
  }
  
  button {
    display: none !important;
  }
  
  @page {
    size: A4;
    margin: 1cm;
  }
}
</style>
