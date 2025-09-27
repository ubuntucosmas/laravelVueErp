import { computed } from 'vue'
import type { Project, ProjectPhase, Quotation } from '../types'

export function useProjectPhases() {
  const getPhaseProgressPercentage = (phase: ProjectPhase) => {
    switch (phase.status) {
      case 'Completed': return 100
      case 'In Progress': return 60
      case 'Not Started': return 0
      default: return 0
    }
  }

  const getPhaseTimelineInfo = (phase: ProjectPhase, selectedProject: Project) => {
    const startDate = selectedProject?.start_date
    if (!startDate) return 'Timeline not set'

    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(start.getDate() + phase.estimatedDuration)

    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
  }

  const getAssignedUserCount = (phase: ProjectPhase) => {
    // In a real app, this would count actual assigned users
    // For now, return a mock count based on role
    const roleCounts: Record<string, number> = {
      'Project Officer': 1,
      'Design Officer': 2,
      'Procurement Officer': 1,
      'Production Manager': 3,
      'Logistics Coordinator': 2,
      'Installation Team': 4,
      'Client Services': 1,
      'Operations Team': 2
    }
    return roleCounts[phase.assignedRole] || 1
  }

  const getPhaseBudgetAllocation = (phase: ProjectPhase, selectedQuotation: Quotation | null) => {
    if (!selectedQuotation) return 'KES 0'

    // Allocate budget based on phase type
    const totalBudget = selectedQuotation.total_amount
    const allocations: Record<string, number> = {
      'procurement': totalBudget * 0.25, // 25% for procurement
      'production': totalBudget * 0.35,  // 35% for production
      'logistics': totalBudget * 0.15,   // 15% for logistics
      'event-setup': totalBudget * 0.20, // 20% for setup
      'client-handover': totalBudget * 0.03, // 3% for handover
      'set-down-return': totalBudget * 0.01, // 1% for return
      'archival-reporting': totalBudget * 0.01 // 1% for reporting
    }

    const allocation = allocations[phase.id] || totalBudget * 0.1
    return `KES ${allocation.toLocaleString()}`
  }

  const getPhaseCostBreakdown = (phase: ProjectPhase) => {
    // Mock cost breakdown - in real app would calculate from actual costs
    const breakdowns: Record<string, string> = {
      'procurement': 'Materials: 80%, Labor: 15%, Misc: 5%',
      'production': 'Labor: 70%, Materials: 20%, Equipment: 10%',
      'logistics': 'Transport: 60%, Handling: 30%, Insurance: 10%',
      'event-setup': 'Labor: 80%, Equipment: 15%, Permits: 5%',
      'client-handover': 'Documentation: 50%, Training: 30%, Sign-off: 20%',
      'set-down-return': 'Labor: 70%, Transport: 25%, Cleanup: 5%',
      'archival-reporting': 'Documentation: 80%, Review: 20%'
    }
    return breakdowns[phase.id] || 'Standard allocation'
  }

  const getPhaseMaterialCount = (phase: ProjectPhase) => {
    // Mock material counts - in real app would query actual materials
    const materialCounts: Record<string, number> = {
      'procurement': 15,
      'production': 8,
      'logistics': 3,
      'event-setup': 12,
      'client-handover': 2,
      'set-down-return': 5,
      'archival-reporting': 1
    }
    return materialCounts[phase.id] || 0
  }

  const getPhaseMaterialStatus = (phase: ProjectPhase) => {
    const counts = getPhaseMaterialCount(phase)
    if (counts === 0) return 'No materials required'
    return `${counts} items allocated`
  }

  const getPhaseTotalMaterialValue = (phase: ProjectPhase) => {
    // Mock calculation - in real app would sum actual material costs
    const baseValues: Record<string, number> = {
      'procurement': 150000,
      'production': 120000,
      'logistics': 25000,
      'event-setup': 80000,
      'client-handover': 5000,
      'set-down-return': 15000,
      'archival-reporting': 1000
    }
    const value = baseValues[phase.id] || 0
    return `KES ${value.toLocaleString()}`
  }

  const getPhaseMaterials = (phase: ProjectPhase) => {
    // Mock materials data - in real app would fetch from API
    const mockMaterials: Record<string, any[]> = {
      'procurement': [
        { id: '1', name: 'Aluminum Frame 2x3m', quantity: 4, unit: 'pcs', unitPrice: 15000, totalCost: 60000, category: 'hire' },
        { id: '2', name: 'LED Panel 50"', quantity: 2, unit: 'pcs', unitPrice: 25000, totalCost: 50000, category: 'hire' }
      ],
      'production': [
        { id: '3', name: 'Carpet Tiles', quantity: 20, unit: 'sqm', unitPrice: 5000, totalCost: 100000, category: 'production' }
      ],
      'logistics': [
        { id: '4', name: 'Transport Services', quantity: 1, unit: 'service', unitPrice: 25000, totalCost: 25000, category: 'service' }
      ],
      'event-setup': [
        { id: '5', name: 'Installation Tools', quantity: 1, unit: 'set', unitPrice: 15000, totalCost: 15000, category: 'hire' },
        { id: '6', name: 'Safety Equipment', quantity: 5, unit: 'pcs', unitPrice: 2000, totalCost: 10000, category: 'hire' }
      ],
      'client-handover': [
        { id: '7', name: 'Documentation Package', quantity: 1, unit: 'set', unitPrice: 5000, totalCost: 5000, category: 'service' }
      ],
      'set-down-return': [
        { id: '8', name: 'Packing Materials', quantity: 10, unit: 'pcs', unitPrice: 500, totalCost: 5000, category: 'consumable' },
        { id: '9', name: 'Cleaning Supplies', quantity: 1, unit: 'set', unitPrice: 2000, totalCost: 2000, category: 'consumable' }
      ],
      'archival-reporting': [
        { id: '10', name: 'Project Documentation', quantity: 1, unit: 'set', unitPrice: 1000, totalCost: 1000, category: 'service' }
      ]
    }
    return mockMaterials[phase.id] || []
  }

  const canStartPhase = (phase: ProjectPhase, index: number, selectedProject: Project) => {
    if (!selectedProject) return false

    // Can start if previous phase is completed and current phase is not started
    if (index === 0) {
      return phase.status === 'Not Started'
    }

    const previousPhase = selectedProject.phases[index - 1]
    return previousPhase.status === 'Completed' && phase.status === 'Not Started'
  }

  const canCompletePhase = (phase: ProjectPhase) => {
    return phase.status === 'In Progress'
  }

  const startProjectPhase = (index: number, selectedProject: Project) => {
    if (!selectedProject) return

    // Update phase status to In Progress
    selectedProject.phases[index].status = 'In Progress'
    console.log(`Started phase: ${selectedProject.phases[index].name}`)
  }

  const completeProjectPhase = (index: number, selectedProject: Project) => {
    if (!selectedProject) return

    // Update phase status to Completed
    selectedProject.phases[index].status = 'Completed'

    // If this is the last phase, mark project as completed
    if (index === selectedProject.phases.length - 1) {
      selectedProject.status = 'completed'
    }

    console.log(`Completed phase: ${selectedProject.phases[index].name}`)
  }

  return {
    getPhaseProgressPercentage,
    getPhaseTimelineInfo,
    getAssignedUserCount,
    getPhaseBudgetAllocation,
    getPhaseCostBreakdown,
    getPhaseMaterialCount,
    getPhaseMaterialStatus,
    getPhaseTotalMaterialValue,
    getPhaseMaterials,
    canStartPhase,
    canCompletePhase,
    startProjectPhase,
    completeProjectPhase
  }
}
