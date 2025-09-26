<template>
  <div class="task-management p-6">
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Creative Tasks</h1>
          <p class="text-gray-600">Manage design, mockup, render, and material list tasks</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="showCreateTaskModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            disabled
            title="Modal component not yet implemented"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>New Task</span>
          </button>
          <button
            @click="loadProjects()"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Task Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Total Tasks</div>
        <div class="text-2xl font-bold text-gray-900">{{ taskStats.total || 0 }}</div>
      </div>
      <div class="bg-yellow-50 rounded-lg shadow p-4">
        <div class="text-sm text-yellow-700">Pending</div>
        <div class="text-2xl font-bold text-yellow-800">{{ taskStats.pending || 0 }}</div>
      </div>
      <div class="bg-blue-50 rounded-lg shadow p-4">
        <div class="text-sm text-blue-700">In Progress</div>
        <div class="text-2xl font-bold text-blue-800">{{ taskStats.in_progress || 0 }}</div>
      </div>
      <div class="bg-orange-50 rounded-lg shadow p-4">
        <div class="text-sm text-orange-700">Review</div>
        <div class="text-2xl font-bold text-orange-800">{{ taskStats.review || 0 }}</div>
      </div>
      <div class="bg-green-50 rounded-lg shadow p-4">
        <div class="text-sm text-green-700">Completed</div>
        <div class="text-2xl font-bold text-green-800">{{ taskStats.completed || 0 }}</div>
      </div>
      <div class="bg-purple-50 rounded-lg shadow p-4">
        <div class="text-sm text-purple-700">Designs</div>
        <div class="text-2xl font-bold text-purple-800">{{ taskStats.total || 0 }}</div>
      </div>
      <div class="bg-red-50 rounded-lg shadow p-4">
        <div class="text-sm text-red-700">Overdue</div>
        <div class="text-2xl font-bold text-red-800">{{ taskStats.overdue || 0 }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
          <select
            v-model="filters.task_type"
            @change="applyFilters"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="design">Design</option>
            <option value="mockup">Mockup</option>
            <option value="render">Render</option>
            <option value="material_list">Material List</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            v-model="filters.priority"
            @change="applyFilters"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          <select
            v-model="filters.assigned_to"
            @change="applyFilters"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Designers</option>
            <option v-for="designer in designers" :key="designer.id" :value="designer.id">
              {{ designer.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Projects List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                To Do
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completed
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading Row -->
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-8 text-center text-gray-600">
                <div class="flex flex-col items-center">
                  <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                  <p>Loading projects...</p>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="!loading && filteredProjects.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-600">
                No projects found
              </td>
            </tr>

            <!-- Projects Rows -->
            <tr v-for="project in filteredProjects" :key="project.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ project.title }}</div>
                <div class="text-sm text-gray-500">
                  {{ project.description?.substring(0, 50) || 'No description' }}
                  {{ project.description?.length > 50 ? '...' : '' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ project.client?.name || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(project.created_at) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(project.taskStatus || project.status)">
                  {{ formatTaskStatus(project.taskStatus || project.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button 
                  @click="viewProjectTasks(project)" 
                  class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors"
                >
                  To Do
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button 
                  @click="viewCompletedTasks(project)" 
                  class="px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium transition-colors"
                  :disabled="!hasCompletedTasks(project)"
                  :class="{ 'opacity-50 cursor-not-allowed': !hasCompletedTasks(project), 'hover:bg-green-200': hasCompletedTasks(project) }"
                  :title="hasCompletedTasks(project) ? 'View completed tasks' : 'No completed tasks'"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Materials Modal -->
    <!-- Materials Modal -->
    <MaterialsModal
      v-if="selectedProject"
      :enquiry="selectedProject"
      :is-visible="showMaterialsModal"
      @close="closeMaterialsModal"
    />
    
    <!-- Completed Tasks Modal -->
    <CompletedTasksModal
      v-if="selectedProject"
      :project="selectedProject"
      :is-visible="showCompletedTasksModal"
      :materials="getProjectMaterials(selectedProject)"
      :uploaded-files="getProjectFiles(selectedProject)"
      @close="closeCompletedTasksModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEnquiries } from '@/modules/clientService/composables/useEnquiries'
import type { Enquiry as BaseEnquiry } from '@/modules/clientService/types'
import MaterialsModal from '@/modules/projects/components/MaterialsModal.vue'
import CompletedTasksModal from '@/modules/creatives/components/CompletedTasksModal.vue'

// Extend the base Enquiry type to include materials and uploadedFiles
interface Enquiry extends BaseEnquiry {
  materials?: Array<{
    id: string
    name: string
    description?: string
    materials: Array<{
      id: string
      name: string
      quantity: number
      unit: string
      unitPrice: number
      totalPrice: number
      category: string
      createdAt?: string
      updatedAt?: string
    }>
    createdAt?: string
    updatedAt?: string
  }>
  uploadedFiles?: Array<{
    id?: string
    name: string
    size?: number
    type?: string
    url?: string
    uploadedAt?: string
    uploadedBy?: string
  }>
}

// Define the component's props and emits
const props = defineProps({})
const emit = defineEmits([])

// Router
const router = useRouter()

// Composables
const { fetchEnquiries, loading, enquiries } = useEnquiries()
const projects = ref<Array<Enquiry & { taskStatus?: string }>>([])

// Fetch projects with task status
const loadProjects = async () => {
  try {
    await fetchEnquiries()
    if (enquiries.value && Array.isArray(enquiries.value)) {
      // Map through projects and add task status
      projects.value = enquiries.value.map(project => ({
        ...project,
        taskStatus: determineTaskStatus(project) // Add task status to each project
      }))
      
      // Update task stats based on projects
      updateTaskStats(projects.value)
    }
  } catch (error) {
    console.error('Failed to load projects:', error)
  }
}

// Determine task status based on project tasks
const determineTaskStatus = (project: any): string => {
  // TODO: Replace with actual task status check when tasks API is available
  // For now, we'll use a mock implementation
  
  // If no tasks, return 'pending'
  if (!project.tasks || project.tasks.length === 0) {
    return 'pending';
  }
  
  // Check if any task is in progress
  const hasInProgress = project.tasks.some((task: any) => 
    task.status === 'in_progress' || task.status === 'draft'
  );
  
  // Check if all tasks are completed
  const allCompleted = project.tasks.every((task: any) => 
    task.status === 'completed' || task.status === 'approved'
  );
  
  if (allCompleted) return 'completed';
  if (hasInProgress) return 'in_progress';
  return 'pending';
}

// Update task stats based on projects
const updateTaskStats = (projectsList: Enquiry[]) => {
  taskStats.value = {
    total: projectsList.length,
    pending: projectsList.filter(p => p.status?.toLowerCase().includes('pending')).length,
    assigned: 0, // Not applicable for projects
    in_progress: projectsList.filter(p => p.status?.toLowerCase().includes('in_progress') || p.status?.toLowerCase().includes('in progress')).length,
    review: projectsList.filter(p => p.status?.toLowerCase().includes('review')).length,
    approved: projectsList.filter(p => p.status?.toLowerCase().includes('approved')).length,
    completed: projectsList.filter(p => p.status?.toLowerCase().includes('complete')).length,
    overdue: 0 // Not tracked in current data
  }
}

// State
const showCreateTaskModal = ref(false)
const showMaterialsModal = ref(false)
const showCompletedTasksModal = ref(false)
const selectedProject = ref<Enquiry | null>(null)
const filters = ref({
  status: '',
  task_type: '',
  priority: '',
  assigned_to: ''
})
const designers = ref([
  { id: 1, name: 'John Designer', email: 'john@company.com' },
  { id: 2, name: 'Sarah Creative', email: 'sarah@company.com' },
  { id: 3, name: 'Mike Artist', email: 'mike@company.com' }
])

// Computed
const filteredProjects = computed(() => {
  if (!projects.value || !Array.isArray(projects.value)) {
    console.log('No projects to filter or invalid projects data')
    return [];
  }
  
  console.log('Filtering projects with status:', filters.value.status) // Debug log
  let filtered = [...projects.value]

  if (filters.value.status) {
    filtered = filtered.filter((p: Enquiry) => p.status?.toLowerCase() === filters.value.status.toLowerCase())
  }
  
  console.log('Filtered projects:', filtered) // Debug log
  return filtered
})

const taskStats = ref({
  total: 0,
  pending: 0,
  assigned: 0,
  in_progress: 0,
  review: 0,
  approved: 0,
  completed: 0,
  overdue: 0
})

// Format task status for display
const formatTaskStatus = (status: string): string => {
  if (!status) return 'Pending';
  
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'draft': 'In Progress',
    'completed': 'Completed',
    'approved': 'Completed'
  };
  
  return statusMap[status.toLowerCase()] || 
    status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

// Get status badge class based on status
const getStatusBadgeClass = (status: string): string => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
  
  if (!status) return `${baseClasses} bg-yellow-100 text-yellow-800`
  
  const statusLower = status.toLowerCase()
  
  if (statusLower === 'completed' || statusLower === 'approved') {
    return `${baseClasses} bg-green-100 text-green-800`
  }
  if (statusLower === 'in_progress' || statusLower === 'draft') {
    return `${baseClasses} bg-blue-100 text-blue-800`
  }
  if (statusLower === 'pending') {
    return `${baseClasses} bg-yellow-100 text-yellow-800`
  }
  if (statusLower === 'review') {
    return `${baseClasses} bg-purple-100 text-purple-800`
  }
  if (statusLower === 'cancelled') {
    return `${baseClasses} bg-red-100 text-red-800`
  }
  
  // Default to pending style for unknown statuses
  return `${baseClasses} bg-yellow-100 text-yellow-800`
}

// Check if project has completed tasks
const hasCompletedTasks = (project: Enquiry): boolean => {
  // For testing purposes, always return true to enable the button
  // In production, you can uncomment and adjust the logic below
  return true;
  
  /* Actual implementation for production:
  // Check if project has tasks and at least one is completed or approved
  if (project.tasks && Array.isArray(project.tasks)) {
    return project.tasks.some((task: any) => 
      task.status === 'completed' || task.status === 'approved' || 
      task.status?.toLowerCase().includes('complete') || 
      task.status?.toLowerCase().includes('approve')
    )
  }
  // If no tasks array, check other possible locations
  if (project.status) {
    const status = String(project.status).toLowerCase();
    return status.includes('complete') || status.includes('approve');
  }
  return false;
  */
}

// Open materials modal for project
const viewProjectTasks = (project: Enquiry): void => {
  selectedProject.value = project
  showMaterialsModal.value = true
}

// View completed tasks for project
const viewCompletedTasks = (project: Enquiry): void => {
  if (!hasCompletedTasks(project)) return
  selectedProject.value = project
  showCompletedTasksModal.value = true
}

// Close materials modal
const closeMaterialsModal = (): void => {
  showMaterialsModal.value = false
  selectedProject.value = null
}

// Close completed tasks modal
const closeCompletedTasksModal = (): void => {
  showCompletedTasksModal.value = false
  selectedProject.value = null
}

// Get project materials or return mock data
const getProjectMaterials = (project: Enquiry): any[] => {
  if (project.materials && project.materials.length > 0) {
    return project.materials;
  }
  
  // Return mock materials data for testing
  return [
    {
      id: 'mock-1',
      name: 'Sample Materials',
      description: 'Sample materials for testing',
      materials: [
        {
          id: 'mock-mat-1',
          name: 'Sample Material 1',
          quantity: 5,
          unit: 'pcs',
          unitPrice: 1000,
          totalPrice: 5000,
          category: 'production',
          description: 'Sample material for testing'
        },
        {
          id: 'mock-mat-2',
          name: 'Sample Material 2',
          quantity: 10,
          unit: 'm',
          unitPrice: 500,
          totalPrice: 5000,
          category: 'production',
          description: 'Another sample material'
        }
      ]
    }
  ];
}

// Get project files or return empty array
const getProjectFiles = (project: Enquiry): any[] => {
  if (project.uploadedFiles && project.uploadedFiles.length > 0) {
    return project.uploadedFiles;
  }
  
  // Return mock files for testing
  return [
    {
      id: 'mock-file-1',
      name: 'sample-document.pdf',
      size: 1024 * 1024 * 2, // 2MB
      type: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'System'
    },
    {
      id: 'mock-file-2',
      name: 'sample-image.jpg',
      size: 1024 * 1024 * 1.5, // 1.5MB
      type: 'image/jpeg',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'System'
    }
  ];
}

// Format date for display
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Apply filters
const applyFilters = (): void => {
  // Filters are applied automatically through computed property
}

// Load data on mount
onMounted(async () => {
  console.log('Component mounted, loading projects...') // Debug log
  await loadProjects()
  console.log('Projects loaded after mount:', projects.value) // Debug log
})
</script>
