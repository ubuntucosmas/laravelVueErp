<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Logistics Phase</h2>
        <div class="flex space-x-3">
          <button class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save Changes
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping Information</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Method</label>
              <select class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
                <option>Air Freight</option>
                <option>Sea Freight</option>
                <option>Road Transport</option>
                <option>Courier</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tracking Number</label>
              <input type="text" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white" placeholder="Enter tracking number">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Delivery</label>
              <input type="date" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Status</h3>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                In Progress
              </span>
            </div>
            <div class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Steps</h4>
              <ul class="space-y-2">
                <li class="flex items-start">
                  <span class="h-5 flex items-center sm:h-6">
                    <svg class="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Confirm shipping details</span>
                </li>
                <li class="flex items-start">
                  <span class="h-5 flex items-center sm:h-6">
                    <svg class="flex-shrink-0 h-5 w-5 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Schedule pickup</span>
                </li>
                <li class="flex items-start">
                  <span class="h-5 flex items-center sm:h-6">
                    <svg class="flex-shrink-0 h-5 w-5 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Confirm delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipment Details</h3>
        <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 truncate dark:text-indigo-400">Shipment #12345</p>
                <div class="ml-2 flex-shrink-0 flex">
                  <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    In Transit
                  </p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    New York, NY to Los Angeles, CA
                  </p>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  <p>
                    Estimated delivery: 
                    <time datetime="2023-12-15">December 15, 2023</time>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Notes & Attachments</h3>
      <div class="space-y-4">
        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Note</label>
          <div class="mt-1">
            <textarea rows="3" name="comment" id="comment" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white p-2"></textarea>
          </div>
        </div>
        <div class="flex justify-end">
          <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Note
          </button>
        </div>
      </div>
      
      <div class="mt-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Notes</h4>
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0 mr-3">
              <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span class="text-indigo-600 dark:text-indigo-300 font-medium">JD</span>
              </div>
            </div>
            <div>
              <div class="text-sm">
                <a href="#" class="font-medium text-gray-900 dark:text-white">John Doe</a>
              </div>
              <div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Confirmed shipping details with the logistics provider. Expected pickup tomorrow morning.</p>
              </div>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <time datetime="2020-12-02T11:00">December 2, 2023</time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  phase: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:phase']);

// Add your component logic here
</script>
