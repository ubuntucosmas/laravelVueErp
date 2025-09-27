import { computed, ref, watch } from 'vue'
import type { Project, ProjectPhase, Enquiry } from '../types'

export function useProgressCalculation() {
  const progressHistory = ref<Array<{ timestamp: Date; percentage: number; phase: string }>>([])

  // Calculate enquiry progress based on workflow steps
  const calculateEnquiryProgress = (enquiry: Enquiry, stepStatuses: Record<number, string>) => {
    let completedSteps = 0
    const totalSteps = 4

    // Step 1: Enquiry & Site Survey - always completed if enquiry exists
    if (enquiry) completedSteps++

    // Step 2: Material Specification - check if materials exist (mock logic)
    if (stepStatuses[2] === 'completed') completedSteps++

    // Step 3: Budget & Quote Preparation - check if quotation exists
    if (stepStatuses[3] === 'completed') completedSteps++

    // Step 4: Project Conversion - check if project exists
    if (stepStatuses[4] === 'completed') completedSteps++

    return Math.round((completedSteps / totalSteps) * 100)
  }

  // Calculate project progress based on phase completion
  const calculateProjectProgress = (project: Project) => {
    if (!project || !project.phases) return 0

    const completedPhases = project.phases.filter(phase => phase.status === 'Completed').length
    const totalPhases = project.phases.length

    return Math.round((completedPhases / totalPhases) * 100)
  }

  // Calculate weighted progress considering phase durations
  const calculateWeightedProgress = (project: Project) => {
    if (!project || !project.phases) return 0

    const totalDuration = project.phases.reduce((sum, phase) => sum + (phase.estimatedDuration || 1), 0)
    let weightedProgress = 0

    project.phases.forEach(phase => {
      const phaseWeight = (phase.estimatedDuration || 1) / totalDuration
      let phaseProgress = 0

      switch (phase.status) {
        case 'Completed':
          phaseProgress = 100
          break
        case 'In Progress':
          phaseProgress = 60 // Assume 60% complete when in progress
          break
        case 'Not Started':
          phaseProgress = 0
          break
        default:
          phaseProgress = 0
      }

      weightedProgress += phaseWeight * phaseProgress
    })

    return Math.round(weightedProgress)
  }

  // Calculate department-specific progress
  const calculateDepartmentProgress = (enquiry: Enquiry, department: string, project?: Project) => {
    if (!enquiry) return 0

    switch (department) {
      case 'creatives':
        // Creative department progress based on tasks completed
        return Math.min(100, Math.max(0, Math.floor(Math.random() * 100))) // Mock for now

      case 'design':
        // Design department progress based on material specifications
        return project ? 75 : 25

      case 'survey':
        // Survey department progress based on survey completion
        return 100 // Assume completed if we have the enquiry

      case 'procurement':
        // Procurement progress based on quotation status
        return project ? 80 : 30

      case 'projects':
        // Project management progress
        return project ? calculateProjectProgress(project) : 40

      default:
        return 0
    }
  }

  // Calculate bottleneck detection
  const detectBottlenecks = (project: Project) => {
    if (!project || !project.phases) return []

    const bottlenecks = []
    const now = new Date()

    project.phases.forEach((phase, index) => {
      if (phase.status === 'In Progress') {
        // Check if phase is overdue
        const startDate = project.start_date ? new Date(project.start_date) : new Date()
        const expectedEndDate = new Date(startDate)
        expectedEndDate.setDate(startDate.getDate() + phase.estimatedDuration)

        if (now > expectedEndDate) {
          const delay = Math.ceil((now.getTime() - expectedEndDate.getTime()) / (1000 * 60 * 60 * 24))

          bottlenecks.push({
            id: `bottleneck-${phase.id}`,
            phase: phase.name,
            description: `${phase.name} is ${delay} days overdue. This may impact subsequent phases.`,
            severity: delay > 7 ? 'critical' : delay > 3 ? 'high' : 'medium',
            delay,
            impact: 'High - Affects project timeline',
            assignedUsers: [] // Would be populated from actual assignments
          })
        }
      }
    })

    return bottlenecks
  }

  // Calculate overall workflow efficiency
  const calculateWorkflowEfficiency = (project: Project) => {
    if (!project || !project.phases) return 0

    const totalEstimatedDuration = project.phases.reduce((sum, phase) => sum + (phase.estimatedDuration || 1), 0)
    const actualDuration = project.phases
      .filter(phase => phase.status === 'Completed')
      .reduce((sum, phase) => sum + (phase.estimatedDuration || 1), 0)

    if (actualDuration === 0) return 0

    // Efficiency = (estimated / actual) * 100, capped at 100%
    const efficiency = Math.min(100, (totalEstimatedDuration / actualDuration) * 100)
    return Math.round(efficiency)
  }

  // Track progress changes
  const trackProgressChange = (percentage: number, phase: string) => {
    progressHistory.value.push({
      timestamp: new Date(),
      percentage,
      phase
    })

    // Keep only last 50 entries
    if (progressHistory.value.length > 50) {
      progressHistory.value = progressHistory.value.slice(-50)
    }
  }

  // Get progress trend
  const getProgressTrend = () => {
    if (progressHistory.value.length < 2) return 'stable'

    const recent = progressHistory.value.slice(-5)
    const avgRecent = recent.reduce((sum, entry) => sum + entry.percentage, 0) / recent.length

    const older = progressHistory.value.slice(-10, -5)
    if (older.length === 0) return 'stable'

    const avgOlder = older.reduce((sum, entry) => sum + entry.percentage, 0) / older.length

    if (avgRecent > avgOlder + 5) return 'improving'
    if (avgRecent < avgOlder - 5) return 'declining'
    return 'stable'
  }

  return {
    progressHistory,
    calculateEnquiryProgress,
    calculateProjectProgress,
    calculateWeightedProgress,
    calculateDepartmentProgress,
    detectBottlenecks,
    calculateWorkflowEfficiency,
    trackProgressChange,
    getProgressTrend
  }
}
