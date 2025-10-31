<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <!-- Dashboard Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Petty Cash Dashboard
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor and manage petty cash transactions
            </p>
          </div>
          <div class="mt-4 sm:mt-0 flex space-x-3">
            <button
              @click="refreshDashboard"
              :disabled="isLoading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
            <button
              @click="showTopUpModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Top-up
            </button>
            <button
              @click="showDisbursementModal = true"
              :disabled="!canCreateDisbursement"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
              </svg>
              New Disbursement
            </button>
          </div>
        </div>

        <!-- Balance Card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Current Balance
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                      {{ currentBalance?.current_balance.formatted || 'KES 0.00' }}
                    </div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold" :class="balanceStatusColor">
                      <span class="sr-only">{{ balanceStatus }}</span>
                      {{ balanceStatusLabel }}
                    </div>
                  </dd>
                </dl>
              </div>
              <div class="flex-shrink-0">
                <div class="w-3 h-3 rounded-full" :class="balanceIndicatorColor"></div>
              </div>
            </div>
            
            <!-- Balance Warning -->
            <div v-if="isBalanceLow || isBalanceCritical" class="mt-4 p-3 rounded-md" :class="warningBgColor">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5" :class="warningIconColor" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium" :class="warningTextColor">
                    {{ warningTitle }}
                  </h3>
                  <div class="mt-2 text-sm" :class="warningTextColor">
                    <p>{{ warningMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Top-ups -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Top-ups
                    </dt>
                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ summary?.total_top_ups ? formatAmount(summary.total_top_ups) : 'KES 0.00' }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Disbursements -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Disbursements
                    </dt>
                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ summary?.total_disbursements ? formatAmount(summary.total_disbursements) : 'KES 0.00' }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Transaction Count -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Transactions
                    </dt>
                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ totalTransactions }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Average Transaction -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Avg. Disbursement
                    </dt>
                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ summary?.average_disbursement ? formatAmount(summary.average_disbursement) : 'KES 0.00' }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
          </div>
          <div class="px-6 py-4">
            <div v-if="loading.recent" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div v-else-if="recentTransactions.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a top-up or disbursement.</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="transaction in recentTransactions"
                :key="`${transaction.type}-${transaction.id}`"
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getTransactionIconBg(transaction.type)">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="transaction.type === 'top_up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ transaction.type === 'top_up' ? 'Top-up' : 'Disbursement' }}
                      <span v-if="transaction.receiver"> to {{ transaction.receiver }}</span>
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ transaction.description }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      by {{ transaction.creator }} • {{ formatDate(transaction.created_at) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium" :class="getTransactionAmountColor(transaction.type)">
                    {{ transaction.type === 'top_up' ? '+' : '-' }}{{ formatAmount(transaction.amount) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <TopUpForm 
      :is-open="showTopUpModal" 
      @close="showTopUpModal = false"
      @success="onTopUpSuccess"
    />
    
    <DisbursementForm 
      :is-open="showDisbursementModal" 
      @close="showDisbursementModal = false"
      @success="onDisbursementSuccess"
    />
    
    <DisbursementForm 
      :is-open="showEditDisbursementModal" 
      :edit-mode="true"
      :disbursement="selectedDisbursement"
      @close="closeEditModal"
      @success="onDisbursementSuccess"
    />
    
    <!-- Void Confirmation Modal -->
    <div
      v-if="showVoidModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="void-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeVoidModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="void-modal-title">
                Void Disbursement
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to void this disbursement? This action cannot be undone and will restore the amount to the available balance.
                </p>
                <div class="mt-4">
                  <label for="void_reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reason for voiding <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="void_reason"
                    v-model="voidReason"
                    rows="3"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="Please provide a reason for voiding this disbursement..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="confirmVoid"
              :disabled="!voidReason || isVoiding"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isVoiding" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isVoiding ? 'Voiding...' : 'Void Disbursement' }}
            </button>
            <button
              @click="closeVoidModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue'
import { usePettyCashStore } from '../stores'
import type { RecentTransaction, PettyCashDisbursement } from '../types/pettyCash'
import TopUpForm from './TopUpForm.vue'
import DisbursementForm from './DisbursementForm.vue'

const store = usePettyCashStore()
const showTopUpModal = ref(false)
const showDisbursementModal = ref(false)
const showEditDisbursementModal = ref(false)
const showVoidModal = ref(false)
const selectedDisbursement = ref<PettyCashDisbursement | null>(null)
const voidReason = ref('')
const isVoiding = ref(false)

// Computed properties
const currentBalance = computed(() => store.currentBalance)
const summary = computed(() => store.summary)
const recentTransactions = computed(() => store.recentTransactions)
const loading = computed(() => store.loading)
const isLoading = computed(() => store.isLoading)
const balanceStatus = computed(() => store.balanceStatus)
const isBalanceLow = computed(() => store.isBalanceLow)
const isBalanceCritical = computed(() => store.isBalanceCritical)

const totalTransactions = computed(() => {
  if (!summary.value) return 0
  return (summary.value.top_up_count || 0) + (summary.value.disbursement_count || 0)
})

const canCreateDisbursement = computed(() => {
  return currentBalance.value && currentBalance.value.current_balance.raw > 0
})

// Balance status styling
const balanceStatusLabel = computed(() => {
  switch (balanceStatus.value) {
    case 'critical': return 'Critical'
    case 'low': return 'Low'
    default: return 'Normal'
  }
})

const balanceStatusColor = computed(() => {
  switch (balanceStatus.value) {
    case 'critical': return 'text-red-600 dark:text-red-400'
    case 'low': return 'text-yellow-600 dark:text-yellow-400'
    default: return 'text-green-600 dark:text-green-400'
  }
})

const balanceIndicatorColor = computed(() => {
  switch (balanceStatus.value) {
    case 'critical': return 'bg-red-500'
    case 'low': return 'bg-yellow-500'
    default: return 'bg-green-500'
  }
})

// Warning styling
const warningTitle = computed(() => {
  return isBalanceCritical.value ? 'Critical Balance Alert' : 'Low Balance Warning'
})

const warningMessage = computed(() => {
  return isBalanceCritical.value 
    ? 'Your petty cash balance is critically low. Please add a top-up immediately.'
    : 'Your petty cash balance is running low. Consider adding a top-up soon.'
})

const warningBgColor = computed(() => {
  return isBalanceCritical.value ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
})

const warningIconColor = computed(() => {
  return isBalanceCritical.value ? 'text-red-400' : 'text-yellow-400'
})

const warningTextColor = computed(() => {
  return isBalanceCritical.value ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'
})

// Methods
const formatAmount = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTransactionIconBg = (type: string): string => {
  return type === 'top_up' ? 'bg-green-500' : 'bg-red-500'
}

const getTransactionAmountColor = (type: string): string => {
  return type === 'top_up' 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400'
}

const refreshDashboard = async () => {
  await store.refreshDashboard()
}

// Modal handlers
const onTopUpSuccess = () => {
  // Dashboard will automatically refresh due to store updates
}

const onDisbursementSuccess = () => {
  // Dashboard will automatically refresh due to store updates
}

const closeEditModal = () => {
  showEditDisbursementModal.value = false
  selectedDisbursement.value = null
}

const closeVoidModal = () => {
  showVoidModal.value = false
  selectedDisbursement.value = null
  voidReason.value = ''
}

const confirmVoid = async () => {
  if (!selectedDisbursement.value || !voidReason.value) return
  
  isVoiding.value = true
  try {
    await store.voidDisbursement(selectedDisbursement.value.id, { void_reason: voidReason.value })
    closeVoidModal()
  } catch (error) {
    // Error handling is done in the store
  } finally {
    isVoiding.value = false
  }
}

// Safe component initialization
onMounted(async () => {
  try {
    // Use nextTick to ensure component is fully mounted
    await nextTick()
    
    // Initialize data safely
    await store.refreshDashboard()
  } catch (error) {
    console.error('Error initializing dashboard:', error)
  }
})
</script>