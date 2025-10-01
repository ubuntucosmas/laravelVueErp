<!-- src/modules/logistics/views/shipments/ShipmentsList.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Shipments Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Track and manage all project deliveries</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Shipment
      </button>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center hover:shadow-md transition-shadow">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">Total Shipments</div>
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ shipments.length }}</div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center hover:shadow-md transition-shadow">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">In Transit</div>
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {{ shipments.filter(s => s.status === 'in_transit').length }}
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center hover:shadow-md transition-shadow">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">Delivered</div>
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ shipments.filter(s => s.status === 'delivered').length }}
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center hover:shadow-md transition-shadow">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">Delayed</div>
          <div class="text-2xl font-bold text-red-600 dark:text-red-400">
            {{ shipments.filter(s => s.status === 'delayed').length }}
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
      <div class="flex-1">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search shipments..."
          />
        </div>
      </div>
      <div class="w-full md:w-48">
        <select 
          v-model="statusFilter"
          class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <button
        @click="resetFilters"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Reset Filters
      </button>
    </div>

    <!-- Shipments Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading shipments...</p>
      </div>
      <div v-else-if="error" class="p-4 text-center text-red-600 dark:text-red-400">
        {{ error }}
      </div>
      <div v-else-if="filteredShipments.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
        No shipments found. Create your first shipment to get started.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tracking #</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Origin</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Destination</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Departure</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estimated Arrival</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="shipment in paginatedShipments" :key="shipment.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ shipment.trackingNumber }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ shipment.items.length }} items</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ shipment.origin }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ shipment.destination }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="statusClasses(shipment.status)">
                  {{ formatStatus(shipment.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(shipment.departureTime) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(shipment.estimatedArrival) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="viewShipment(shipment)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">View</button>
                <button @click="editShipment(shipment)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">Edit</button>
                <button @click="confirmDelete(shipment)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-between items-center mt-4">
      <button 
        @click="prevPage" 
        :disabled="page === 1" 
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Page {{ page }} of {{ totalPages }}
      </div>
      <button 
        @click="nextPage" 
        :disabled="page >= totalPages" 
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Shipment' : 'Create New Shipment' }}
        </h2>

        <form @submit.prevent="saveShipment" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tracking Number <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.trackingNumber"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. SHIP-2023-001"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Origin <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.origin"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. Nairobi Depot"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.destination"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. Westlands Office Park"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.status"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Departure Time <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.departureTime"
                  type="datetime-local"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Arrival <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.estimatedArrival"
                  type="datetime-local"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.vehicleId"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Select a vehicle</option>
                  <option 
                    v-for="vehicle in availableVehicles" 
                    :key="vehicle.id" 
                    :value="vehicle.id"
                  >
                    {{ vehicle.model }} ({{ vehicle.registration }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Driver <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.driverId"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Select a driver</option>
                  <option 
                    v-for="driver in availableDrivers" 
                    :key="driver.id" 
                    :value="driver.id"
                  >
                    {{ driver.name }} ({{ driver.license }})
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Items Section -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Items
              </label>
              <button
                type="button"
                @click="addItem"
                class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + Add Item
              </button>
            </div>
            
            <div v-for="(item, index) in formData.items" :key="index" class="grid grid-cols-12 gap-4 mb-3 items-end">
              <div class="col-span-5">
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Item Name</label>
                <input
                  v-model="item.name"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="e.g. Office Chairs"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Qty</label>
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
              <div class="col-span-3">
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Weight (kg)</label>
                <input
                  v-model.number="item.weight"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
              <div class="col-span-2 flex justify-end">
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2"
                  :disabled="formData.items.length <= 1"
                  :class="{ 'opacity-50 cursor-not-allowed': formData.items.length <= 1 }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              v-model="formData.notes"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any additional notes or special instructions..."
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ isEditing ? 'Update Shipment' : 'Create Shipment' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
            <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="mt-3 text-lg font-medium text-gray-900 dark:text-white">Delete Shipment</h3>
          <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete shipment <span class="font-medium">{{ shipmentToDelete?.trackingNumber }}</span>? This action cannot be undone.
          </div>
        </div>
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            @click="deleteShipment"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
          >
            Delete
          </button>
          <button
            type="button"
            @click="showDeleteModal = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Shipment, ShipmentItem, Vehicle, Driver } from '../../types/logistics'
import { mockShipments, mockVehicles, mockDrivers } from '../../mock/logisticsMockData'

// Router
const router = useRouter()

// State
const shipments = ref<Shipment[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const page = ref(1)
const perPage = 10

// Form data
const formData = ref<Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>>({
  trackingNumber: '',
  origin: 'Nairobi Depot',
  destination: '',
  status: 'pending',
  departureTime: new Date().toISOString().slice(0, 16),
  estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  actualArrival: null,
  vehicleId: 0,
  driverId: 0,
  items: [],
  notes: ''
})

// UI State
const showModal = ref(false)
const isEditing = ref(false)
const currentShipmentId = ref<number | null>(null)
const showDeleteModal = ref(false)
const shipmentToDelete = ref<Shipment | null>(null)

// Computed
const availableVehicles = computed(() => 
  mockVehicles.filter((v: Vehicle) => v.status === 'available')
)

const availableDrivers = computed(() => 
  mockDrivers.filter((d: Driver) => d.status === 'available')
)

// Filter and pagination
const filteredShipments = computed(() => {
  let result = [...shipments.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((shipment: Shipment) => 
      shipment.trackingNumber.toLowerCase().includes(query) ||
      shipment.origin.toLowerCase().includes(query) ||
      shipment.destination.toLowerCase().includes(query) ||
      (shipment.notes && shipment.notes.toLowerCase().includes(query))
    )
  }
  
  if (statusFilter.value) {
    result = result.filter((shipment: Shipment) => shipment.status === statusFilter.value)
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredShipments.value.length / perPage))

const paginatedShipments = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredShipments.value.slice(start, start + perPage)
})

// Navigation
const nextPage = () => { if (page.value < totalPages.value) page.value++ }
const prevPage = () => { if (page.value > 1) page.value-- }

// Fetch data
const fetchShipments = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    shipments.value = [...mockShipments]
  } catch (err) {
    error.value = 'Failed to load shipments. Please try again.'
    console.error('Error fetching shipments:', err)
  } finally {
    loading.value = false
  }
}

// Format status for display
const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    delayed: 'Delayed',
    cancelled: 'Cancelled'
  }
  return statusMap[status] || status
}

// Get status CSS classes
const statusClasses = (status: string) => {
  const base = 'px-2 py-1 text-xs font-semibold rounded-full'
  const statusMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    in_transit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    delayed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
  return `${base} ${statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`
}

// Format date for display
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// CRUD Operations
const openCreateModal = () => {
  isEditing.value = false
  currentShipmentId.value = null
  resetForm()
  showModal.value = true
}

const viewShipment = (shipment: Shipment) => {
  router.push(`/logistics/shipments/${shipment.id}`)
}

const editShipment = (shipment: Shipment) => {
  isEditing.value = true
  currentShipmentId.value = shipment.id
  formData.value = {
    trackingNumber: shipment.trackingNumber,
    origin: shipment.origin,
    destination: shipment.destination,
    status: shipment.status,
    departureTime: shipment.departureTime,
    estimatedArrival: shipment.estimatedArrival,
    actualArrival: shipment.actualArrival,
    vehicleId: shipment.vehicleId,
    driverId: shipment.driverId,
    items: [...shipment.items],
    notes: shipment.notes || ''
  }
  showModal.value = true
}

const saveShipment = async () => {
  try {
    if (isEditing.value && currentShipmentId.value) {
      // Update existing shipment
      const index = shipments.value.findIndex(s => s.id === currentShipmentId.value)
      if (index !== -1) {
        const updatedShipment: Shipment = {
          ...shipments.value[index],
          ...formData.value,
          updatedAt: new Date().toISOString()
        }
        shipments.value[index] = updatedShipment
      }
    } else {
      // Create new shipment
      const newShipment: Shipment = {
        id: Math.max(0, ...shipments.value.map(s => s.id)) + 1,
        ...formData.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      shipments.value.push(newShipment)
    }
    
    showModal.value = false
    resetForm()
  } catch (err) {
    console.error('Error saving shipment:', err)
    error.value = 'Failed to save shipment. Please try again.'
  }
}

const confirmDelete = (shipment: Shipment) => {
  shipmentToDelete.value = shipment
  showDeleteModal.value = true
}

const deleteShipment = async () => {
  if (!shipmentToDelete.value) return
  
  try {
    shipments.value = shipments.value.filter(s => s.id !== shipmentToDelete.value?.id)
    showDeleteModal.value = false
    shipmentToDelete.value = null
  } catch (err) {
    console.error('Error deleting shipment:', err)
    error.value = 'Failed to delete shipment. Please try again.'
  }
}

// Form helpers
const addItem = () => {
  formData.value.items.push({
    id: Date.now(),
    name: '',
    quantity: 1,
    weight: 0
  })
}

const removeItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

const resetForm = () => {
  formData.value = {
    trackingNumber: '',
    origin: 'Nairobi Depot',
    destination: '',
    status: 'pending',
    departureTime: new Date().toISOString().slice(0, 16),
    estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    actualArrival: null,
    vehicleId: 0,
    driverId: 0,
    items: [{
      id: Date.now(),
      name: '',
      quantity: 1,
      weight: 0
    }],
    notes: ''
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  page.value = 1
}

// Initialize
onMounted(() => {
  fetchShipments()
})
</script>
