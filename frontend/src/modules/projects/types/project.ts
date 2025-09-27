export interface ProjectTask {
  name: string;
  description: string;
  deliverables: string[];
}

import type { DepartmentalTask } from './departmentalTask'

export interface ProjectPhase {
  id: string;
  name: string;
  icon: string;
  summary: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold' | 'Skipped';
  isRequired: boolean;
  order: number;
  description?: string;
  requiredActions?: string[];
  forms?: string[];
  dependencies?: string[]; // IDs of phases that must be completed first
  estimatedDuration?: number; // in days
  assignedRole?: string;
  offsetStart?: number;
  offsetEnd?: number;
  tasks?: ProjectTask[];

  // Departmental task fields
  departmental_completion_count?: number;
  total_departmental_tasks?: number;
  auto_progress_enabled?: boolean;
  departmental_tasks?: DepartmentalTask[];
}

export interface Project {
  id: number;
  enquiry_id: number;
  enquiry?: {
    id: number;
    title: string;
    client: {
      id: number;
      name: string;
    };
  };
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  budget: number;
  current_phase: number; // Index of current phase in phases array
  phases: ProjectPhase[];
  assigned_users: number[];
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  enquiry_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  budget: number;
  assigned_users: number[];
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: Project['status'];
  current_phase?: number;
  phases?: ProjectPhase[];
}
