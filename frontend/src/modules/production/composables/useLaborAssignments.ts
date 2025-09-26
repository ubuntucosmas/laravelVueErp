// src/modules/production/composables/useLaborAssignments.ts
import { ref, computed } from 'vue';
import type { LaborAssignment, ProjectWithAssignments } from '../types/labor';

// Mock data
const mockProjects: ProjectWithAssignments[] = [
  {
    id: 1,
    title: 'Office Fitout - 5th Floor',
    client: {
      id: 1,
      name: 'Acme Corp'
    },
    status: 'in_progress',
    workshop_labor: [
      {
        id: 1,
        project_id: 1,
        labor_category: 'workshop',
        labor_type: 'internal',
        employee_id: 101,
        employee: {
          id: 101,
          name: 'John Doe',
          department: 'Workshop',
          position: 'Carpenter'
        },
        hours_allocated: 40,
        start_date: '2023-06-01',
        end_date: '2023-06-10',
        status: 'scheduled',
        created_at: '2023-05-25T10:00:00Z',
        updated_at: '2023-05-25T10:00:00Z'
      }
    ],
    setup_labor: [],
    setdown_labor: []
  }
  // Add more mock projects as needed
];

const mockEmployees = [
  { id: 101, name: 'John Doe', department: 'Workshop', position: 'Carpenter' },
  { id: 102, name: 'Jane Smith', department: 'Setup', position: 'Team Lead' },
  { id: 103, name: 'Mike Johnson', department: 'Setdown', position: 'Technician' }
  // Add more mock employees
];

const loading = ref(false);
const error = ref<string | null>(null);

export function useLaborAssignments() {
  const projects = ref<ProjectWithAssignments[]>(mockProjects);
  const currentProject = ref<ProjectWithAssignments | null>(null);

  const fetchProjects = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real app: const response = await api.get('/api/labor/assignments')
      return projects.value;
    } catch (e) {
      error.value = 'Failed to fetch labor assignments';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const fetchProjectAssignments = async (projectId: number) => {
    loading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const project = projects.value.find(p => p.id === projectId) || null;
      currentProject.value = project;
      return project;
    } catch (e) {
      error.value = 'Failed to fetch project assignments';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const assignLabor = async (assignment: Omit<LaborAssignment, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newAssignment: LaborAssignment = {
        ...assignment,
        id: Math.floor(Math.random() * 1000), // Mock ID generation
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add to the appropriate category
      const category = `${assignment.labor_category}_labor` as const;
      const project = projects.value.find(p => p.id === assignment.project_id);
      if (project) {
        project[category].push(newAssignment);
      }

      return newAssignment;
    } catch (e) {
      error.value = 'Failed to assign labor';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Other CRUD operations (update, delete) would go here

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProjectAssignments,
    assignLabor
    // Other methods would be exported here
  };
}