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
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading disbursement form...</p>
      </div>
    </div>
    <!-- Modal Content - Show when isOpen is true, regardless of modalState -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div>
          <!-- Modal header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
              {{ editMode ? 'Edit Disbursement' : 'New Disbursement' }}
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
            <!-- Current Balance and Amount Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Current Balance Display -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available Balance
                </label>
                <div class="mt-1 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ formatAmount(currentBalance) }}
                    </span>
                    <div class="flex items-center">
                      <div 
                        :class="[
                          'w-2 h-2 rounded-full mr-2',
                          balanceStatus === 'normal' ? 'bg-green-500' : 
                          balanceStatus === 'low' ? 'bg-yellow-500' : 'bg-red-500'
                        ]"
                      ></div>
                      <span 
                        :class="[
                          'text-xs font-medium',
                          balanceStatus === 'normal' ? 'text-green-600 dark:text-green-400' : 
                          balanceStatus === 'low' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                        ]"
                      >
                        {{ balanceStatusLabel }}
                      </span>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Total funds available for disbursement
                  </p>
                </div>
              </div>

              <!-- Amount -->
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
                    :max="maxAmount"
                    :class="[
                      'block w-full pl-12 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                      errors.amount ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    ]"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p v-if="currentBalance > 0" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Available: {{ formatAmount(currentBalance) }}
                </p>
                <p v-else class="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                  ⚠️ No funds available for disbursement. Please add a top-up first.
                </p>
                <p v-if="errors.amount" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.amount[0] }}
                </p>
              </div>
            </div>

            <!-- Receiver and Account Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Receiver -->
              <div>
                <label for="receiver" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Receiver <span class="text-red-500">*</span>
                </label>
                <input
                  id="receiver"
                  v-model="form.receiver"
                  type="text"
                  :class="[
                    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.receiver ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  placeholder="Name of person/entity receiving funds"
                  required
                />
                <p v-if="errors.receiver" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.receiver[0] }}
                </p>
              </div>

              <!-- Account -->
              <div>
                <label for="account" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account <span class="text-red-500">*</span>
                </label>
                <input
                  id="account"
                  v-model="form.account"
                  type="text"
                  :class="[
                    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.account ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  placeholder="Account category for expense"
                  required
                />
                <p v-if="errors.account" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.account[0] }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  errors.description ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                ]"
                placeholder="Detailed description of the disbursement purpose..."
                required
              ></textarea>
              <p v-if="errors.description" class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ errors.description[0] }}
              </p>
            </div>        
    <!-- Classification and Project Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Classification -->
              <div>
                <label for="classification" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Classification <span class="text-red-500">*</span>
                </label>
                <select
                  id="classification"
                  v-model="form.classification"
                  :class="[
                    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.classification ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  required
                >
                  <option value="">Select classification</option>
                  <option value="agencies">Agencies</option>
                  <option value="admin">Administration</option>
                  <option value="operations">Operations</option>
                  <option value="other">Other</option>
                </select>
                <p v-if="errors.classification" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.classification[0] }}
                </p>
              </div>

              <!-- Project Name -->
              <div>
                <label for="project_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name
                  <span v-if="requiresProject" class="text-red-500">*</span>
                </label>
                <input
                  id="project_name"
                  v-model="form.project_name"
                  type="text"
                  :class="[
                    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.project_name ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  placeholder="Project or job name"
                  :required="requiresProject"
                />
                <p v-if="errors.project_name" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.project_name[0] }}
                </p>
                <p v-else-if="requiresProject" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Project name is required for {{ form.classification }} classification
                </p>
              </div>
            </div>

            <!-- Payment Method and Transaction Code Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Payment Method -->
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

              <!-- Transaction Code -->
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
                  Enter the 10-character M-Pesa transaction code
                </p>
              </div>

              <!-- Job Number (when no transaction code) -->
              <div v-else>
                <label for="job_number" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Number
                </label>
                <input
                  id="job_number"
                  v-model="form.job_number"
                  type="text"
                  :class="[
                    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.job_number ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  placeholder="Optional job or reference number"
                />
                <p v-if="errors.job_number" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.job_number[0] }}
                </p>
              </div>
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
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submitButtonText }}
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
import { defaultDisbursementFormData, mergeWithDefaults } from '../utils/defaults'
import { validateDisbursementFormData } from '../utils/validation'
import type { CreateDisbursementFormData, UpdateDisbursementFormData } from '../types/forms'
import type { PettyCashDisbursement } from '../types/pettyCash'

interface Props {
  isOpen: boolean
  editMode?: boolean
  disbursement?: PettyCashDisbursement
}

interface Emits {
  (e: 'close'): void
  (e: 'success', disbursement: PettyCashDisbursement): void
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false
})

const emit = defineEmits<Emits>()

const store = usePettyCashStore()
const { handleError, clearError, withErrorHandling } = useErrorHandler()

// Modal state management
const isSubmitting = ref(false)
const isInitialized = ref(false)
const modalError = ref<string | null>(null)

// Form data with safe defaults
const form = reactive<CreateDisbursementFormData>({ ...defaultDisbursementFormData })

// Form validation
const errors = ref<Record<string, string[]>>({})

// Modal state tracking
const modalState = ref<'closed' | 'opening' | 'open' | 'closing'>('closed')

// Computed properties for current balance
const currentBalance = computed(() => {
  // Use the actual available balance (top-ups minus disbursements)
  return store.actualAvailableBalance || 0
})

const maxAmount = computed(() => {
  // Ensure max is always greater than min (0.01) to avoid validation errors
  return Math.max(currentBalance.value, 0.01)
})

const balanceStatus = computed(() => {
  // Calculate status based on actual available balance
  const balance = currentBalance.value
  if (balance <= 0) return 'critical'
  if (balance < 1000) return 'low' // You can adjust this threshold
  return 'normal'
})

const balanceStatusLabel = computed(() => {
  const status = balanceStatus.value
  switch (status) {
    case 'critical': return 'Critical'
    case 'low': return 'Low'
    case 'normal': return 'Normal'
    default: return 'Normal'
  }
})

const submitButtonText = computed(() => {
  if (isSubmitting.value) {
    return props.editMode ? 'Updating...' : 'Creating...'
  }
  
  if (currentBalance.value <= 0) {
    return 'No Balance Available'
  }
  
  return props.editMode ? 'Update Disbursement' : 'Create Disbursement'
})

const requiresProject = computed(() => {
  return ['agencies', 'operations'].includes(form.classification)
})

const requiresTransactionCode = computed(() => {
  return form.payment_method && form.payment_method !== 'cash'
})

const isFormValid = computed(() => {
  return form.receiver && 
         form.account && 
         form.amount && 
         form.description && 
         form.classification && 
         form.payment_method &&
         currentBalance.value > 0 && // Ensure there's balance available
         (!requiresProject.value || form.project_name) &&
         (!requiresTransactionCode.value || form.transaction_code)
})

// Methods
const formatAmount = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

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

// Removed onTopUpChange - no longer needed since we're using current balance

// Enhanced form validation using validation utilities
const validateForm = (): boolean => {
  try {
    const result = validateDisbursementFormData(form)
    errors.value = result.errors
    
    // Additional balance validation
    if (result.isValid && Number(form.amount) > currentBalance.value) {
      errors.value.amount = [`Amount exceeds available balance of ${formatAmount(currentBalance.value)}`]
      return false
    }
    
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
    Object.assign(form, defaultDisbursementFormData)
    errors.value = {}
    modalError.value = null
    clearError()
  } catch (error) {
    console.error('Error resetting form:', error)
  }
}

const loadDisbursementData = () => {
  if (props.editMode && props.disbursement) {
    const d = props.disbursement
    Object.assign(form, {
      receiver: d.receiver,
      account: d.account,
      amount: d.amount.raw.toString(),
      description: d.description,
      project_name: d.project_name || '',
      classification: d.classification.value,
      job_number: d.job_number || '',
      payment_method: d.payment_method.value,
      transaction_code: d.transaction_code || ''
    })
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
    
    if (props.editMode && props.disbursement) {
      loadDisbursementData()
    } else {
      resetForm()
    }
    
    await store.fetchAvailableTopUps()
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
    
    const formData = {
      ...form,
      amount: Number(form.amount),
      // Add a default top_up_id for backend compatibility
      // In a real system, this would be handled differently
      top_up_id: 1 // Default value for backend compatibility
    }

    let result: PettyCashDisbursement

    if (props.editMode && props.disbursement) {
      result = await store.updateDisbursement(props.disbursement.id, formData as UpdateDisbursementFormData)
    } else {
      result = await store.createDisbursement(formData)
    }

    emit('success', result)
    await closeModal()
    
    return result
  }, { 
    context: 'DisbursementForm.handleSubmit',
    formData: { ...form },
    editMode: props.editMode
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

// Watchers
watch(() => form.payment_method, (newMethod) => {
  if (newMethod === 'cash') {
    form.transaction_code = ''
  }
})

watch(() => form.classification, () => {
  if (!requiresProject.value) {
    form.project_name = ''
  }
})

// Safe component initialization
onMounted(async () => {
  console.log('🔥 DisbursementForm mounted, isOpen:', props.isOpen)
  
  // Use nextTick to ensure component is fully mounted
  await nextTick()
  
  // Initialize modal state if already open
  if (props.isOpen) {
    console.log('🔥 DisbursementForm mounted with isOpen=true, initializing...')
    modalState.value = 'open'
    isInitialized.value = true
    try {
      resetForm()
    } catch (error) {
      console.error('🔥 Error initializing DisbursementForm on mount:', error)
    }
  }
})

// Simplified modal state management
watch(() => props.isOpen, async (newValue, oldValue) => {
  console.log('🔥 DisbursementForm isOpen changed:', { newValue, oldValue, modalState: modalState.value })
  try {
    if (newValue && !oldValue) {
      // Modal opening - set to open immediately
      console.log('🔥 Opening Disbursement modal directly...')
      modalState.value = 'open'
      isInitialized.value = true
      
      // Reset form and fetch data after setting state
      try {
        resetForm()
        console.log('🔥 Disbursement modal opened and form reset successfully')
      } catch (resetError) {
        console.error('🔥 Error resetting form:', resetError)
        // Continue anyway, don't block modal opening
      }
    } else if (!newValue && oldValue) {
      // Modal closing
      console.log('🔥 Closing Disbursement modal...')
      modalState.value = 'closed'
      isInitialized.value = false
    }
  } catch (error) {
    console.error('🔥 Error in Disbursement modal state change:', error)
    modalError.value = 'Modal state error occurred'
    modalState.value = 'closed'
    isInitialized.value = false
  }
}, { immediate: false })
</script>