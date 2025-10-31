<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Transaction History
        </h3>
        <div class="mt-3 sm:mt-0 flex space-x-3">
          <!-- Search -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search transactions..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Filters Toggle -->
          <button
            @click="showFilters = !showFilters"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
            </svg>
            Filters
          </button>
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              v-model="filters.status"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="voided">Voided</option>
            </select>
          </div>

          <!-- Classification Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Classification</label>
            <select
              v-model="filters.classification"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="">All</option>
              <option value="agencies">Agencies</option>
              <option value="admin">Administration</option>
              <option value="operations">Operations</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Payment Method Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
            <select
              v-model="filters.payment_method"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="">All</option>
              <option value="cash">Cash</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input
              v-model="filters.start_date"
              type="date"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input
              v-model="filters.end_date"
              type="date"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="mt-4 flex justify-end space-x-3">
          <button
            @click="clearFilters"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear
          </button>
          <button
            @click="applyFilters"
            class="px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
    
    <!-- Transaction List -->
    <div class="px-6 py-4">
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      
      <div v-else-if="allTransactions.length === 0" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ hasActiveFilters ? 'Try adjusting your filters' : 'Get started by creating a top-up or disbursement' }}
        </p>
      </div>

      <div v-else class="space-y-3">
        <!-- Individual Transactions -->
        <div
          v-for="transaction in allTransactions"
          :key="transaction.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <!-- Transaction Icon -->
              <div class="flex-shrink-0">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="transaction.type === 'top_up' ? 'bg-green-500' : getTransactionIconBg(transaction)"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      :d="transaction.type === 'top_up' ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'"
                    ></path>
                  </svg>
                </div>
              </div>
              
              <!-- Transaction Details -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center space-x-2">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    <span v-if="transaction.type === 'top_up'">Top-up</span>
                    <span v-else>{{ transaction.receiver || 'Disbursement' }}</span>
                  </h4>
                  
                  <!-- Transaction Type Badge -->
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="transaction.type === 'top_up' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'"
                  >
                    {{ transaction.type === 'top_up' ? 'Top-up' : 'Disbursement' }}
                  </span>
                  
                  <!-- Payment Method Badge -->
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                    {{ transaction.payment_method?.label || 'Unknown' }}
                  </span>
                  
                  <!-- Classification Badge (for disbursements) -->
                  <span 
                    v-if="transaction.classification"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" 
                    :class="getClassificationBadgeClass(transaction.classification.value)"
                  >
                    {{ transaction.classification.label }}
                  </span>
                  
                  <!-- Status Badge (for disbursements) -->
                  <span 
                    v-if="transaction.status?.is_voided" 
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                  >
                    Voided
                  </span>
                </div>
                
                <!-- Description -->
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ transaction.description }}
                </p>
                
                <!-- Additional Details (for disbursements) -->
                <div v-if="transaction.type === 'disbursement'" class="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-500 mt-1">
                  <span v-if="transaction.account">{{ transaction.account }}</span>
                  <span v-if="transaction.project_name">{{ transaction.project_name }}</span>
                  <span>{{ formatDate(transaction.created_at.raw) }}</span>
                </div>
                <div v-else class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{ formatDate(transaction.created_at.raw) }}
                </div>
              </div>
            </div>
            
            <!-- Amount and Actions -->
            <div class="flex items-center space-x-3">
              <!-- Amount -->
              <span 
                class="text-sm font-medium"
                :class="getTransactionAmountColor(transaction)"
              >
                {{ transaction.type === 'top_up' ? '+' : '-' }}{{ transaction.amount.formatted }}
              </span>
              
              <!-- Actions (for disbursements) -->
              <div v-if="transaction.type === 'disbursement'" class="flex items-center space-x-1">
                <button
                  v-if="transaction.can_edit"
                  @click="editDisbursement(transaction.original_data)"
                  class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  title="Edit disbursement"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  v-if="transaction.can_void"
                  @click="voidDisbursement(transaction.original_data)"
                  class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  title="Void disbursement"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="allTransactions.length > 15" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="goToPreviousPage"
            :disabled="pagination.current_page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="goToNextPage"
            :disabled="pagination.current_page >= pagination.last_page"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ pagination.from }}</span>
              to
              <span class="font-medium">{{ pagination.to }}</span>
              of
              <span class="font-medium">{{ pagination.total }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="goToPreviousPage"
                :disabled="pagination.current_page <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === pagination.current_page
                    ? 'z-10 bg-blue-50 dark:bg-blue-900/50 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
              
              <button
                @click="goToNextPage"
                :disabled="pagination.current_page >= pagination.last_page"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted, nextTick } from 'vue'
import { usePettyCashStore } from '../stores/pettyCashStore'
import type { PettyCashDisbursement, TransactionFilters } from '../types/pettyCash'

interface Emits {
  (e: 'edit-disbursement', disbursement: PettyCashDisbursement): void
  (e: 'void-disbursement', disbursement: PettyCashDisbursement): void
}

const emit = defineEmits<Emits>()

const store = usePettyCashStore()
const showFilters = ref(false)
const searchQuery = ref('')

// Filters
const filters = reactive<TransactionFilters>({
  status: '',
  classification: '',
  payment_method: '',
  start_date: '',
  end_date: ''
})

// Computed properties
const transactions = computed(() => store.transactions)
const pagination = computed(() => store.pagination.transactions)
const loading = computed(() => store.loading.transactions)

// Create a flattened list of all transactions (top-ups and disbursements) with unique IDs
const allTransactions = computed(() => {
  const transactionList: Array<{
    id: string
    type: 'top_up' | 'disbursement'
    amount: { raw: number; formatted: string }
    description: string
    created_at: { raw: string; formatted: string; human: string }
    payment_method: { value: string; label: string }
    classification?: { value: string; label: string }
    status?: { value: string; label: string; is_active: boolean; is_voided: boolean }
    receiver?: string
    account?: string
    project_name?: string
    can_edit?: boolean
    can_void?: boolean
    top_up_id?: number
    original_data: any
  }> = []

  // Add top-ups as transactions
  store.topUps.forEach(topUp => {
    transactionList.push({
      id: `topup-${topUp.id}`,
      type: 'top_up',
      amount: topUp.amount,
      description: `Top-up via ${topUp.payment_method?.label || 'Unknown'}`,
      created_at: topUp.created_at,
      payment_method: topUp.payment_method,
      original_data: topUp
    })
  })

  // Add disbursements as transactions
  store.disbursements.forEach(disbursement => {
    transactionList.push({
      id: `disbursement-${disbursement.id}`,
      type: 'disbursement',
      amount: disbursement.amount,
      description: disbursement.description || 'Disbursement',
      created_at: disbursement.created_at,
      payment_method: disbursement.payment_method,
      classification: disbursement.classification,
      status: disbursement.status,
      receiver: disbursement.receiver,
      account: disbursement.account,
      project_name: disbursement.project_name,
      can_edit: disbursement.can_edit,
      can_void: disbursement.can_void,
      top_up_id: disbursement.top_up_id,
      original_data: disbursement
    })
  })

  // Sort by creation date (newest first)
  return transactionList.sort((a, b) => 
    new Date(b.created_at.raw).getTime() - new Date(a.created_at.raw).getTime()
  )
})

const hasActiveFilters = computed(() => {
  return Object.values(filters).some(value => value !== '') || searchQuery.value !== ''
})

const visiblePages = computed(() => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages: number[] = []
  
  // Always show first page
  if (last > 0) pages.push(1)
  
  // Show pages around current page
  for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
    if (!pages.includes(i)) pages.push(i)
  }
  
  // Always show last page
  if (last > 1 && !pages.includes(last)) pages.push(last)
  
  return pages.sort((a, b) => a - b)
})

// Methods
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDisbursementIconBg = (status: string): string => {
  return status === 'voided' ? 'bg-red-500' : 'bg-blue-500'
}

const getDisbursementAmountColor = (status: string): string => {
  return status === 'voided' 
    ? 'text-red-400 dark:text-red-500 line-through' 
    : 'text-red-600 dark:text-red-400'
}

const getTransactionIconBg = (transaction: any): string => {
  if (transaction.type === 'top_up') {
    return 'bg-green-500'
  }
  return transaction.status?.is_voided ? 'bg-red-500' : 'bg-blue-500'
}

const getTransactionAmountColor = (transaction: any): string => {
  if (transaction.type === 'top_up') {
    return 'text-green-600 dark:text-green-400'
  }
  return transaction.status?.is_voided 
    ? 'text-red-400 dark:text-red-500 line-through' 
    : 'text-red-600 dark:text-red-400'
}

const getClassificationBadgeClass = (classification: string): string => {
  const classes = {
    agencies: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    operations: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
  return classes[classification as keyof typeof classes] || classes.other
}



const editDisbursement = (disbursement: PettyCashDisbursement) => {
  emit('edit-disbursement', disbursement)
}

const voidDisbursement = (disbursement: PettyCashDisbursement) => {
  emit('void-disbursement', disbursement)
}

const applyFilters = async () => {
  const searchFilters = { ...filters }
  if (searchQuery.value) {
    searchFilters.search = searchQuery.value
  }
  
  // Fetch both top-ups and disbursements with filters
  await Promise.all([
    store.fetchTopUps(searchFilters),
    store.fetchDisbursements(searchFilters)
  ])
}

const clearFilters = async () => {
  Object.keys(filters).forEach(key => {
    filters[key as keyof TransactionFilters] = ''
  })
  searchQuery.value = ''
  
  // Fetch both top-ups and disbursements without filters
  await Promise.all([
    store.fetchTopUps(),
    store.fetchDisbursements()
  ])
}

// Pagination methods (simplified for now since we're showing combined data)
const goToPage = async (page: number) => {
  const searchFilters = { ...filters, page }
  if (searchQuery.value) {
    searchFilters.search = searchQuery.value
  }
  
  // For now, we'll fetch both types with the same page
  await Promise.all([
    store.fetchTopUps(searchFilters),
    store.fetchDisbursements(searchFilters)
  ])
}

const goToPreviousPage = () => {
  if (pagination.value.current_page > 1) {
    goToPage(pagination.value.current_page - 1)
  }
}

const goToNextPage = () => {
  if (pagination.value.current_page < pagination.value.last_page) {
    goToPage(pagination.value.current_page + 1)
  }
}

// Watchers
let searchTimeout: NodeJS.Timeout
watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500) // Debounce search
})

// Safe component initialization
onMounted(async () => {
  try {
    // Use nextTick to ensure component is fully mounted
    await nextTick()
    
    // Ensure we have both top-ups and disbursements data
    if (store.topUps.length === 0) {
      await store.fetchTopUps()
    }
    if (store.disbursements.length === 0) {
      await store.fetchDisbursements()
    }
    
    console.log('🔍 TransactionList mounted:', {
      topUpsCount: store.topUps.length,
      disbursementsCount: store.disbursements.length,
      allTransactionsCount: allTransactions.value.length
    })
  } catch (error) {
    console.error('Error initializing transaction list:', error)
  }
})
</script>