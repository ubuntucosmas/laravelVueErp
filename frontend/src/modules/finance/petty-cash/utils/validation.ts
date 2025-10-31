import type {
    PettyCashBalance,
    PettyCashTopUp,
    PettyCashDisbursement,
    TransactionSummary,
    SpendingAnalytics,
    PaymentMethod,
    Classification,
    BalanceStatus,
    DisbursementStatus
} from '../types/pettyCash'
import type {
    CreateTopUpFormData,
    CreateDisbursementFormData,
    VoidDisbursementFormData
} from '../types/forms'

import type { 
    ValidationError, 
    Result,
    SafeArray 
} from '../types/utils'
import type {
    NullableString,
    NullableNumber
} from '../types/pettyCash'

// Enhanced validation result interface with strict typing
export interface ValidationResult<T = unknown> {
    readonly isValid: boolean
    readonly errors: Record<string, SafeArray<string>>
    readonly warnings?: Record<string, SafeArray<string>>
    readonly data?: T | null
    readonly field?: NullableString
    readonly timestamp: Date
}

// Enhanced validation context for better error reporting
export interface ValidationContext {
    readonly field: string
    readonly value: unknown
    readonly formData?: Record<string, unknown>
    readonly rules?: Record<string, unknown>
}

// Enhanced type guards for runtime validation with strict typing
export const isValidPaymentMethod = (value: unknown): value is PaymentMethod => {
    return typeof value === 'string' && 
           (['cash', 'mpesa', 'bank_transfer', 'other'] as const).includes(value as PaymentMethod)
}

export const isValidClassification = (value: unknown): value is Classification => {
    return typeof value === 'string' && 
           (['agencies', 'admin', 'operations', 'other'] as const).includes(value as Classification)
}

export const isValidBalanceStatus = (value: unknown): value is BalanceStatus => {
    return typeof value === 'string' && 
           (['normal', 'low', 'critical'] as const).includes(value as BalanceStatus)
}

export const isValidDisbursementStatus = (value: unknown): value is DisbursementStatus => {
    return typeof value === 'string' && 
           (['active', 'voided'] as const).includes(value as DisbursementStatus)
}

// Enhanced utility functions for validation with strict typing
const isValidNumber = (
    value: unknown, 
    min?: NullableNumber, 
    max?: NullableNumber
): value is number => {
    if (typeof value !== 'number' || isNaN(value)) return false
    if (min !== null && min !== undefined && value < min) return false
    if (max !== null && max !== undefined && value > max) return false
    return true
}

const isValidString = (
    value: unknown, 
    minLength?: NullableNumber, 
    maxLength?: NullableNumber
): value is string => {
    if (typeof value !== 'string') return false
    if (minLength !== null && minLength !== undefined && value.length < minLength) return false
    if (maxLength !== null && maxLength !== undefined && value.length > maxLength) return false
    return true
}

const isValidDate = (value: unknown): value is Date | string => {
    if (!value) return false
    const date = new Date(value as string | number | Date)
    return !isNaN(date.getTime())
}

const hasRequiredProperties = <T extends Record<string, unknown>>(
    obj: unknown, 
    properties: ReadonlyArray<keyof T>
): obj is T => {
    return typeof obj === 'object' && 
           obj !== null && 
           properties.every(prop => obj && Object.prototype.hasOwnProperty.call(obj, prop))
}

const isNonEmptyString = (value: unknown): value is string => {
    return typeof value === 'string' && value.trim().length > 0
}

const isPositiveNumber = (value: unknown): value is number => {
    return isValidNumber(value) && (value as number) > 0
}

const isNonNegativeNumber = (value: unknown): value is number => {
    return isValidNumber(value) && (value as number) >= 0
}

// Enhanced balance data validation with strict typing
export const validateBalanceData = (data: unknown): ValidationResult<PettyCashBalance> => {
    const errors: Record<string, string[]> = {}
    const warnings: Record<string, string[]> = {}
    const timestamp = new Date()

    if (!data || typeof data !== 'object') {
        errors.general = ['Invalid balance data structure']
        return { 
            isValid: false, 
            errors, 
            warnings, 
            timestamp,
            field: 'balance'
        }
    }

    const balanceData = data as Record<string, any>

    // Validate required properties
    const requiredProps = ['id', 'current_balance', 'status', 'thresholds', 'health_indicators']
    if (!hasRequiredProperties(balanceData, requiredProps)) {
        errors.structure = ['Missing required balance properties']
    }

    // Validate ID
    if (!isValidNumber(balanceData.id, 1)) {
        errors.id = ['Invalid balance ID']
    }

    // Validate current_balance structure
    if (balanceData.current_balance) {
        if (!hasRequiredProperties(balanceData.current_balance, ['raw', 'formatted'])) {
            errors.current_balance = ['Invalid current_balance structure']
        } else {
            if (!isValidNumber(balanceData.current_balance.raw, 0)) {
                errors.current_balance = ['Invalid balance amount']
            }
            if (!isValidString(balanceData.current_balance.formatted, 1)) {
                errors.current_balance = [...(errors.current_balance || []), 'Invalid formatted balance']
            }
        }
    } else {
        errors.current_balance = ['Missing current_balance data']
    }

    // Validate status structure
    if (balanceData.status) {
        if (!hasRequiredProperties(balanceData.status, ['value', 'label'])) {
            errors.status = ['Invalid status structure']
        } else {
            if (!isValidBalanceStatus(balanceData.status.value)) {
                errors.status = ['Invalid balance status value']
            }
            if (!isValidString(balanceData.status.label, 1)) {
                errors.status = [...(errors.status || []), 'Invalid status label']
            }
        }
    } else {
        errors.status = ['Missing status data']
    }

    // Validate thresholds
    if (balanceData.thresholds) {
        if (!hasRequiredProperties(balanceData.thresholds, ['low_threshold', 'critical_threshold'])) {
            errors.thresholds = ['Invalid thresholds structure']
        } else {
            // Validate low_threshold
            const lowThreshold = balanceData.thresholds.low_threshold as any
            if (!lowThreshold || !isValidNumber(lowThreshold.raw, 0)) {
                errors.thresholds = ['Invalid low threshold value']
            }
            // Validate critical_threshold
            const criticalThreshold = balanceData.thresholds.critical_threshold as any
            if (!criticalThreshold || !isValidNumber(criticalThreshold.raw, 0)) {
                errors.thresholds = [...(errors.thresholds || []), 'Invalid critical threshold value']
            }
            // Logical validation
            if (lowThreshold?.raw <= criticalThreshold?.raw) {
                warnings.thresholds = ['Low threshold should be higher than critical threshold']
            }
        }
    } else {
        errors.thresholds = ['Missing thresholds data']
    }

    // Validate health_indicators
    if (balanceData.health_indicators) {
        if (typeof balanceData.health_indicators.needs_attention !== 'boolean') {
            errors.health_indicators = ['Invalid needs_attention value']
        }
        if (balanceData.health_indicators.days_since_last_top_up !== undefined &&
            !isValidNumber(balanceData.health_indicators.days_since_last_top_up, 0)) {
            errors.health_indicators = [...(errors.health_indicators || []), 'Invalid days_since_last_top_up']
        }
    } else {
        errors.health_indicators = ['Missing health_indicators data']
    }

    // Validate last_transaction if present
    if (balanceData.last_transaction) {
        if (!hasRequiredProperties(balanceData.last_transaction, ['id', 'type', 'amount'])) {
            errors.last_transaction = ['Invalid last_transaction structure']
        }
    }

    // Validate timestamps
    if (balanceData.updated_at && !isValidDate(balanceData.updated_at.raw)) {
        errors.updated_at = ['Invalid updated_at timestamp']
    }

    const isValid = Object.keys(errors).length === 0
    return { 
        isValid, 
        errors, 
        warnings, 
        data: isValid ? balanceData as PettyCashBalance : null,
        timestamp,
        field: 'balance'
    }
}

// Top-up data validation
export const validateTopUpData = (data: unknown): ValidationResult<PettyCashTopUp> => {
    const errors: Record<string, string[]> = {}
    const warnings: Record<string, string[]> = {}
    const timestamp = new Date()

    if (!data || typeof data !== 'object') {
        errors.general = ['Invalid top-up data structure']
        return { 
            isValid: false, 
            errors, 
            warnings, 
            timestamp,
            field: 'topup'
        }
    }

    const topUpData = data as Record<string, any>

    // Validate required properties
    const requiredProps = ['id', 'amount', 'payment_method', 'created_at']
    if (!hasRequiredProperties(topUpData, requiredProps)) {
        errors.structure = ['Missing required top-up properties']
    }

    // Validate ID
    if (!isValidNumber(topUpData.id, 1)) {
        errors.id = ['Invalid top-up ID']
    }

    // Validate amount structure
    if (topUpData.amount) {
        if (!hasRequiredProperties(topUpData.amount, ['raw', 'formatted'])) {
            errors.amount = ['Invalid amount structure']
        } else {
            if (!isValidNumber(topUpData.amount.raw, 0.01)) {
                errors.amount = ['Invalid amount value']
            }
        }
    } else {
        errors.amount = ['Missing amount data']
    }

    // Validate payment_method
    if (topUpData.payment_method) {
        if (!hasRequiredProperties(topUpData.payment_method, ['value', 'label'])) {
            errors.payment_method = ['Invalid payment_method structure']
        } else {
            if (!isValidPaymentMethod(topUpData.payment_method.value)) {
                errors.payment_method = ['Invalid payment method value']
            }
        }
    } else {
        errors.payment_method = ['Missing payment_method data']
    }

    // Validate transaction_code for non-cash payments
    if (topUpData.payment_method?.value !== 'cash' && !topUpData.transaction_code) {
        warnings.transaction_code = ['Transaction code recommended for non-cash payments']
    }

    // Validate remaining_balance if present
    if (topUpData.remaining_balance && !isValidNumber(topUpData.remaining_balance.raw, 0)) {
        errors.remaining_balance = ['Invalid remaining balance']
    }

    // Validate timestamps
    if (topUpData.created_at && !isValidDate(topUpData.created_at.raw)) {
        errors.created_at = ['Invalid created_at timestamp']
    }

    const isValid = Object.keys(errors).length === 0
    return { 
        isValid, 
        errors, 
        warnings, 
        data: isValid ? topUpData as PettyCashTopUp : null,
        timestamp,
        field: 'topup'
    }
}

// Disbursement data validation
export const validateDisbursementData = (data: unknown): ValidationResult<PettyCashDisbursement> => {
    const errors: Record<string, string[]> = {}
    const warnings: Record<string, string[]> = {}
    const timestamp = new Date()

    if (!data || typeof data !== 'object') {
        errors.general = ['Invalid disbursement data structure']
        return { 
            isValid: false, 
            errors, 
            warnings, 
            timestamp,
            field: 'disbursement'
        }
    }

    const disbursementData = data as Record<string, any>

    // Validate required properties
    const requiredProps = ['id', 'receiver', 'account', 'amount', 'description', 'classification', 'payment_method', 'status', 'created_at']
    if (!hasRequiredProperties(disbursementData, requiredProps)) {
        errors.structure = ['Missing required disbursement properties']
    }

    // Validate ID
    if (!isValidNumber(disbursementData.id, 1)) {
        errors.id = ['Invalid disbursement ID']
    }

    // top_up_id validation removed - no longer required

    // Validate receiver
    if (!isValidString(disbursementData.receiver, 1, 255)) {
        errors.receiver = ['Invalid receiver name']
    }

    // Validate account
    if (!isValidString(disbursementData.account, 1, 255)) {
        errors.account = ['Invalid account name']
    }

    // Validate amount
    if (disbursementData.amount) {
        if (!hasRequiredProperties(disbursementData.amount, ['raw', 'formatted'])) {
            errors.amount = ['Invalid amount structure']
        } else {
            if (!isValidNumber(disbursementData.amount.raw, 0.01)) {
                errors.amount = ['Invalid amount value']
            }
        }
    } else {
        errors.amount = ['Missing amount data']
    }

    // Validate description
    if (!isValidString(disbursementData.description, 1, 1000)) {
        errors.description = ['Invalid description']
    }

    // Validate classification
    if (disbursementData.classification) {
        if (!hasRequiredProperties(disbursementData.classification, ['value', 'label'])) {
            errors.classification = ['Invalid classification structure']
        } else {
            if (!isValidClassification(disbursementData.classification.value)) {
                errors.classification = ['Invalid classification value']
            }
        }
    } else {
        errors.classification = ['Missing classification data']
    }

    // Validate payment_method
    if (disbursementData.payment_method) {
        if (!hasRequiredProperties(disbursementData.payment_method, ['value', 'label'])) {
            errors.payment_method = ['Invalid payment_method structure']
        } else {
            if (!isValidPaymentMethod(disbursementData.payment_method.value)) {
                errors.payment_method = ['Invalid payment method value']
            }
        }
    } else {
        errors.payment_method = ['Missing payment_method data']
    }

    // Validate status
    if (disbursementData.status) {
        if (!hasRequiredProperties(disbursementData.status, ['value', 'label'])) {
            errors.status = ['Invalid status structure']
        } else {
            if (!isValidDisbursementStatus(disbursementData.status.value)) {
                errors.status = ['Invalid status value']
            }
        }
    } else {
        errors.status = ['Missing status data']
    }

    // Validate project_name for specific classifications
    if (['agencies', 'operations'].includes(disbursementData.classification?.value) && !disbursementData.project_name) {
        warnings.project_name = ['Project name recommended for this classification']
    }

    // Validate transaction_code for non-cash payments
    if (disbursementData.payment_method?.value !== 'cash' && !disbursementData.transaction_code) {
        warnings.transaction_code = ['Transaction code recommended for non-cash payments']
    }

    // Validate void data if status is voided
    if (disbursementData.status?.value === 'voided') {
        if (!disbursementData.void_reason) {
            errors.void_reason = ['Void reason required for voided disbursements']
        }
        if (!disbursementData.voided_at || !isValidDate(disbursementData.voided_at.raw)) {
            errors.voided_at = ['Invalid voided_at timestamp']
        }
    }

    // Validate timestamps
    if (disbursementData.created_at && !isValidDate(disbursementData.created_at.raw)) {
        errors.created_at = ['Invalid created_at timestamp']
    }

    const isValid = Object.keys(errors).length === 0
    return { 
        isValid, 
        errors, 
        warnings, 
        data: isValid ? disbursementData as PettyCashDisbursement : null,
        timestamp,
        field: 'disbursement'
    }
}

// Form data validation
export const validateTopUpFormData = (formData: CreateTopUpFormData): ValidationResult<CreateTopUpFormData> => {
    const errors: Record<string, string[]> = {}
    const timestamp = new Date()

    // Validate amount
    const amount = typeof formData.amount === 'string' ? parseFloat(formData.amount) : formData.amount
    if (!isValidNumber(amount, 0.01, 999999.99)) {
        errors.amount = ['Amount must be between 0.01 and 999,999.99']
    }

    // Validate payment method
    if (!isValidPaymentMethod(formData.payment_method)) {
        errors.payment_method = ['Invalid payment method']
    }

    // Validate transaction code for non-cash payments
    if (formData.payment_method !== 'cash' && !formData.transaction_code) {
        errors.transaction_code = ['Transaction code is required for non-cash payments']
    }

    // M-Pesa specific validation
    if (formData.payment_method === 'mpesa' && formData.transaction_code) {
        if (!/^[A-Z0-9]{10}$/.test(formData.transaction_code)) {
            errors.transaction_code = ['M-Pesa transaction code must be 10 characters (letters and numbers only)']
        }
    }

    // Validate description length if provided
    if (formData.description && !isValidString(formData.description, 0, 500)) {
        errors.description = ['Description cannot exceed 500 characters']
    }

    const isValid = Object.keys(errors).length === 0
    return { 
        isValid, 
        errors, 
        data: isValid ? formData : null,
        timestamp,
        field: 'topup_form'
    }
}

export const validateDisbursementFormData = (formData: CreateDisbursementFormData): ValidationResult<CreateDisbursementFormData> => {
    const errors: Record<string, string[]> = {}
    const timestamp = new Date()

    // top_up_id validation removed - no longer required

    // Validate receiver
    if (!isValidString(formData.receiver, 1, 255)) {
        errors.receiver = ['Receiver name is required and cannot exceed 255 characters']
    }

    // Validate account
    if (!isValidString(formData.account, 1, 255)) {
        errors.account = ['Account is required and cannot exceed 255 characters']
    }

    // Validate amount
    const amount = typeof formData.amount === 'string' ? parseFloat(formData.amount) : formData.amount
    if (!isValidNumber(amount, 0.01, 999999.99)) {
        errors.amount = ['Amount must be between 0.01 and 999,999.99']
    }

    // Validate description
    if (!isValidString(formData.description, 1, 1000)) {
        errors.description = ['Description is required and cannot exceed 1000 characters']
    }

    // Validate classification
    if (!isValidClassification(formData.classification)) {
        errors.classification = ['Please select a valid classification']
    }

    // Validate payment method
    if (!isValidPaymentMethod(formData.payment_method)) {
        errors.payment_method = ['Please select a valid payment method']
    }

    // Validate project name for specific classifications
    if (['agencies', 'operations'].includes(formData.classification) && !formData.project_name) {
        errors.project_name = [`Project name is required for ${formData.classification} classification`]
    }

    // Validate transaction code for non-cash payments
    if (formData.payment_method !== 'cash' && !formData.transaction_code) {
        errors.transaction_code = ['Transaction code is required for non-cash payments']
    }

    // M-Pesa specific validation
    if (formData.payment_method === 'mpesa' && formData.transaction_code) {
        if (!/^[A-Z0-9]{10}$/.test(formData.transaction_code)) {
            errors.transaction_code = ['M-Pesa transaction code must be 10 characters (letters and numbers only)']
        }
    }

    // Validate job number length if provided
    if (formData.job_number && !isValidString(formData.job_number, 0, 100)) {
        errors.job_number = ['Job number cannot exceed 100 characters']
    }

    const isValid = Object.keys(errors).length === 0
    return { 
        isValid, 
        errors, 
        data: isValid ? formData : null,
        timestamp,
        field: 'disbursement_form'
    }
}

export const validateVoidFormData = (formData: VoidDisbursementFormData): ValidationResult<VoidDisbursementFormData> => {
    const errors: Record<string, string[]> = {}
    const timestamp = new Date()

    // Validate void reason
    if (!isValidString(formData.void_reason, 1, 500)) {
        errors.void_reason = ['Void reason is required and cannot exceed 500 characters']
    }

    const isValid = Object.keys(errors).length === 0
    return { 
        isValid, 
        errors, 
        data: isValid ? formData : null,
        timestamp,
        field: 'void_form'
    }
}

// Summary data validation
export const validateSummaryData = (data: unknown): ValidationResult<TransactionSummary> => {
    const errors: Record<string, string[]> = {}
    const timestamp = new Date()

    if (!data || typeof data !== 'object') {
        errors.general = ['Invalid summary data structure']
        return { 
            isValid: false, 
            errors, 
            timestamp,
            field: 'summary'
        }
    }

    const summaryData = data as Record<string, any>

    // Validate numeric fields
    const numericFields = ['total_top_ups', 'total_disbursements', 'net_balance', 'top_up_count', 'disbursement_count', 'average_top_up', 'average_disbursement', 'current_balance']

    numericFields.forEach(field => {
        if (summaryData[field] !== undefined && !isValidNumber(summaryData[field], 0)) {
            errors[field] = [`Invalid ${field} value`]
        }
    })

    // Validate balance status
    if (summaryData.balance_status && !isValidBalanceStatus(summaryData.balance_status)) {
        errors.balance_status = ['Invalid balance status']
    }

    const isValid = Object.keys(errors).length === 0
    return { 
        isValid, 
        errors, 
        data: isValid ? summaryData as TransactionSummary : null,
        timestamp,
        field: 'summary'
    }
}

// Analytics data validation
export const validateAnalyticsData = (data: unknown): ValidationResult<SpendingAnalytics> => {
    const errors: Record<string, string[]> = {}
    const timestamp = new Date()

    if (!data || typeof data !== 'object') {
        errors.general = ['Invalid analytics data structure']
        return { 
            isValid: false, 
            errors, 
            timestamp,
            field: 'analytics'
        }
    }

    const analyticsData = data as Record<string, any>

    // Validate by_classification array
    if (analyticsData.by_classification && Array.isArray(analyticsData.by_classification)) {
        analyticsData.by_classification.forEach((item: any, index: number) => {
            if (!isValidClassification(item.classification)) {
                errors[`by_classification_${index}`] = ['Invalid classification in analytics data']
            }
            if (!isValidNumber(item.total_amount, 0)) {
                errors[`by_classification_${index}`] = [...(errors[`by_classification_${index}`] || []), 'Invalid total_amount']
            }
        })
    }

    // Validate by_payment_method array
    if (analyticsData.by_payment_method && Array.isArray(analyticsData.by_payment_method)) {
        analyticsData.by_payment_method.forEach((item: any, index: number) => {
            if (!isValidPaymentMethod(item.payment_method)) {
                errors[`by_payment_method_${index}`] = ['Invalid payment method in analytics data']
            }
            if (!isValidNumber(item.total_amount, 0)) {
                errors[`by_payment_method_${index}`] = [...(errors[`by_payment_method_${index}`] || []), 'Invalid total_amount']
            }
        })
    }

    const isValid = Object.keys(errors).length === 0
    return { 
        isValid, 
        errors, 
        data: isValid ? analyticsData as SpendingAnalytics : null,
        timestamp,
        field: 'analytics'
    }
}

// Utility function to validate API response data
export const validateApiResponseData = <T>(
    data: unknown,
    validator: (data: unknown) => ValidationResult<T>
): ValidationResult<T> => {
    try {
        return validator(data)
    } catch (error) {
        return {
            isValid: false,
            errors: { validation: ['Validation error occurred'] },
            timestamp: new Date(),
            field: 'api_response'
        }
    }
}

// Batch validation for arrays
export const validateArrayData = <T>(
    dataArray: unknown[],
    validator: (data: unknown) => ValidationResult<T>
): { validItems: T[], invalidItems: unknown[], errors: Record<string, string[]> } => {
    const validItems: T[] = []
    const invalidItems: unknown[] = []
    const errors: Record<string, string[]> = {}

    if (!Array.isArray(dataArray)) {
        errors.general = ['Expected array data']
        return { validItems, invalidItems, errors }
    }

    dataArray.forEach((item, index) => {
        const result = validator(item)
        if (result.isValid && result.data) {
            validItems.push(result.data)
        } else {
            invalidItems.push(item)
            errors[`item_${index}`] = Object.values(result.errors).flat()
        }
    })

    return { validItems, invalidItems, errors }
}