export interface ProjectEnquiry {
  id: number;
  date_received: string;
  expected_delivery_date?: string;
  client_id: number;
  title: string;
  description?: string;
  project_scope?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'client_registered' | 'enquiry_logged' | 'site_survey_completed' | 'design_completed' | 'design_approved' | 'materials_specified' | 'budget_created' | 'quote_prepared' | 'quote_approved' | 'converted_to_project' | 'planning' | 'in_progress' | 'completed' | 'cancelled';
  department_id?: number;
  assigned_department?: string;
  project_deliverables?: string;
  contact_person: string;
  assigned_po?: number;
  follow_up_notes?: string;
  enquiry_number: string;
  converted_to_project_id?: number;
  venue?: string;
  site_survey_skipped: boolean;
  site_survey_skip_reason?: string;
  quote_approved?: boolean;
  quote_approved_at?: string;
  quote_approved_by?: number;
  estimated_budget?: number;
  created_by: number;
  // Relations
  client?: {
    id: number;
    full_name: string;
    FullName?: string;
  };
  department?: {
    id: number;
    name: string;
  };
  enquiryTasks?: EnquiryTask[];
  creator?: {
    id: number;
    name: string;
  };
}

export interface TaskAssignmentHistory {
  id: number;
  enquiry_task_id: number;
  assigned_to: number;
  assigned_by: number;
  assigned_at: string;
  notes?: string;
  assignedTo?: {
    id: number;
    name: string;
  };
  assignedBy?: {
    id: number;
    name: string;
  };
}

export interface EnquiryTask {
  id: number;
  enquiry_id: number;
  project_enquiry_id?: number;
  department_id?: number;
  title: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_at?: string;
  notes?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  enquiry?: {
    id: number;
    title: string;
  };
  department?: {
    id: number;
    name: string;
  };
  creator?: {
    id: number;
    name: string;
  };
  // Note: API returns relationship objects under snake_case keys
  assigned_by?: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  assignmentHistory?: TaskAssignmentHistory[];
}

export interface CreateProjectEnquiryData {
  date_received: string;
  expected_delivery_date?: string;
  client_id: number | null;
  title: string;
  description?: string;
  project_scope?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status: ProjectEnquiry['status'];
  contact_person: string;
  assigned_po?: number;
  follow_up_notes?: string;
  venue?: string;
  site_survey_skipped?: boolean;
  site_survey_skip_reason?: string;
  estimated_budget?: number;
}

export interface UpdateProjectEnquiryData extends Partial<CreateProjectEnquiryData> {
  status?: ProjectEnquiry['status'];
}

export interface SiteSurvey {
  id: number;
  enquiry_id: number;
  project_id?: number;
  site_visit_date: string;
  status?: 'pending' | 'completed' | 'approved' | 'rejected';
  project_manager?: string;
  other_project_manager?: string;
  client_name: string;
  location: string;
  attendees?: string[];
  client_contact_person?: string;
  client_phone?: string;
  client_email?: string;
  project_description: string;
  objectives?: string;
  current_condition?: string;
  existing_branding?: string;
  access_logistics?: string;
  parking_availability?: string;
  size_accessibility?: string;
  lifts?: string;
  door_sizes?: string;
  loading_areas?: string;
  site_measurements?: string;
  room_size?: string;
  constraints?: string;
  electrical_outlets?: string;
  food_refreshment?: string;
  branding_preferences?: string;
  material_preferences?: string;
  color_scheme?: string;
  brand_guidelines?: string;
  special_instructions?: string;
  project_start_date?: string;
  project_deadline?: string;
  milestones?: string;
  safety_conditions?: string;
  potential_hazards?: string;
  safety_requirements?: string;
  additional_notes?: string;
  special_requests?: string;
  action_items?: string[];
  prepared_by?: string;
  prepared_signature?: string;
  prepared_date?: string;
  client_approval?: boolean;
  client_signature?: string;
  client_approval_date?: string;
  created_at?: string;
  updated_at?: string;
  enquiry?: ProjectEnquiry;
}

export interface CreateSiteSurveyData {
  enquiry_id: number;
  project_id?: number;
  site_visit_date: string;
  status?: 'pending' | 'completed' | 'approved' | 'rejected';
  project_manager?: string;
  other_project_manager?: string;
  client_name: string;
  location: string;
  attendees?: string[];
  client_contact_person?: string;
  client_phone?: string;
  client_email?: string;
  project_description: string;
  objectives?: string;
  current_condition?: string;
  existing_branding?: string;
  access_logistics?: string;
  parking_availability?: string;
  size_accessibility?: string;
  lifts?: string;
  door_sizes?: string;
  loading_areas?: string;
  site_measurements?: string;
  room_size?: string;
  constraints?: string;
  electrical_outlets?: string;
  food_refreshment?: string;
  branding_preferences?: string;
  material_preferences?: string;
  color_scheme?: string;
  brand_guidelines?: string;
  special_instructions?: string;
  project_start_date?: string;
  project_deadline?: string;
  milestones?: string;
  safety_conditions?: string;
  potential_hazards?: string;
  safety_requirements?: string;
  additional_notes?: string;
  special_requests?: string;
  action_items?: string[];
  prepared_by?: string;
  prepared_signature?: string;
  prepared_date?: string;
  client_approval?: boolean;
  client_signature?: string;
  client_approval_date?: string;
}

export interface UpdateSiteSurveyData extends Partial<CreateSiteSurveyData> {}

export interface DashboardMetrics {
  enquiry_metrics: {
    total_enquiries: number;
    status_breakdown: Record<string, number>;
    monthly_trend: Array<{ month: string; count: number }>;
    priority_distribution: Record<string, number>;
    department_distribution: Record<string, number>;
  };
  task_metrics: {
    enquiry_tasks: Record<string, number>;
    departmental_tasks: Record<string, number>;
    total_tasks: number;
    overdue_tasks: number;
    tasks_by_department: Record<string, number>;
    completion_rate: number;
  };
  project_metrics: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    converted_enquiries: number;
    total_budget: number;
    projects_by_status: Record<string, number>;
    average_duration_days: number | null;
    phases_by_status: Record<string, number>;
    phase_progress: Array<{
      name: string;
      total: number;
      completed: number;
      progress: number;
    }>;
  };
  recent_activities?: Array<{
    type: string;
    title: string;
    description: string;
    timestamp: string;
    priority?: string;
    status?: string;
  }>;
  alerts?: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    title: string;
    message: string;
    action_url?: string;
  }>;
}
