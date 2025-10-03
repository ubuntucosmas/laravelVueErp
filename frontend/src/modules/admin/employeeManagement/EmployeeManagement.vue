<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Dashboard
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/admin" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Admin
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Employees</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage company employees and their information</p>
      </div>
      <button
        @click="resetForm(); showCreateModal = true"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Add Employee
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search employees..."
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          v-model="filters.department_id"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Departments</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>
        <select
          v-model="filters.is_active"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option :value="true">Active</option>
          <option :value="false">Inactive</option>
        </select>
        <button
          @click="applyFilters"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Filter
        </button>
      </div>
    </div>

    <!-- Employees Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading employees...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Employee
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Position
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="employee in employees" :key="employee.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">{{ employee.first_name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ employee.first_name }} {{ employee.last_name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ employee.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.department?.name || 'No Department' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.position || 'Not specified' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    employee.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  {{ employee.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editEmployee(employee)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="toggleEmployeeStatus(employee)"
                  :class="[
                    'mr-3',
                    employee.status === 'active'
                      ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                      : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                  ]"
                >
                  {{ employee.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ editingEmployee ? 'Edit Employee' : 'Create New Employee' }}
        </h2>
        <form @submit.prevent="saveEmployee" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name *</label>
              <input
                v-model="formData.first_name"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :class="{ 'border-red-500': formErrors.first_name }"
              />
              <p v-if="formErrors.first_name" class="text-red-500 text-xs mt-1">{{ formErrors.first_name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name *</label>
              <input
                v-model="formData.last_name"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :class="{ 'border-red-500': formErrors.last_name }"
              />
              <p v-if="formErrors.last_name" class="text-red-500 text-xs mt-1">{{ formErrors.last_name }}</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
            <input
              v-model="formData.email"
              type="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              :class="{ 'border-red-500': formErrors.email }"
            />
            <p v-if="formErrors.email" class="text-red-500 text-xs mt-1">{{ formErrors.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              v-model="formData.phone"
              type="tel"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Position *</label>
              <input
                v-model="formData.position"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :class="{ 'border-red-500': formErrors.position }"
              />
              <p v-if="formErrors.position" class="text-red-500 text-xs mt-1">{{ formErrors.position }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Department *</label>
              <select
                v-model="formData.department_id"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :class="{ 'border-red-500': formErrors.department_id }"
              >
                <option value="">Select Department</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
              <p v-if="formErrors.department_id" class="text-red-500 text-xs mt-1">{{ formErrors.department_id }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Hire Date *</label>
              <input
                v-model="formData.hire_date"
                type="date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :class="{ 'border-red-500': formErrors.hire_date }"
              />
              <p v-if="formErrors.hire_date" class="text-red-500 text-xs mt-1">{{ formErrors.hire_date }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Salary *</label>
              <input
                v-model.number="formData.salary"
                type="number"
                min="0"
                step="0.01"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :class="{ 'border-red-500': formErrors.salary }"
              />
              <p v-if="formErrors.salary" class="text-red-500 text-xs mt-1">{{ formErrors.salary }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showCreateModal = false; editingEmployee = null; resetForm()"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Employee, CreateEmployeeData, UpdateEmployeeData } from '../../shared/types/employee'
import { useEmployees } from './composables/useEmployees'

const { employees, loading, error, fetchEmployees, createEmployee, updateEmployee, toggleEmployeeStatus: toggleStatus } = useEmployees()
const filters = ref({ search: '', department_id: undefined as number | undefined, is_active: undefined as boolean | undefined })
const showCreateModal = ref(false)
const editingEmployee = ref<Employee | null>(null)
const departments = ref<Array<{id: number, name: string}>>([])
const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: '',
  department_id: 0,
  hire_date: '',
  salary: 0
})
const formErrors = ref<Record<string, string>>({})

const applyFilters = () => {
  fetchEmployees(filters.value)
}

const editEmployee = (employee: Employee) => {
  editingEmployee.value = employee
  formData.value = {
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone || '',
    position: employee.position,
    department_id: employee.department_id,
    hire_date: employee.hire_date,
    salary: employee.salary
  }
  showCreateModal.value = true
}

const resetForm = () => {
  formData.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department_id: 0,
    hire_date: '',
    salary: 0
  }
  formErrors.value = {}
}

const validateForm = () => {
  formErrors.value = {}
  if (!formData.value.first_name) formErrors.value.first_name = 'First name is required'
  if (!formData.value.last_name) formErrors.value.last_name = 'Last name is required'
  if (!formData.value.email) formErrors.value.email = 'Email is required'
  if (!formData.value.position) formErrors.value.position = 'Position is required'
  if (!formData.value.department_id) formErrors.value.department_id = 'Department is required'
  if (!formData.value.hire_date) formErrors.value.hire_date = 'Hire date is required'
  if (!formData.value.salary || formData.value.salary <= 0) formErrors.value.salary = 'Valid salary is required'
  return Object.keys(formErrors.value).length === 0
}

const saveEmployee = async () => {
  if (!validateForm()) return
  try {
    if (editingEmployee.value) {
      await updateEmployee(editingEmployee.value.id, formData.value as UpdateEmployeeData)
    } else {
      await createEmployee(formData.value as CreateEmployeeData)
    }
    showCreateModal.value = false
    editingEmployee.value = null
    resetForm()
  } catch (err) {
    console.error('Failed to save employee:', err)
  }
}

const toggleEmployeeStatus = async (employee: Employee) => {
  try {
    await toggleStatus(employee.id)
  } catch (err) {
    console.error('Failed to toggle employee status:', err)
  }
}

onMounted(() => {
  fetchEmployees()
  // Load departments for filter dropdown
  departments.value = [
    { id: 1, name: 'Projects' },
    { id: 2, name: 'Accounts/Finance' },
    { id: 3, name: 'Production' },
    { id: 4, name: 'Design/Creatives' },
    { id: 5, name: 'Procurement' },
    { id: 6, name: 'Costing' },
    { id: 7, name: 'Logistics' },
    { id: 8, name: 'Stores' }
  ]
})
</script>
