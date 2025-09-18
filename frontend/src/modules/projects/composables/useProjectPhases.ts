import { ref, computed } from 'vue'
import type { ProjectPhase } from '../types'

// Default phase templates for different project types
const phaseTemplates = {
  standard: [
    {
      id: 'client-engagement',
      name: 'Client Engagement & Briefing',
      icon: 'bi-folder-symlink',
      summary: 'Initial client meetings and requirements gathering',
      status: 'Not Started' as const,
      isRequired: true,
      order: 1,
      description: 'Schedule and conduct initial client meetings to understand project requirements and objectives.',
      requiredActions: ['Schedule initial meeting', 'Prepare project brief', 'Gather client requirements', 'Document project scope'],
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
      summary: 'Creative development and design concepts',
      status: 'Not Started' as const,
      isRequired: true,
      order: 2,
      description: 'Create design concepts, mood boards, and initial mockups for client approval.',
      requiredActions: ['Create mood boards', 'Develop design concepts', 'Prepare initial mockups', 'Client design presentation'],
      forms: ['design-brief-form', 'concept-development-form', 'design-approval-form'],
      dependencies: ['client-engagement'],
      estimatedDuration: 7,
      assignedRole: 'Design Officer'
    },
    {
      id: 'budget-quotation',
      name: 'Budget & Quotation',
      icon: 'bi-cash-coin',
      summary: 'Financial planning and client quotation',
      status: 'Not Started' as const,
      isRequired: true,
      order: 3,
      description: 'Prepare detailed budget breakdown and client quotation for approval.',
      requiredActions: ['Calculate material costs', 'Add labor costs', 'Include contingencies', 'Prepare quotation document'],
      forms: ['budget-breakdown-form', 'quotation-form', 'cost-estimation-form'],
      dependencies: ['design-development'],
      estimatedDuration: 3,
      assignedRole: 'Project Lead'
    },
    {
      id: 'client-approval',
      name: 'Client Approval',
      icon: 'bi-check-circle',
      summary: 'Client review and approval of designs and quotation',
      status: 'Not Started' as const,
      isRequired: true,
      order: 4,
      description: 'Present final designs and quotation to client for approval before proceeding to production.',
      requiredActions: ['Schedule approval meeting', 'Present designs and quote', 'Address client feedback', 'Obtain client signature'],
      forms: ['approval-meeting-form', 'client-feedback-form', 'approval-document'],
      dependencies: ['budget-quotation'],
      estimatedDuration: 2,
      assignedRole: 'Project Lead'
    },
    {
      id: 'production',
      name: 'Production',
      icon: 'bi-gear',
      summary: 'Manufacturing and assembly of project components',
      status: 'Not Started' as const,
      isRequired: true,
      order: 5,
      description: 'Execute production according to approved designs and specifications.',
      requiredActions: ['Create work orders', 'Monitor production progress', 'Quality control checks', 'Final assembly'],
      forms: ['work-order-form', 'production-log-form', 'quality-control-form'],
      dependencies: ['client-approval'],
      estimatedDuration: 14,
      assignedRole: 'Production Manager'
    },
    {
      id: 'logistics',
      name: 'Logistics',
      icon: 'bi-truck',
      summary: 'Coordination of transportation, storage, and delivery',
      status: 'Not Started' as const,
      isRequired: false,
      order: 6,
      description: 'Plan and execute transportation and delivery logistics for the completed project.',
      requiredActions: ['Plan transportation routes', 'Coordinate delivery schedule', 'Track shipment progress', 'Arrange storage if needed'],
      forms: ['logistics-plan-form', 'delivery-schedule-form', 'shipment-tracking-form'],
      dependencies: ['production'],
      estimatedDuration: 3,
      assignedRole: 'Logistics Coordinator'
    },
    {
      id: 'event-setup',
      name: 'Event Setup & Execution',
      icon: 'bi-tools',
      summary: 'On-site setup and implementation',
      status: 'Not Started' as const,
      isRequired: false,
      order: 7,
      description: 'On-site installation and setup of the completed project.',
      requiredActions: ['Schedule installation team', 'On-site setup and assembly', 'Testing and calibration', 'Safety checks'],
      forms: ['installation-schedule-form', 'setup-report-form', 'safety-checklist-form'],
      dependencies: ['logistics'],
      estimatedDuration: 2,
      assignedRole: 'Installation Team'
    },
    {
      id: 'client-handover',
      name: 'Client Handover',
      icon: 'bi-clipboard-check',
      summary: 'Final delivery to client with training and documentation',
      status: 'Not Started' as const,
      isRequired: true,
      order: 8,
      description: 'Complete project handover with training, documentation, and sign-off procedures.',
      requiredActions: ['Client training session', 'Documentation delivery', 'System walkthrough', 'Final sign-off'],
      forms: ['training-record-form', 'handover-document', 'client-signoff-form'],
      dependencies: ['event-setup'],
      estimatedDuration: 1,
      assignedRole: 'Project Lead'
    },
    {
      id: 'set-down-return',
      name: 'Set Down & Return',
      icon: 'bi-arrow-return-left',
      summary: 'Post-event activities and equipment return',
      status: 'Not Started' as const,
      isRequired: false,
      order: 9,
      description: 'Post-event activities including equipment return, cleanup, and storage.',
      requiredActions: ['Equipment inventory check', 'Transportation back to storage', 'Equipment cleaning', 'Storage organization'],
      forms: ['equipment-return-form', 'inventory-checklist-form', 'storage-log-form'],
      dependencies: ['client-handover'],
      estimatedDuration: 2,
      assignedRole: 'Operations Team'
    },
    {
      id: 'archival-reporting',
      name: 'Archival & Reporting',
      icon: 'bi-archive',
      summary: 'Final project review, documentation, and lessons learned',
      status: 'Not Started' as const,
      isRequired: true,
      order: 10,
      description: 'Complete final project review, documentation, and lessons learned for future reference.',
      requiredActions: ['Project performance review', 'Documentation archiving', 'Lessons learned session', 'Final report preparation'],
      forms: ['project-review-form', 'lessons-learned-form', 'final-report-form'],
      dependencies: ['set-down-return'],
      estimatedDuration: 1,
      assignedRole: 'Project Lead'
    }
  ],

  simple: [
    {
      id: 'client-engagement',
      name: 'Client Engagement',
      icon: 'bi-folder-symlink',
      summary: 'Initial client consultation',
      status: 'Not Started' as const,
      isRequired: true,
      order: 1,
      description: 'Meet with client and gather basic requirements for the project.',
      requiredActions: ['Schedule client meeting', 'Gather basic requirements', 'Document project scope'],
      forms: ['client-consultation-form', 'basic-requirements-form'],
      estimatedDuration: 2,
      assignedRole: 'Project Officer'
    },
    {
      id: 'quotation',
      name: 'Quotation',
      icon: 'bi-cash-coin',
      summary: 'Prepare and send quotation',
      status: 'Not Started' as const,
      isRequired: true,
      order: 2,
      description: 'Create detailed quotation based on client requirements.',
      requiredActions: ['Assess project requirements', 'Calculate costs', 'Prepare quotation document', 'Send to client'],
      forms: ['quotation-form', 'cost-breakdown-form'],
      dependencies: ['client-engagement'],
      estimatedDuration: 2,
      assignedRole: 'Project Officer'
    },
    {
      id: 'client-approval',
      name: 'Client Approval',
      icon: 'bi-check-circle',
      summary: 'Client approval of quotation',
      status: 'Not Started' as const,
      isRequired: true,
      order: 3,
      description: 'Obtain client approval and deposit before starting production.',
      requiredActions: ['Client review of quotation', 'Address any concerns', 'Obtain approval signature', 'Collect deposit'],
      forms: ['approval-form', 'deposit-confirmation-form'],
      dependencies: ['quotation'],
      estimatedDuration: 1,
      assignedRole: 'Project Officer'
    },
    {
      id: 'production',
      name: 'Production',
      icon: 'bi-gear',
      summary: 'Project execution and manufacturing',
      status: 'Not Started' as const,
      isRequired: true,
      order: 4,
      description: 'Execute the project according to specifications and timeline.',
      requiredActions: ['Procure materials', 'Start manufacturing', 'Quality control', 'Final assembly'],
      forms: ['production-schedule-form', 'quality-checklist-form', 'completion-certificate-form'],
      dependencies: ['client-approval'],
      estimatedDuration: 7,
      assignedRole: 'Project Officer'
    },
    {
      id: 'logistics',
      name: 'Logistics',
      icon: 'bi-truck',
      summary: 'Delivery and transportation coordination',
      status: 'Not Started' as const,
      isRequired: false,
      order: 5,
      description: 'Coordinate delivery of completed project to client location.',
      requiredActions: ['Plan delivery schedule', 'Arrange transportation', 'Track delivery progress', 'Confirm delivery'],
      forms: ['delivery-schedule-form', 'transportation-form', 'delivery-confirmation-form'],
      dependencies: ['production'],
      estimatedDuration: 2,
      assignedRole: 'Project Officer'
    },
    {
      id: 'client-handover',
      name: 'Client Handover',
      icon: 'bi-clipboard-check',
      summary: 'Final delivery and project handover',
      status: 'Not Started' as const,
      isRequired: true,
      order: 6,
      description: 'Complete final handover with documentation and client sign-off.',
      requiredActions: ['Final inspection', 'Client walkthrough', 'Documentation handover', 'Final payment collection'],
      forms: ['handover-checklist-form', 'client-signoff-form', 'final-invoice-form'],
      dependencies: ['logistics'],
      estimatedDuration: 1,
      assignedRole: 'Project Officer'
    },
    {
      id: 'archival-reporting',
      name: 'Archival & Reporting',
      icon: 'bi-archive',
      summary: 'Project documentation and closure',
      status: 'Not Started' as const,
      isRequired: true,
      order: 7,
      description: 'Archive project documentation and prepare final report.',
      requiredActions: ['Archive all documents', 'Prepare project summary', 'Update project database', 'File final report'],
      forms: ['project-summary-form', 'closure-report-form'],
      dependencies: ['client-handover'],
      estimatedDuration: 1,
      assignedRole: 'Project Officer'
    }
  ],

  complex: [
    {
      id: 'client-engagement',
      name: 'Client Engagement & Briefing',
      icon: 'bi-folder-symlink',
      summary: 'Comprehensive client consultation',
      status: 'Not Started' as const,
      isRequired: true,
      order: 1,
      description: 'Detailed client meetings and requirements analysis',
      requiredActions: ['Initial meeting', 'Detailed briefing', 'Requirements analysis'],
      forms: ['client-briefing-form', 'requirements-analysis-form'],
      estimatedDuration: 5,
      assignedRole: 'Project Lead'
    },
    {
      id: 'site-survey',
      name: 'Site Survey',
      icon: 'bi-geo-alt',
      summary: 'Detailed site assessment',
      status: 'Not Started' as const,
      isRequired: true,
      order: 2,
      description: 'Comprehensive site survey and documentation',
      requiredActions: ['Site visit', 'Measurements', 'Documentation'],
      forms: ['site-survey-form', 'measurement-form'],
      dependencies: ['client-engagement'],
      estimatedDuration: 3,
      assignedRole: 'Survey Team'
    },
    {
      id: 'design-development',
      name: 'Design & Concept Development',
      icon: 'bi-brush',
      summary: 'Detailed design and concept development',
      status: 'Not Started' as const,
      isRequired: true,
      order: 3,
      description: 'Create detailed designs and concepts',
      requiredActions: ['Concept development', 'Design iterations', 'Client presentations'],
      forms: ['design-concept-form', 'design-iteration-form'],
      dependencies: ['site-survey'],
      estimatedDuration: 10,
      assignedRole: 'Design Team'
    },
    {
      id: 'material-list',
      name: 'Material Procurement',
      icon: 'bi-list-task',
      summary: 'Material sourcing and procurement',
      status: 'Not Started' as const,
      isRequired: true,
      order: 4,
      description: 'Source and procure all required materials',
      requiredActions: ['Material list creation', 'Supplier selection', 'Procurement'],
      forms: ['material-list-form', 'procurement-form'],
      dependencies: ['design-development'],
      estimatedDuration: 7,
      assignedRole: 'Procurement Officer'
    },
    {
      id: 'budget-quotation',
      name: 'Budget & Quotation',
      icon: 'bi-cash-coin',
      summary: 'Detailed budget and quotation',
      status: 'Not Started' as const,
      isRequired: true,
      order: 5,
      description: 'Prepare comprehensive budget and quotation',
      requiredActions: ['Cost analysis', 'Budget preparation', 'Quotation creation'],
      forms: ['budget-form', 'quotation-form'],
      dependencies: ['material-list'],
      estimatedDuration: 4,
      assignedRole: 'Finance Officer'
    },
    {
      id: 'client-approval',
      name: 'Client Approval',
      icon: 'bi-check-circle',
      summary: 'Multi-stage client approval process',
      status: 'Not Started' as const,
      isRequired: true,
      order: 6,
      description: 'Comprehensive client approval process',
      requiredActions: ['Design approval', 'Budget approval', 'Final sign-off'],
      forms: ['design-approval-form', 'budget-approval-form', 'final-approval-form'],
      dependencies: ['budget-quotation'],
      estimatedDuration: 3,
      assignedRole: 'Project Lead'
    },
    {
      id: 'production',
      name: 'Production',
      icon: 'bi-gear',
      summary: 'Full production process',
      status: 'Not Started' as const,
      isRequired: true,
      order: 7,
      description: 'Complete production execution',
      requiredActions: ['Production planning', 'Quality control', 'Final assembly'],
      forms: ['production-plan-form', 'quality-control-form', 'assembly-form'],
      dependencies: ['client-approval'],
      estimatedDuration: 21,
      assignedRole: 'Production Manager'
    },
    {
      id: 'testing-qa',
      name: 'Testing & Quality Assurance',
      icon: 'bi-check-square',
      summary: 'Quality testing and assurance',
      status: 'Not Started' as const,
      isRequired: true,
      order: 8,
      description: 'Comprehensive testing and quality assurance',
      requiredActions: ['Quality testing', 'Bug fixes', 'Final QA'],
      forms: ['testing-form', 'qa-form'],
      dependencies: ['production'],
      estimatedDuration: 5,
      assignedRole: 'QA Team'
    },
    {
      id: 'logistics',
      name: 'Logistics & Delivery',
      icon: 'bi-truck',
      summary: 'Logistics planning and delivery',
      status: 'Not Started' as const,
      isRequired: true,
      order: 9,
      description: 'Plan and execute delivery logistics',
      requiredActions: ['Logistics planning', 'Transportation', 'Delivery'],
      forms: ['logistics-form', 'delivery-form'],
      dependencies: ['testing-qa'],
      estimatedDuration: 4,
      assignedRole: 'Logistics Coordinator'
    },
    {
      id: 'client-handover',
      name: 'Client Handover',
      icon: 'bi-clipboard-check',
      summary: 'Complete client handover process',
      status: 'Not Started' as const,
      isRequired: true,
      order: 10,
      description: 'Full handover with training, documentation, and final sign-off procedures.',
      requiredActions: ['Client training session', 'System documentation delivery', 'Operational walkthrough', 'Final inspection', 'Client sign-off'],
      forms: ['training-record-form', 'documentation-handover-form', 'final-inspection-form', 'client-signoff-form'],
      dependencies: ['logistics'],
      estimatedDuration: 2,
      assignedRole: 'Project Lead'
    },
    {
      id: 'set-down-return',
      name: 'Set Down & Return',
      icon: 'bi-arrow-return-left',
      summary: 'Post-event activities and equipment return',
      status: 'Not Started' as const,
      isRequired: false,
      order: 11,
      description: 'Post-event cleanup, equipment return, and storage activities.',
      requiredActions: ['Equipment inventory and inspection', 'Transportation back to warehouse', 'Equipment cleaning and maintenance', 'Secure storage organization'],
      forms: ['equipment-inventory-form', 'return-logistics-form', 'maintenance-checklist-form', 'storage-log-form'],
      dependencies: ['client-handover'],
      estimatedDuration: 3,
      assignedRole: 'Operations Team'
    },
    {
      id: 'archival-reporting',
      name: 'Archival & Reporting',
      icon: 'bi-archive',
      summary: 'Final project review and documentation',
      status: 'Not Started' as const,
      isRequired: true,
      order: 12,
      description: 'Complete final project review, documentation, and lessons learned for future reference.',
      requiredActions: ['Project performance analysis', 'Client feedback collection', 'Lessons learned documentation', 'Final project report', 'Archive all project documents'],
      forms: ['project-review-form', 'client-feedback-form', 'lessons-learned-form', 'final-report-form', 'archival-checklist-form'],
      dependencies: ['set-down-return'],
      estimatedDuration: 2,
      assignedRole: 'Project Lead'
    }
  ]
}

const customPhases = ref<ProjectPhase[]>([])

export function useProjectPhases() {
  const getPhasesForProjectType = (projectType: 'standard' | 'simple' | 'complex'): ProjectPhase[] => {
    return phaseTemplates[projectType].map(phase => ({ ...phase }))
  }

  const customizePhases = (basePhases: ProjectPhase[], customizations: {
    skipPhases?: string[]
    addPhases?: ProjectPhase[]
    modifyPhases?: { id: string; changes: Partial<ProjectPhase> }[]
  }): ProjectPhase[] => {
    let phases = [...basePhases]

    // Skip phases
    if (customizations.skipPhases) {
      phases = phases.map(phase =>
        customizations.skipPhases!.includes(phase.id)
          ? { ...phase, status: 'Skipped' as const, isRequired: false }
          : phase
      )
    }

    // Add custom phases
    if (customizations.addPhases) {
      phases.push(...customizations.addPhases)
    }

    // Modify existing phases
    if (customizations.modifyPhases) {
      customizations.modifyPhases.forEach(mod => {
        const index = phases.findIndex(p => p.id === mod.id)
        if (index !== -1) {
          phases[index] = { ...phases[index], ...mod.changes }
        }
      })
    }

    // Reorder phases based on dependencies and order
    return phases.sort((a, b) => a.order - b.order)
  }

  const validatePhaseDependencies = (phases: ProjectPhase[]): boolean => {
    const completedPhases = new Set(
      phases.filter(p => p.status === 'Completed').map(p => p.id)
    )

    for (const phase of phases) {
      if (phase.dependencies && phase.status !== 'Skipped') {
        const unmetDeps = phase.dependencies.filter(dep => !completedPhases.has(dep))
        if (unmetDeps.length > 0) {
          return false // Dependencies not met
        }
      }
    }
    return true
  }

  const getNextAvailablePhases = (phases: ProjectPhase[]): ProjectPhase[] => {
    const completedPhases = new Set(
      phases.filter(p => p.status === 'Completed').map(p => p.id)
    )

    return phases.filter(phase => {
      if (phase.status !== 'Not Started' && phase.status !== 'Skipped') return false

      // Check if all dependencies are met
      if (phase.dependencies) {
        return phase.dependencies.every(dep => completedPhases.has(dep))
      }

      return true
    })
  }

  const calculateProjectProgress = (phases: ProjectPhase[]): number => {
    const totalPhases = phases.filter(p => p.status !== 'Skipped').length
    const completedPhases = phases.filter(p => p.status === 'Completed').length

    return totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0
  }

  const getPhaseById = (phases: ProjectPhase[], phaseId: string): ProjectPhase | undefined => {
    return phases.find(p => p.id === phaseId)
  }

  const updatePhaseStatus = (phases: ProjectPhase[], phaseId: string, status: ProjectPhase['status']): ProjectPhase[] => {
    return phases.map(phase =>
      phase.id === phaseId ? { ...phase, status } : phase
    )
  }

  const getRequiredFormsForPhase = (phase: ProjectPhase): string[] => {
    return phase.forms || []
  }

  const getEstimatedDurationForProject = (phases: ProjectPhase[]): number => {
    return phases
      .filter(p => p.status !== 'Skipped')
      .reduce((total, phase) => total + (phase.estimatedDuration || 0), 0)
  }

  return {
    phaseTemplates,
    customPhases,
    getPhasesForProjectType,
    customizePhases,
    validatePhaseDependencies,
    getNextAvailablePhases,
    calculateProjectProgress,
    getPhaseById,
    updatePhaseStatus,
    getRequiredFormsForPhase,
    getEstimatedDurationForProject
  }
}