<template>
  <div class="quote-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>

      <!-- Task Completion Toggle -->
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
        <div class="flex items-center space-x-2">
          <span :class="task.status === 'completed' ? 'text-green-600' : 'text-gray-500'" class="text-sm font-medium">
            {{ task.status === 'completed' ? 'Completed' : 'In Progress' }}
          </span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="isCompleted"
              type="checkbox"
              class="sr-only peer"
              @change="toggleTaskCompletion"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

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

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Quote Details Tab -->
      <div v-if="activeTab === 'quote'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quote Amount *</label>
            <input
              v-model="formData.quote_amount"
              type="number"
              step="0.01"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
            <select
              v-model="formData.currency"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="KES">KES</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Validity Period (days)</label>
            <input
              v-model="formData.validity_days"
              type="number"
              min="1"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="30"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quote Date</label>
            <input
              v-model="formData.quote_date"
              type="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Terms Tab -->
      <div v-if="activeTab === 'terms'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Terms</label>
          <select
            v-model="formData.payment_terms"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select payment terms</option>
            <option value="100%_upfront">100% Upfront</option>
            <option value="50_50">50% Upfront, 50% on Completion</option>
            <option value="30_40_30">30% Upfront, 40% Mid-term, 30% Final</option>
            <option value="monthly">Monthly Installments</option>
            <option value="custom">Custom Terms</option>
          </select>
        </div>

        <div v-if="formData.payment_terms === 'custom'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Custom Payment Terms</label>
          <textarea
            v-model="formData.custom_payment_terms"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Specify custom payment terms..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Inclusions</label>
          <textarea
            v-model="formData.inclusions"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="What is included in this quote..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Exclusions</label>
          <textarea
            v-model="formData.exclusions"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="What is NOT included in this quote..."
          ></textarea>
        </div>
      </div>

      <!-- Conditions Tab -->
      <div v-if="activeTab === 'conditions'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Terms and Conditions</label>
          <textarea
            v-model="formData.terms_conditions"
            rows="4"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Additional terms and conditions..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quote Notes</label>
          <textarea
            v-model="formData.notes"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Additional notes about the quote"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Quote Preparation
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Quote
          </button>
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          Save Quote Data
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
  { id: 'quote', label: 'Quote Details', icon: '💰' },
  { id: 'terms', label: 'Terms', icon: '📋' },
  { id: 'conditions', label: 'Conditions', icon: '⚖️' }
]

const isCompleted = computed({
  get: () => props.task.status === 'completed',
  set: (value) => {
    if (value && props.task.status !== 'completed') {
      toggleTaskCompletion()
    }
  }
})

const toggleTaskCompletion = async () => {
  try {
    const response = await fetch(`/api/projects/enquiry-tasks/${props.task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        status: 'completed'
      })
    })

    if (response.ok) {
      emit('update-status', 'completed')

      // Show success notification
      alert(`Task "${props.task.title}" has been marked as completed! All users have been notified.`)

      // Refresh notifications (if notification system is available)
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('task-completed', {
          detail: { task: props.task }
        }))
      }
    } else {
      throw new Error('Failed to update task status')
    }
  } catch (error) {
    console.error('Error updating task status:', error)
    alert('Failed to mark task as completed. Please try again.')
  }
}

const formData = ref({
  quote_amount: null as number | null,
  currency: 'USD',
  validity_days: null as number | null,
  quote_date: '',
  payment_terms: '',
  custom_payment_terms: '',
  inclusions: '',
  exclusions: '',
  terms_conditions: '',
  notes: ''
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const handleSubmit = () => {
  // Here you would typically save the form data
  console.log('Quote data:', formData.value)
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset form if needed
watch(() => props.task.id, () => {
  // Reset form for new task
  formData.value = {
    quote_amount: null,
    currency: 'USD',
    validity_days: null,
    quote_date: '',
    payment_terms: '',
    custom_payment_terms: '',
    inclusions: '',
    exclusions: '',
    terms_conditions: '',
    notes: ''
  }
})
</script>
