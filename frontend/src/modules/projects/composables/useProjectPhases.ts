import { ref, computed } from 'vue'
import type { ProjectPhase } from '../types'

// Default phase templates for different project types
const phaseTemplates = {
  standard: [
    {
      id: 'procurement',
      name: 'Procurement & Material Sourcing',
      icon: 'bi-cart-plus',
      summary: 'Source and acquire all required materials and supplies',
      status: 'Not Started' as const,
      isRequired: true,
      order: 1,
      description: 'Procure all materials and supplies required for production according to the approved material specification.',
      requiredActions: ['Create purchase orders', 'Contact suppliers', 'Track delivery schedules', 'Verify material quality'],
      forms: ['purchase-order-form', 'supplier-contact-form', 'material-receipt-form'],
      estimatedDuration: 5,
      assignedRole: 'Procurement Officer',
      tasks: [
        {
          name: 'Material Procurement',
          description: 'Order all required materials from approved suppliers.',
          deliverables: [
            'Create purchase orders for all materials.',
            'Confirm supplier availability and lead times.',
            'Track order status and delivery dates.'
          ]
        },
        {
          name: 'Material Receipt & Inspection',
          description: 'Receive and inspect delivered materials.',
          deliverables: [
            'Verify material quality and specifications.',
            'Document any discrepancies.',
            'Store materials appropriately.'
          ]
        }
      ]
    },
    {
      id: 'pre-production',
      name: 'Pre-Production Planning',
      icon: 'bi-clipboard-check',
      summary: 'Planning and preparation for production',
      status: 'Not Started' as const,
      isRequired: true,
      order: 2,
      description: 'Plan production schedule, allocate resources, and prepare workspace for manufacturing.',
      requiredActions: ['Create production schedule', 'Allocate team members', 'Prepare workspace', 'Review material availability'],
      forms: ['production-schedule-form', 'resource-allocation-form', 'workspace-prep-form'],
      dependencies: ['procurement'],
      estimatedDuration: 3,
      assignedRole: 'Production Manager',
      tasks: [
        {
          name: 'Production Planning',
          description: 'Create detailed production schedule and workflow.',
          deliverables: [
            'Develop production timeline.',
            'Assign team members to tasks.',
            'Prepare production workspace.'
          ]
        },
        {
          name: 'Resource Allocation',
          description: 'Ensure all necessary tools and equipment are available.',
          deliverables: [
            'Check equipment availability.',
            'Schedule maintenance if needed.',
            'Prepare safety equipment.'
          ]
        }
      ]
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing & Assembly',
      icon: 'bi-gear',
      summary: 'Core production and manufacturing work',
      status: 'Not Started' as const,
      isRequired: true,
      order: 3,
      description: 'Execute the actual manufacturing and assembly of project components.',
      requiredActions: ['Start manufacturing process', 'Monitor progress', 'Document production steps', 'Handle quality issues'],
      forms: ['production-log-form', 'quality-issue-form', 'progress-report-form'],
      dependencies: ['pre-production'],
      estimatedDuration: 10,
      assignedRole: 'Production Team',
      tasks: [
        {
          name: 'Manufacturing Execution',
          description: 'Produce items according to specifications.',
          deliverables: [
            'Follow production procedures.',
            'Monitor quality standards.',
            'Document production progress.'
          ]
        },
        {
          name: 'Assembly & Finishing',
          description: 'Complete final assembly and finishing work.',
          deliverables: [
            'Assemble components.',
            'Apply finishing touches.',
            'Prepare for quality inspection.'
          ]
        }
      ]
    },
    {
      id: 'quality-control',
      name: 'Quality Control & Testing',
      icon: 'bi-check-square',
      summary: 'Quality assurance and testing',
      status: 'Not Started' as const,
      isRequired: true,
      order: 4,
      description: 'Conduct quality control checks and testing to ensure products meet specifications.',
      requiredActions: ['Perform quality inspections', 'Test functionality', 'Document issues', 'Approve for next stage'],
      forms: ['quality-inspection-form', 'testing-report-form', 'defect-report-form'],
      dependencies: ['manufacturing'],
      estimatedDuration: 2,
      assignedRole: 'Quality Control Officer',
      tasks: [
        {
          name: 'Quality Inspection',
          description: 'Inspect finished products for quality.',
          deliverables: [
            'Check dimensions and specifications.',
            'Test functionality.',
            'Document any defects.'
          ]
        },
        {
          name: 'Quality Approval',
          description: 'Approve products for packaging and delivery.',
          deliverables: [
            'Sign off on quality standards.',
            'Prepare quality certificates.',
            'Authorize next steps.'
          ]
        }
      ]
    },
    {
      id: 'packaging',
      name: 'Packaging & Preparation',
      icon: 'bi-box',
      summary: 'Final packaging and delivery preparation',
      status: 'Not Started' as const,
      isRequired: true,
      order: 5,
      description: 'Package finished products and prepare for delivery or installation.',
      requiredActions: ['Package products safely', 'Prepare shipping documents', 'Coordinate delivery', 'Final quality check'],
      forms: ['packaging-checklist-form', 'shipping-document-form', 'delivery-coordination-form'],
      dependencies: ['quality-control'],
      estimatedDuration: 2,
      assignedRole: 'Production Team',
      tasks: [
        {
          name: 'Packaging',
          description: 'Package products for safe transport.',
          deliverables: [
            'Use appropriate packaging materials.',
            'Protect fragile components.',
            'Label packages correctly.'
          ]
        },
        {
          name: 'Documentation',
          description: 'Prepare all necessary documentation.',
          deliverables: [
            'Create delivery notes.',
            'Prepare installation guides.',
            'Complete export documents if needed.'
          ]
        }
      ]
    },
    {
      id: 'logistics-delivery',
      name: 'Logistics & Delivery',
      icon: 'bi-truck',
      summary: 'Transportation and delivery coordination',
      status: 'Not Started' as const,
      isRequired: true,
      order: 6,
      description: 'Coordinate transportation and delivery of packaged products to client location.',
      requiredActions: ['Arrange transportation', 'Track delivery progress', 'Confirm safe delivery', 'Handle delivery issues'],
      forms: ['transportation-form', 'delivery-tracking-form', 'delivery-confirmation-form'],
      dependencies: ['packaging'],
      estimatedDuration: 3,
      assignedRole: 'Logistics Coordinator',
      tasks: [
        {
          name: 'Transportation Planning',
          description: 'Arrange appropriate transportation method.',
          deliverables: [
            'Select transportation provider.',
            'Schedule delivery time.',
            'Prepare shipping documents.'
          ]
        },
        {
          name: 'Delivery Execution',
          description: 'Monitor and confirm successful delivery.',
          deliverables: [
            'Track shipment progress.',
            'Confirm delivery receipt.',
            'Handle any delivery issues.'
          ]
        }
      ]
    },
    {
      id: 'installation-setup',
      name: 'Installation & Setup',
      icon: 'bi-tools',
      summary: 'On-site installation and setup',
      status: 'Not Started' as const,
      isRequired: false,
      order: 7,
      description: 'Install and set up products at client location if required.',
      requiredActions: ['Schedule installation team', 'On-site setup', 'Testing and calibration', 'Client training'],
      forms: ['installation-schedule-form', 'setup-report-form', 'training-record-form'],
      dependencies: ['logistics-delivery'],
      estimatedDuration: 4,
      assignedRole: 'Installation Team',
      tasks: [
        {
          name: 'Site Preparation',
          description: 'Prepare installation site.',
          deliverables: [
            'Assess installation location.',
            'Prepare necessary tools.',
            'Ensure safety compliance.'
          ]
        },
        {
          name: 'Installation & Testing',
          description: 'Install and test the products.',
          deliverables: [
            'Complete installation.',
            'Test functionality.',
            'Provide client training.'
          ]
        }
      ]
    },
    {
      id: 'client-handover',
      name: 'Client Handover & Training',
      icon: 'bi-clipboard-check',
      summary: 'Final delivery and client training',
      status: 'Not Started' as const,
      isRequired: true,
      order: 8,
      description: 'Complete final handover with documentation, training, and client sign-off.',
      requiredActions: ['Client walkthrough', 'Documentation delivery', 'Training session', 'Final sign-off'],
      forms: ['handover-checklist-form', 'training-certificate-form', 'client-signoff-form'],
      dependencies: ['installation-setup'],
      estimatedDuration: 2,
      assignedRole: 'Project Lead',
      tasks: [
        {
          name: 'Client Training',
          description: 'Train client on product usage.',
          deliverables: [
            'Conduct training session.',
            'Provide user manuals.',
            'Answer client questions.'
          ]
        },
        {
          name: 'Final Handover',
          description: 'Complete project handover.',
          deliverables: [
            'Deliver all documentation.',
            'Obtain client sign-off.',
            'Confirm client satisfaction.'
          ]
        }
      ]
    },
    {
      id: 'post-production',
      name: 'Post-Production & Cleanup',
      icon: 'bi-arrow-return-left',
      summary: 'Post-delivery activities and cleanup',
      status: 'Not Started' as const,
      isRequired: false,
      order: 9,
      description: 'Handle post-delivery activities, cleanup, and return of any temporary equipment.',
      requiredActions: ['Equipment return', 'Site cleanup', 'Client follow-up', 'Documentation completion'],
      forms: ['equipment-return-form', 'cleanup-report-form', 'client-feedback-form'],
      dependencies: ['client-handover'],
      estimatedDuration: 3,
      assignedRole: 'Operations Team',
      tasks: [
        {
          name: 'Equipment Return',
          description: 'Return any temporary equipment.',
          deliverables: [
            'Collect all equipment.',
            'Inspect for damage.',
            'Return to storage.'
          ]
        },
        {
          name: 'Site Cleanup',
          description: 'Clean up installation site.',
          deliverables: [
            'Remove packaging materials.',
            'Clean work area.',
            'Restore site to original condition.'
          ]
        }
      ]
    },
    {
      id: 'project-closure',
      name: 'Project Closure & Reporting',
      icon: 'bi-archive',
      summary: 'Final documentation and project closure',
      status: 'Not Started' as const,
      isRequired: true,
      order: 10,
      description: 'Complete final documentation, reporting, and formal project closure.',
      requiredActions: ['Final reporting', 'Documentation archiving', 'Client feedback collection', 'Project closure'],
      forms: ['final-report-form', 'client-feedback-form', 'closure-checklist-form'],
      dependencies: ['post-production'],
      estimatedDuration: 2,
      assignedRole: 'Project Lead',
      tasks: [
        {
          name: 'Final Documentation',
          description: 'Complete all project documentation.',
          deliverables: [
            'Compile project reports.',
            'Archive all documents.',
            'Update project database.'
          ]
        },
        {
          name: 'Project Review',
          description: 'Review project performance.',
          deliverables: [
            'Collect team feedback.',
            'Document lessons learned.',
            'Prepare final report.'
          ]
        }
      ]
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
