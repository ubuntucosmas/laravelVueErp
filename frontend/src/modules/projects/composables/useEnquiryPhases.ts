import type { Enquiry } from '../types'

// Enquiry workflow phases - mapping enquiry statuses to workflow steps
const enquiryPhases = [
  {
    id: 'client_registered',
    name: 'Client Registration',
    icon: 'bi-person-plus',
    summary: 'New client registered in the system',
    status: 'completed',
    order: 1,
    description: 'Client information has been captured and registered'
  },
  {
    id: 'enquiry_logged',
    name: 'Enquiry Logged',
    icon: 'bi-journal-text',
    summary: 'Project enquiry has been logged and assigned',
    status: 'in_progress',
    order: 2,
    description: 'Enquiry details captured and assigned to project officer'
  },
  {
    id: 'site_survey_completed',
    name: 'Site Survey',
    icon: 'bi-geo-alt',
    summary: 'Site assessment and survey completed',
    status: 'pending',
    order: 3,
    description: 'Site visit conducted and requirements documented'
  },
  {
    id: 'design_completed',
    name: 'Design & Concept',
    icon: 'bi-brush',
    summary: 'Design concepts and specifications completed',
    status: 'pending',
    order: 4,
    description: 'Creative designs and technical specifications finalized'
  },
  {
    id: 'design_approved',
    name: 'Design Approval',
    icon: 'bi-check-circle',
    summary: 'Client has approved the design concepts',
    status: 'pending',
    order: 5,
    description: 'Design concepts reviewed and approved by client'
  },
  {
    id: 'materials_specified',
    name: 'Materials Specification',
    icon: 'bi-list-task',
    summary: 'All required materials have been specified',
    status: 'pending',
    order: 6,
    description: 'Material requirements documented and sourced'
  },
  {
    id: 'budget_created',
    name: 'Budget Creation',
    icon: 'bi-cash-coin',
    summary: 'Project budget has been calculated',
    status: 'pending',
    order: 7,
    description: 'Cost breakdown and budget prepared'
  },
  {
    id: 'quote_prepared',
    name: 'Quote Preparation',
    icon: 'bi-file-earmark-text',
    summary: 'Client quotation has been prepared',
    status: 'pending',
    order: 8,
    description: 'Formal quotation document created and sent'
  },
  {
    id: 'quote_approved',
    name: 'Quote Approval',
    icon: 'bi-check-square',
    summary: 'Client has approved the quotation',
    status: 'pending',
    order: 9,
    description: 'Quotation accepted and deposit received'
  },
  {
    id: 'converted_to_project',
    name: 'Project Conversion',
    icon: 'bi-arrow-right-circle',
    summary: 'Enquiry converted to active project',
    status: 'pending',
    order: 10,
    description: 'Project created and execution begins'
  },
  {
    id: 'cancelled',
    name: 'Cancelled',
    icon: 'bi-x-circle',
    summary: 'Enquiry has been cancelled',
    status: 'cancelled',
    order: 11,
    description: 'Project enquiry cancelled or rejected'
  }
]

export function useEnquiryPhases() {
  const getCurrentPhase = (enquiry: Enquiry) => {
    return enquiryPhases.find(phase => phase.id === enquiry.status)
  }

  const getNextPhase = (enquiry: Enquiry) => {
    const currentIndex = enquiryPhases.findIndex(phase => phase.id === enquiry.status)
    if (currentIndex >= 0 && currentIndex < enquiryPhases.length - 1) {
      return enquiryPhases[currentIndex + 1]
    }
    return null
  }

  const getPreviousPhase = (enquiry: Enquiry) => {
    const currentIndex = enquiryPhases.findIndex(phase => phase.id === enquiry.status)
    if (currentIndex > 0) {
      return enquiryPhases[currentIndex - 1]
    }
    return null
  }

  const getPhaseById = (phaseId: string) => {
    return enquiryPhases.find(phase => phase.id === phaseId)
  }

  const getPhasesUpToCurrent = (enquiry: Enquiry) => {
    const currentIndex = enquiryPhases.findIndex(phase => phase.id === enquiry.status)
    return enquiryPhases.slice(0, currentIndex + 1)
  }

  const getCompletedPhases = (enquiry: Enquiry) => {
    const currentIndex = enquiryPhases.findIndex(phase => phase.id === enquiry.status)
    return enquiryPhases.slice(0, currentIndex)
  }

  const getRemainingPhases = (enquiry: Enquiry) => {
    const currentIndex = enquiryPhases.findIndex(phase => phase.id === enquiry.status)
    return enquiryPhases.slice(currentIndex + 1)
  }

  const calculateProgress = (enquiry: Enquiry): number => {
    const currentIndex = enquiryPhases.findIndex(phase => phase.id === enquiry.status)
    const totalPhases = enquiryPhases.filter(p => p.id !== 'cancelled').length
    return Math.round(((currentIndex + 1) / totalPhases) * 100)
  }

  const canAdvanceToPhase = (enquiry: Enquiry, targetPhaseId: string): boolean => {
    const currentIndex = enquiryPhases.findIndex(phase => phase.id === enquiry.status)
    const targetIndex = enquiryPhases.findIndex(phase => phase.id === targetPhaseId)

    // Can only advance forward, not backward (except for cancellation)
    if (targetPhaseId === 'cancelled') return true
    return targetIndex > currentIndex
  }

  const getPhaseStatus = (phaseId: string, enquiryStatus: string): 'completed' | 'current' | 'pending' | 'cancelled' => {
    if (phaseId === enquiryStatus) return 'current'
    if (phaseId === 'cancelled' && enquiryStatus === 'cancelled') return 'cancelled'

    const currentIndex = enquiryPhases.findIndex(phase => phase.id === enquiryStatus)
    const phaseIndex = enquiryPhases.findIndex(phase => phase.id === phaseId)

    if (phaseIndex < currentIndex) return 'completed'
    return 'pending'
  }

  const getPhaseIcon = (phaseId: string, enquiryStatus: string): string => {
    const status = getPhaseStatus(phaseId, enquiryStatus)
    const phase = enquiryPhases.find(p => p.id === phaseId)

    if (status === 'completed') return 'bi-check-circle-fill'
    if (status === 'current') return phase?.icon || 'bi-circle'
    if (status === 'cancelled') return 'bi-x-circle-fill'
    return 'bi-circle'
  }

  const getPhaseColor = (phaseId: string, enquiryStatus: string): string => {
    const status = getPhaseStatus(phaseId, enquiryStatus)

    switch (status) {
      case 'completed': return 'text-green-600'
      case 'current': return 'text-blue-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-400'
    }
  }

  return {
    enquiryPhases,
    getCurrentPhase,
    getNextPhase,
    getPreviousPhase,
    getPhaseById,
    getPhasesUpToCurrent,
    getCompletedPhases,
    getRemainingPhases,
    calculateProgress,
    canAdvanceToPhase,
    getPhaseStatus,
    getPhaseIcon,
    getPhaseColor
  }
}
