import { ref, computed } from 'vue'
import type { Project, Vehicle, Driver, LogisticsStatus, Shipment } from '../types/logistics'
import { mockProjectsNeedingLogistics, mockVehicles, mockDrivers } from '../mock/logisticsMockData'

// Mock shipments data for now
const mockShipments: Shipment[] = [
  {
    id: 1,
    trackingNumber: 'SHIP123456',
    projectName: 'Office Relocation',
    site: 'Acme Corp HQ',
    loadingTime: '2023-06-10T08:00:00Z',
    departureTime: '2023-06-10T09:30:00Z',
    vehicleAllocated: 'ABC-123',
    poIncharge: 'John Smith',
    remarks: 'Urgent delivery requested',
    status: 'in_transit',
    origin: 'Nairobi Warehouse',
    destination: 'Mombasa Showroom',
    estimatedDelivery: '2023-06-15',
    carrier: 'Speed Logistics',
    items: [
      { id: 1, name: 'Office Chairs', quantity: 10, weight: 150 }
    ],
    createdAt: '2023-06-10T09:00:00Z',
    updatedAt: '2023-06-11T14:30:00Z'
  },
  {
    id: 2,
    trackingNumber: 'SHIP789012',
    projectName: 'Conference Setup',
    site: 'Kisumu Branch',
    loadingTime: '2023-06-05T10:00:00Z',
    departureTime: '2023-06-05T11:00:00Z',
    vehicleAllocated: 'DEF-456',
    poIncharge: 'Mary Johnson',
    status: 'delivered',
    origin: 'Nakuru Warehouse',
    destination: 'Kisumu Branch',
    estimatedDelivery: '2023-06-12',
    actualDelivery: '2023-06-12',
    carrier: 'Swift Movers',
    items: [
      { id: 2, name: 'Conference Tables', quantity: 5, weight: 250 }
    ],
    createdAt: '2023-06-05T11:20:00Z',
    updatedAt: '2023-06-12T16:45:00Z'
  }
]

export function useLogistics() {
  const projects = ref<Project[]>([...mockProjectsNeedingLogistics])
  const vehicles = ref<Vehicle[]>([...mockVehicles])
  const drivers = ref<Driver[]>([...mockDrivers])
  const shipments = ref<Shipment[]>([...mockShipments])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Stats computed properties
  const totalProjects = computed(() => projects.value.length)
  const pendingProjects = computed(() => projects.value.filter((p: Project) => p.logistics.status === 'pending').length)
  const assignedProjects = computed(() => projects.value.filter((p: Project) => p.logistics.status === 'assigned').length)
  const inTransitProjects = computed(() => projects.value.filter((p: Project) => p.logistics.status === 'in_transit').length)
  const deliveredProjects = computed(() => projects.value.filter((p: Project) => p.logistics.status === 'delivered').length)

  const availableVehicles = computed(() => vehicles.value.filter((v: Vehicle) => v.status === 'available').length)
  const availableDrivers = computed(() => drivers.value.filter((d: Driver) => d.status === 'available').length)

  // Filter projects by status
  const getProjectsByStatus = (status: LogisticsStatus) => {
    return projects.value.filter((p: Project) => p.logistics.status === status)
  }

  // Assign vehicle to project
  const assignVehicle = (projectId: number, vehicleId: number) => {
    const project = projects.value.find((p: Project) => p.id === projectId)
    const vehicle = vehicles.value.find((v: Vehicle) => v.id === vehicleId)

    if (project && vehicle) {
      project.logistics.assignedVehicle = vehicle
      vehicle.status = 'assigned'

      // Update project status
      if (project.logistics.assignedDriver && project.logistics.assignedVehicle) {
        project.logistics.status = 'assigned'
      }
    }
  }

  // Assign driver to project
  const assignDriver = (projectId: number, driverId: number) => {
    const project = projects.value.find((p: Project) => p.id === projectId)
    const driver = drivers.value.find((d: Driver) => d.id === driverId)

    if (project && driver) {
      project.logistics.assignedDriver = driver
      driver.status = 'assigned'

      // Update project status
      if (project.logistics.assignedDriver && project.logistics.assignedVehicle) {
        project.logistics.status = 'assigned'
      }
    }
  }

  // Update project logistics status
  const updateProjectStatus = (projectId: number, status: LogisticsStatus) => {
    const project = projects.value.find((p: Project) => p.id === projectId)
    if (project) {
      project.logistics.status = status

      // Update estimated delivery when status changes
      if (status === 'in_transit') {
        project.logistics.estimatedDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      } else if (status === 'delivered') {
        project.logistics.actualDelivery = new Date().toISOString().split('T')[0]
      }
    }
  }

  // Unassign vehicle from project
  const unassignVehicle = (projectId: number) => {
    const project = projects.value.find((p: Project) => p.id === projectId)
    if (project && project.logistics.assignedVehicle) {
      project.logistics.assignedVehicle.status = 'available'
      project.logistics.assignedVehicle = null

      // Update project status
      if (!project.logistics.assignedDriver) {
        project.logistics.status = 'pending'
      } else {
        project.logistics.status = 'assigned'
      }
    }
  }

  // Unassign driver from project
  const unassignDriver = (projectId: number) => {
    const project = projects.value.find((p: Project) => p.id === projectId)
    if (project && project.logistics.assignedDriver) {
      project.logistics.assignedDriver.status = 'available'
      project.logistics.assignedDriver = null

      // Update project status
      if (!project.logistics.assignedVehicle) {
        project.logistics.status = 'pending'
      } else {
        project.logistics.status = 'assigned'
      }
    }
  }

  // Simulate API call to fetch projects
  const fetchProjects = async () => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // In a real app, this would be an API call
      projects.value = [...mockProjectsNeedingLogistics]
    } catch (err) {
      error.value = 'Failed to fetch projects'
      console.error('Error fetching projects:', err)
    } finally {
      loading.value = false
    }
  }

  // Simulate API call to fetch shipments
  const fetchShipments = async () => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // In a real app, this would be an API call
      shipments.value = [...mockShipments]
    } catch (err) {
      error.value = 'Failed to fetch shipments'
      console.error('Error fetching shipments:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // Data
    projects,
    vehicles,
    drivers,
    shipments,
    loading,
    error,

    // Computed
    totalProjects,
    pendingProjects,
    assignedProjects,
    inTransitProjects,
    deliveredProjects,
    availableVehicles,
    availableDrivers,

    // Methods
    getProjectsByStatus,
    assignVehicle,
    assignDriver,
    updateProjectStatus,
    unassignVehicle,
    unassignDriver,
    fetchProjects,
    fetchShipments
  }
}