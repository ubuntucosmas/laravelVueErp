export interface Project {
  id: number;
  enquiry_id: number;
  project_id: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  current_phase?: number;
  assigned_users?: number[];
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  // Relations
  enquiry?: Enquiry;
  projectTasks?: ProjectTask[];
}

export interface ProjectTask {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_user_id?: number;
  due_date?: string;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  project?: Project;
  assignedUser?: {
    id: number;
    name: string;
  };
}

export interface CreateProjectData {
  enquiry_id: number;
  project_id: string;
  start_date?: string;
  budget?: number;
  assigned_users?: number[];
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: Project['status'];
  current_phase?: number;
  end_date?: string;
}

// Import Enquiry for circular reference
import type { Enquiry } from './enquiry'
