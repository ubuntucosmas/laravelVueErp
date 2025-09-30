<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <div class="text-red-600 dark:text-red-400 mb-2">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-red-800 dark:text-red-200">Error loading project</h3>
      <p class="mt-2 text-sm text-red-700 dark:text-red-300">{{ error }}</p>
      <button 
        @click="fetchProject(route.params.id as string)" 
        class="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Retry
      </button>
    </div>
    
    <!-- List View (when no project ID is provided) -->
    <div v-else-if="!route.params.id" class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          All Projects
        </h1>
      </div>
      
      <!-- Projects Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="project in projects" :key="project.id" 
             class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ project.name }}</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ project.description || 'No description available' }}</p>
            <div class="mt-4">
              <router-link 
                :to="{ name: 'projects-projectoverview', params: { id: project.id } }"
                class="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View Project →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Detail View (when project ID is provided) -->
    <div v-else-if="project" class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {{ project.name || 'Project Overview' }}
        </h1>
        <div class="flex space-x-2">
          <button class="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export
            </span>
          </button>
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            New Task
          </button>
        </div>
      </div>

      <!-- Project Info Card with integrated progress -->
      <ProjectInfoCard v-if="project" :project="project" :progress="overallProgress" class="mb-8" />
      
      <!-- Phases Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex overflow-x-auto">
            <router-link 
              v-for="(phase, index) in phases" 
              :key="phase.id"
              :to="{ 
                name: getPhaseRouteName(phase.id), 
                params: { id: route.params.id }
              }"
              class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
              :class="{
                'border-indigo-500 text-indigo-600 dark:text-indigo-400': isPhaseActive(phase.id),
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200': !isPhaseActive(phase.id)
              }"
            >
              <div class="flex items-center">
                <span 
                  class="w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-semibold"
                  :class="{
                    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200': isPhaseActive(phase.id),
                    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400': !isPhaseActive(phase.id)
                  }"
                >
                  {{ index + 1 }}
                </span>
                {{ phase.name }}
                <span v-if="phase.status === 'completed'" class="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
                <span v-else-if="phase.status === 'in-progress'" class="ml-2 w-2 h-2 rounded-full bg-yellow-500"></span>
                <span v-else class="ml-2 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              </div>
            </router-link>
          </nav>
        </div>

        <!-- Nested Route View -->
        <div class="p-6">
          <router-view 
            v-if="!loading && !error"
            :project="project" 
            :phase="getCurrentPhase()"
            @update:phase="handlePhaseUpdate"
          ></router-view>
          <div v-else class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p class="mt-4 text-gray-500 dark:text-gray-400">Loading phase content...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter, type RouteLocationNormalizedLoaded } from 'vue-router';
import ProjectInfoCard from './components/ProjectInfoCard.vue';
import StatCard from './components/StatCard.vue';

// Types
interface ProjectPhase {
  id: string;
  name: string;
  status: string;
  [key: string]: any;
}

interface Project {
  id: string | number;
  name: string;
  description?: string;
  status: string;
  phases?: ProjectPhase[];
  [key: string]: any;
}

// Router setup
const route: RouteLocationNormalizedLoaded = useRoute();
const router = useRouter();

// State
const project = ref<Project | null>(null);
const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const phases = ref<ProjectPhase[]>([]);
const overallProgress = ref(0);

// Default phases for when no project phases are available
const defaultPhases = [
  { id: 'summary', name: 'Summary', status: 'pending' },
  { id: 'planning', name: 'Planning', status: 'pending' },
  { id: 'procurement', name: 'Procurement', status: 'pending' },
  { id: 'logistics', name: 'Logistics', status: 'pending' },
  { id: 'production', name: 'Production', status: 'pending' },
  { id: 'setup', name: 'Setup', status: 'pending' },
  { id: 'handover', name: 'Handover', status: 'pending' },
  { id: 'setdown', name: 'Set Down', status: 'pending' },
  { id: 'report', name: 'Final Report', status: 'pending' }
];

// Helper to get route name for a phase with TypeScript types
function getPhaseRouteName(phaseId: string): string {
  // Special case for summary route
  if (phaseId === 'summary') return 'project-summary';
  
  // Handle different phase ID formats to match route names
  const routeMap: Record<string, string> = {
    'planning': 'project-planning',
    'procurement': 'project-procurement',
    'logistics': 'project-logistics',
    'production': 'project-production',
    'setup': 'project-setup',
    'handover': 'project-handover',
    'setdown': 'project-setdown',
    'report': 'project-report'
  };
  
  return routeMap[phaseId] || `project-${phaseId}`;
}

// Helper to check if a phase is active
function isPhaseActive(phaseId: string): boolean {
  const currentRoute = route.name?.toString() || '';
  const phaseRouteName = getPhaseRouteName(phaseId);
  return currentRoute === phaseRouteName || 
         (phaseId === 'summary' && currentRoute === 'project-summary');
}

// Helper to get the current phase based on route
function getCurrentPhase(): ProjectPhase | null {
  if (!route.name) return null;
  
  // Handle both the default route and explicit summary route
  if (route.name === 'project-summary' || route.name === 'projects-projectoverview') {
    return phases.value.find(p => p.id === 'summary') || phases.value[0];
  }
  
  // Extract phase ID from route name
  const routeName = route.name.toString();
  const phaseId = routeName.replace('project-', '');
  
  // Find the phase by ID or return the first phase as fallback
  return phases.value.find(p => p.id === phaseId) || phases.value[0];
}

// Handle phase updates from child components
function handlePhaseUpdate(updatedPhase: ProjectPhase) {
  if (!project.value) return;
  
  const updatedPhases = [...(project.value.phases || [])];
  const phaseIndex = updatedPhases.findIndex(p => p.id === updatedPhase.id);
  
  if (phaseIndex !== -1) {
    updatedPhases[phaseIndex] = { ...updatedPhases[phaseIndex], ...updatedPhase };
  } else {
    updatedPhases.push(updatedPhase);
  }
  
  project.value = {
    ...project.value,
    phases: updatedPhases
  };
}

// Handle tab navigation with error handling
function handleTabClick(phaseId: string) {
  try {
    const routeName = getPhaseRouteName(phaseId);
    router.push({ 
      name: routeName, 
      params: { id: route.params.id } 
    });
  } catch (error) {
    console.error('Error navigating to phase:', error);
  }
}

// Expose necessary properties and methods to template
defineExpose({
  route,
  project: project as any, // Cast to any to handle null case
  phases,
  overallProgress,
  getPhaseRouteName,
  isPhaseActive,
  getCurrentPhase,
  handlePhaseUpdate,
  handleTabClick
});

// Fetch project data based on the ID from the route
const fetchProject = async (id: string) => {
  try {
    loading.value = true
    error.value = null
    
    // TODO: Replace with actual API call to fetch project by ID
    // For now, we'll use a timeout to simulate an API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Dummy data - in a real app, this would come from an API
    const dummyProjects = {
      '1': {
        id: '1',
        name: 'Modern Office Renovation',
        client: 'Acme Corp',
        startDate: '2023-10-15',
        endDate: '2024-03-20',
        status: 'in-progress',
        description: 'Complete renovation of the 5th floor office space including new workstations, meeting rooms, and lounge areas.',
        budget: 250000,
        spent: 125000,
        progress: 65,
        manager: {
          id: 'user-001',
          name: 'Alex Johnson',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        team: [
          { id: 'user-002', name: 'Sarah Williams', role: 'Design Lead' },
          { id: 'user-003', name: 'Mike Chen', role: 'Project Coordinator' },
          { id: 'user-004', name: 'Emma Davis', role: 'Procurement' },
          { id: 'user-005', name: 'David Kim', role: 'Site Supervisor' }
        ],
        phases: [
          { id: 'summary', name: 'Enquiry Phase', status: 'completed' },
          { id: 'procurement', name: 'Procurement', status: 'in-progress' },
          { id: 'production', name: 'Production', status: 'pending' },
          { id: 'logistics', name: 'Logistics', status: 'pending' },
          { id: 'setup', name: 'Set-up', status: 'pending' },
          { id: 'handover', name: 'Client Handover', status: 'pending' },
          { id: 'setdown', name: 'Setdown', status: 'pending' },
          { id: 'report', name: 'Final Report', status: 'pending' }
        ]
      },
      // Add more dummy projects as needed
    }
    
    const projectData = dummyProjects[id as keyof typeof dummyProjects]
    
    if (!projectData) {
      throw new Error('Project not found')
    }
    
    project.value = projectData
  } catch (err) {
    console.error('Error fetching project:', err)
    error.value = 'Failed to load project. Please try again.'
  } finally {
    loading.value = false
  }
}

// Navigate to the first phase if no phase is active
const navigateToFirstPhase = () => {
  const currentRouteName = route.name?.toString()
  const isPhaseRoute = currentRouteName && 
    (currentRouteName.startsWith('project-') || 
     currentRouteName === 'project-summary')
  
  if (phases.value.length > 0 && !isPhaseRoute) {
    const firstPhase = phases.value[0]
    if (firstPhase) {
      const routeName = getPhaseRouteName(firstPhase.id)
      if (routeName) {
        // Ensure we have a valid route name before navigating
        router.push({ 
          name: routeName as any, // Cast to any to satisfy TypeScript
          params: { id: route.params.id } 
        }).catch(err => {
          console.error('Navigation error:', err)
        })
      }
    }
  }
}

// Watch for changes to the route params
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchProject(newId as string)
  }
}, { immediate: true })

// Watch for project changes to handle first phase navigation
watch(() => project.value, (newProject) => {
  if (newProject) {
    nextTick(() => {
      navigateToFirstPhase()
    })
  }
})

// Computed properties for stats
const stats = computed(() => ({
  tasks: {
    completed: project.value?.tasks?.completed || 0,
    total: project.value?.tasks?.total || 1, // Avoid division by zero
    overdue: project.value?.tasks?.overdue || 0
  },
  budget: {
    used: project.value?.spent || 0,
    total: project.value?.budget || 1, // Avoid division by zero
    remaining: Math.max(0, (project.value?.budget || 0) - (project.value?.spent || 0))
  },
  daysElapsed: project.value?.startDate ? 
    Math.max(0, Math.ceil((new Date().getTime() - new Date(project.value.startDate).getTime()) / (1000 * 60 * 60 * 24))) : 0,
  totalDays: (project.value?.startDate && project.value?.endDate) ?
    Math.max(1, Math.ceil((new Date(project.value.endDate).getTime() - new Date(project.value.startDate).getTime()) / (1000 * 60 * 60 * 24))) : 90,
  team: {
    members: project.value?.team?.length || 0,
    active: project.value?.team?.filter((member: any) => member.status === 'active').length || 0
  }
}))

// Function to update phases based on project data
const updatePhases = () => {
  if (project.value?.phases?.length) {
    phases.value = project.value.phases.map((phase: any) => ({
      id: phase.id,
      name: phase.name,
      status: phase.status || 'pending',
      startDate: phase.startDate || '',
      endDate: phase.endDate || '',
      progress: phase.progress || 0
    }));
  } else {
    // Use default phases if none provided in the project
    phases.value = defaultPhases.map(phase => ({
      ...phase,
      startDate: phase.id === 'setdown' ? project.value?.endDate || '' : ''
    }));
  }
};

// Watch for changes to project data and update phases
watch(() => project.value, () => {
  updatePhases();
  
  // Update overall progress when phases change
  if (phases.value.length) {
    const total = phases.value.reduce((sum: number, phase: ProjectPhase) => sum + (phase.progress || 0), 0);
    overallProgress.value = Math.round(total / phases.value.length);
  } else {
    overallProgress.value = 0;
  }
}, { immediate: true });

// Fetch projects for the list view
const fetchProjects = async () => {
  try {
    loading.value = true;
    error.value = null;
    // Simulate API call to fetch projects
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock projects data
    projects.value = [
      {
        id: '1',
        name: 'Modern Office Renovation',
        description: 'Complete renovation of office space',
        status: 'in-progress',
        progress: 65,
        startDate: '2023-10-15',
        endDate: '2024-03-20',
        budget: 250000,
        spent: 162500
      },
      {
        id: '2',
        name: 'Retail Store Fit-out',
        description: 'New retail store interior design and build',
        status: 'planning',
        progress: 15,
        startDate: '2024-01-10',
        endDate: '2024-05-15',
        budget: 180000,
        spent: 27000
      }
    ];
  } catch (err) {
    console.error('Error fetching projects:', err);
    error.value = 'Failed to load projects. Please try again later.';
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  if (route.params.id) {       
    await fetchProject(route.params.id as string);            
    // Navigate to the first phase if we're at the root project URL
    if (route.name === 'projects-projectoverview' || route.name === 'project-summary') {
      nextTick(() => {
        if (phases.value.length > 0) {
          const firstPhase = phases.value[0];
          router.push({ 
            name: getPhaseRouteName(firstPhase.id), 
            params: { id: route.params.id } 
          });
        }
      });
    }
  } else {
    fetchProjects();
  }
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
