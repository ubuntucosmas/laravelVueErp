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
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Projects Department</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Projects Department</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Project coordination, timeline management, and client communication</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectStats.active }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectStats.completed }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">On Track</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectStats.onTrack }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">At Risk</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectStats.atRisk }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/projects/enquiries"
          class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="ml-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Workflow Management</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">View detailed project workflows</p>
          </div>
        </router-link>

        <router-link
          to="/projects/projects"
          class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <div class="ml-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Active Projects</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">Monitor project progress</p>
          </div>
        </router-link>

        <button
          @click="createNewProject"
          class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <div class="ml-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">New Project</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">Start project from enquiry</p>
          </div>
        </button>
      </div>
    </div>
    <!-- Active Projects with Task Relationships -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Active Projects & Tasks</h3>
          <router-link to="/projects/projects" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            View All Projects →
          </router-link>
        </div>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="project in activeProjects" :key="project.id" class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3 mb-3">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ project.name }}
                </h4>
                <span :class="getStatusBadgeClass(project.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ project.status.replace('_', ' ') }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  <span class="font-medium">Client:</span> {{ project.client_name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  <span class="font-medium">Progress:</span> {{ project.progress }}%
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  <span class="font-medium">Budget:</span> KES {{ project.budget.toLocaleString() }}
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-3">
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: project.progress + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Related Tasks -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <h5 class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Active Tasks by Department:</h5>
                <div class="flex flex-wrap gap-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    🎨 Creatives: 2 active
                  </span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    📦 Procurement: 1 active
                  </span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    📍 Surveys: 1 active
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2 ml-4">
              <router-link
                :to="`/projects/enquiries/${project.id}`"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              >
                View Detailed Workflow
              </router-link>
            </div>
          </div>
        </div>

        <div v-if="activeProjects.length === 0" class="p-6 text-center">
          <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">No active projects</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Active projects will appear here with their related tasks</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity Logs -->
    <DetailedActivityLogs :logs="activityLogs" />

    <!-- Project Guidelines -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Projects Department Guidelines</h3>
          <div class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p>• <strong>Project Initiation:</strong> Convert approved quotations into structured projects with phases</p>
            <p>• <strong>Timeline Management:</strong> Set realistic deadlines and monitor progress against milestones</p>
            <p>• <strong>Resource Allocation:</strong> Assign team members and coordinate cross-department activities</p>
            <p>• <strong>Client Communication:</strong> Maintain regular updates and manage expectations</p>
            <p>• <strong>Risk Management:</strong> Identify potential issues and implement mitigation strategies</p>
            <p>• <strong>Quality Assurance:</strong> Ensure all deliverables meet client requirements and standards</p>
          </div>
        </div>
            <!-- Workflow Guide -->
            <WorkflowGuide />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WorkflowGuide from '../components/WorkflowGuide.vue'
import DetailedActivityLogs from '../components/DetailedActivityLogs.vue'
import type { ActivityLog } from '../types'

// Mock data - in real app, this would come from API
const projectStats = ref({
  active: 8,
  completed: 15,
  onTrack: 6,
  atRisk: 2
})

const activeProjects = ref([
  {
    id: 1,
    name: 'Corporate Event Booth Setup',
    client_name: 'ABC Corporation',
    status: 'in_progress',
    progress: 65,
    deadline: '2025-10-15',
    budget: 450000
  },
  {
    id: 2,
    name: 'Wedding Exhibition Display',
    client_name: 'XYZ Events',
    status: 'in_progress',
    progress: 40,
    deadline: '2025-10-20',
    budget: 280000
  },
  {
    id: 3,
    name: 'Product Launch Event',
    client_name: 'Tech Innovations Ltd',
    status: 'planning',
    progress: 15,
    deadline: '2025-11-05',
    budget: 650000
  }
])

const activityLogs = ref<ActivityLog[]>([
  {
    id: 1,
    action: 'handover',
    user_id: 1,
    user_name: 'John Smith',
    from_department: 'projects',
    to_department: 'creatives',
    assigned_by_user_id: 2,
    assigned_by_name: 'Project Manager',
    task_id: 1,
    task_name: 'Design Concept Development',
    notes: 'Handover completed successfully for creative design phase',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 2,
    action: 'assigned',
    user_id: 3,
    user_name: 'Sarah Johnson',
    from_department: 'projects',
    to_department: 'finance',
    assigned_by_user_id: 2,
    assigned_by_name: 'Project Manager',
    task_id: 2,
    task_name: 'Budget Preparation',
    notes: 'Assigned budget preparation task to finance department',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
  },
  {
    id: 3,
    action: 'completed',
    user_id: 4,
    user_name: 'Mike Davis',
    task_id: 3,
    task_name: 'Site Survey Report',
    notes: 'Site survey completed and report submitted',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
  },
  {
    id: 4,
    action: 'started',
    user_id: 5,
    user_name: 'Emily Chen',
    task_id: 4,
    task_name: 'Material Procurement',
    notes: 'Started procurement process for event materials',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
  },
  {
    id: 5,
    action: 'handover',
    user_id: 6,
    user_name: 'David Wilson',
    from_department: 'creatives',
    to_department: 'production',
    assigned_by_user_id: 2,
    assigned_by_name: 'Project Manager',
    task_id: 5,
    task_name: 'Final Design Approval',
    notes: 'Design approved and handed over to production team',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
  }
])

const router = useRouter()

const getStatusBadgeClass = (status: string) => {
  const classes = {
    planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    on_hold: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status as keyof typeof classes] || classes.planning
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const createNewProject = () => {
  router.push('/projects/enquiries')
}

onMounted(() => {
  // Load real data from API
  console.log('Projects Department Dashboard mounted')
})
</script>
