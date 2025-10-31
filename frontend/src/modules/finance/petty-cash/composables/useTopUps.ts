import { ref, computed } from 'vue'
import type { 
  PettyCashTopUp, 
  PettyCashBalance,
  TopUpFilters,
  TopUpStatistics,
  PaymentMethodBreakdown,
  BalanceCheck
} from '../types/pettyCash'
import type {
  CreateTopUpFormData
} from '../types/forms'
import api from '@/plugins/axios'

const topUps = ref<PettyCashTopUp[]>([])
const availableTopUps = ref<PettyCashTopUp[]>([])
const currentBalance = ref<PettyCashBalance | null>(null)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})
const loading = ref(false)
const error = ref<string | null>(null)

export function useTopUps() {
  const fetchTopUps = async (filters?: TopUpFilters & { page?: number }) => {
    loading.value = true
    error.value = null

    try {
      const params = { ...filters }
      const response = await api.get('/api/finance/petty-cash/top-ups', { params })
      
      if (response.data.success) {
        topUps.value = response.data.data || []
        pagination.value = {
          current_page: response.data.meta.current_page || 1,
          last_page: response.data.meta.last_page || 1,
          per_page: response.data.meta.per_page || 15,
          total: response.data.meta.total || 0,
          from: ((response.data.meta.current_page - 1) * response.data.meta.per_page) + 1,
          to: Math.min(response.data.meta.current_page * response.data.meta.per_page, response.data.meta.total)
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch top-ups')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch top-ups'
      topUps.value = []
      pagination.value = {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
      }
    } finally {
      loading.value = false
    }
  }

  const fetchAvailableTopUps = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/finance/petty-cash/top-ups/available')
      
      if (response.data.success) {
        availableTopUps.value = response.data.data || []
      } else {
        throw new Error(response.data.message || 'Failed to fetch available top-ups')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch available top-ups'
      availableTopUps.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchCurrentBalance = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/finance/petty-cash/balance')
      
      if (response.data.success) {
        currentBalance.value = response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch current balance')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch current balance'
      currentBalance.value = null
    } finally {
      loading.value = false
    }
  }

  const getTopUp = async (id: number): Promise<PettyCashTopUp> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/finance/petty-cash/top-ups/${id}`)
      
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch top-up')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch top-up'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTopUp = async (data: CreateTopUpFormData): Promise<PettyCashTopUp> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/finance/petty-cash/top-ups', data)
      
      if (response.data.success) {
        const newTopUp = response.data.data
        topUps.value.unshift(newTopUp)
        // Refresh balance after creating top-up
        await fetchCurrentBalance()
        return newTopUp
      } else {
        throw new Error(response.data.message || 'Failed to create top-up')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to create top-up'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getAvailableBalance = async (topUpId: number): Promise<number> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/finance/petty-cash/top-ups/${topUpId}/available-balance`)
      
      if (response.data.success) {
        return response.data.data.available_balance
      } else {
        throw new Error(response.data.message || 'Failed to fetch available balance')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch available balance'
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkBalance = async (amount: number): Promise<BalanceCheck> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/finance/petty-cash/balance/check', { amount })
      
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to check balance')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to check balance'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getStatistics = async (filters?: TopUpFilters): Promise<TopUpStatistics> => {
    loading.value = true
    error.value = null

    try {
      const params = { ...filters }
      const response = await api.get('/api/finance/petty-cash/statistics', { params })
      
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch statistics')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch statistics'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPaymentMethodBreakdown = async (filters?: TopUpFilters): Promise<PaymentMethodBreakdown> => {
    loading.value = true
    error.value = null

    try {
      const params = { ...filters }
      const response = await api.get('/api/finance/petty-cash/payment-methods', { params })
      
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch payment method breakdown')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch payment method breakdown'
      throw err
    } finally {
      loading.value = false
    }
  }

  const validateTopUp = async (data: CreateTopUpFormData): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/finance/petty-cash/validate/top-up', data)
      
      if (response.data.success) {
        return true
      } else {
        throw new Error(response.data.message || 'Validation failed')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Validation failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const recalculateBalance = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/finance/petty-cash/balance/recalculate')
      
      if (response.data.success) {
        // Refresh balance after recalculation
        await fetchCurrentBalance()
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to recalculate balance')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to recalculate balance'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const topUpsWithBalance = computed(() => 
    topUps.value.filter(t => t.has_available_balance)
  )

  const fullyDisbursedTopUps = computed(() => 
    topUps.value.filter(t => t.is_fully_disbursed)
  )

  const totalTopUpAmount = computed(() => 
    topUps.value.reduce((sum, t) => sum + t.amount.raw, 0)
  )

  const totalRemainingBalance = computed(() => 
    topUps.value.reduce((sum, t) => sum + t.remaining_balance.raw, 0)
  )

  const averageTopUpAmount = computed(() => 
    topUps.value.length > 0 ? totalTopUpAmount.value / topUps.value.length : 0
  )

  const balanceStatus = computed(() => currentBalance.value?.status.value || 'normal')

  const isBalanceLow = computed(() => currentBalance.value?.status.is_low || false)

  const isBalanceCritical = computed(() => currentBalance.value?.status.is_critical || false)

  // Pagination helpers
  const goToPage = async (page: number, filters?: TopUpFilters) => {
    await fetchTopUps({ ...filters, page })
  }

  // Clear functions
  const clearError = () => {
    error.value = null
  }

  const clearTopUps = () => {
    topUps.value = []
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    }
  }

  return {
    // State
    topUps,
    availableTopUps,
    currentBalance,
    pagination,
    loading,
    error,

    // Actions
    fetchTopUps,
    fetchAvailableTopUps,
    fetchCurrentBalance,
    getTopUp,
    createTopUp,
    getAvailableBalance,
    checkBalance,
    getStatistics,
    getPaymentMethodBreakdown,
    validateTopUp,
    recalculateBalance,

    // Computed
    topUpsWithBalance,
    fullyDisbursedTopUps,
    totalTopUpAmount,
    totalRemainingBalance,
    averageTopUpAmount,
    balanceStatus,
    isBalanceLow,
    isBalanceCritical,

    // Helpers
    goToPage,
    clearError,
    clearTopUps
  }
}