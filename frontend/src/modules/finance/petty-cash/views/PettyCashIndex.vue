<template>
  <ErrorBoundary 
    type="component" 
    :can-retry="true" 
    :can-reset="true"
    @retry="handleRetry"
    @reset="handleReset"
  >
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="space-y-8">
          <!-- Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Petty Cash Management
              </h1>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Monitor balances, manage transactions, and track petty cash disbursements
              </p>
            </div>
            <div class="mt-4 sm:mt-0 flex space-x-3">
              <!-- Permission-based action buttons -->
              <button
                v-if="permissions.canCreateTopUp"
                @click="openTopUpModal"
                :disabled="isRefreshing"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Top-up
              </button>
              <button
                v-if="permissions.canCreateDisbursement"
                @click="openDisbursementModal"
                :disabled="isRefreshing"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
                </svg>
                New Disbursement
              </button>
              <button
                v-if="permissions.canView"
                @click="handleRefreshAll"
                :disabled="isRefreshing"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isRefreshing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{ isRefreshing ? 'Refreshing...' : 'Refresh All' }}
              </button>
            </div>
          </div>

        <!-- Dashboard Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Balance Card with Error Boundary -->
          <div class="lg:col-span-1">
            <ErrorBoundary 
              type="component" 
              :can-retry="true"
              title="Balance Card Error"
              message="Unable to load balance information"
              @retry="handleBalanceRetry"
            >
              <BalanceCard 
                :balance="currentBalance"
                :loading="loading.balance"
                :error="store.error?.balance"
                @add-topup="openTopUpModal"
                @new-disbursement="openDisbursementModal"
                @refresh="store.fetchCurrentBalance"
                @retry="handleBalanceRetry"
              />
            </ErrorBoundary>
          </div>

          <!-- Summary Cards with Error Boundary -->
          <div class="lg:col-span-2">
            <ErrorBoundary 
              type="component" 
              :can-retry="true"
              title="Summary Cards Error"
              message="Unable to load summary information"
              @retry="handleSummaryRetry"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            {{ safeSummary?.total_top_ups ? formatAmount(safeSummary.total_top_ups) : formatAmount(store.totalTopUpAmount) }}
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
                            {{ safeSummary?.total_disbursements ? formatAmount(safeSummary.total_disbursements) : formatAmount(store.totalDisbursementAmount) }}
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

                <!-- Average Disbursement -->
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
                            {{ safeSummary?.average_disbursement ? formatAmount(safeSummary.average_disbursement) : 'KES 0.00' }}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </div>



        <!-- Transaction List with Error Boundary -->
        <ErrorBoundary 
          type="component" 
          :can-retry="true"
          title="Transaction List Error"
          message="Unable to load transaction list"
          @retry="handleTransactionListRetry"
        >
          <TransactionList 
            @edit-disbursement="editDisbursement"
            @void-disbursement="voidDisbursement"
          />
        </ErrorBoundary>
        </div>
      </div>
    </div>

    <!-- Modals with Error Boundaries -->
    <ErrorBoundary 
      v-if="showTopUpModal"
      type="component" 
      :can-retry="true"
      title="Top-up Form Error"
      message="Unable to load top-up form"
      @retry="handleTopUpModalRetry"
      @reset="closeTopUpModal"
    >
      <TopUpForm 
        :is-open="showTopUpModal" 
        @close="closeTopUpModal"
        @success="onTopUpSuccess"
      />
    </ErrorBoundary>
    
    <ErrorBoundary 
      v-if="showDisbursementModal"
      type="component" 
      :can-retry="true"
      title="Disbursement Form Error"
      message="Unable to load disbursement form"
      @retry="handleDisbursementModalRetry"
      @reset="closeDisbursementModal"
    >
      <DisbursementForm 
        :is-open="showDisbursementModal" 
        @close="closeDisbursementModal"
        @success="onDisbursementSuccess"
      />
    </ErrorBoundary>
    
    <ErrorBoundary 
      v-if="selectedDisbursement && showEditDisbursementModal"
      type="component" 
      :can-retry="true"
      title="Edit Disbursement Form Error"
      message="Unable to load edit disbursement form"
      @retry="handleEditModalRetry"
      @reset="closeEditModal"
    >
      <DisbursementForm 
        :is-open="showEditDisbursementModal" 
        :edit-mode="true"
        :disbursement="selectedDisbursement"
        @close="closeEditModal"
        @success="onDisbursementSuccess"
      />
    </ErrorBoundary>
    
    <!-- Void Confirmation Modal -->
    <div
      v-if="showVoidModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-labelledby="void-modal-title"
      role="dialog"
      aria-modal="true"
      @click.self="closeVoidModal"
      style="background-color: rgba(0, 0, 0, 0.5);"
    >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
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
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick, watch } from 'vue'
import { usePettyCashStore } from '../stores/pettyCashStore'
import { usePermissions } from '../composables/usePermissions'
import { useErrorHandler } from '../composables/useErrorHandler'
import type { PettyCashDisbursement } from '../types/pettyCash'
import BalanceCard from '../components/BalanceCard.vue'
import TransactionList from '../components/TransactionList.vue'
import TopUpForm from '../components/TopUpForm.vue'
import DisbursementForm from '../components/DisbursementForm.vue'
import ErrorBoundary from '../components/ErrorBoundary.vue'


const store = usePettyCashStore()
const permissions = usePermissions()
const { handleError, clearError, withErrorHandling } = useErrorHandler()

// Loading states
const isInitialLoading = ref(false)
const isRefreshing = ref(false)

// Modal states - Initialize with explicit values to prevent Vue reactivity issues
const showTopUpModal = ref(false)
const showDisbursementModal = ref(false)
const showEditDisbursementModal = ref(false)
const showVoidModal = ref(false)
const selectedDisbursement = ref<PettyCashDisbursement | null>(null)
const voidReason = ref('')
const isVoiding = ref(false)

// Modal conflict prevention
const activeModal = ref<string | null>(null)

// Computed properties with safe access
const currentBalance = computed(() => {
  // Create a balance object that uses the actual available balance
  const actualBalance = store.actualAvailableBalance || 0
  
  const result = {
    ...store.currentBalance,
    current_balance: {
      raw: actualBalance,
      formatted: `KES ${actualBalance.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }
  
  console.log('🔍 PettyCashIndex currentBalance:', {
    actualAvailableBalance: store.actualAvailableBalance,
    actualBalance,
    storeCurrentBalance: store.currentBalance,
    totalTopUps: store.totalTopUpAmount,
    totalDisbursements: store.totalDisbursementAmount,
    result
  })
  
  return result
})
const summary = computed(() => store.summary)
const loading = computed(() => store.loading)
const isLoading = computed(() => store.isLoading)

// Safe computed properties with null checking
const safeSummary = computed(() => {
  try {
    return summary.value || {
      total_top_ups: 0,
      total_disbursements: 0,
      transaction_count: 0,
      average_disbursement: 0
    }
  } catch (error) {
    // console.warn('Error accessing summary data:', error)
    return {
      total_top_ups: 0,
      total_disbursements: 0,
      transaction_count: 0,
      average_disbursement: 0
    }
  }
})

const totalTransactions = computed(() => {
  try {
    if (!safeSummary.value) return 0
    const total = (safeSummary.value.top_up_count || 0) + (safeSummary.value.disbursement_count || 0)
    console.log('🔍 PettyCashIndex totalTransactions:', {
      topUpCount: safeSummary.value.top_up_count,
      disbursementCount: safeSummary.value.disbursement_count,
      total,
      storeTransactions: store.transactions.length,
      storeDisbursements: store.disbursements.length,
      storeTopUps: store.topUps.length
    })
    return total
  } catch (error) {
    // console.warn('Error calculating total transactions:', error)
    return 0
  }
})

// Debug computed to track modal states
const modalStates = computed(() => {
  return {
    topUp: showTopUpModal.value,
    disbursement: showDisbursementModal.value,
    edit: showEditDisbursementModal.value,
    void: showVoidModal.value
  }
})

// Watch modal states for debugging (disabled in production)
// watch(modalStates, (newStates) => {
//   console.log('🔥 Modal states changed:', newStates)
// }, { deep: true })

// Methods
const formatAmount = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Enhanced refresh functionality with proper error handling
const handleRefreshAll = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  clearError()
  
  try {
    // Check permissions before refreshing
    permissions.requirePermission('petty_cash.view')
    
    await withErrorHandling(async () => {
      await store.refreshAll()
    }, { context: 'refresh_all' })
  } catch (error: any) {
    handleError(error, { context: 'refresh_all' })
  } finally {
    isRefreshing.value = false
  }
}

// Enhanced retry handlers with proper error handling
const handleBalanceRetry = async () => {
  try {
    await withErrorHandling(async () => {
      await store.fetchCurrentBalance()
    }, { context: 'balance_retry' })
  } catch (error: any) {
    handleError(error, { context: 'balance_retry' })
  }
}

const handleSummaryRetry = async () => {
  try {
    await withErrorHandling(async () => {
      await store.fetchSummary()
    }, { context: 'summary_retry' })
  } catch (error: any) {
    handleError(error, { context: 'summary_retry' })
  }
}

const handleTransactionListRetry = async () => {
  try {
    await withErrorHandling(async () => {
      await store.fetchTransactions()
    }, { context: 'transaction_list_retry' })
  } catch (error: any) {
    handleError(error, { context: 'transaction_list_retry' })
  }
}

// Enhanced modal handlers with conflict prevention and permission checking
const openTopUpModal = async () => {
  console.log('🔥 openTopUpModal called')
  try {
    // Prevent modal conflicts
    if (activeModal.value && activeModal.value !== 'topup') {
      console.warn('Another modal is already open:', activeModal.value)
      return
    }
    
    console.log('🔥 Opening top-up modal...')
    activeModal.value = 'topup'
    showTopUpModal.value = true
    await nextTick() // Ensure DOM is updated
    console.log('🔥 Top-up modal opened, showTopUpModal:', showTopUpModal.value, 'activeModal:', activeModal.value)
  } catch (error: any) {
    console.error('🔥 Error opening top-up modal:', error)
    handleError(error, { context: 'open_topup_modal' })
  }
}

const openDisbursementModal = async () => {
  console.log('🔥 openDisbursementModal called')
  try {
    // Prevent modal conflicts
    if (activeModal.value && activeModal.value !== 'disbursement') {
      console.warn('Another modal is already open:', activeModal.value)
      return
    }
    
    console.log('🔥 Opening disbursement modal...')
    activeModal.value = 'disbursement'
    showDisbursementModal.value = true
    await nextTick() // Ensure DOM is updated
    console.log('🔥 Disbursement modal opened, showDisbursementModal:', showDisbursementModal.value, 'activeModal:', activeModal.value)
  } catch (error: any) {
    console.error('🔥 Error opening disbursement modal:', error)
    handleError(error, { context: 'open_disbursement_modal' })
  }
}

const closeTopUpModal = async () => {
  try {
    showTopUpModal.value = false
    if (activeModal.value === 'topup') {
      activeModal.value = null
    }
    await nextTick() // Ensure DOM is updated
  } catch (error: any) {
    console.error('Error closing top-up modal:', error)
    handleError(error, { context: 'close_topup_modal' })
  }
}

const closeDisbursementModal = async () => {
  try {
    showDisbursementModal.value = false
    if (activeModal.value === 'disbursement') {
      activeModal.value = null
    }
    await nextTick() // Ensure DOM is updated
  } catch (error: any) {
    console.error('Error closing disbursement modal:', error)
    handleError(error, { context: 'close_disbursement_modal' })
  }
}

const onTopUpSuccess = async () => {
  try {
    await closeTopUpModal()
    // Store will automatically refresh data
  } catch (error) {
    console.error('Error handling top-up success:', error)
  }
}

const onDisbursementSuccess = async () => {
  try {
    await closeDisbursementModal()
    await closeEditModal()
    // Store will automatically refresh data
  } catch (error) {
    console.error('Error handling disbursement success:', error)
  }
}

const editDisbursement = async (disbursement: PettyCashDisbursement) => {
  try {
    // Check permissions before opening edit modal
    permissions.requirePermission('petty_cash.edit_disbursement')
    
    // Prevent modal conflicts
    if (activeModal.value && activeModal.value !== 'edit') {
      console.warn('Another modal is already open:', activeModal.value)
      return
    }
    
    activeModal.value = 'edit'
    selectedDisbursement.value = disbursement
    showEditDisbursementModal.value = true
    await nextTick()
  } catch (error: any) {
    console.error('Error opening edit modal:', error)
    handleError(error, { context: 'open_edit_modal' })
  }
}

const voidDisbursement = async (disbursement: PettyCashDisbursement) => {
  try {
    // Check permissions before opening void modal
    permissions.requirePermission('petty_cash.void_disbursement')
    
    // Prevent modal conflicts
    if (activeModal.value && activeModal.value !== 'void') {
      console.warn('Another modal is already open:', activeModal.value)
      return
    }
    
    activeModal.value = 'void'
    selectedDisbursement.value = disbursement
    showVoidModal.value = true
    await nextTick()
  } catch (error: any) {
    console.error('Error opening void modal:', error)
    handleError(error, { context: 'open_void_modal' })
  }
}

const closeEditModal = async () => {
  try {
    showEditDisbursementModal.value = false
    selectedDisbursement.value = null
    if (activeModal.value === 'edit') {
      activeModal.value = null
    }
    await nextTick() // Ensure DOM is updated
  } catch (error: any) {
    console.error('Error closing edit modal:', error)
    handleError(error, { context: 'close_edit_modal' })
  }
}

const closeVoidModal = async () => {
  try {
    showVoidModal.value = false
    selectedDisbursement.value = null
    voidReason.value = ''
    if (activeModal.value === 'void') {
      activeModal.value = null
    }
    await nextTick() // Ensure DOM is updated
  } catch (error: any) {
    console.error('Error closing void modal:', error)
    handleError(error, { context: 'close_void_modal' })
  }
}

const confirmVoid = async () => {
  if (!selectedDisbursement.value || !voidReason.value) return
  
  isVoiding.value = true
  try {
    await withErrorHandling(async () => {
      await store.voidDisbursement(selectedDisbursement.value!.id, { void_reason: voidReason.value })
    }, { context: 'void_disbursement' })
    
    await closeVoidModal()
  } catch (error: any) {
    handleError(error, { context: 'void_disbursement' })
  } finally {
    isVoiding.value = false
  }
}

// Error boundary retry handlers
const handleTopUpModalRetry = async () => {
  try {
    await nextTick()
    // Modal should automatically re-render after error boundary retry
  } catch (error: any) {
    handleError(error, { context: 'topup_modal_retry' })
  }
}

const handleDisbursementModalRetry = async () => {
  try {
    await nextTick()
    // Modal should automatically re-render after error boundary retry
  } catch (error: any) {
    handleError(error, { context: 'disbursement_modal_retry' })
  }
}

const handleEditModalRetry = async () => {
  try {
    await nextTick()
    // Modal should automatically re-render after error boundary retry
  } catch (error: any) {
    handleError(error, { context: 'edit_modal_retry' })
  }
}

// Main component error boundary handlers
const handleRetry = async () => {
  try {
    isInitialLoading.value = true
    clearError()
    await initializeComponent()
  } catch (error: any) {
    handleError(error, { context: 'main_component_retry' })
  } finally {
    isInitialLoading.value = false
  }
}

const handleReset = async () => {
  try {
    // Reset all modal states
    showTopUpModal.value = false
    showDisbursementModal.value = false
    showEditDisbursementModal.value = false
    showVoidModal.value = false
    selectedDisbursement.value = null
    voidReason.value = ''
    activeModal.value = null
    
    // Clear errors and reinitialize
    clearError()
    await nextTick()
    await initializeComponent()
  } catch (error: any) {
    handleError(error, { context: 'main_component_reset' })
  }
}

// Safe component initialization with permission checking
const initializeComponent = async () => {
  try {
    // Check basic view permissions
    permissions.requirePermission('petty_cash.view')
    
    // Use nextTick to ensure component is fully mounted
    await nextTick()
    
    console.log('🔍 PettyCashIndex initializing component...')
    
    // Initialize data safely with error handling
    await withErrorHandling(async () => {
      await store.refreshAll()
      console.log('🔍 PettyCashIndex after refreshAll:', {
        transactions: store.transactions.length,
        disbursements: store.disbursements.length,
        topUps: store.topUps.length,
        actualBalance: store.actualAvailableBalance
      })
      // Debug store state
      store.debugStoreState()
    }, { context: 'component_initialization' })
  } catch (error: any) {
    // Log the error but don't re-throw to prevent loading state from hanging
    console.error('Component initialization failed:', error)
    handleError(error, { context: 'component_initialization' })
    // Don't re-throw - let the component render with error state
  }
}

onMounted(async () => {
  try {
    isInitialLoading.value = true
    await initializeComponent()
  } catch (error) {
    console.error('Error initializing petty cash component:', error)
    // Error is already handled by initializeComponent
  } finally {
    isInitialLoading.value = false
  }
})


</script>