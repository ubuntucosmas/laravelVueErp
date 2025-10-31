import { ref, computed } from 'vue'
import type { 
  PettyCashDisbursement, 
  DisbursementFilters,
  TransactionFilters
} from '../types/pettyCash'
import type {
  CreateDisbursementFormData, 
  UpdateDisbursementFormData,
  VoidDisbursementFormData
} from '../types/forms'
import api from '@/plugins/axios'

const disbursements = ref<PettyCashDisbursement[]>([])
const transactions = ref<any[]>([]) // Hierarchical transactions (top-ups with disbursements)
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

export function usePettyCash() {
  const fetchDisbursements = async (filters?: DisbursementFilters & { page?: number }) => {
    loading.value = true
    error.value = null

    try {
      const params = { ...filters }
      const response = await api.get('/api/finance/petty-cash/disbursements', { params })
      
      if (response.data.success) {
        disbursements.value = response.data.data || []
        pagination.value = {
          current_page: response.data.meta.current_page || 1,
          last_page: response.data.meta.last_page || 1,
          per_page: response.data.meta.per_page || 15,
          total: response.data.meta.total || 0,
          from: ((response.data.meta.current_page - 1) * response.data.meta.per_page) + 1,
          to: Math.min(response.data.meta.current_page * response.data.meta.per_page, response.data.meta.total)
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch disbursements')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch disbursements'
      disbursements.value = []
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

  const fetchTransactions = async (filters?: TransactionFilters & { page?: number }) => {
    loading.value = true
    error.value = null

    try {
      const params = { ...filters }
      const response = await api.get('/api/finance/petty-cash/transactions', { params })
      
      if (response.data.success) {
        transactions.value = response.data.data || []
        pagination.value = {
          current_page: response.data.meta.current_page || 1,
          last_page: response.data.meta.last_page || 1,
          per_page: response.data.meta.per_page || 15,
          total: response.data.meta.total || 0,
          from: ((response.data.meta.current_page - 1) * response.data.meta.per_page) + 1,
          to: Math.min(response.data.meta.current_page * response.data.meta.per_page, response.data.meta.total)
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch transactions')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch transactions'
      transactions.value = []
    } finally {
      loading.value = false
    }
  }

  const getDisbursement = async (id: number): Promise<PettyCashDisbursement> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/finance/petty-cash/disbursements/${id}`)
      
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch disbursement')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch disbursement'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createDisbursement = async (data: CreateDisbursementFormData): Promise<PettyCashDisbursement> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/finance/petty-cash/disbursements', data)
      
      if (response.data.success) {
        const newDisbursement = response.data.data
        disbursements.value.unshift(newDisbursement)
        return newDisbursement
      } else {
        throw new Error(response.data.message || 'Failed to create disbursement')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to create disbursement'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDisbursement = async (id: number, data: UpdateDisbursementFormData): Promise<PettyCashDisbursement> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/finance/petty-cash/disbursements/${id}`, data)
      
      if (response.data.success) {
        const updatedDisbursement = response.data.data
        const index = disbursements.value.findIndex(d => d.id === id)
        if (index !== -1) {
          disbursements.value[index] = updatedDisbursement
        }
        return updatedDisbursement
      } else {
        throw new Error(response.data.message || 'Failed to update disbursement')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to update disbursement'
      throw err
    } finally {
      loading.value = false
    }
  }

  const voidDisbursement = async (id: number, data: VoidDisbursementFormData): Promise<PettyCashDisbursement> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/api/finance/petty-cash/disbursements/${id}/void`, data)
      
      if (response.data.success) {
        const voidedDisbursement = response.data.data
        const index = disbursements.value.findIndex(d => d.id === id)
        if (index !== -1) {
          disbursements.value[index] = voidedDisbursement
        }
        return voidedDisbursement
      } else {
        throw new Error(response.data.message || 'Failed to void disbursement')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to void disbursement'
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchTransactions = async (query: string, filters?: DisbursementFilters & { page?: number }) => {
    loading.value = true
    error.value = null

    try {
      const params = { query, ...filters }
      const response = await api.get('/api/finance/petty-cash/search', { params })
      
      if (response.data.success) {
        disbursements.value = response.data.data || []
        pagination.value = {
          current_page: response.data.meta.current_page || 1,
          last_page: response.data.meta.last_page || 1,
          per_page: response.data.meta.per_page || 15,
          total: response.data.meta.total || 0,
          from: ((response.data.meta.current_page - 1) * response.data.meta.per_page) + 1,
          to: Math.min(response.data.meta.current_page * response.data.meta.per_page, response.data.meta.total)
        }
      } else {
        throw new Error(response.data.message || 'Failed to search transactions')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to search transactions'
      disbursements.value = []
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const activeDisbursements = computed(() => 
    disbursements.value.filter(d => d.status.is_active)
  )

  const voidedDisbursements = computed(() => 
    disbursements.value.filter(d => d.status.is_voided)
  )

  const totalDisbursements = computed(() => disbursements.value.length)

  const totalAmount = computed(() => 
    disbursements.value.reduce((sum, d) => sum + d.amount.raw, 0)
  )

  const activeAmount = computed(() => 
    activeDisbursements.value.reduce((sum, d) => sum + d.amount.raw, 0)
  )

  // Pagination helpers
  const goToPage = async (page: number, filters?: DisbursementFilters) => {
    await fetchDisbursements({ ...filters, page })
  }

  const goToTransactionPage = async (page: number, filters?: TransactionFilters) => {
    await fetchTransactions({ ...filters, page })
  }

  // Clear functions
  const clearError = () => {
    error.value = null
  }

  const clearDisbursements = () => {
    disbursements.value = []
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
    disbursements,
    transactions,
    pagination,
    loading,
    error,

    // Actions
    fetchDisbursements,
    fetchTransactions,
    getDisbursement,
    createDisbursement,
    updateDisbursement,
    voidDisbursement,
    searchTransactions,

    // Computed
    activeDisbursements,
    voidedDisbursements,
    totalDisbursements,
    totalAmount,
    activeAmount,

    // Helpers
    goToPage,
    goToTransactionPage,
    clearError,
    clearDisbursements
  }
}