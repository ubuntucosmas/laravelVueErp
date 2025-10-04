<template>
  <div class="quote-approval-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          ]"
        >
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Quote Tab -->
    <div v-if="activeTab === 'quote'">
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 class="text-md font-medium mb-2 text-gray-900 dark:text-white">Quote Summary</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Amount:</strong> {{ quoteData?.quote_amount || 'N/A' }} {{ quoteData?.currency || 'USD' }}</div>
          <div><strong>Validity:</strong> {{ quoteData?.validity_days || 'N/A' }} days</div>
          <div><strong>Payment Terms:</strong> {{ formatPaymentTerms(quoteData?.payment_terms) }}</div>
          <div><strong>Quote Date:</strong> {{ quoteData?.quote_date || 'N/A' }}</div>
        </div>
        <div class="mt-2">
          <strong>Inclusions:</strong> {{ quoteData?.inclusions || 'N/A' }}
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Review Tab -->
      <div v-if="activeTab === 'review'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Approval Status *</label>
          <select
            v-model="formData.approval_status"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select approval status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending Review</option>
          </select>
        </div>

        <div v-if="formData.approval_status === 'rejected'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rejection Reason *</label>
          <textarea
            v-model="formData.rejection_reason"
            required
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Please provide detailed reason for rejection..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Approval Comments</label>
          <textarea
            v-model="formData.comments"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Additional comments or conditions..."
          ></textarea>
        </div>
      </div>

      <!-- Approval Tab -->
      <div v-if="activeTab === 'approval'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Approval Date</label>
          <input
            v-model="formData.approval_date"
            type="date"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Approved By *</label>
          <input
            v-model="formData.approved_by"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Your full name"
          />
        </div>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Review
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Approval
          </button>
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          Save Approval Data
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const activeTab = ref('quote')

const tabs = [
  { id: 'quote', label: 'Quote Details', icon: '📄' },
  { id: 'review', label: 'Review', icon: '🔍' },
  { id: 'approval', label: 'Approval', icon: '✅' }
]

const formData = ref({
  approval_status: '',
  rejection_reason: '',
  comments: '',
  approval_date: new Date().toISOString().split('T')[0],
  approved_by: ''
})

// Mock quote data - in real implementation, this would come from related quote task
const quoteData = ref({
  quote_amount: 15000,
  currency: 'USD',
  validity_days: 30,
  payment_terms: '50_50',
  inclusions: 'Design, materials, setup, and execution',
  quote_date: '2025-10-01'
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const formatPaymentTerms = (terms: string) => {
  const termsMap: Record<string, string> = {
    '100%_upfront': '100% Upfront',
    '50_50': '50% Upfront, 50% on Completion',
    '30_40_30': '30% Upfront, 40% Mid-term, 30% Final',
    'monthly': 'Monthly Installments',
    'custom': 'Custom Terms'
  }
  return termsMap[terms] || terms || 'Not specified'
}

const handleSubmit = () => {
  // Here you would typically save the form data
  console.log('Approval data:', formData.value)
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset form if needed
watch(() => props.task.id, () => {
  // Reset form for new task
  formData.value = {
    approval_status: '',
    rejection_reason: '',
    comments: '',
    approval_date: new Date().toISOString().split('T')[0],
    approved_by: ''
  }
})
</script>
