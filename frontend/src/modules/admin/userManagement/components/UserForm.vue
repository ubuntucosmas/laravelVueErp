<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Employee Selection (Only for creation) -->
    <div v-if="!isEditing" class="md:col-span-2">
      <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Select Employee *
      </label>
      <select
        v-model="selectedEmployeeId"
        required
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
      >
        <option :value="null" disabled>Select an employee to create user account</option>
        <option
          v-for="employee in availableEmployees"
          :key="employee.id"
          :value="employee.id"
        >
          {{ employee.name }} - {{ employee.email }} ({{ employee.department?.name || 'No Department' }})
        </option>
      </select>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        All user accounts must be created from existing HR employee records. Select an employee to proceed.
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Full Name
      </label>
      <input
        v-model="formData.name"
        type="text"
        placeholder="Select an employee first"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        required
      />
      <p v-if="selectedEmployeeId" class="text-xs text-blue-600 dark:text-blue-400 mt-1">
        Auto-populated from selected employee record (editable)
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Email Address
      </label>
      <input
        v-model="formData.email"
        type="email"
        placeholder="Select an employee first"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        required
      />
      <p v-if="selectedEmployeeId" class="text-xs text-blue-600 dark:text-blue-400 mt-1">
        Auto-populated from selected employee record (editable)
      </p>
    </div>

    <div class="md:col-span-2">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Password {{ isEditing ? '(Leave blank to keep current)' : '*' }}
          </label>
          <input
            v-model="formData.password"
            type="password"
            :placeholder="isEditing ? 'Leave blank to keep current password' : 'Create a password'"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            :required="!isEditing"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Confirm Password {{ isEditing ? '(Only if changing password)' : '*' }}
          </label>
          <input
            v-model="formData.password_confirmation"
            type="password"
            :placeholder="isEditing ? 'Only required if changing password' : 'Confirm password'"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            :required="!isEditing"
          />
        </div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Department
      </label>
      <select
        v-model="formData.department_id"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
      >
        <option :value="undefined">No Department</option>
        <option
          v-for="department in availableDepartments"
          :key="department.id"
          :value="department.id"
        >
          {{ department.name }}
        </option>
      </select>
      <p v-if="selectedEmployeeId" class="text-xs text-blue-600 dark:text-blue-400 mt-1">
        Auto-populated from selected employee record (editable)
      </p>
    </div>

    <div class="md:col-span-2">
      <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Roles
      </label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <label v-for="role in availableRoles" :key="role.id" class="flex items-center">
          <input
            v-model="formData.role_ids"
            :value="role.id"
            type="checkbox"
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ role.name }}</span>
        </label>
      </div>
    </div>


    <div v-if="errorMessage" class="md:col-span-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="md:col-span-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { CreateUserData } from '../types/user'
import { useUsers } from '../composables/useUsers'
import { useDepartments } from '../../departmentManagement/composables/useDepartments'
import { useRoles } from '../../roleManagement/composables/useRoles'

// Props
const props = defineProps<{
  modelValue: CreateUserData
  errorMessage?: string
  successMessage?: string
  isEditing?: boolean
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: CreateUserData]
  'update:selectedEmployeeId': [value: number | null]
  submit: []
}>()

// Use composables
const { availableEmployees, fetchAvailableEmployees } = useUsers()
const { departments: availableDepartments, fetchDepartments } = useDepartments()
const { roles: availableRoles, fetchRoles } = useRoles()

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    fetchAvailableEmployees(),
    fetchDepartments(),
    fetchRoles()
  ])
})

// Employee selection
const selectedEmployeeId = ref<number | null>(null)

// Reactive form data
const formData = ref<CreateUserData>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  department_id: undefined,
  role_ids: []
})

// Watch for changes and emit
watch(formData, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Watch for prop changes
watch(() => props.modelValue, (newValue, oldValue) => {
  if (newValue && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    formData.value = { ...newValue }
    // Reset employee selection when form data changes externally (only for creation)
    if (!props.isEditing) {
      selectedEmployeeId.value = null
    }
  }
}, { immediate: true, deep: true })

// Watch for employee selection and auto-populate form
watch(selectedEmployeeId, (newEmployeeId) => {
  emit('update:selectedEmployeeId', newEmployeeId)

  if (newEmployeeId) {
    const selectedEmployee = availableEmployees.value.find(emp => emp.id === newEmployeeId)
    if (selectedEmployee) {
      formData.value.name = selectedEmployee.name
      formData.value.email = selectedEmployee.email

      // Auto-select department based on employee's department
      formData.value.department_id = selectedEmployee.department_id || undefined
    }
  } else {
    // Clear form when no employee selected (unless editing existing user)
    if (!props.modelValue?.name) {
      formData.value.name = ''
      formData.value.email = ''
    }
  }
})

// Expose form data for parent component
defineExpose({
  formData
})
</script>