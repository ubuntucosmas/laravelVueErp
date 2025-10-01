<!-- src/modules/logistics/views/ProjectsIndex.vue -->
<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 018 0v2M5 10a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z"/>
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">Total Projects</div>
          <div class="text-2xl font-bold text-blue-600">{{ totalProjects }}</div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">Pending</div>
          <div class="text-2xl font-bold text-yellow-600">{{ pendingProjects }}</div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">In Transit</div>
          <div class="text-2xl font-bold text-green-600">{{ inTransitProjects }}</div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-300">Delivered</div>
          <div class="text-2xl font-bold text-purple-600">{{ deliveredProjects }}</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
      <div class="flex-1 flex gap-4">
        <select v-model="filters.status" class="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="delayed">Delayed</option>
        </select>
        <select v-model="filters.priority" class="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button @click="applyFilters" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Apply</button>
        <button v-if="filters.status || filters.priority" @click="resetFilters" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Reset</button>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Projects Requiring Logistics</h1>
        <p class="text-sm text-gray-600">Assign vehicles and drivers to projects</p>
      </div>
    </div>

    <!-- Projects Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading projects...</p>
      </div>
      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>
      <div v-else-if="projects.length === 0" class="p-8 text-center text-gray-500">
        No projects found requiring logistics assignment.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Items</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Logistics Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vehicle</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Driver</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="project in paginatedProjects" :key="project.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ project.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ project.deliveryAddress }}</div>
                <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ new Date().toLocaleDateString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ project.client }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ project.items.length }} items</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Total: {{ project.items.reduce((sum: number, item: any) => sum + item.weight, 0) }}kg
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="statusClasses(project.logistics.status)">
                  {{ formatStatus(project.logistics.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ project.logistics.assignedVehicle?.registration || 'Not assigned' }}
                <div v-if="project.logistics.assignedVehicle" class="text-xs text-gray-500">
                  {{ project.logistics.assignedVehicle.type }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ project.logistics.assignedDriver?.name || 'Not assigned' }}
                <div v-if="project.logistics.assignedDriver" class="text-xs text-gray-500">
                  {{ project.logistics.assignedDriver.license }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openAssignModal(project, 'vehicle')"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                  :class="{ 'opacity-50 cursor-not-allowed': !availableVehicles }"
                  :disabled="!availableVehicles"
                >
                  {{ project.logistics.assignedVehicle ? 'Change' : 'Assign' }} Vehicle
                </button>
                <button
                  @click="openAssignModal(project, 'driver')"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-2"
                  :class="{ 'opacity-50 cursor-not-allowed': !availableDrivers }"
                  :disabled="!availableDrivers"
                >
                  {{ project.logistics.assignedDriver ? 'Change' : 'Assign' }} Driver
                </button>
                <button
                  v-if="project.logistics.status === 'assigned'"
                  @click="updateProjectStatus(project, 'in_transit')"
                  class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Start Transit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-between items-center mt-4">
      <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white disabled:opacity-50">Previous</button>
      <span class="text-sm text-gray-600 dark:text-gray-300">Page {{ page }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages" class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white disabled:opacity-50">Next</button>
    </div>

    <!-- Assignment Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ assignType === 'vehicle' ? 'Assign Vehicle' : 'Assign Driver' }} to {{ selectedProject?.name }}
        </h2>
        <div class="space-y-4">
          <div v-if="assignType === 'vehicle'" class="max-h-60 overflow-y-auto">
            <div v-for="vehicle in availableVehiclesList" :key="vehicle.id"
                 @click="selectVehicle(vehicle)"
                 :class="[
                   'p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700',
                   selectedVehicle?.id === vehicle.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-600'
                 ]">
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-medium">{{ vehicle.registration }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ vehicle.type }} • {{ vehicle.capacity }}kg</div>
                  <div class="text-xs text-gray-500">{{ vehicle.currentLocation }}</div>
                </div>
                <div v-if="vehicle.model" class="text-sm text-gray-500">{{ vehicle.year }} {{ vehicle.model }}</div>
              </div>
            </div>
          </div>

          <div v-if="assignType === 'driver'" class="max-h-60 overflow-y-auto">
            <div v-for="driver in availableDriversList" :key="driver.id"
                 @click="selectDriver(driver)"
                 :class="[
                   'p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700',
                   selectedDriver?.id === driver.id ? 'border-green-500 bg-green-50 dark:bg-green-900' : 'border-gray-200 dark:border-gray-600'
                 ]">
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-medium">{{ driver.name }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ driver.license }}</div>
                  <div class="text-xs text-gray-500">{{ driver.contact }}</div>
                </div>
                <div v-if="driver.email" class="text-sm text-gray-500">{{ driver.email }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button @click="closeAssignModal" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button @click="confirmAssignment" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLogistics } from '../composables/useLogistics'
import type { Project, Vehicle, Driver } from '../types/logistics'

const {
  projects,
  vehicles,
  drivers,
  loading,
  error,
  totalProjects,
  pendingProjects,
  inTransitProjects,
  deliveredProjects,
  availableVehicles,
  availableDrivers,
  assignVehicle,
  assignDriver,
  updateProjectStatus,
  fetchProjects
} = useLogistics()

// UI state
const showAssignModal = ref(false)
const selectedProject = ref<Project | null>(null)
const assignType = ref<'vehicle' | 'driver'>('vehicle')
const selectedVehicle = ref<Vehicle | null>(null)
const selectedDriver = ref<Driver | null>(null)

// Filters
const filters = ref({ status: '', priority: '' })
const filteredProjects = computed(() => {
  return projects.value.filter((p: Project) => {
    const matchStatus = !filters.value.status || p.logistics.status === filters.value.status
    // Note: priority field doesn't exist in current Project interface, but keeping for future use
    return matchStatus
  })
})

const applyFilters = () => {}
const resetFilters = () => { filters.value = { status: '', priority: '' } }

// Pagination
const page = ref(1)
const perPage = 10
const totalPages = computed(() => Math.ceil(filteredProjects.value.length / perPage))
const paginatedProjects = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredProjects.value.slice(start, start + perPage)
})
const nextPage = () => { if (page.value < totalPages.value) page.value++ }
const prevPage = () => { if (page.value > 1) page.value-- }

// Available resources for assignment
const availableVehiclesList = computed(() => vehicles.value.filter((v: Vehicle) => v.status === 'available'))
const availableDriversList = computed(() => drivers.value.filter((d: Driver) => d.status === 'available'))

// Status formatting
const formatStatus = (status: string): string => {
  return status.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const statusClasses = (status: string): string => {
  const base = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
  const statusMap: Record<string, string> = {
    'pending': `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`,
    'assigned': `${base} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`,
    'in_transit': `${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`,
    'delivered': `${base} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`,
    'delayed': `${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`
  }
  return statusMap[status] || base
}

// Modal handlers
const openAssignModal = (project: Project, type: 'vehicle' | 'driver') => {
  selectedProject.value = project
  assignType.value = type
  selectedVehicle.value = null
  selectedDriver.value = null
  showAssignModal.value = true
}

const closeAssignModal = () => {
  showAssignModal.value = false
  selectedProject.value = null
  selectedVehicle.value = null
  selectedDriver.value = null
}

const selectVehicle = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle
}

const selectDriver = (driver: Driver) => {
  selectedDriver.value = driver
}

const confirmAssignment = () => {
  if (!selectedProject.value) return

  if (assignType.value === 'vehicle' && selectedVehicle.value) {
    assignVehicle(selectedProject.value.id, selectedVehicle.value.id)
  } else if (assignType.value === 'driver' && selectedDriver.value) {
    assignDriver(selectedProject.value.id, selectedDriver.value.id)
  }

  closeAssignModal()
}

onMounted(() => {
  fetchProjects()
})
</script>
