<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Quotation Details
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ quotation?.enquiry?.title }} - {{ formatDate(quotation?.createdAt) }}
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="downloadPDF"
            :disabled="isGeneratingPDF"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="isGeneratingPDF" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>{{ isGeneratingPDF ? 'Generating...' : 'Download PDF' }}</span>
          </button>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
        <!-- PDF Content Template (Hidden for PDF generation) -->
        <div id="quotation-pdf-content" class="hidden">
          <div class="pdf-content p-8 bg-white text-black" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <!-- Company Header -->
            <div class="text-center mb-8 border-b-2 border-gray-800 pb-4">
              <h1 class="text-3xl font-bold text-gray-800 mb-2">EXHIBITION & DISPLAY SOLUTIONS</h1>
              <p class="text-lg text-gray-600">Professional Event Equipment & Services</p>
              <div class="mt-4 text-sm text-gray-600">
                <p>123 Business Avenue, Nairobi, Kenya</p>
                <p>Phone: +254 700 000 000 | Email: info@exhibitionsolutions.co.ke</p>
                <p>Website: www.exhibitionsolutions.co.ke</p>
              </div>
            </div>

            <!-- Quotation Header -->
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">QUOTATION</h2>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Quotation #:</strong> QT-{{ quotation?.enquiry?.id }}-{{ formatDateForPDF(quotation?.createdAt) }}</p>
                  <p><strong>Date:</strong> {{ formatDate(quotation?.createdAt) }}</p>
                  <p><strong>Valid Until:</strong> {{ formatValidUntil(quotation?.enquiry?.quotation?.valid_until) }}</p>
                </div>
                <div>
                  <p><strong>Client:</strong> {{ quotation?.enquiry?.client?.name }}</p>
                  <p><strong>Project:</strong> {{ quotation?.enquiry?.title }}</p>
                  <p><strong>Status:</strong> {{ quotation?.enquiry?.quotation?.status || 'Draft' }}</p>
                </div>
              </div>
            </div>

            <!-- Elements Breakdown -->
            <div class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 border-b border-gray-400 pb-1">Project Elements</h3>
              <table class="w-full border-collapse border border-gray-400 mb-4">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-400 px-3 py-2 text-left font-semibold">Element</th>
                    <th class="border border-gray-400 px-3 py-2 text-left font-semibold">Description</th>
                    <th class="border border-gray-400 px-3 py-2 text-right font-semibold">Quantity</th>
                    <th class="border border-gray-400 px-3 py-2 text-right font-semibold">Unit Price</th>
                    <th class="border border-gray-400 px-3 py-2 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="element in quotation?.elements" :key="element.id">
                    <td class="border border-gray-400 px-3 py-2 font-medium">{{ element.elementName }}</td>
                    <td class="border border-gray-400 px-3 py-2 text-sm">{{ element.description }}</td>
                    <td class="border border-gray-400 px-3 py-2 text-right">1</td>
                    <td class="border border-gray-400 px-3 py-2 text-right">KES {{ element.quotePrice.toLocaleString() }}</td>
                    <td class="border border-gray-400 px-3 py-2 text-right font-medium">KES {{ element.quotePrice.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Materials Details (Optional - can be expanded) -->
            <div class="mb-6" v-if="includeMaterialsDetails">
              <h3 class="text-lg font-bold text-gray-800 mb-3 border-b border-gray-400 pb-1">Detailed Materials Breakdown</h3>
              <div v-for="element in quotation?.elements" :key="element.id" class="mb-4">
                <h4 class="font-semibold text-gray-700 mb-2">{{ element.elementName }} Materials:</h4>
                <table class="w-full border-collapse border border-gray-300 mb-3">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="border border-gray-300 px-2 py-1 text-left text-sm font-medium">Material</th>
                      <th class="border border-gray-300 px-2 py-1 text-center text-sm font-medium">Qty</th>
                      <th class="border border-gray-300 px-2 py-1 text-center text-sm font-medium">Unit</th>
                      <th class="border border-gray-300 px-2 py-1 text-right text-sm font-medium">Unit Price</th>
                      <th class="border border-gray-300 px-2 py-1 text-right text-sm font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="subItem in element.subItems" :key="subItem.id">
                      <td class="border border-gray-300 px-2 py-1 text-sm">{{ subItem.name }}</td>
                      <td class="border border-gray-300 px-2 py-1 text-center text-sm">{{ subItem.quantity }}</td>
                      <td class="border border-gray-300 px-2 py-1 text-center text-sm">{{ subItem.unit }}</td>
                      <td class="border border-gray-300 px-2 py-1 text-right text-sm">KES {{ subItem.unitPrice.toLocaleString() }}</td>
                      <td class="border border-gray-300 px-2 py-1 text-right text-sm">KES {{ (subItem.quantity * subItem.unitPrice).toLocaleString() }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Financial Summary -->
            <div class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 border-b border-gray-400 pb-1">Financial Summary</h3>
              <div class="bg-gray-50 p-4 rounded">
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Subtotal (Before VAT):</span>
                    <span class="font-medium">KES {{ quotation?.summary?.subtotalBeforeTax?.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>VAT (16%):</span>
                    <span class="font-medium">KES {{ quotation?.summary?.vatAmount?.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between border-t border-gray-400 pt-2 mt-2">
                    <span class="font-bold text-lg">Total Amount:</span>
                    <span class="font-bold text-lg">KES {{ quotation?.summary?.totalQuoteAmount?.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 border-b border-gray-400 pb-1">Terms & Conditions</h3>
              <div class="text-sm space-y-1">
                <p><strong>Validity:</strong> This quotation is valid for 30 days from the date of issue.</p>
                <p><strong>Payment Terms:</strong> 50% deposit required to commence work, balance due before delivery.</p>
                <p><strong>Delivery:</strong> Delivery timeframe will be confirmed upon order confirmation.</p>
                <p><strong>Warranty:</strong> 6 months warranty on all equipment and workmanship.</p>
                <p><strong>Cancellation:</strong> 48 hours notice required for cancellation.</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-8 pt-4 border-t border-gray-400 text-center text-sm text-gray-600">
              <p>Thank you for considering Exhibition & Display Solutions for your project needs.</p>
              <p class="mt-2">For inquiries, please contact us at info@exhibitionsolutions.co.ke or +254 700 000 000</p>
            </div>
          </div>
        </div>

        <!-- Display Content (Visible) -->
        <div class="space-y-6">
          <!-- Quotation Header -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Quotation Details</h3>
                <p class="text-gray-600 dark:text-gray-400">QT-{{ quotation?.enquiry?.id }}-{{ formatDateForPDF(quotation?.createdAt) }}</p>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-600 dark:text-gray-400">Status</div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {{ quotation?.enquiry?.quotation?.status || 'Draft' }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Client Information</h4>
                <div class="space-y-1 text-sm">
                  <p><strong>Name:</strong> {{ quotation?.enquiry?.client?.name }}</p>
                  <p><strong>Email:</strong> {{ quotation?.enquiry?.client?.email }}</p>
                  <p><strong>Project:</strong> {{ quotation?.enquiry?.title }}</p>
                </div>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Quotation Details</h4>
                <div class="space-y-1 text-sm">
                  <p><strong>Date:</strong> {{ formatDate(quotation?.createdAt) }}</p>
                  <p><strong>Valid Until:</strong> {{ formatValidUntil(quotation?.enquiry?.quotation?.valid_until) }}</p>
                  <p><strong>Margin:</strong> {{ quotation?.summary?.averageMarginPercentage?.toFixed(1) }}%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Elements Breakdown -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Elements</h4>
            <div class="space-y-4">
              <div v-for="element in quotation?.elements" :key="element.id"
                   class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <h5 class="font-semibold text-gray-900 dark:text-white">{{ element.elementName }}</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ element.description }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-green-600 dark:text-green-400">
                      KES {{ element.quotePrice.toLocaleString() }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Profit: KES {{ element.profitAmount.toLocaleString() }}
                    </div>
                  </div>
                </div>

                <!-- Materials List -->
                <div class="mt-3">
                  <h6 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Materials:</h6>
                  <div class="space-y-1">
                    <div v-for="subItem in element.subItems" :key="subItem.id"
                         class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 py-1 px-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span>{{ subItem.name }} ({{ subItem.quantity }} {{ subItem.unit }})</span>
                      <span>KES {{ (subItem.quantity * subItem.unitPrice).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Summary</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">Subtotal (Before VAT):</span>
                <span class="font-semibold text-gray-900 dark:text-white">KES {{ quotation?.summary?.subtotalBeforeTax?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">VAT (16%):</span>
                <span class="font-semibold text-orange-600 dark:text-orange-400">KES {{ quotation?.summary?.vatAmount?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center pt-3 border-t border-gray-300 dark:border-gray-600">
                <span class="text-lg font-bold text-gray-900 dark:text-white">Total Amount:</span>
                <span class="text-xl font-bold text-green-600 dark:text-green-400">KES {{ quotation?.summary?.totalQuoteAmount?.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="quotation?.enquiry?.quotation?.notes" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ quotation.enquiry.quotation.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Props
interface Props {
  isVisible: boolean
  quotation?: any
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Reactive data
const isGeneratingPDF = ref(false)
const includeMaterialsDetails = ref(false)

// Methods
const closeModal = () => {
  emit('close')
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateForPDF = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.getFullYear().toString().slice(-2) + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0')
}

const formatValidUntil = (dateString?: string) => {
  if (!dateString) return '30 days from issue'
  return formatDate(dateString)
}

const downloadPDF = async () => {
  if (!props.quotation) return

  isGeneratingPDF.value = true

  try {
    const pdfContent = document.getElementById('quotation-pdf-content')
    if (!pdfContent) {
      throw new Error('PDF content not found')
    }

    // Temporarily show the PDF content for capture
    pdfContent.style.display = 'block'

    // Generate canvas from HTML
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: pdfContent.scrollHeight
    })

    // Hide the PDF content again
    pdfContent.style.display = 'none'

    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    const fileName = `Quotation-QT-${props.quotation.enquiry?.id}-${formatDateForPDF(props.quotation.createdAt)}.pdf`
    pdf.save(fileName)

  } catch (error) {
    console.error('PDF generation failed:', error)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    isGeneratingPDF.value = false
  }
}
</script>

<style scoped>
.pdf-content {
  font-size: 12px;
  line-height: 1.4;
}

.pdf-content h1 {
  font-size: 24px;
  margin-bottom: 8px;
}

.pdf-content h2 {
  font-size: 20px;
  margin-bottom: 16px;
}

.pdf-content h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.pdf-content table {
  font-size: 11px;
}

.pdf-content table th,
.pdf-content table td {
  padding: 6px 8px;
}
</style>
