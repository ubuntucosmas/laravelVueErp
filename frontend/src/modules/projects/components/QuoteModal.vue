<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Quotation Generation
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create final quotation with profit margins for {{ enquiry?.title }}
          </p>
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Based on budget calculations with applied profit margins
          </div>
        </div>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
        <!-- Error Display -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <span class="text-sm font-medium text-red-800 dark:text-red-200">Error</span>
          </div>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
        </div>

        <!-- Success Display -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm font-medium text-green-800 dark:text-green-200">Success</span>
          </div>
          <p class="text-sm text-green-700 dark:text-green-300 mt-1">{{ successMessage }}</p>
        </div>

        <!-- Quotation Overview -->
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 mb-6 border border-green-200 dark:border-green-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quotation Summary</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Final pricing with profit margins applied</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Quote Amount</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">KES {{ totalQuoteAmount.toLocaleString() }}</div>
            </div>
          </div>
        </div>

        <!-- Profit Margin Settings -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div class="flex items-center space-x-2 mb-3">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
            <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">Global Profit Margin Settings</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                Default Margin (%)
              </label>
              <input
                v-model.number="globalMarginPercentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                class="w-full px-3 py-2 text-sm border border-blue-300 dark:border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                @input="applyGlobalMargin"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                Default Fixed Amount (KES)
              </label>
              <input
                v-model.number="globalMarginFixed"
                type="number"
                min="0"
                class="w-full px-3 py-2 text-sm border border-blue-300 dark:border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                @input="applyGlobalMargin"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="applyGlobalMargin"
                class="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Apply to All
              </button>
            </div>
          </div>
        </div>

        <!-- Elements with Profit Margins -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Element Pricing</h4>

          <div v-for="(element, index) in quotationElements" :key="element.id"
               class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <!-- Element Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <div>
                  <h5 class="text-md font-semibold text-gray-900 dark:text-white">{{ element.elementName }}</h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ element.description }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="element.category === 'production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'">
                {{ element.category }}
              </span>
            </div>

            <!-- Materials Breakdown -->
            <div class="mb-4">
              <h6 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Materials Breakdown</h6>
              <div class="space-y-1">
                <div v-for="subItem in element.subItems" :key="subItem.id"
                     class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 py-1">
                  <span>• {{ subItem.name }} ({{ subItem.quantity }} {{ subItem.unit }})</span>
                  <span>KES {{ (subItem.quantity * subItem.unitPrice).toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Cost and Margin Calculation -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Base Cost
                </label>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  KES {{ element.baseCost.toLocaleString() }}
                </div>
              </div>

              <div>
                <label :for="`margin-percent-${element.id}`" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Margin (%)
                </label>
                <input
                  :id="`margin-percent-${element.id}`"
                  v-model.number="element.marginPercentage"
                  type="number"
                  min="0"
                  max="200"
                  step="0.1"
                  class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-600 dark:text-white"
                  @input="calculateElementQuote(element)"
                />
              </div>

              <div>
                <label :for="`margin-fixed-${element.id}`" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fixed Margin (KES)
                </label>
                <input
                  :id="`margin-fixed-${element.id}`"
                  v-model.number="element.marginFixed"
                  type="number"
                  min="0"
                  class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-600 dark:text-white"
                  @input="calculateElementQuote(element)"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quote Price
                </label>
                <div class="text-sm font-bold text-green-600 dark:text-green-400">
                  KES {{ element.quotePrice.toLocaleString() }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Profit: KES {{ element.profitAmount.toLocaleString() }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quotation Summary -->
        <div class="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Final Quotation Summary</h4>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ quotationElements.length }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Elements</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">KES {{ totalBaseCost.toLocaleString() }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Base Cost</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">KES {{ totalProfitAmount.toLocaleString() }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Profit</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">KES {{ subtotalBeforeTax.toLocaleString() }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Subtotal (Before Tax)</div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-700 dark:text-gray-300">Subtotal (Before VAT):</span>
              <span class="text-lg font-medium text-gray-900 dark:text-white">KES {{ subtotalBeforeTax.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-700 dark:text-gray-300">VAT (16%):</span>
              <span class="text-lg font-medium text-orange-600 dark:text-orange-400">KES {{ vatAmount.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-400 dark:border-gray-500">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">Final Quote Amount (incl. VAT):</span>
              <span class="text-2xl font-bold text-green-600 dark:text-green-400">KES {{ totalQuoteAmount.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div class="flex items-center space-x-4">
          <button
            @click="calculateAllQuotes"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            <span>Recalculate All</span>
          </button>
          <button
            @click="saveQuotation"
            :disabled="isSaving"
            class="inline-flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ isSaving ? 'Saving...' : 'Save Quotation' }}</span>
          </button>
        </div>
        <button
          @click="closeModal"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Enquiry } from '../types'

// Props
interface Props {
  isVisible: boolean
  enquiry: Enquiry | null
  materialElements?: any[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  save: [quotation: QuotationData]
}>()

// Types
interface MaterialSubItem {
  id: string
  name: string
  quantity: number
  unit: string
  unitPrice: number
  category: 'production' | 'hire'
  comment?: string
}

interface QuotationElement {
  id: string
  elementName: string
  description?: string
  category: 'production' | 'hire'
  subItems: MaterialSubItem[]
  baseCost: number
  marginPercentage: number
  marginFixed: number
  profitAmount: number
  quotePrice: number
}

interface QuotationData {
  elements: QuotationElement[]
  summary: {
    totalBaseCost: number
    totalProfitAmount: number
    subtotalBeforeTax: number
    vatAmount: number
    totalQuoteAmount: number
    averageMarginPercentage: number
  }
  enquiry: Enquiry | null
  createdAt: string
}

// Reactive data
const quotationElements = ref<QuotationElement[]>([])
const globalMarginPercentage = ref(25) // Default 25% margin
const globalMarginFixed = ref(0)
const error = ref('')
const successMessage = ref('')
const isSaving = ref(false)

// Initialize quotation elements from props
watch(() => props.materialElements, (newElements) => {
  if (newElements && newElements.length > 0) {
    quotationElements.value = newElements.map(element => ({
      id: element.id,
      elementName: element.elementName,
      description: element.description,
      category: element.category,
      subItems: element.subItems || [],
      baseCost: calculateBaseCost(element),
      marginPercentage: globalMarginPercentage.value,
      marginFixed: globalMarginFixed.value,
      profitAmount: 0,
      quotePrice: 0
    }))

    // Calculate initial quotes
    quotationElements.value.forEach(calculateElementQuote)
  }
}, { immediate: true })

// Computed properties
const totalBaseCost = computed(() => {
  return quotationElements.value.reduce((total, element) => total + element.baseCost, 0)
})

const totalProfitAmount = computed(() => {
  return quotationElements.value.reduce((total, element) => total + element.profitAmount, 0)
})

const subtotalBeforeTax = computed(() => {
  return quotationElements.value.reduce((total, element) => total + element.quotePrice, 0)
})

const vatAmount = computed(() => {
  return subtotalBeforeTax.value * 0.16 // 16% VAT
})

const totalQuoteAmount = computed(() => {
  return subtotalBeforeTax.value + vatAmount.value
})

// Methods
const closeModal = () => {
  emit('close')
}

const calculateBaseCost = (element: any): number => {
  if (!element.subItems) return 0
  return element.subItems.reduce((total: number, subItem: MaterialSubItem) => {
    return total + (subItem.quantity * subItem.unitPrice)
  }, 0)
}

const calculateElementQuote = (element: QuotationElement) => {
  const percentageProfit = element.baseCost * (element.marginPercentage / 100)
  const fixedProfit = element.marginFixed
  element.profitAmount = percentageProfit + fixedProfit
  element.quotePrice = element.baseCost + element.profitAmount
}

const applyGlobalMargin = () => {
  quotationElements.value.forEach(element => {
    element.marginPercentage = globalMarginPercentage.value
    element.marginFixed = globalMarginFixed.value
    calculateElementQuote(element)
  })
}

const calculateAllQuotes = () => {
  quotationElements.value.forEach(calculateElementQuote)
}

const saveQuotation = async () => {
  // Clear previous messages
  error.value = ''
  successMessage.value = ''

  // Basic validation
  if (quotationElements.value.length === 0) {
    error.value = 'No elements to quote.'
    return
  }

  if (totalQuoteAmount.value <= totalBaseCost.value) {
    error.value = 'Quote amount must be higher than base cost.'
    return
  }

  isSaving.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const quotationData: QuotationData = {
      elements: quotationElements.value,
      summary: {
        totalBaseCost: totalBaseCost.value,
        totalProfitAmount: totalProfitAmount.value,
        subtotalBeforeTax: subtotalBeforeTax.value,
        vatAmount: vatAmount.value,
        totalQuoteAmount: totalQuoteAmount.value,
        averageMarginPercentage: quotationElements.value.reduce((sum, el) => sum + el.marginPercentage, 0) / quotationElements.value.length
      },
      enquiry: props.enquiry,
      createdAt: new Date().toISOString()
    }

    emit('save', quotationData)

    successMessage.value = `Quotation saved successfully! Subtotal: KES ${subtotalBeforeTax.value.toLocaleString()}, VAT (16%): KES ${vatAmount.value.toLocaleString()}, Total: KES ${totalQuoteAmount.value.toLocaleString()}`

    // Auto-close after success
    setTimeout(() => {
      closeModal()
    }, 2000)

  } catch (err) {
    console.error('Save failed:', err)
    error.value = 'Failed to save quotation. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// Watch for modal visibility changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    error.value = ''
    successMessage.value = ''
  }
})
</script>
