<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Department Name *
      </label>
      <input
        v-model="formData.name"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Enter department name"
        required
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Description
      </label>
      <textarea
        v-model="formData.description"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Enter department description"
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Manager
      </label>
      <select
        v-model="formData.manager_id"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">Select Manager (Optional)</option>
        <option v-for="employee in availableEmployees" :key="employee.id" :value="employee.id">
          {{ employee.first_name }} {{ employee.last_name }} - {{ employee.position }}
        </option>
      </select>
      <p v-if="errors.manager_id" class="mt-1 text-sm text-red-600">{{ errors.manager_id[0] }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Budget
        </label>
        <input
          v-model.number="formData.budget"
          type="number"
          step="0.01"
          min="0"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="0.00"
        />
        <p v-if="errors.budget" class="mt-1 text-sm text-red-600">{{ errors.budget[0] }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location
        </label>
        <input
          v-model="formData.location"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Enter location"
        />
        <p v-if="errors.location" class="mt-1 text-sm text-red-600">{{ errors.location[0] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { CreateDepartmentData, UpdateDepartmentData } from '../types/department'

interface Props {
  modelValue: CreateDepartmentData | UpdateDepartmentData
  errorMessage?: string
  successMessage?: string
}

interface Emits {
  (e: 'update:modelValue', value: CreateDepartmentData | UpdateDepartmentData): void
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<CreateDepartmentData | UpdateDepartmentData>(props.modelValue)
const errors = ref<Record<string, string[]>>({})
const availableEmployees = ref<Array<{
  id: number
  first_name: string
  last_name: string
  position: string
}>>([])

// Watch for prop changes
watch(() => props.modelValue, (newValue: CreateDepartmentData | UpdateDepartmentData) => {
  formData.value = { ...newValue }
}, { deep: true })

// Watch for form data changes
watch(formData, (newValue: CreateDepartmentData | UpdateDepartmentData) => {
  emit('update:modelValue', newValue)
}, { deep: true })

const fetchAvailableEmployees = async () => {
  try {
    const response = await fetch('/api/hr/employees?status=active&per_page=1000')
    const data = await response.json()
    availableEmployees.value = data.data || []
  } catch (error) {
    console.error('Error fetching employees:', error)
    availableEmployees.value = []
  }
}

onMounted(() => {
  fetchAvailableEmployees()
})
</script>