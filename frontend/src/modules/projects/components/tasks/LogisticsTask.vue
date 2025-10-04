<template>
  <div class="logistics-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Shipping Schedule -->
    <div class="mb-6">
      <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Shipping & Delivery Schedule</h4>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ship Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivery Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tracking</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(shipment, index) in shipments" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ shipment.item }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ shipment.quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ shipment.ship_date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ shipment.delivery_date }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  v-model="shipment.status"
                  class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="delayed">Delayed</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <input
                  v-model="shipment.tracking_number"
                  type="text"
                  placeholder="Enter tracking #"
                  class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Transportation Details -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Transportation Details</h4>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Transportation Method *</label>
            <select
              v-model="logisticsData.transportation_method"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select method</option>
              <option value="road">Road Transport</option>
              <option value="air">Air Freight</option>
              <option value="sea">Sea Freight</option>
              <option value="rail">Rail Transport</option>
              <option value="courier">Courier Service</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Carrier/Vendor *</label>
            <select
              v-model="logisticsData.carrier"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select carrier</option>
              <option value="DHL">DHL</option>
              <option value="FedEx">FedEx</option>
              <option value="UPS">UPS</option>
              <option value="Local Trucking Co">Local Trucking Co</option>
              <option value="Air Cargo Ltd">Air Cargo Ltd</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</label>
            <input
              v-model="logisticsData.contact_person"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Carrier contact name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Phone</label>
            <input
              v-model="logisticsData.contact_phone"
              type="tel"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="+1-234-567-8900"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Delivery Address</h4>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipient Name *</label>
            <input
              v-model="logisticsData.recipient_name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Full name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Address Line 1 *</label>
            <input
              v-model="logisticsData.address_line1"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Street address"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Address Line 2</label>
            <input
              v-model="logisticsData.address_line2"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Apartment, suite, etc."
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">City *</label>
              <input
                v-model="logisticsData.city"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Postal Code *</label>
              <input
                v-model="logisticsData.postal_code"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Country *</label>
            <select
              v-model="logisticsData.country"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="KE">Kenya</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Insurance & Documentation -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Insurance & Special Requirements</h4>

        <div class="space-y-4">
          <div class="flex items-center">
            <input
              id="insurance_required"
              v-model="logisticsData.insurance_required"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="insurance_required" class="ml-2 block text-sm text-gray-900 dark:text-white">
              Insurance Required
            </label>
          </div>

          <div v-if="logisticsData.insurance_required">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Insurance Value</label>
            <input
              v-model.number="logisticsData.insurance_value"
              type="number"
              step="0.01"
              min="0"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Insured value"
            />
          </div>

          <div class="flex items-center">
            <input
              id="customs_required"
              v-model="logisticsData.customs_required"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="customs_required" class="ml-2 block text-sm text-gray-900 dark:text-white">
              Customs Documentation Required
            </label>
          </div>

          <div v-if="logisticsData.customs_required">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">HS Code</label>
            <input
              v-model="logisticsData.hs_code"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Harmonized System code"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Delivery Confirmation</h4>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Notes</label>
            <textarea
              v-model="logisticsData.delivery_notes"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Special delivery instructions..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipient Signature</label>
            <div class="mt-1 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Signature capture area</p>
              <p class="text-xs text-gray-400 mt-1">Digital signature will be collected upon delivery</p>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="photos_required"
              v-model="logisticsData.photos_required"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="photos_required" class="ml-2 block text-sm text-gray-900 dark:text-white">
              Delivery photos required
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex space-x-2">
        <button
          v-if="task.status === 'pending'"
          @click="updateStatus('in_progress')"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Logistics
        </button>
        <button
          v-if="task.status === 'in_progress'"
          @click="updateStatus('completed')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Complete Logistics
        </button>
      </div>
      <button
        @click="handleSubmit"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
      >
        Save Logistics Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface Shipment {
  item: string
  quantity: string
  ship_date: string
  delivery_date: string
  status: string
  tracking_number: string
}

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const shipments = ref<Shipment[]>([
  {
    item: 'LED Display Panels',
    quantity: '10 units',
    ship_date: '2025-10-15',
    delivery_date: '2025-10-20',
    status: 'pending',
    tracking_number: ''
  },
  {
    item: 'Sound Equipment',
    quantity: '1 set',
    ship_date: '2025-10-16',
    delivery_date: '2025-10-21',
    status: 'pending',
    tracking_number: ''
  }
])

const logisticsData = ref({
  transportation_method: '',
  carrier: '',
  contact_person: '',
  contact_phone: '',
  recipient_name: '',
  address_line1: '',
  address_line2: '',
  city: '',
  postal_code: '',
  country: '',
  insurance_required: false,
  insurance_value: null as number | null,
  customs_required: false,
  hs_code: '',
  delivery_notes: '',
  photos_required: false
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const handleSubmit = () => {
  // Here you would typically save the logistics data
  console.log('Logistics data:', {
    shipments: shipments.value,
    logisticsData: logisticsData.value
  })
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset data if needed
watch(() => props.task.id, () => {
  // Reset logistics data for new task
  shipments.value = []
  logisticsData.value = {
    transportation_method: '',
    carrier: '',
    contact_person: '',
    contact_phone: '',
    recipient_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: '',
    insurance_required: false,
    insurance_value: null,
    customs_required: false,
    hs_code: '',
    delivery_notes: '',
    photos_required: false
  }
})
</script>
