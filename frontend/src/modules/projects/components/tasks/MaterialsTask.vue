<template>
  <div class="materials-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
      <button
        @click="showModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span>Open Materials Manager</span>
      </button>
    </div>

    <!-- Quick Status Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <div>
            <p class="text-sm font-medium text-blue-800 dark:text-blue-200">Materials</p>
            <p class="text-lg font-semibold text-blue-900 dark:text-blue-100">{{ materialItems.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
          </svg>
          <div>
            <p class="text-sm font-medium text-green-800 dark:text-green-200">Total Cost</p>
            <p class="text-lg font-semibold text-green-900 dark:text-green-100">KES {{ totalMaterialCost.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <p class="text-sm font-medium text-purple-800 dark:text-purple-200">Status</p>
            <p class="text-lg font-semibold text-purple-900 dark:text-purple-100 capitalize">{{ task.status.replace('_', ' ') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Actions -->
    <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex space-x-2">
        <button
          v-if="task.status === 'pending'"
          @click="updateStatus('in_progress')"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Materials Spec
        </button>
        <button
          v-if="task.status === 'in_progress'"
          @click="updateStatus('completed')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Complete Materials Spec
        </button>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Last updated: {{ new Date().toLocaleDateString() }}
      </div>
    </div>

    <!-- Materials Modal -->
    <MaterialsModal
      :is-visible="showModal"
      :enquiry="task.enquiry"
      :department="task.department?.name"
      :is-design-mode="false"
      @close="showModal = false"
      @materials-updated="handleMaterialsUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import MaterialsModal from '../MaterialsModal.vue'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

// Modal state
const showModal = ref(false)

// Mock data for display (in real implementation, this would come from the modal)
const materialItems = ref([])
const totalMaterialCost = ref(0)

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const handleMaterialsUpdated = (data: any) => {
  // Update local state when materials are updated in the modal
  materialItems.value = data.materialItems || []
  totalMaterialCost.value = data.totalMaterialCost || 0
}
</script>
