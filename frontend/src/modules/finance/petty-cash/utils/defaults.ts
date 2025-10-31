import type { 
  PettyCashBalance, 
  PettyCashTopUp, 
  PettyCashDisbursement,
  TransactionSummary,
  SpendingAnalytics,
  RecentTransaction,
  ChartData,
  TopUpStatistics,
  PaymentMethodBreakdown,
  BalanceCheck,
  LoadingStates,
  ErrorStates,
  AmountData,
  DateData,
  BalanceStatusData,
  ThresholdData,
  HealthIndicators
} from '../types/pettyCash'
import type { 
  CreateTopUpFormData, 
  CreateDisbursementFormData,
  VoidDisbursementFormData,
  TopUpFormState,
  DisbursementFormState,
  VoidFormState,
  FilterFormData,
  SearchFormData
} from '../types/forms'
import type { 
  DeepReadonly,
  SafeArray,
  ComponentStateManager,
  AsyncState
} from '../types/utils'

// Enhanced default amount structure
const createDefaultAmount = (raw: number = 0): AmountData => ({
  raw,
  formatted: `KES ${raw.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
} as const)

// Enhanced default date structure
const createDefaultDate = (date: Date = new Date()): DateData => ({
  raw: date.toISOString(),
  formatted: date.toLocaleDateString('en-KE'),
  human: 'Just now',
  date_only: date.toISOString().split('T')[0]
} as const)

// Enhanced default balance status
const createDefaultBalanceStatus = (): BalanceStatusData => ({
  value: 'normal',
  label: 'Normal',
  color: 'green',
  is_low: false,
  is_critical: false,
  is_normal: true
} as const)

// Enhanced default thresholds
const createDefaultThresholds = (): ThresholdData => ({
  low_threshold: createDefaultAmount(1000),
  critical_threshold: createDefaultAmount(500)
} as const)

// Enhanced default health indicators
const createDefaultHealthIndicators = (): HealthIndicators => ({
  needs_attention: false,
  days_since_last_top_up: null,
  average_daily_spending: null,
  estimated_days_remaining: null
} as const)

// Enhanced default balance structure with all required properties and strict typing
export const defaultBalance: DeepReadonly<PettyCashBalance> = {
  id: 0,
  current_balance: createDefaultAmount(0),
  status: createDefaultBalanceStatus(),
  thresholds: createDefaultThresholds(),
  updated_at: createDefaultDate(),
  health_indicators: createDefaultHealthIndicators(),
  last_transaction: null,
  can_add_top_up: true,
  can_create_disbursement: false,
  can_recalculate: false
} as const

// Default transaction summary
export const defaultSummary: TransactionSummary = {
  total_top_ups: 0,
  total_disbursements: 0,
  net_balance: 0,
  top_up_count: 0,
  disbursement_count: 0,
  average_top_up: 0,
  average_disbursement: 0,
  current_balance: 0,
  balance_status: 'normal'
}

// Default spending analytics
export const defaultAnalytics: SpendingAnalytics = {
  by_classification: [
    {
      classification: 'agencies',
      total_amount: 0,
      transaction_count: 0,
      percentage: 0
    },
    {
      classification: 'admin',
      total_amount: 0,
      transaction_count: 0,
      percentage: 0
    },
    {
      classification: 'operations',
      total_amount: 0,
      transaction_count: 0,
      percentage: 0
    },
    {
      classification: 'other',
      total_amount: 0,
      transaction_count: 0,
      percentage: 0
    }
  ],
  by_payment_method: [
    {
      payment_method: 'cash',
      total_amount: 0,
      transaction_count: 0,
      percentage: 0
    },
    {
      payment_method: 'mpesa',
      total_amount: 0,
      transaction_count: 0,
      percentage: 0
    },
    {
      payment_method: 'bank_transfer',
      total_amount: 0,
      transaction_count: 0,
      percentage: 0
    },
    {
      payment_method: 'other',
      total_amount: 0,
      transaction_count: 0,
      percentage: 0
    }
  ]
}

// Default chart data
export const defaultChartData: ChartData = {
  classification_pie: {
    labels: ['Agencies', 'Administration', 'Operations', 'Other'],
    data: [0, 0, 0, 0],
    backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981', '#6B7280']
  },
  payment_method_doughnut: {
    labels: ['Cash', 'M-Pesa', 'Bank Transfer', 'Other'],
    data: [0, 0, 0, 0],
    backgroundColor: ['#F59E0B', '#EF4444', '#8B5CF6', '#6B7280']
  }
}

// Default top-up statistics
export const defaultTopUpStatistics: TopUpStatistics = {
  total_amount: 0,
  count: 0,
  average_amount: 0,
  current_balance: 0,
  balance_status: 'normal'
}

// Default payment method breakdown
export const defaultPaymentMethodBreakdown: PaymentMethodBreakdown = {
  cash: {
    count: 0,
    total_amount: 0,
    average_amount: 0
  },
  mpesa: {
    count: 0,
    total_amount: 0,
    average_amount: 0
  },
  bank_transfer: {
    count: 0,
    total_amount: 0,
    average_amount: 0
  },
  other: {
    count: 0,
    total_amount: 0,
    average_amount: 0
  }
}

// Default balance check
export const defaultBalanceCheck: BalanceCheck = {
  amount_requested: 0,
  current_balance: 0,
  has_sufficient_balance: false,
  balance_status: 'normal'
}

// Default form data structures
export const defaultTopUpFormData: CreateTopUpFormData = {
  amount: '',
  payment_method: 'cash',
  transaction_code: '',
  description: ''
}

export const defaultDisbursementFormData: CreateDisbursementFormData = {
  receiver: '',
  account: '',
  amount: '',
  description: '',
  project_name: '',
  classification: 'admin',
  job_number: '',
  payment_method: 'cash',
  transaction_code: ''
}

export const defaultVoidFormData: VoidDisbursementFormData = {
  void_reason: ''
}

// Default form states
export const defaultTopUpFormState: TopUpFormState = {
  data: { ...defaultTopUpFormData },
  validation: {
    isValid: false,
    errors: {},
    touched: {}
  },
  isSubmitting: false,
  isValid: false
}

export const defaultDisbursementFormState: DisbursementFormState = {
  data: { ...defaultDisbursementFormData },
  validation: {
    isValid: false,
    errors: {},
    touched: {}
  },
  isSubmitting: false,
  isValid: false,
  availableTopUps: [],
  selectedTopUpBalance: 0
}

export const defaultVoidFormState: VoidFormState = {
  data: { ...defaultVoidFormData },
  validation: {
    isValid: false,
    errors: {},
    touched: {}
  },
  isSubmitting: false,
  isValid: false
}

// Default filter data
export const defaultFilterFormData: FilterFormData = {
  status: '',
  classification: undefined,
  payment_method: undefined,
  project_name: '',
  creator_id: undefined,
  start_date: '',
  end_date: '',
  search: ''
}

// Default search data
export const defaultSearchFormData: SearchFormData = {
  query: '',
  filters: { ...defaultFilterFormData }
}

// Default pagination structure
export const defaultPagination = {
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
}

// Enhanced default loading states with strict typing
export const defaultLoadingStates: DeepReadonly<LoadingStates> = {
  balance: false,
  summary: false,
  analytics: false,
  transactions: false,
  topUps: false,
  disbursements: false,
  recent: false,
  charts: false,
  statistics: false
} as const

// Enhanced default error states with strict typing
export const defaultErrorStates: DeepReadonly<ErrorStates> = {
  balance: null,
  summary: null,
  analytics: null,
  transactions: null,
  topUps: null,
  disbursements: null,
  recent: null,
  charts: null,
  statistics: null,
  general: null
} as const

// Utility functions to create default structures
export const createDefaultTopUp = (overrides: Partial<PettyCashTopUp> = {}): PettyCashTopUp => {
  const now = new Date()
  const defaultTopUp: PettyCashTopUp = {
    id: 0,
    amount: {
      raw: 0,
      formatted: 'KES 0.00'
    },
    payment_method: {
      value: 'cash',
      label: 'Cash'
    },
    created_at: {
      raw: now.toISOString(),
      formatted: now.toLocaleDateString(),
      human: 'Just now',
      date_only: now.toISOString().split('T')[0]
    },
    updated_at: {
      raw: now.toISOString(),
      formatted: now.toLocaleDateString(),
      human: 'Just now'
    },
    remaining_balance: {
      raw: 0,
      formatted: 'KES 0.00'
    },
    total_disbursed: {
      raw: 0,
      formatted: 'KES 0.00'
    },
    utilization_percentage: 0,
    is_fully_disbursed: false,
    has_available_balance: false,
    can_create_disbursement: false,
    can_view_details: true,
    can_view_disbursements: true
  }

  return { ...defaultTopUp, ...overrides }
}

export const createDefaultDisbursement = (overrides: Partial<PettyCashDisbursement> = {}): PettyCashDisbursement => {
  const now = new Date()
  const defaultDisbursement: PettyCashDisbursement = {
    id: 0,
    top_up_id: 0,
    receiver: '',
    account: '',
    amount: {
      raw: 0,
      formatted: 'KES 0.00'
    },
    description: '',
    classification: {
      value: 'admin',
      label: 'Administration'
    },
    payment_method: {
      value: 'cash',
      label: 'Cash'
    },
    status: {
      value: 'active',
      label: 'Active',
      is_active: true,
      is_voided: false
    },
    created_at: {
      raw: now.toISOString(),
      formatted: now.toLocaleDateString(),
      human: 'Just now',
      date_only: now.toISOString().split('T')[0]
    },
    updated_at: {
      raw: now.toISOString(),
      formatted: now.toLocaleDateString(),
      human: 'Just now'
    },
    can_edit: false,
    can_void: false,
    can_view_details: true
  }

  return { ...defaultDisbursement, ...overrides }
}

export const createDefaultRecentTransaction = (overrides: Partial<RecentTransaction> = {}): RecentTransaction => {
  const defaultTransaction: RecentTransaction = {
    id: 0,
    type: 'top_up',
    amount: 0,
    description: '',
    created_at: new Date().toISOString(),
    creator: 'Unknown'
  }

  return { ...defaultTransaction, ...overrides }
}

// Enhanced utility function to safely merge data with defaults using strict typing
export const mergeWithDefaults = <T extends Record<string, unknown>>(
  defaultData: DeepReadonly<T>,
  actualData: Partial<T> | null | undefined
): T => {
  if (!actualData || typeof actualData !== 'object') {
    return { ...defaultData } as T
  }

  const merged = { ...defaultData } as T
  
  Object.keys(actualData).forEach(key => {
    const value = actualData[key as keyof T]
    if (value !== null && value !== undefined) {
      if (typeof value === 'object' && 
          !Array.isArray(value) && 
          typeof defaultData[key as keyof T] === 'object' &&
          defaultData[key as keyof T] !== null) {
        // Recursively merge nested objects
        merged[key as keyof T] = mergeWithDefaults(
          defaultData[key as keyof T] as Record<string, unknown>, 
          value as Record<string, unknown>
        ) as T[keyof T]
      } else {
        merged[key as keyof T] = value
      }
    }
  })

  return merged
}

// Enhanced utility function to create safe array with defaults using strict typing
export const createSafeArray = <T>(
  data: SafeArray<T> | null | undefined,
  defaultItem: DeepReadonly<T>,
  minLength: number = 0
): SafeArray<T> => {
  if (!Array.isArray(data)) {
    return Array(minLength).fill(null).map(() => ({ ...defaultItem })) as SafeArray<T>
  }

  const safeArray = [...data]
  
  // Ensure minimum length
  while (safeArray.length < minLength) {
    safeArray.push({ ...defaultItem } as T)
  }

  return safeArray as SafeArray<T>
}

// Enhanced utility function to validate and provide defaults for required properties
export const ensureRequiredProperties = <T extends Record<string, unknown>>(
  data: Partial<T> | null | undefined,
  requiredProperties: DeepReadonly<Record<keyof T, unknown>>
): T => {
  const result = { ...data } as T

  Object.keys(requiredProperties).forEach(key => {
    const typedKey = key as keyof T
    if (result[typedKey] === null || result[typedKey] === undefined) {
      result[typedKey] = requiredProperties[typedKey] as T[keyof T]
    }
  })

  return result
}

// Type-safe factory functions for creating default objects
export const createDefaultAsyncState = <T, E = Error>(
  initialData?: T | null
): AsyncState<T, E> => ({
  status: 'idle',
  data: initialData ?? null,
  error: null,
  loading: false,
  lastFetch: null,
  retryCount: 0
} as const)

export const createDefaultComponentState = <T>(
  initialData?: T | null
): ComponentStateManager<T> => ({
  state: 'initializing',
  data: initialData ?? null,
  error: null,
  loading: false,
  initialized: false,
  retryable: true
} as const)