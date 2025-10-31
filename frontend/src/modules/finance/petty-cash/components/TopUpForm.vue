<template>
  <!-- Modal Overlay with Error Boundary -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    @click.self="closeModal"
    style="background-color: rgba(0, 0, 0, 0.5);"
  >
    <!-- Modal Error State -->
    <div v-if="modalError" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
          <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Modal Error</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ modalError }}</p>
        <div class="mt-6 flex space-x-3 justify-center">
          <button
            @click="modalError = null; initializeModal()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
          <button
            @click="closeModal"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Loading State -->
    <div v-else-if="modalState === 'opening'" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>

    <!-- Modal Content - Show when isOpen is true, regardless of modalState -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div>
          <!-- Modal header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
              Add Top-up
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Amount Field -->
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 dark:text-gray-400 sm:text-sm">KES</span>
                </div>
                <input
                  id="amount"
                  v-model="form.amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="999999.99"
                  :class="[
                    'block w-full pl-12 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.amount ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  placeholder="0.00"
                  required
                />
              </div>
              <p v-if="errors.amount" class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ errors.amount[0] }}
              </p>
            </div>

            <!-- Payment Method Field -->
            <div>
              <label for="payment_method" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Method <span class="text-red-500">*</span>
              </label>
              <select
                id="payment_method"
                v-model="form.payment_method"
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  errors.payment_method ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                ]"
                required
              >
                <option value="">Select payment method</option>
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
              <p v-if="errors.payment_method" class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ errors.payment_method[0] }}
              </p>
            </div>

            <!-- Transaction Code Field (conditional) -->
            <div v-if="requiresTransactionCode">
              <label for="transaction_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Transaction Code <span class="text-red-500">*</span>
              </label>
              <input
                id="transaction_code"
                v-model="form.transaction_code"
                type="text"
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  errors.transaction_code ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                ]"
                :placeholder="getTransactionCodePlaceholder()"
                :required="requiresTransactionCode"
              />
              <p v-if="errors.transaction_code" class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ errors.transaction_code[0] }}
              </p>
              <p v-else-if="form.payment_method === 'mpesa'" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Enter the 10-character M-Pesa transaction code (e.g., QH12ABC345)
              </p>
            </div>

            <!-- Description Field -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  errors.description ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                ]"
                placeholder="Optional description for this top-up..."
              ></textarea>
              <p v-if="errors.description" class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ errors.description[0] }}
              </p>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !isFormValid"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Creating...' : 'Create Top-up' }}
              </button>
            </div>
          </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted, nextTick } from 'vue'
import { usePettyCashStore } from '../stores/pettyCashStore'
import { useErrorHandler } from '../composables/useErrorHandler'
import { defaultTopUpFormData, mergeWithDefaults } from '../utils/defaults'
import { validateTopUpFormData } from '../utils/validation'
import type { CreateTopUpFormData } from '../types/forms'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success', topUp: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = usePettyCashStore()
const { handleError, clearError, withErrorHandling } = useErrorHandler()

// Modal state management
const isSubmitting = ref(false)
const isInitialized = ref(false)
const modalError = ref<string | null>(null)

// Form data with safe defaults
const form = reactive<CreateTopUpFormData>({ ...defaultTopUpFormData })

// Form validation
const errors = ref<Record<string, string[]>>({})

// Modal state tracking
const modalState = ref<'closed' | 'opening' | 'open' | 'closing'>('closed')

const requiresTransactionCode = computed(() => {
  return form.payment_method && form.payment_method !== 'cash'
})

const isFormValid = computed(() => {
  return form.amount && 
         form.payment_method && 
         (!requiresTransactionCode.value || form.transaction_code)
})

// Methods
const getTransactionCodePlaceholder = (): string => {
  switch (form.payment_method) {
    case 'mpesa':
      return 'QH12ABC345'
    case 'bank_transfer':
      return 'Bank reference number'
    default:
      return 'Transaction reference'
  }
}

// Enhanced form validation using validation utilities
const validateForm = (): boolean => {
  try {
    const result = validateTopUpFormData(form)
    errors.value = result.errors
    return result.isValid
  } catch (error) {
    console.error('Form validation error:', error)
    errors.value = { general: ['Validation error occurred'] }
    return false
  }
}

// Safe form reset with error handling
const resetForm = () => {
  try {
    Object.assign(form, defaultTopUpFormData)
    errors.value = {}
    modalError.value = null
    clearError()
  } catch (error) {
    console.error('Error resetting form:', error)
  }
}

// Safe modal closing with state management
const closeModal = async () => {
  try {
    modalState.value = 'closing'
    await nextTick()
    
    resetForm()
    emit('close')
    
    modalState.value = 'closed'
  } catch (error) {
    console.error('Error closing modal:', error)
    modalError.value = 'Failed to close modal'
  }
}

// Initialize modal when opened
const initializeModal = async () => {
  try {
    modalState.value = 'opening'
    await nextTick()
    
    resetForm()
    isInitialized.value = true
    modalState.value = 'open'
  } catch (error) {
    console.error('Error initializing modal:', error)
    modalError.value = 'Failed to initialize modal'
    modalState.value = 'closed'
  }
}

// Enhanced form submission with error handling
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  const result = await withErrorHandling(async () => {
    isSubmitting.value = true
    
    const topUp = await store.createTopUp({
      ...form,
      amount: Number(form.amount)
    })

    emit('success', topUp)
    await closeModal()
    
    return topUp
  }, { 
    context: 'TopUpForm.handleSubmit',
    formData: { ...form }
  })

  if (!result) {
    // Handle API validation errors
    const storeError = store.error
    if (storeError && typeof storeError === 'object' && 'errors' in storeError) {
      errors.value = storeError.errors as Record<string, string[]>
    }
  }

  isSubmitting.value = false
}

// Clear transaction code when payment method changes to cash
watch(() => form.payment_method, (newMethod) => {
  if (newMethod === 'cash') {
    form.transaction_code = ''
  }
})

// Clear errors when form values change
watch(() => form.amount, () => {
  if (errors.value.amount) {
    delete errors.value.amount
  }
})

watch(() => form.payment_method, () => {
  if (errors.value.payment_method) {
    delete errors.value.payment_method
  }
})

watch(() => form.transaction_code, () => {
  if (errors.value.transaction_code) {
    delete errors.value.transaction_code
  }
})

// Safe component initialization
onMounted(async () => {
  console.log('🔥 TopUpForm mounted, isOpen:', props.isOpen)
  
  // Use nextTick to ensure component is fully mounted
  await nextTick()
  
  // Initialize modal state if already open
  if (props.isOpen) {
    console.log('🔥 TopUpForm mounted with isOpen=true, initializing...')
    modalState.value = 'open'
    isInitialized.value = true
    try {
      resetForm()
    } catch (error) {
      console.error('🔥 Error resetting form on mount:', error)
    }
  }
})

// Simplified modal state management
watch(() => props.isOpen, async (newValue, oldValue) => {
  console.log('🔥 TopUpForm isOpen changed:', { newValue, oldValue, modalState: modalState.value })
  try {
    if (newValue && !oldValue) {
      // Modal opening - set to open immediately
      console.log('🔥 Opening TopUp modal directly...')
      modalState.value = 'open'
      isInitialized.value = true
      
      // Reset form after setting state
      try {
        resetForm()
        console.log('🔥 TopUp modal opened and form reset successfully')
      } catch (resetError) {
        console.error('🔥 Error resetting form:', resetError)
        // Continue anyway, don't block modal opening
      }
    } else if (!newValue && oldValue) {
      // Modal closing
      console.log('🔥 Closing TopUp modal...')
      modalState.value = 'closed'
      isInitialized.value = false
    }
  } catch (error) {
    console.error('🔥 Error in TopUp modal state change:', error)
    modalError.value = 'Modal state error occurred'
    modalState.value = 'closed'
    isInitialized.value = false
  }
}, { immediate: false })
</script>