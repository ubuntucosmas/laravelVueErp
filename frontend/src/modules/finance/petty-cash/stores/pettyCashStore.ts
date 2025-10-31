import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
    PettyCashTopUp,
    PettyCashDisbursement,
    PettyCashBalance,
    TransactionSummary,
    SpendingAnalytics,
    RecentTransaction,
    DisbursementFilters,
    TopUpFilters
} from '../types/pettyCash'
import type {
    CreateTopUpFormData,
    CreateDisbursementFormData,
    UpdateDisbursementFormData,
    VoidDisbursementFormData
} from '../types/forms'
import { pettyCashService } from '../services/pettyCashService'
import { useErrorHandler } from '../composables/useErrorHandler'
import { 
    defaultBalance, 
    defaultSummary, 
    defaultAnalytics, 
    defaultPagination,
    defaultLoadingStates,
    defaultErrorStates,
    mergeWithDefaults,
    createSafeArray
} from '../utils/defaults'
import { 
    validateBalanceData, 
    validateSummaryData, 
    validateAnalyticsData,
    validateTopUpData,
    validateDisbursementData,
    validateArrayData
} from '../utils/validation'


export const usePettyCashStore = defineStore('pettyCash', () => {
    // Error handling composable
    const { handleError, clearError: clearErrorHandler, withErrorHandling, withRetry } = useErrorHandler()

    // State with safe defaults
    const disbursements = ref<PettyCashDisbursement[]>([])
    const topUps = ref<PettyCashTopUp[]>([])
    const transactions = ref<PettyCashTopUp[]>([]) // Hierarchical transactions (top-ups with disbursements)
    const availableTopUps = ref<PettyCashTopUp[]>([])
    const currentBalance = ref<PettyCashBalance>(defaultBalance)
    const summary = ref<TransactionSummary>(defaultSummary)
    const analytics = ref<SpendingAnalytics>(defaultAnalytics)
    const recentTransactions = ref<RecentTransaction[]>([])

    // Enhanced loading states with safe defaults
    const loading = ref({
        disbursements: false,
        topUps: false,
        transactions: false,
        balance: false,
        summary: false,
        analytics: false,
        recent: false,
        creating: false,
        updating: false,
        voiding: false
    })

    // Enhanced error states with safe defaults
    const errors = ref({
        disbursements: null as string | null,
        topUps: null as string | null,
        transactions: null as string | null,
        balance: null as string | null,
        summary: null as string | null,
        analytics: null as string | null,
        recent: null as string | null,
        creating: null as string | null,
        updating: null as string | null,
        voiding: null as string | null
    })

    // Pagination with safe defaults
    const pagination = ref({
        disbursements: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
            from: 0,
            to: 0
        },
        topUps: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
            from: 0,
            to: 0
        },
        transactions: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
            from: 0,
            to: 0
        }
    })

    // Filters
    const activeFilters = ref({
        disbursements: {} as DisbursementFilters,
        topUps: {} as TopUpFilters
    })

    // Retry configuration
    const retryConfig = ref({
        maxRetries: 3,
        retryDelay: 1000,
        enableRetry: true
    })

    // Data validation flags
    const dataIntegrity = ref({
        lastValidated: null as Date | null,
        validationErrors: [] as string[],
        isDataStale: false
    })

    // Safe computed properties with error handling
    const activeDisbursements = computed(() => {
        try {
            return disbursements.value.filter(d => d?.status?.is_active === true)
        } catch (error) {
            // console.warn('Error filtering active disbursements:', error)
            return []
        }
    })

    const voidedDisbursements = computed(() => {
        try {
            return disbursements.value.filter(d => d?.status?.is_voided === true)
        } catch (error) {
            // console.warn('Error filtering voided disbursements:', error)
            return []
        }
    })

    const topUpsWithBalance = computed(() => {
        try {
            return topUps.value.filter(t => t?.has_available_balance === true)
        } catch (error) {
            // console.warn('Error filtering top-ups with balance:', error)
            return []
        }
    })

    const fullyDisbursedTopUps = computed(() => {
        try {
            return topUps.value.filter(t => t?.is_fully_disbursed === true)
        } catch (error) {
            // console.warn('Error filtering fully disbursed top-ups:', error)
            return []
        }
    })

    const totalDisbursementAmount = computed(() => {
        try {
            // Use all disbursements, not just active ones, but filter out voided ones
            const validDisbursements = disbursements.value.filter(d => 
                d?.status?.is_active !== false && d?.status?.value !== 'voided'
            )
            
            console.log('🔍 Calculating totalDisbursementAmount:', {
                disbursementsCount: validDisbursements.length,
                allDisbursementsCount: disbursements.value.length,
                disbursements: validDisbursements.map(d => ({
                    id: d?.id,
                    amount: d?.amount,
                    amountRaw: d?.amount?.raw,
                    status: d?.status
                }))
            })
            
            const total = validDisbursements.reduce((sum, d) => {
                const amount = d?.amount?.raw || 0
                console.log('🔍 Processing disbursement:', { id: d?.id, amount, sum, status: d?.status })
                return sum + (typeof amount === 'number' ? amount : 0)
            }, 0)
            
            console.log('🔍 Total disbursement amount:', total)
            return total
        } catch (error) {
            console.warn('Error calculating total disbursement amount:', error)
            return 0
        }
    })

    const totalTopUpAmount = computed(() => {
        try {
            console.log('🔍 Calculating totalTopUpAmount:', {
                topUpsCount: topUps.value.length,
                topUps: topUps.value.map(t => ({
                    id: t?.id,
                    amount: t?.amount,
                    amountRaw: t?.amount?.raw
                }))
            })
            
            const total = topUps.value.reduce((sum, t) => {
                const amount = t?.amount?.raw || 0
                console.log('🔍 Processing top-up:', { id: t?.id, amount, sum })
                return sum + (typeof amount === 'number' ? amount : 0)
            }, 0)
            
            console.log('🔍 Total top-up amount:', total)
            return total
        } catch (error) {
            console.warn('Error calculating total top-up amount:', error)
            return 0
        }
    })

    const totalRemainingBalance = computed(() => {
        try {
            return topUps.value.reduce((sum, t) => {
                const balance = t?.remaining_balance?.raw || 0
                return sum + (typeof balance === 'number' ? balance : 0)
            }, 0)
        } catch (error) {
            // console.warn('Error calculating total remaining balance:', error)
            return 0
        }
    })

    const safeCurrentBalance = computed(() => {
        try {
            return mergeWithDefaults(defaultBalance, currentBalance.value)
        } catch (error) {
            // console.warn('Error accessing current balance:', error)
            return defaultBalance
        }
    })

    const balanceStatus = computed(() => {
        try {
            return safeCurrentBalance.value.status?.value || 'normal'
        } catch (error) {
            console.warn('Error getting balance status:', error)
            return 'normal'
        }
    })

    const isBalanceLow = computed(() => {
        try {
            return safeCurrentBalance.value.status?.is_low === true
        } catch (error) {
            console.warn('Error checking if balance is low:', error)
            return false
        }
    })

    const isBalanceCritical = computed(() => {
        try {
            return safeCurrentBalance.value.status?.is_critical === true
        } catch (error) {
            console.warn('Error checking if balance is critical:', error)
            return false
        }
    })

    // Calculate actual available balance: Use summary data from backend (more reliable)
    const actualAvailableBalance = computed(() => {
        try {
            // Always calculate from individual items for accuracy
            const totalTopUps = totalTopUpAmount.value
            const totalDisbursements = totalDisbursementAmount.value
            const available = totalTopUps - totalDisbursements
            
            console.log('💰 Balance Calculation:', {
                totalTopUps,
                totalDisbursements,
                available: Math.max(available, 0),
                topUpsCount: topUps.value.length,
                disbursementsCount: disbursements.value.length,
                activeDisbursementsCount: activeDisbursements.value.length,
                summaryNetBalance: summary.value?.net_balance,
                source: 'frontend_calculation'
            })
            
            // Also try to use the net_balance from summary as a comparison
            if (summary.value && typeof summary.value.net_balance === 'number') {
                const summaryBalance = Math.max(summary.value.net_balance, 0)
                console.log('💰 Summary vs Calculated Balance:', {
                    summaryBalance,
                    calculatedBalance: Math.max(available, 0),
                    difference: Math.abs(summaryBalance - Math.max(available, 0))
                })
                
                // Use summary balance if it's available and reasonable
                if (summaryBalance >= 0) {
                    return summaryBalance
                }
            }
            
            return Math.max(available, 0) // Ensure it's never negative
        } catch (error) {
            console.error('Error calculating actual available balance:', error)
            return 0
        }
    })

    const getDisbursementById = computed(() => (id: number) => {
        try {
            return disbursements.value.find(d => d?.id === id) || null
        } catch (error) {
            console.warn('Error finding disbursement by ID:', error)
            return null
        }
    })

    const getTopUpById = computed(() => (id: number) => {
        try {
            return topUps.value.find(t => t?.id === id) || null
        } catch (error) {
            console.warn('Error finding top-up by ID:', error)
            return null
        }
    })

    const isLoading = computed(() => {
        try {
            return Object.values(loading.value).some(l => l === true)
        } catch (error) {
            console.warn('Error checking loading state:', error)
            return false
        }
    })

    const hasErrors = computed(() => {
        try {
            return Object.values(errors.value).some(e => e !== null)
        } catch (error) {
            console.warn('Error checking error state:', error)
            return false
        }
    })

    const isDataStale = computed(() => {
        try {
            const lastValidated = dataIntegrity.value.lastValidated
            if (!lastValidated) return true
            
            const staleThreshold = 5 * 60 * 1000 // 5 minutes
            return Date.now() - lastValidated.getTime() > staleThreshold
        } catch (error) {
            console.warn('Error checking data staleness:', error)
            return true
        }
    })

    const hasValidationErrors = computed(() => {
        try {
            return dataIntegrity.value.validationErrors.length > 0
        } catch (error) {
            console.warn('Error checking validation errors:', error)
            return false
        }
    })

    // Enhanced data validation
    const validateAndSetDisbursements = (data: any[]): PettyCashDisbursement[] => {
        try {
            const { validItems, invalidItems, errors: validationErrors } = validateArrayData(data, validateDisbursementData)
            
            if (invalidItems.length > 0) {
                console.warn(`${invalidItems.length} invalid disbursements filtered out:`, validationErrors)
                dataIntegrity.value.validationErrors.push(`${invalidItems.length} invalid disbursements filtered`)
            }
            
            return validItems as PettyCashDisbursement[]
        } catch (error) {
            console.error('Error validating disbursements:', error)
            dataIntegrity.value.validationErrors.push('Disbursement validation failed')
            return []
        }
    }

    const validateAndSetBalance = (data: any): PettyCashBalance => {
        try {
            // Check if data looks like Laravel validation errors (arrays of error messages)
            if (data && typeof data === 'object' && Object.values(data).some(value => Array.isArray(value))) {
                console.warn('Received validation errors instead of balance data:', data)
                dataIntegrity.value.validationErrors.push('Server returned validation errors instead of balance data')
                return defaultBalance
            }

            const result = validateBalanceData(data)
            if (!result.isValid) {
                console.warn('Invalid balance data:', result.errors)
                dataIntegrity.value.validationErrors.push('Balance data validation failed')
                return mergeWithDefaults(defaultBalance, data)
            }
            return result.data || defaultBalance
        } catch (error) {
            console.error('Error validating balance:', error)
            dataIntegrity.value.validationErrors.push('Balance validation failed')
            return mergeWithDefaults(defaultBalance, data)
        }
    }

    // Actions - Disbursements with enhanced error handling
    const fetchDisbursements = async (filters?: DisbursementFilters & { page?: number }) => {
        const operation = async () => {
            console.log('🔍 fetchDisbursements called with filters:', filters)
            loading.value.disbursements = true
            errors.value.disbursements = null

            const response = await pettyCashService.getDisbursements(filters)
            console.log('🔍 fetchDisbursements response:', response)

            if ('success' in response && response.success) {
                console.log('🔍 fetchDisbursements success, data:', response.data)
                
                // Transform API data to expected format (similar to top-ups)
                const transformedData = response.data.map((item: any) => ({
                    ...item,
                    amount: {
                        raw: parseFloat(item.amount || 0),
                        formatted: `KES ${parseFloat(item.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    },
                    payment_method: {
                        value: item.payment_method,
                        label: item.payment_method === 'cash' ? 'Cash' : 
                               item.payment_method === 'mpesa' ? 'M-Pesa' :
                               item.payment_method === 'bank_transfer' ? 'Bank Transfer' : 
                               item.payment_method || 'Other'
                    },
                    classification: {
                        value: item.classification,
                        label: item.classification === 'admin' ? 'Admin' :
                               item.classification === 'agencies' ? 'Agencies' :
                               item.classification === 'operations' ? 'Operations' :
                               item.classification || 'Other'
                    },
                    status: {
                        value: item.status || 'active',
                        label: item.status === 'active' ? 'Active' : 'Voided',
                        is_active: (item.status || 'active') === 'active',
                        is_voided: (item.status || 'active') === 'voided'
                    },
                    created_at: {
                        raw: item.created_at,
                        formatted: new Date(item.created_at).toLocaleDateString('en-KE'),
                        human: 'Recently'
                    }
                }))
                
                console.log('🔍 fetchDisbursements transformed data:', transformedData[0])
                const validatedData = validateAndSetDisbursements(transformedData)
                console.log('🔍 fetchDisbursements validatedData:', validatedData)
                disbursements.value = validatedData as PettyCashDisbursement[]
                
                pagination.value.disbursements = {
                    ...defaultPagination,
                    ...response.meta
                }
                
                if (filters) {
                    activeFilters.value.disbursements = filters
                }
                
                dataIntegrity.value.lastValidated = new Date()
                return validatedData
            } else {
                console.error('🔍 fetchDisbursements failed:', response)
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'fetchDisbursements',
            filters
        })

        if (!result) {
            errors.value.disbursements = 'Failed to fetch disbursements'
            disbursements.value = []
        }

        loading.value.disbursements = false
        return result
    }

    const createDisbursement = async (data: CreateDisbursementFormData) => {
        const operation = async () => {
            loading.value.creating = true
            errors.value.creating = null

            console.log('🔍 Creating disbursement with data:', data)
            const response = await pettyCashService.createDisbursement(data)
            console.log('🔍 Create disbursement response:', response)

            if ('success' in response && response.success) {
                // Transform disbursement data to expected format (similar to top-ups)
                const transformedDisbursement = {
                    ...response.data,
                    amount: {
                        raw: parseFloat(response.data.amount || 0),
                        formatted: `KES ${parseFloat(response.data.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    },
                    payment_method: {
                        value: response.data.payment_method,
                        label: response.data.payment_method === 'cash' ? 'Cash' : 
                               response.data.payment_method === 'mpesa' ? 'M-Pesa' :
                               response.data.payment_method === 'bank_transfer' ? 'Bank Transfer' : 
                               response.data.payment_method || 'Other'
                    },
                    classification: {
                        value: response.data.classification,
                        label: response.data.classification === 'admin' ? 'Admin' :
                               response.data.classification === 'agencies' ? 'Agencies' :
                               response.data.classification === 'operations' ? 'Operations' :
                               response.data.classification || 'Other'
                    },
                    status: {
                        value: response.data.status || 'active',
                        label: response.data.status === 'active' ? 'Active' : 'Voided',
                        is_active: (response.data.status || 'active') === 'active',
                        is_voided: (response.data.status || 'active') === 'voided'
                    },
                    created_at: {
                        raw: response.data.created_at,
                        formatted: new Date(response.data.created_at).toLocaleDateString('en-KE'),
                        human: 'Just now'
                    }
                }
                
                console.log('🔍 Transformed disbursement:', transformedDisbursement)
                const validationResult = validateDisbursementData(transformedDisbursement)
                if (validationResult.isValid && validationResult.data) {
                    console.log('🔍 Adding valid disbursement to store:', validationResult.data)
                    disbursements.value.unshift(validationResult.data)
                    console.log('🔍 Disbursements array after adding:', disbursements.value.length)
                    
                    // Refresh balance after creating disbursement
                    await fetchCurrentBalance()
                    
                    dataIntegrity.value.lastValidated = new Date()
                    return validationResult.data
                } else {
                    console.warn('Created disbursement failed validation:', validationResult.errors)
                    console.log('🔍 Adding invalid disbursement to store anyway:', transformedDisbursement)
                    // Still add it but log the issue
                    disbursements.value.unshift(transformedDisbursement)
                    console.log('🔍 Disbursements array after adding invalid:', disbursements.value.length)
                    return transformedDisbursement
                }
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'createDisbursement',
            formData: data
        })

        if (!result) {
            errors.value.creating = 'Failed to create disbursement'
            throw new Error('Failed to create disbursement')
        }

        loading.value.creating = false
        return result
    }

    const updateDisbursement = async (id: number, data: UpdateDisbursementFormData) => {
        const operation = async () => {
            loading.value.updating = true
            errors.value.updating = null

            const response = await pettyCashService.updateDisbursement(id, data)

            if ('success' in response && response.success) {
                const validationResult = validateDisbursementData(response.data)
                if (validationResult.isValid && validationResult.data) {
                    const index = disbursements.value.findIndex(d => d.id === id)
                    if (index !== -1) {
                        disbursements.value[index] = validationResult.data
                    }
                    
                    // Refresh balance after updating disbursement
                    await fetchCurrentBalance()
                    
                    dataIntegrity.value.lastValidated = new Date()
                    return validationResult.data
                } else {
                    console.warn('Updated disbursement failed validation:', validationResult.errors)
                    // Still update it but log the issue
                    const index = disbursements.value.findIndex(d => d.id === id)
                    if (index !== -1) {
                        disbursements.value[index] = response.data
                    }
                    return response.data
                }
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'updateDisbursement',
            disbursementId: id,
            formData: data
        })

        if (!result) {
            errors.value.updating = 'Failed to update disbursement'
            throw new Error('Failed to update disbursement')
        }

        loading.value.updating = false
        return result
    }

    const voidDisbursement = async (id: number, data: VoidDisbursementFormData) => {
        const operation = async () => {
            loading.value.voiding = true
            errors.value.voiding = null

            const response = await pettyCashService.voidDisbursement(id, data)

            if ('success' in response && response.success) {
                const validationResult = validateDisbursementData(response.data)
                if (validationResult.isValid && validationResult.data) {
                    const index = disbursements.value.findIndex(d => d.id === id)
                    if (index !== -1) {
                        disbursements.value[index] = validationResult.data
                    }
                    
                    // Refresh balance after voiding disbursement
                    await fetchCurrentBalance()
                    
                    dataIntegrity.value.lastValidated = new Date()
                    return validationResult.data
                } else {
                    console.warn('Voided disbursement failed validation:', validationResult.errors)
                    // Still update it but log the issue
                    const index = disbursements.value.findIndex(d => d.id === id)
                    if (index !== -1) {
                        disbursements.value[index] = response.data
                    }
                    return response.data
                }
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'voidDisbursement',
            disbursementId: id,
            voidData: data
        })

        if (!result) {
            errors.value.voiding = 'Failed to void disbursement'
            throw new Error('Failed to void disbursement')
        }

        loading.value.voiding = false
        return result
    }

    // Actions - Top-ups with enhanced error handling
    const fetchTopUps = async (filters?: TopUpFilters & { page?: number }) => {
        const operation = async () => {
            console.log('🔍 fetchTopUps called with filters:', filters)
            loading.value.topUps = true
            errors.value.topUps = null

            const response = await pettyCashService.getTopUps(filters)
            console.log('🔍 fetchTopUps response:', response)

            if ('success' in response && response.success) {
                console.log('🔍 fetchTopUps success, data:', response.data)
                console.log('🔍 fetchTopUps first item structure:', response.data[0])
                
                // Transform API data to expected format
                const transformedData = response.data.map((item: any) => ({
                    ...item,
                    amount: {
                        raw: parseFloat(item.amount || 0),
                        formatted: `KES ${parseFloat(item.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    },
                    payment_method: {
                        value: item.payment_method,
                        label: item.payment_method === 'cash' ? 'Cash' : 
                               item.payment_method === 'mpesa' ? 'M-Pesa' :
                               item.payment_method === 'bank_transfer' ? 'Bank Transfer' : 
                               item.payment_method || 'Other'
                    },
                    remaining_balance: {
                        raw: parseFloat(item.remaining_balance || item.amount || 0),
                        formatted: `KES ${parseFloat(item.remaining_balance || item.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    },
                    created_at: {
                        raw: item.created_at,
                        formatted: new Date(item.created_at).toLocaleDateString('en-KE'),
                        human: 'Recently'
                    }
                }))
                
                console.log('🔍 fetchTopUps transformed data:', transformedData[0])
                
                const { validItems, invalidItems, errors } = validateArrayData(transformedData, validateTopUpData)
                console.log('🔍 fetchTopUps validation results:', { validItems, invalidItems, errors })
                topUps.value = validItems as PettyCashTopUp[]
                
                pagination.value.topUps = {
                    ...defaultPagination,
                    ...response.meta
                }
                
                if (filters) {
                    activeFilters.value.topUps = filters
                }
                
                dataIntegrity.value.lastValidated = new Date()
                return validItems
            } else {
                console.error('🔍 fetchTopUps failed:', response)
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'fetchTopUps',
            filters
        })

        if (!result) {
            errors.value.topUps = 'Failed to fetch top-ups'
            topUps.value = []
        }

        loading.value.topUps = false
        return result
    }

    const fetchAvailableTopUps = async () => {
        const operation = async () => {
            loading.value.topUps = true
            errors.value.topUps = null

            const response = await pettyCashService.getAvailableTopUps()

            if ('success' in response && response.success) {
                const { validItems } = validateArrayData(response.data || [], validateTopUpData)
                availableTopUps.value = validItems as PettyCashTopUp[]
                
                dataIntegrity.value.lastValidated = new Date()
                return validItems
            } else if (response.status === 500) {
                // Handle server error gracefully without throwing
                console.warn('Available top-ups service temporarily unavailable')
                availableTopUps.value = []
                errors.value.topUps = 'Top-ups service temporarily unavailable'
                return []
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'fetchAvailableTopUps'
        })

        if (!result) {
            errors.value.topUps = 'Failed to fetch available top-ups'
            availableTopUps.value = []
        }

        loading.value.topUps = false
        return result
    }

    const createTopUp = async (data: CreateTopUpFormData) => {
        const operation = async () => {
            loading.value.creating = true
            errors.value.creating = null

            const response = await pettyCashService.createTopUp(data)

            if ('success' in response && response.success) {
                const validationResult = validateTopUpData(response.data)
                if (validationResult.isValid && validationResult.data) {
                    topUps.value.unshift(validationResult.data)
                    
                    // Refresh balance and available top-ups after creating top-up
                    await Promise.all([
                        fetchCurrentBalance(),
                        fetchAvailableTopUps()
                    ])
                    
                    dataIntegrity.value.lastValidated = new Date()
                    return validationResult.data
                } else {
                    console.warn('Created top-up failed validation:', validationResult.errors)
                    // Still add it but log the issue
                    topUps.value.unshift(response.data)
                    return response.data
                }
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'createTopUp',
            formData: data
        })

        if (!result) {
            errors.value.creating = 'Failed to create top-up'
            throw new Error('Failed to create top-up')
        }

        loading.value.creating = false
        return result
    }

    // Actions - Transactions (Hierarchical)
    const fetchTransactions = async (filters?: any & { page?: number }) => {
        const operation = async () => {
            console.log('🔍 fetchTransactions called with filters:', filters)
            loading.value.transactions = true
            errors.value.transactions = null

            const response = await pettyCashService.getTransactions(filters)
            console.log('🔍 fetchTransactions response:', response)

            if ('success' in response && response.success) {
                console.log('🔍 fetchTransactions success, data:', response.data)
                
                // Transform hierarchical transaction data (top-ups with disbursements)
                const transformedData = response.data.map((topUp: any) => ({
                    ...topUp,
                    amount: {
                        raw: parseFloat(topUp.amount || 0),
                        formatted: `KES ${parseFloat(topUp.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    },
                    payment_method: {
                        value: topUp.payment_method,
                        label: topUp.payment_method === 'cash' ? 'Cash' : 
                               topUp.payment_method === 'mpesa' ? 'M-Pesa' :
                               topUp.payment_method === 'bank_transfer' ? 'Bank Transfer' : 
                               topUp.payment_method || 'Other'
                    },
                    remaining_balance: {
                        raw: parseFloat(topUp.remaining_balance || topUp.amount || 0),
                        formatted: `KES ${parseFloat(topUp.remaining_balance || topUp.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    },
                    created_at: {
                        raw: topUp.created_at,
                        formatted: new Date(topUp.created_at).toLocaleDateString('en-KE'),
                        human: 'Recently'
                    },
                    // Transform nested disbursements
                    disbursements: (topUp.disbursements || []).map((disbursement: any) => ({
                        ...disbursement,
                        amount: {
                            raw: parseFloat(disbursement.amount || 0),
                            formatted: `KES ${parseFloat(disbursement.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        },
                        payment_method: {
                            value: disbursement.payment_method,
                            label: disbursement.payment_method === 'cash' ? 'Cash' : 
                                   disbursement.payment_method === 'mpesa' ? 'M-Pesa' :
                                   disbursement.payment_method === 'bank_transfer' ? 'Bank Transfer' : 
                                   disbursement.payment_method || 'Other'
                        },
                        classification: {
                            value: disbursement.classification,
                            label: disbursement.classification === 'admin' ? 'Admin' :
                                   disbursement.classification === 'agencies' ? 'Agencies' :
                                   disbursement.classification === 'operations' ? 'Operations' :
                                   disbursement.classification || 'Other'
                        },
                        status: {
                            value: disbursement.status || 'active',
                            label: disbursement.status === 'active' ? 'Active' : 'Voided',
                            is_active: (disbursement.status || 'active') === 'active',
                            is_voided: (disbursement.status || 'active') === 'voided'
                        },
                        created_at: {
                            raw: disbursement.created_at,
                            formatted: new Date(disbursement.created_at).toLocaleDateString('en-KE'),
                            human: 'Recently'
                        }
                    })),
                    // Add disbursements summary for display
                    disbursements_summary: {
                        active_count: (topUp.disbursements || []).filter((d: any) => (d.status || 'active') === 'active').length,
                        voided_count: (topUp.disbursements || []).filter((d: any) => d.status === 'voided').length,
                        total_count: (topUp.disbursements || []).length
                    }
                }))
                
                console.log('🔍 fetchTransactions transformed data:', transformedData[0])
                
                // For transactions, we don't need to validate as strictly since it's hierarchical data
                transactions.value = transformedData as PettyCashTopUp[]
                
                pagination.value.transactions = {
                    ...defaultPagination,
                    ...response.meta
                }
                
                dataIntegrity.value.lastValidated = new Date()
                return transformedData
            } else {
                console.error('🔍 fetchTransactions failed:', response)
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'fetchTransactions',
            filters
        })

        if (!result) {
            errors.value.transactions = 'Failed to fetch transactions'
            transactions.value = []
        }

        loading.value.transactions = false
        return result
    }

    const goToTransactionPage = async (page: number, filters?: any) => {
        return await fetchTransactions({ ...filters, page })
    }

    // Actions - Analytics with enhanced error handling
    const fetchSummary = async (filters?: DisbursementFilters) => {
        const operation = async () => {
            loading.value.summary = true
            errors.value.summary = null

            const response = await pettyCashService.getSummary(filters)

            if ('success' in response && response.success) {
                const validationResult = validateSummaryData(response.data)
                if (validationResult.isValid && validationResult.data) {
                    summary.value = validationResult.data
                } else {
                    console.warn('Summary data failed validation:', validationResult.errors)
                    summary.value = mergeWithDefaults(defaultSummary, response.data)
                }
                
                dataIntegrity.value.lastValidated = new Date()
                return summary.value
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'fetchSummary',
            filters
        })

        if (!result) {
            errors.value.summary = 'Failed to fetch summary'
            summary.value = defaultSummary
        }

        loading.value.summary = false
        return result
    }

    const fetchAnalytics = async (filters?: DisbursementFilters) => {
        const operation = async () => {
            loading.value.analytics = true
            errors.value.analytics = null

            const response = await pettyCashService.getAnalytics(filters)

            if ('success' in response && response.success) {
                const validationResult = validateAnalyticsData(response.data)
                if (validationResult.isValid && validationResult.data) {
                    analytics.value = validationResult.data
                } else {
                    console.warn('Analytics data failed validation:', validationResult.errors)
                    analytics.value = mergeWithDefaults(defaultAnalytics, response.data)
                }
                
                dataIntegrity.value.lastValidated = new Date()
                return analytics.value
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'fetchAnalytics',
            filters
        })

        if (!result) {
            errors.value.analytics = 'Failed to fetch analytics'
            analytics.value = defaultAnalytics
        }

        loading.value.analytics = false
        return result
    }

    const fetchRecentTransactions = async (limit: number = 10) => {
        const operation = async () => {
            loading.value.recent = true
            errors.value.recent = null

            const response = await pettyCashService.getRecentTransactions(limit)

            if ('success' in response && response.success) {
                recentTransactions.value = createSafeArray(response.data, {
                    id: 0,
                    type: 'top_up',
                    amount: 0,
                    description: '',
                    created_at: new Date().toISOString(),
                    creator: 'Unknown'
                })
                
                dataIntegrity.value.lastValidated = new Date()
                return recentTransactions.value
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withErrorHandling(operation, {
            context: 'fetchRecentTransactions',
            limit
        })

        if (!result) {
            errors.value.recent = 'Failed to fetch recent transactions'
            recentTransactions.value = []
        }

        loading.value.recent = false
        return result
    }

    // Actions - Balance with enhanced error handling
    const fetchCurrentBalance = async () => {
        const operation = async () => {
            loading.value.balance = true
            errors.value.balance = null

            const response = await pettyCashService.getCurrentBalance()

            if ('success' in response && response.success) {
                const validatedBalance = validateAndSetBalance(response.data)
                currentBalance.value = validatedBalance
                
                dataIntegrity.value.lastValidated = new Date()
                return validatedBalance
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }

        const result = await withRetry(operation, {
            context: 'fetchCurrentBalance'
        })

        if (!result) {
            errors.value.balance = 'Failed to fetch current balance'
            currentBalance.value = defaultBalance
        }

        loading.value.balance = false
        return result
    }

    // Error recovery mechanisms
    const recoverFromError = async (errorType: keyof typeof errors.value) => {
        try {
            clearError(errorType)
            
            switch (errorType) {
                case 'balance':
                    await fetchCurrentBalance()
                    break
                case 'disbursements':
                    await fetchDisbursements(activeFilters.value.disbursements)
                    break
                case 'topUps':
                    await fetchTopUps(activeFilters.value.topUps)
                    break
                case 'summary':
                    await fetchSummary()
                    break
                case 'analytics':
                    await fetchAnalytics()
                    break
                case 'recent':
                    await fetchRecentTransactions()
                    break
                default:
                    console.warn(`No recovery mechanism for error type: ${errorType}`)
            }
        } catch (error) {
            console.error(`Error recovery failed for ${errorType}:`, error)
        }
    }

    const validateDataIntegrity = () => {
        dataIntegrity.value.validationErrors = []
        
        try {
            // Validate current balance
            if (currentBalance.value) {
                const balanceResult = validateBalanceData(currentBalance.value)
                if (!balanceResult.isValid) {
                    dataIntegrity.value.validationErrors.push('Balance data integrity issue')
                }
            }

            // Validate summary
            if (summary.value) {
                const summaryResult = validateSummaryData(summary.value)
                if (!summaryResult.isValid) {
                    dataIntegrity.value.validationErrors.push('Summary data integrity issue')
                }
            }

            // Validate analytics
            if (analytics.value) {
                const analyticsResult = validateAnalyticsData(analytics.value)
                if (!analyticsResult.isValid) {
                    dataIntegrity.value.validationErrors.push('Analytics data integrity issue')
                }
            }

            dataIntegrity.value.lastValidated = new Date()
            return dataIntegrity.value.validationErrors.length === 0
        } catch (error) {
            console.error('Data integrity validation failed:', error)
            dataIntegrity.value.validationErrors.push('Validation process failed')
            return false
        }
    }

    // Enhanced utility actions
    const clearError = (type?: keyof typeof errors.value) => {
        try {
            if (type) {
                errors.value[type] = null
            } else {
                Object.keys(errors.value).forEach(key => {
                    errors.value[key as keyof typeof errors.value] = null
                })
            }
            clearErrorHandler()
        } catch (error) {
            console.error('Error clearing errors:', error)
        }
    }

    const clearData = () => {
        try {
            disbursements.value = []
            topUps.value = []
            transactions.value = []
            availableTopUps.value = []
            currentBalance.value = defaultBalance
            summary.value = defaultSummary
            analytics.value = defaultAnalytics
            recentTransactions.value = []
            
            // Reset pagination
            pagination.value = {
                disbursements: { ...defaultPagination },
                topUps: { ...defaultPagination },
                transactions: { ...defaultPagination }
            }
            
            // Reset data integrity
            dataIntegrity.value = {
                lastValidated: null,
                validationErrors: [],
                isDataStale: false
            }
        } catch (error) {
            console.error('Error clearing data:', error)
        }
    }

    const resetStore = () => {
        try {
            clearData()
            clearError()
            
            // Reset loading states
            loading.value = {
                disbursements: false,
                topUps: false,
                transactions: false,
                balance: false,
                summary: false,
                analytics: false,
                recent: false,
                creating: false,
                updating: false,
                voiding: false
            }
            
            // Reset filters
            activeFilters.value = {
                disbursements: {},
                topUps: {}
            }
        } catch (error) {
            console.error('Error resetting store:', error)
        }
    }

    const refreshDashboard = async () => {
        const operation = async () => {
            const results = await Promise.allSettled([
                fetchCurrentBalance(),
                fetchRecentTransactions(),
                fetchSummary(),
                fetchAnalytics()
            ])

            // Log any failures but don't throw
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    const operations = ['balance', 'recent', 'summary', 'analytics']
                    console.warn(`Dashboard refresh failed for ${operations[index]}:`, result.reason)
                }
            })

            return results
        }

        return await withErrorHandling(operation, {
            context: 'refreshDashboard'
        })
    }

    const refreshAll = async () => {
        const operation = async () => {
            const results = await Promise.allSettled([
                fetchDisbursements(activeFilters.value.disbursements),
                fetchTopUps(activeFilters.value.topUps),
                fetchTransactions(),
                fetchAvailableTopUps(),
                refreshDashboard()
            ])

            // Log any failures but don't throw
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    const operations = ['disbursements', 'topUps', 'transactions', 'availableTopUps', 'dashboard']
                    console.warn(`Full refresh failed for ${operations[index]}:`, result.reason)
                }
            })

            // Validate data integrity after refresh
            validateDataIntegrity()

            return results
        }

        return await withErrorHandling(operation, {
            context: 'refreshAll'
        })
    }



    return {
        // State
        disbursements,
        topUps,
        transactions,
        availableTopUps,
        currentBalance,
        summary,
        analytics,
        recentTransactions,
        loading,
        errors,
        pagination,
        activeFilters,
        retryConfig,
        dataIntegrity,

        // Enhanced Getters
        activeDisbursements,
        voidedDisbursements,
        topUpsWithBalance,
        fullyDisbursedTopUps,
        totalDisbursementAmount,
        totalTopUpAmount,
        totalRemainingBalance,
        safeCurrentBalance,
        actualAvailableBalance,
        balanceStatus,
        isBalanceLow,
        isBalanceCritical,
        getDisbursementById,
        getTopUpById,
        isLoading,
        hasErrors,
        isDataStale,
        hasValidationErrors,

        // Actions
        fetchDisbursements,
        createDisbursement,
        updateDisbursement,
        voidDisbursement,
        fetchTopUps,
        fetchTransactions,
        goToTransactionPage,
        fetchAvailableTopUps,
        createTopUp,
        fetchCurrentBalance,
        fetchSummary,
        fetchAnalytics,
        fetchRecentTransactions,

        // Enhanced Utility Actions
        clearError,
        clearData,
        resetStore,
        recoverFromError,
        validateDataIntegrity,
        refreshDashboard,
        refreshAll,

        // Validation utilities
        validateAndSetDisbursements,
        validateAndSetBalance,

        // Debug utilities (remove in production)
        debugStoreState: () => {
            console.log('🔍 Store Debug State:', {
                disbursements: {
                    count: disbursements.value.length,
                    active: activeDisbursements.value.length,
                    totalAmount: totalDisbursementAmount.value,
                    sample: disbursements.value[0]
                },
                topUps: {
                    count: topUps.value.length,
                    totalAmount: totalTopUpAmount.value,
                    sample: topUps.value[0]
                },
                transactions: {
                    count: transactions.value.length,
                    sample: transactions.value[0]
                },
                balance: {
                    current: currentBalance.value,
                    actual: actualAvailableBalance.value
                },
                loading: loading.value,
                errors: errors.value
            })
        }
    }
})