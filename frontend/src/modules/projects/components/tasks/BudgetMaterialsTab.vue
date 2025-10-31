<template>
  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Materials & Components</h3>
      </div>
      <div class="flex items-center space-x-3">
        <button
          v-if="!formData.materials || formData.materials.length === 0"
          @click="() => importMaterials(false)"
          type="button"
          :disabled="isImporting"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors"
        >
          {{ isImporting ? 'Importing...' : 'Import from Materials Task' }}
        </button>

        <!-- Import Status Display -->
        <div v-if="importStatus" class="flex flex-col space-y-2">
          <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>
              Imported {{ importStatus.importMetadata?.imported_at ? new Date(importStatus.importMetadata.imported_at).toLocaleDateString() : 'recently' }}
              from {{ importStatus.importMetadata?.materials_task_title || 'Materials Task' }}
              ({{ importStatus.importMetadata?.total_elements || 0 }} elements, {{ importStatus.importMetadata?.total_materials || 0 }} materials)
            </span>
          </div>

          <!-- Update notification -->
          <div v-if="materialsUpdateCheck?.has_updates" class="flex items-center space-x-2">
            <div class="flex items-center space-x-1 text-sm text-orange-600 dark:text-orange-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <span>{{ materialsUpdateCheck.message }}</span>
            </div>
            <button
              @click="reImportMaterials"
              type="button"
              :disabled="isImporting"
              class="px-3 py-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white text-xs rounded transition-colors"
            >
              Update Now
            </button>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center space-x-2">
            <button
              @click="reImportMaterials"
              type="button"
              :disabled="isImporting"
              class="px-3 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white text-xs rounded transition-colors"
              title="Re-import all materials from the Materials Task"
            >
              Re-import
            </button>
            <button
              v-if="!materialsUpdateCheck"
              @click="checkMaterialsUpdates"
              type="button"
              :disabled="isCheckingUpdates"
              class="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-xs rounded transition-colors"
              title="Check if materials have been updated"
            >
              {{ isCheckingUpdates ? 'Checking...' : 'Check Updates' }}
            </button>
          </div>
        </div>

        <!-- Update Check Button -->
        <button
          v-if="importStatus && !materialsUpdateCheck"
          @click="checkMaterialsUpdates"
          type="button"
          :disabled="isCheckingUpdates"
          class="px-3 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white text-xs rounded transition-colors"
        >
          {{ isCheckingUpdates ? 'Checking...' : 'Check for Updates' }}
        </button>
      </div>
    </div>

    <div v-if="!formData.materials || formData.materials.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      <p>No materials imported yet. Click "Import from Materials Task" to get started.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="element in formData.materials"
        :key="element.id"
        class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      >
        <div class="bg-gray-100 dark:bg-gray-700 px-4 py-3">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ element.name }}</h4>
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ element.materials.length }} items</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="text-left py-2 px-4 text-gray-700 dark:text-gray-300 font-medium">Description</th>
                <th class="text-left py-2 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit</th>
                <th class="text-left py-2 px-4 text-gray-700 dark:text-gray-300 font-medium">Qty</th>
                <th class="text-left py-2 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit Price (KES)</th>
                <th class="text-left py-2 px-4 text-gray-700 dark:text-gray-300 font-medium">Total (KES)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="material in element.materials"
                :key="material.id"
                class="border-t border-gray-100 dark:border-gray-700"
              >
                <td class="py-2 px-4 text-gray-900 dark:text-white">
                  <div class="flex items-center space-x-2">
                    <span>{{ material.description }}</span>
                    <!-- Visual indicator for imported vs manual materials -->
                    <span
                      v-if="!material.isAddition"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      title="Imported from Materials Task"
                    >
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Imported
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      title="Manually added"
                    >
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Manual
                    </span>
                  </div>
                </td>
                <td class="py-2 px-4 text-gray-600 dark:text-gray-400">{{ material.unitOfMeasurement }}</td>
                <td class="py-2 px-4 text-gray-600 dark:text-gray-400">{{ material.quantity }}</td>
                <td class="py-2 px-4">
                  <input
                    v-model.number="material.unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    @input="calculateMaterialTotal(material)"
                  />
                </td>
                <td class="py-2 px-4 text-gray-900 dark:text-white font-medium">{{ formatCurrency(material.totalPrice || 0) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BudgetElement, BudgetMaterialItem, MaterialsImportInfo, MaterialsUpdateCheckResponse } from '../../services/budgetService'

interface Props {
  formData: {
    materials: BudgetElement[]
  }
  importStatus: MaterialsImportInfo | null
  materialsUpdateCheck: MaterialsUpdateCheckResponse | null
  isImporting: boolean
  isCheckingUpdates: boolean
}

interface Emits {
  (e: 'import-materials', forceReimport: boolean): void
  (e: 'check-updates'): void
  (e: 're-import-materials'): void
  (e: 'calculate-material-total', material: BudgetMaterialItem): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const importMaterials = (forceReimport: boolean) => {
  emit('import-materials', forceReimport)
}

const checkMaterialsUpdates = () => {
  emit('check-updates')
}

const reImportMaterials = () => {
  emit('re-import-materials')
}

const calculateMaterialTotal = (material: BudgetMaterialItem) => {
  emit('calculate-material-total', material)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>
