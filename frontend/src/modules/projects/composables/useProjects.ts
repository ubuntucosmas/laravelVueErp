import { ref, computed } from 'vue'
import type { Project, CreateProjectData, UpdateProjectData, ProjectPhase } from '../types'
import type { DepartmentalTask, DepartmentalTaskStats } from '../types/departmentalTask'

// Project phases from config - now with dynamic properties
const defaultPhases: ProjectPhase[] = [
  {
    id: 'client-engagement',
    name: 'Client Engagement & Briefing',
    icon: 'bi-folder-symlink',
    summary: 'Initial client meetings, project briefs, and requirements gathering. This phase sets the foundation for the entire project.',
    status: 'Not Started',
    isRequired: true,
    order: 1,
    description: 'Schedule and conduct initial client meetings to understand project requirements and objectives.',
    requiredActions: ['Schedule meeting', 'Prepare briefing document', 'Collect client requirements'],
    forms: ['client-briefing-form', 'requirements-gathering-form'],
    estimatedDuration: 3,
    assignedRole: 'Project Officer',
    offsetStart: 0,
    offsetEnd: 5,
    tasks: [
      {
        name: 'Receive Client Brief',
        description: 'Capture client needs via email, call, or physical visit.',
        deliverables: [
          'Customer Service captures client needs.',
          'Assign a Project Officer (PO).',
          'Log new project entry in system.'
        ]
      },
      {
        name: 'Analyze Requirements',
        description: 'Review and allocate project internally.',
        deliverables: [
          'Team leads and PO review client brief.',
          'Allocate project to relevant departments.',
          'Schedule internal project briefing.'
        ]
      },
      {
        name: 'Confirm Project Scope',
        description: 'Align with client on deliverables and expectations.',
        deliverables: [
          'Document project deliverables.',
          'Share requirements summary for client confirmation.',
          'Use official communication channels for confirmation.'
        ]
      }
    ]
  },
  {
    id: 'design-development',
    name: 'Design & Concept Development',
    icon: 'bi-brush',
    summary: 'Creative development, mood boards, and initial design concepts. This is where ideas take visual form.',
    status: 'Not Started',
    isRequired: true,
    order: 2,
    description: 'Create design concepts, mood boards, and initial mockups for client approval.',
    requiredActions: ['Create mood boards', 'Develop design concepts', 'Prepare initial mockups'],
    forms: ['design-brief-form', 'concept-approval-form'],
    dependencies: ['client-engagement'],
    estimatedDuration: 7,
    assignedRole: 'Design Officer',
    offsetStart: 6,
    offsetEnd: 15,
    tasks: [
      {
        name: 'Initial Design Creation',
        description: 'Create and share initial design concepts.',
        deliverables: [
          'Designer creates initial concepts.',
          'Share internally and with client.',
          'Collect feedback via email or portal.'
        ]
      },
      {
        name: 'Final Design Approval',
        description: 'Refine and approve final design.',
        deliverables: [
          'Incorporate revisions from feedback.',
          'Client provides sign-off.',
          'Document final designs in ERP.'
        ]
      },
      {
        name: 'Material & Cost Listing',
        description: 'Estimate material needs and costs.',
        deliverables: [
          'List all required materials.',
          'Rough cost estimation.',
          'Finalize and approve materials list internally.'
        ]
      }
    ]
  },
  {
    id: 'procurement-inventory',
    name: 'Procurement & Inventory Management',
    icon: 'bi-list-task',
    summary: 'Ensure necessary stock is available and handle procurement of materials.',
    status: 'Not Started',
    isRequired: true,
    order: 3,
    description: 'Ensure necessary stock is available and handle procurement of materials.',
    requiredActions: ['Inventory check', 'Procurement process', 'Inventory ready for production'],
    forms: ['inventory-check-form', 'procurement-form'],
    dependencies: ['design-development'],
    estimatedDuration: 4,
    assignedRole: 'Procurement Officer',
    offsetStart: 16,
    offsetEnd: 20,
    tasks: [
      {
        name: 'Inventory Check',
        description: 'Ensure necessary stock is available.',
        deliverables: [
          'Store manager checks available stock.'
        ]
      },
      {
        name: 'Procurement Process',
        description: 'Raise and track procurement of materials.',
        deliverables: [
          'Raise purchase request.',
          'Approve via Procurement Officer.',
          'Track supplier delivery status.'
        ]
      },
      {
        name: 'Inventory Ready for Production',
        description: 'Prepare materials for use.',
        deliverables: [
          'Receive and verify materials.',
          'Notify production team.'
        ]
      }
    ]
  },
  {
    id: 'quotation-budget',
    name: 'Quotation & Budget Approval',
    icon: 'bi-cash-coin',
    summary: 'Financial planning, cost estimation, and client quotations.',
    status: 'Not Started',
    isRequired: true,
    order: 4,
    description: 'Validate cost and prepare client quotation.',
    requiredActions: ['Budget confirmation', 'Approval & TAT'],
    forms: ['quotation-form', 'budget-approval-form'],
    dependencies: ['procurement-inventory'],
    estimatedDuration: 4,
    assignedRole: 'Project Lead',
    offsetStart: 21,
    offsetEnd: 25,
    tasks: [
      {
        name: 'Budget Confirmation',
        description: 'Validate cost and prepare client quotation.',
        deliverables: [
          'Cross-check cost with scope.',
          'Generate and send quotation.'
        ]
      },
      {
        name: 'Approval & TAT',
        description: 'Follow up and confirm client approval.',
        deliverables: [
          'Follow up within 45 minutes (or as needed).',
          'Confirm client approval.',
          'Mark status as "Quote Approved".'
        ]
      }
    ]
  },
  {
    id: 'production',
    name: 'Production',
    icon: 'bi-gear',
    summary: 'Manufacturing and assembly of project components. Tracks work orders, progress, and quality control.',
    status: 'Not Started',
    isRequired: true,
    order: 5,
    description: 'Execute production according to approved designs and specifications.',
    requiredActions: ['Execute production', 'Quality control', 'Packing & handover for setup'],
    forms: ['production-form', 'quality-control-form'],
    dependencies: ['quotation-budget'],
    estimatedDuration: 4,
    assignedRole: 'Production Manager',
    offsetStart: 26,
    offsetEnd: 30,
    tasks: [
      {
        name: 'Execute Production',
        description: 'Fabricate/brand as per approved design.',
        deliverables: [
          'Log time and material usage.'
        ]
      },
      {
        name: 'Quality Control',
        description: 'Ensure deliverables meet standards.',
        deliverables: [
          'QA team inspects output.',
          'Retouch if needed.',
          'Approve for delivery.'
        ]
      },
      {
        name: 'Packing & Handover for Setup',
        description: 'Prepare items for delivery.',
        deliverables: [
          'Package final items.',
          'Update delivery docket.',
          'Handover to logistics.'
        ]
      }
    ]
  },
  {
    id: 'production',
    name: 'Production',
    icon: 'bi-gear',
    summary: 'Manufacturing and assembly of project components. Tracks work orders, progress, and quality control.',
    status: 'Not Started',
    isRequired: true,
    order: 7,
    description: 'Execute production according to approved designs and specifications.',
    requiredActions: ['Create work orders', 'Monitor production progress', 'Quality control checks'],
    forms: ['work-order-form', 'quality-control-form'],
    dependencies: ['client-approval'],
    estimatedDuration: 14,
    assignedRole: 'Production Manager'
  },
  {
    id: 'event-setup',
    name: 'Event Setup & Execution',
    icon: 'bi-tools',
    summary: 'On-site setup and implementation. Includes installation schedules and site reports.',
    status: 'Not Started',
    isRequired: true,
    order: 6,
    description: 'On-site installation and setup of the completed project.',
    requiredActions: ['Site delivery', 'Setup execution'],
    forms: ['site-delivery-form', 'setup-execution-form'],
    dependencies: ['production'],
    estimatedDuration: 4,
    assignedRole: 'Installation Team',
    offsetStart: 31,
    offsetEnd: 35,
    tasks: [
      {
        name: 'Site Delivery',
        description: 'Transport and confirm safe arrival of items.',
        deliverables: [
          'Load and transport items to venue.',
          'Confirm arrival and condition.'
        ]
      },
      {
        name: 'Setup Execution',
        description: 'Install and test setup on-site.',
        deliverables: [
          'Install branding/equipment as per design.',
          'Test all components.',
          'Confirm readiness with client.'
        ]
      }
    ]
  },
  {
    id: 'set-down-return',
    name: 'Set Down & Return',
    icon: 'bi-arrow-return-left',
    summary: 'Post-event activities, including equipment return and storage.',
    status: 'Not Started',
    isRequired: false,
    order: 7,
    description: 'Post-event cleanup, equipment return, and storage activities.',
    requiredActions: ['Dismantling', 'Returns & storage'],
    forms: ['dismantling-form', 'return-storage-form'],
    dependencies: ['event-setup'],
    estimatedDuration: 4,
    assignedRole: 'Operations Team',
    offsetStart: 36,
    offsetEnd: 40,
    tasks: [
      {
        name: 'Dismantling',
        description: 'Safely uninstall and collect materials.',
        deliverables: [
          'Uninstall props/equipment.',
          'Account for all items.'
        ]
      },
      {
        name: 'Returns & Storage',
        description: 'Return items to workshop and update records.',
        deliverables: [
          'Transport items back.',
          'Inspect for damage.',
          'Update return condition.'
        ]
      }
    ]
  },
  {
    id: 'client-handover',
    name: 'Client Handover & Feedback',
    icon: 'bi-clipboard-check',
    summary: 'Final delivery to client. Includes training, documentation, and sign-off procedures.',
    status: 'Not Started',
    isRequired: true,
    order: 8,
    description: 'Complete project handover with training, documentation, and sign-off procedures.',
    requiredActions: ['Final handover', 'Feedback collection'],
    forms: ['handover-form', 'feedback-form'],
    dependencies: ['event-setup'],
    estimatedDuration: 2,
    assignedRole: 'Project Lead',
    offsetStart: 41,
    offsetEnd: 43,
    tasks: [
      {
        name: 'Final Handover',
        description: 'Wrap up project and submit final report.',
        deliverables: [
          'Submit final project report.',
          'Provide soft copies or photos.'
        ]
      },
      {
        name: 'Feedback Collection',
        description: 'Collect feedback and assess satisfaction.',
        deliverables: [
          'Debrief session with client.',
          'Record satisfaction and lessons learned.'
        ]
      }
    ]
  },
  {
    id: 'archival-reporting',
    name: 'Archival & Reporting',
    icon: 'bi-archive',
    summary: 'Final project review, documentation, and lessons learned. Formally closes out the project.',
    status: 'Not Started',
    isRequired: true,
    order: 9,
    description: 'Complete final project review, documentation, and lessons learned for future reference.',
    requiredActions: ['Close project', 'Analytics & reports'],
    forms: ['closure-form', 'analytics-form'],
    dependencies: ['client-handover'],
    estimatedDuration: 1,
    assignedRole: 'Project Lead',
    offsetStart: 44,
    offsetEnd: 45,
    tasks: [
      {
        name: 'Close Project',
        description: 'Mark project complete and archive.',
        deliverables: [
          'Mark Project as complete.',
          'Archive all related documentation.'
        ]
      },
      {
        name: 'Analytics & Reports',
        description: 'Generate insights for management review.',
        deliverables: [
          'Create cost, time, and material usage reports.',
          'Send summary to management.'
        ]
      }
    ]
  }
]

// Dummy data
const dummyProjects: Project[] = [
  {
    id: 1,
    enquiry_id: 3,
    enquiry: {
      id: 3,
      title: 'Product Launch Event',
      client: {
        id: 1,
        name: 'ABC Corporation'
      }
    },
    name: 'ABC Product Launch 2024',
    description: 'Complete event setup for product launch',
    start_date: '2024-10-01',
    end_date: '2024-10-05',
    status: 'in_progress',
    budget: 75000,
    current_phase: 2,
    phases: defaultPhases.map((phase, index) => ({
      ...phase,
      status: index < 2 ? 'Completed' : index === 2 ? 'In Progress' : 'Not Started'
    })),
    assigned_users: [1, 2],
    created_by: 1,
    created_at: '2024-09-15T11:20:00Z',
    updated_at: '2024-09-15T11:20:00Z'
  },
  {
    id: 2,
    enquiry_id: 2,
    enquiry: {
      id: 2,
      title: 'Wedding Exhibition Display',
      client: {
        id: 2,
        name: 'XYZ Events'
      }
    },
    name: 'XYZ Wedding Exhibition',
    description: 'Elegant display booth setup',
    start_date: '2024-11-15',
    end_date: '2024-11-20',
    status: 'planning',
    budget: 25000,
    current_phase: 0,
    phases: defaultPhases.map(phase => ({ ...phase })),
    assigned_users: [2],
    created_by: 2,
    created_at: '2024-09-10T16:45:00Z',
    updated_at: '2024-09-10T16:45:00Z'
  }
]

const projects = ref<Project[]>([...dummyProjects])
const loading = ref(false)
const error = ref<string | null>(null)

export function useProjects() {
  const fetchProjects = async (filters?: {
    search?: string;
    status?: string;
    client_id?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      let filteredProjects = [...dummyProjects]

      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filteredProjects = filteredProjects.filter(project =>
          project.name.toLowerCase().includes(search) ||
          project.description.toLowerCase().includes(search) ||
          project.enquiry?.client.name.toLowerCase().includes(search)
        )
      }

      if (filters?.status) {
        filteredProjects = filteredProjects.filter(project => project.status === filters.status)
      }

      if (filters?.client_id) {
        filteredProjects = filteredProjects.filter(project =>
          project.enquiry?.client.id === filters.client_id
        )
      }

      projects.value = filteredProjects
    } catch (err) {
      error.value = 'Failed to fetch projects'
      console.error('Error fetching projects:', err)
    } finally {
      loading.value = false
    }
  }

  const getProject = (id: number): Project | undefined => {
    return projects.value.find(project => project.id === id)
  }

  const createProject = async (data: CreateProjectData): Promise<Project> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const newProject: Project = {
        id: Math.max(...projects.value.map(p => p.id)) + 1,
        ...data,
        status: 'planning',
        current_phase: 0,
        phases: defaultPhases.map(phase => ({ ...phase })),
        created_by: 1, // Current user
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      projects.value.push(newProject)
      return newProject
    } catch (err) {
      error.value = 'Failed to create project'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id: number, data: UpdateProjectData): Promise<Project> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = projects.value.findIndex(project => project.id === id)
      if (index === -1) {
        throw new Error('Project not found')
      }

      const updatedProject = {
        ...projects.value[index],
        ...data,
        updated_at: new Date().toISOString()
      }

      projects.value[index] = updatedProject
      return updatedProject
    } catch (err) {
      error.value = 'Failed to update project'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProjectPhase = async (id: number, phaseIndex: number, status: ProjectPhase['status']): Promise<Project> => {
    const project = projects.value.find(p => p.id === id)
    if (!project) {
      throw new Error('Project not found')
    }

    const updatedPhases = project.phases.map((phase, index) =>
      index === phaseIndex ? { ...phase, status } : phase
    )

    // Update current phase if this phase is now in progress
    let currentPhase = project.current_phase
    if (status === 'In Progress') {
      currentPhase = phaseIndex
    } else if (status === 'Completed' && phaseIndex === project.current_phase) {
      // Move to next phase if current is completed
      currentPhase = Math.min(phaseIndex + 1, project.phases.length - 1)
    }

    return updateProject(id, {
      phases: updatedPhases,
      current_phase: currentPhase,
      status: currentPhase === project.phases.length - 1 && status === 'Completed' ? 'completed' : project.status
    })
  }

  const deleteProject = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = projects.value.findIndex(project => project.id === id)
      if (index === -1) {
        throw new Error('Project not found')
      }

      projects.value.splice(index, 1)
    } catch (err) {
      error.value = 'Failed to delete project'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Departmental task functions
  const fetchDepartmentalTasksForProject = async (projectId: number): Promise<DepartmentalTask[]> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Mock departmental tasks data
      const mockTasks: DepartmentalTask[] = [
        {
          id: 1,
          project_phase_id: 1,
          department_id: 1,
          task_name: 'Design Concept Review',
          task_description: 'Review and approve initial design concepts',
          status: 'completed',
          assigned_user_id: 1,
          priority: 'high',
          estimated_hours: 4,
          actual_hours: 3.5,
          due_date: '2024-10-05',
          started_at: '2024-10-01T09:00:00Z',
          completed_at: '2024-10-03T14:30:00Z',
          notes: 'Approved with minor revisions',
          order: 1,
          created_at: '2024-09-28T10:00:00Z',
          updated_at: '2024-10-03T14:30:00Z'
        },
        {
          id: 2,
          project_phase_id: 1,
          department_id: 2,
          task_name: 'Material Specification',
          task_description: 'Specify materials required for production',
          status: 'in_progress',
          assigned_user_id: 2,
          priority: 'medium',
          estimated_hours: 6,
          actual_hours: 2,
          due_date: '2024-10-10',
          started_at: '2024-10-04T11:00:00Z',
          notes: 'Working on material sourcing',
          order: 2,
          created_at: '2024-09-29T08:00:00Z',
          updated_at: '2024-10-04T11:00:00Z'
        }
      ]

      return mockTasks.filter(task => {
        // Find the project and check if any phase belongs to this project
        const project = projects.value.find(p => p.id === projectId)
        if (!project) return false
        return project.phases.some(phase => phase.id === `phase-${task.project_phase_id}`)
      })
    } catch (err) {
      error.value = 'Failed to fetch departmental tasks'
      console.error('Error fetching departmental tasks:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getDepartmentalTaskStats = async (projectId?: number): Promise<DepartmentalTaskStats> => {
    try {
      const tasks = projectId ? await fetchDepartmentalTasksForProject(projectId) : []

      const total_tasks = tasks.length
      const completed_tasks = tasks.filter(t => t.status === 'completed').length
      const in_progress_tasks = tasks.filter(t => t.status === 'in_progress').length
      const pending_tasks = tasks.filter(t => t.status === 'pending').length
      const overdue_tasks = tasks.filter(t =>
        t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
      ).length

      const completion_rate = total_tasks > 0 ? (completed_tasks / total_tasks) * 100 : 0

      // Calculate average completion time
      const completedTasksWithTime = tasks.filter(t =>
        t.status === 'completed' && t.started_at && t.completed_at
      )
      const average_completion_time = completedTasksWithTime.length > 0
        ? completedTasksWithTime.reduce((sum, task) => {
            const start = new Date(task.started_at!)
            const end = new Date(task.completed_at!)
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60) // hours
          }, 0) / completedTasksWithTime.length
        : 0

      // Department breakdown
      const departmentMap = new Map<number, { name: string; tasks: DepartmentalTask[] }>()
      tasks.forEach(task => {
        if (!departmentMap.has(task.department_id)) {
          departmentMap.set(task.department_id, {
            name: `Department ${task.department_id}`,
            tasks: []
          })
        }
        departmentMap.get(task.department_id)!.tasks.push(task)
      })

      const department_breakdown = Array.from(departmentMap.entries()).map(([deptId, data]) => ({
        department_id: deptId,
        department_name: data.name,
        task_count: data.tasks.length,
        completed_count: data.tasks.filter(t => t.status === 'completed').length,
        completion_rate: data.tasks.length > 0
          ? (data.tasks.filter(t => t.status === 'completed').length / data.tasks.length) * 100
          : 0
      }))

      return {
        total_tasks,
        completed_tasks,
        in_progress_tasks,
        pending_tasks,
        overdue_tasks,
        completion_rate,
        average_completion_time,
        department_breakdown
      }
    } catch (err) {
      console.error('Error calculating departmental task stats:', err)
      return {
        total_tasks: 0,
        completed_tasks: 0,
        in_progress_tasks: 0,
        pending_tasks: 0,
        overdue_tasks: 0,
        completion_rate: 0,
        average_completion_time: 0,
        department_breakdown: []
      }
    }
  }

  const planningProjects = computed(() => projects.value.filter(project => project.status === 'planning'))
  const inProgressProjects = computed(() => projects.value.filter(project => project.status === 'in_progress'))
  const completedProjects = computed(() => projects.value.filter(project => project.status === 'completed'))
  const totalProjects = computed(() => projects.value.length)

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    updateProjectPhase,
    deleteProject,
    planningProjects,
    inProgressProjects,
    completedProjects,
    totalProjects,
    defaultPhases,
    fetchDepartmentalTasksForProject,
    getDepartmentalTaskStats
  }
}
