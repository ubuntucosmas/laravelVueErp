import type { PaymentMethod, Classification, NullableString, NullableNumber } from './pettyCash'

// Enhanced form data interfaces with strict typing and validation
export interface CreateTopUpFormData {
  readonly amount: number | string
  readonly payment_method: PaymentMethod
  readonly transaction_code?: NullableString
  readonly description?: NullableString
}

export interface CreateDisbursementFormData {
  readonly receiver: string
  readonly account: string
  readonly amount: number | string
  readonly description: string
  readonly project_name?: NullableString
  readonly classification: Classification
  readonly job_number?: NullableString
  readonly payment_method: PaymentMethod
  readonly transaction_code?: NullableString
}

// Partial update interface with strict null safety
export interface UpdateDisbursementFormData {
  readonly receiver?: NullableString
  readonly account?: NullableString
  readonly amount?: number | string | null
  readonly description?: NullableString
  readonly project_name?: NullableString
  readonly classification?: Classification | null
  readonly job_number?: NullableString
  readonly payment_method?: PaymentMethod | null
  readonly transaction_code?: NullableString
}

export interface VoidDisbursementFormData {
  readonly void_reason: string
}

// Enhanced form validation interfaces with strict typing
export interface FormValidationErrors {
  readonly [key: string]: ReadonlyArray<string>
}

export interface FormValidationWarnings {
  readonly [key: string]: ReadonlyArray<string>
}

export interface FormValidationState {
  readonly isValid: boolean
  readonly errors: FormValidationErrors
  readonly warnings?: FormValidationWarnings
  readonly touched: Record<string, boolean>
  readonly dirty: Record<string, boolean>
  readonly validating: Record<string, boolean>
}

// Enhanced form field interfaces for UI components with strict typing
export interface SelectOption<T = string | number> {
  readonly value: T
  readonly label: string
  readonly disabled?: boolean
  readonly description?: NullableString
  readonly icon?: NullableString
}

export interface PaymentMethodOption extends SelectOption<PaymentMethod> {
  readonly value: PaymentMethod
  readonly requiresTransactionCode: boolean
  readonly validation_pattern?: NullableString
  readonly max_amount?: NullableNumber
}

export interface ClassificationOption extends SelectOption<Classification> {
  readonly value: Classification
  readonly requiresProject: boolean
  readonly default_payment_method?: PaymentMethod
}

// Enhanced available top-up interface
export interface AvailableTopUp {
  readonly id: number
  readonly amount: number
  readonly remaining_balance: number
  readonly payment_method: PaymentMethod
  readonly created_at: string
  readonly formatted_amount: string
  readonly formatted_remaining: string
  readonly utilization_percentage: number
}

// Enhanced form state interfaces with comprehensive state management
export interface BaseFormState {
  readonly isSubmitting: boolean
  readonly isValid: boolean
  readonly isDirty: boolean
  readonly hasErrors: boolean
  readonly hasWarnings: boolean
  readonly lastValidated?: Date | null
  readonly submitAttempts: number
}

export interface TopUpFormState extends BaseFormState {
  readonly data: CreateTopUpFormData
  readonly validation: FormValidationState
  readonly estimated_balance_after?: NullableNumber
}

export interface DisbursementFormState extends BaseFormState {
  readonly data: CreateDisbursementFormData
  readonly validation: FormValidationState
  readonly availableTopUps: ReadonlyArray<AvailableTopUp>
  readonly selectedTopUpBalance: number
  readonly insufficient_balance: boolean
  readonly balance_warning_threshold: number
}

export interface VoidFormState extends BaseFormState {
  readonly data: VoidDisbursementFormData
  readonly validation: FormValidationState
  readonly disbursement_id: number
  readonly current_status: string
}

// Enhanced filter form interfaces with strict null safety
export interface FilterFormData {
  readonly status?: NullableString
  readonly classification?: Classification | null
  readonly payment_method?: PaymentMethod | null
  readonly project_name?: NullableString
  readonly creator_id?: NullableNumber
  readonly start_date?: NullableString
  readonly end_date?: NullableString
  readonly search?: NullableString
  readonly sort_by?: NullableString
  readonly sort_direction?: 'asc' | 'desc' | null
}

export interface FilterFormState {
  readonly data: FilterFormData
  readonly isActive: boolean
  readonly hasActiveFilters: boolean
  readonly filterCount: number
  readonly lastApplied?: Date | null
  readonly presets: ReadonlyArray<{
    readonly name: string
    readonly filters: FilterFormData
  }>
}

// Enhanced search form interface with advanced search capabilities
export interface SearchFormData {
  readonly query: string
  readonly filters?: FilterFormData | null
  readonly search_fields?: ReadonlyArray<string>
  readonly exact_match?: boolean
  readonly case_sensitive?: boolean
}

export interface SearchFormState {
  readonly data: SearchFormData
  readonly isSearching: boolean
  readonly hasResults: boolean
  readonly resultsCount: number
  readonly searchTime?: NullableNumber
  readonly suggestions: ReadonlyArray<string>
  readonly recentSearches: ReadonlyArray<string>
}

// Enhanced form validation rules with comprehensive validation options
export interface ValidationRule<T = unknown> {
  readonly required?: boolean
  readonly min?: number
  readonly max?: number
  readonly minLength?: number
  readonly maxLength?: number
  readonly pattern?: RegExp
  readonly email?: boolean
  readonly url?: boolean
  readonly numeric?: boolean
  readonly integer?: boolean
  readonly positive?: boolean
  readonly custom?: (value: T, formData?: Record<string, unknown>) => string | null
  readonly async_validator?: (value: T, formData?: Record<string, unknown>) => Promise<string | null>
  readonly depends_on?: ReadonlyArray<string>
  readonly error_message?: NullableString
  readonly warning_message?: NullableString
}

export interface ValidationRules {
  readonly [fieldName: string]: ValidationRule
}

// Enhanced validation result interface
export interface ValidationResult {
  readonly isValid: boolean
  readonly errors: ReadonlyArray<string>
  readonly warnings: ReadonlyArray<string>
  readonly field: string
  readonly value: unknown
}

// Common validation rules for petty cash forms with enhanced type safety
export const topUpValidationRules: ValidationRules = {
  amount: {
    required: true,
    numeric: true,
    positive: true,
    min: 0.01,
    max: 999999.99,
    error_message: 'Amount must be between 0.01 and 999,999.99'
  },
  payment_method: {
    required: true,
    error_message: 'Payment method is required'
  },
  transaction_code: {
    custom: (value: unknown, formData?: Record<string, unknown>) => {
      const stringValue = value as string
      const data = formData as unknown as CreateTopUpFormData
      if (data?.payment_method !== 'cash' && !stringValue) {
        return 'Transaction code is required for non-cash payments'
      }
      if (data?.payment_method === 'mpesa' && stringValue && !/^[A-Z0-9]{10}$/.test(stringValue)) {
        return 'M-Pesa transaction code must be 10 characters (letters and numbers only)'
      }
      return null
    },
    depends_on: ['payment_method']
  },
  description: {
    maxLength: 500,
    error_message: 'Description cannot exceed 500 characters'
  }
} as const

export const disbursementValidationRules: ValidationRules = {
  top_up_id: {
    required: true,
    integer: true,
    positive: true,
    error_message: 'Please select a valid top-up source'
  },
  receiver: {
    required: true,
    minLength: 1,
    maxLength: 255,
    error_message: 'Receiver name is required and cannot exceed 255 characters'
  },
  account: {
    required: true,
    minLength: 1,
    maxLength: 255,
    error_message: 'Account is required and cannot exceed 255 characters'
  },
  amount: {
    required: true,
    numeric: true,
    positive: true,
    min: 0.01,
    max: 999999.99,
    error_message: 'Amount must be between 0.01 and 999,999.99'
  },
  description: {
    required: true,
    minLength: 1,
    maxLength: 1000,
    error_message: 'Description is required and cannot exceed 1000 characters'
  },
  classification: {
    required: true,
    error_message: 'Please select a valid classification'
  },
  payment_method: {
    required: true,
    error_message: 'Please select a valid payment method'
  },
  project_name: {
    custom: (value: unknown, formData?: Record<string, unknown>) => {
      const stringValue = value as string
      const data = formData as unknown as CreateDisbursementFormData
      if (['agencies', 'operations'].includes(data?.classification) && !stringValue) {
        return `Project name is required for ${data.classification} classification`
      }
      return null
    },
    depends_on: ['classification'],
    maxLength: 255
  },
  job_number: {
    maxLength: 100,
    error_message: 'Job number cannot exceed 100 characters'
  },
  transaction_code: {
    custom: (value: unknown, formData?: Record<string, unknown>) => {
      const stringValue = value as string
      const data = formData as unknown as CreateDisbursementFormData
      if (data?.payment_method !== 'cash' && !stringValue) {
        return 'Transaction code is required for non-cash payments'
      }
      if (data?.payment_method === 'mpesa' && stringValue && !/^[A-Z0-9]{10}$/.test(stringValue)) {
        return 'M-Pesa transaction code must be 10 characters (letters and numbers only)'
      }
      return null
    },
    depends_on: ['payment_method']
  }
} as const

export const voidValidationRules: ValidationRules = {
  void_reason: {
    required: true,
    minLength: 1,
    maxLength: 500,
    error_message: 'Void reason is required and cannot exceed 500 characters'
  }
} as const