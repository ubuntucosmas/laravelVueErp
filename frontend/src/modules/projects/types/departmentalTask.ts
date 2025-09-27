export interface DepartmentalTask {
  id: number;
  project_phase_id: number;
  department_id: number;
  task_name: string;
  task_description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_user_id?: number;
  priority: 'low' | 'medium' | 'high';
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  order: number;
  created_at: string;
  updated_at: string;

  // Relations
  project_phase?: ProjectPhaseEntity;
  department?: Department;
  assigned_user?: User;
}

export interface Department {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  department_id?: number;
  department?: Department;
}

// Database entity interfaces for departmental tasks
export interface ProjectPhaseEntity {
  id: number;
  project_id: number;
  phase_id: number;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_user_id?: number;
  assigned_role_id?: number;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;

  // Departmental fields
  departmental_completion_count: number;
  total_departmental_tasks: number;
  auto_progress_enabled: boolean;

  // Relations
  departmental_tasks?: DepartmentalTask[];
  project?: ProjectEntity;
  phase?: PhaseEntity;
}

export interface PhaseEntity {
  id: number;
  name: string;
  description?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectEntity {
  id: number;
  enquiry_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  budget: number;
  current_phase: number;
  phases: ProjectPhaseEntity[];
  assigned_users: number[];
  created_by: number;
  created_at: string;
  updated_at: string;

  enquiry?: {
    id: number;
    title: string;
    client: {
      id: number;
      name: string;
    };
  };
}

// Task filtering and sorting options
export interface TaskFilters {
  status?: DepartmentalTask['status'][];
  priority?: DepartmentalTask['priority'][];
  assignment?: 'all' | 'assigned_to_me' | 'unassigned' | 'assigned_to_others';
  dueDate?: 'all' | 'overdue' | 'due_today' | 'due_this_week' | 'due_this_month';
  projectPhase?: 'current' | 'all';
  search?: string;
}

export interface TaskSorting {
  field: 'due_date' | 'priority' | 'created_at' | 'task_name';
  direction: 'asc' | 'desc';
}

// API request/response types
export interface CreateDepartmentalTaskData {
  project_phase_id: number;
  department_id: number;
  task_name: string;
  task_description?: string;
  priority?: DepartmentalTask['priority'];
  estimated_hours?: number;
  due_date?: string;
  order?: number;
}

export interface UpdateDepartmentalTaskData extends Partial<CreateDepartmentalTaskData> {
  status?: DepartmentalTask['status'];
  assigned_user_id?: number;
  actual_hours?: number;
  notes?: string;
}

export interface TaskActionRequest {
  task_id: number;
  action: 'claim' | 'start' | 'complete' | 'submit';
  notes?: string;
  actual_hours?: number;
}

export interface TaskActionResponse {
  success: boolean;
  task: DepartmentalTask;
  message?: string;
  phase_advanced?: boolean;
}

// Notification types
export interface TaskNotification {
  id: number;
  type: 'task_assigned' | 'task_completed' | 'phase_advanced' | 'deadline_approaching' | 'task_overdue';
  task_id?: number;
  project_id?: number;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  created_at: string;
  data?: Record<string, unknown>;
}

// Real-time update types
export interface TaskUpdateMessage {
  type: 'task_updated' | 'task_created' | 'task_deleted' | 'phase_updated';
  task?: DepartmentalTask;
  project_phase?: ProjectPhaseEntity;
  timestamp: string;
}

// Activity log types
export interface ActivityLog {
  id: number;
  action: 'assigned' | 'handover' | 'completed' | 'started' | 'updated';
  user_id: number;
  user_name: string;
  from_department?: string;
  to_department?: string;
  assigned_by_user_id?: number;
  assigned_by_name?: string;
  task_id?: number;
  task_name?: string;
  notes?: string;
  created_at: string;
}

// Statistics and analytics
export interface DepartmentalTaskStats {
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  average_completion_time: number; // in hours
  department_breakdown: {
    department_id: number;
    department_name: string;
    task_count: number;
    completed_count: number;
    completion_rate: number;
  }[];
}
