export interface SiteSurvey {
  id: number;
  project_id?: number;
  enquiry_id: number;
  enquiry?: {
    id: number;
    title: string;
    client: {
      id: number;
      name: string;
    };
  };
  project?: {
    id: number;
    name: string;
  };
  site_visit_date: string;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  project_manager?: string;
  other_project_manager?: string;
  client_name: string;
  location: string;
  attendees: string[];
  client_contact_person: string;
  client_phone: string;
  client_email: string;
  project_description: string;
  objectives: string;
  current_condition: string;
  existing_branding: string;
  access_logistics: string;
  parking_availability: string;
  size_accessibility: string;
  lifts: string;
  door_sizes: string;
  loading_areas: string;
  site_measurements: string;
  room_size: string;
  constraints: string;
  electrical_outlets: string;
  food_refreshment: string;
  branding_preferences: string;
  material_preferences: string;
  color_scheme: string;
  brand_guidelines: string;
  special_instructions: string;
  project_start_date?: string;
  project_deadline?: string;
  milestones: string;
  safety_conditions: string;
  potential_hazards: string;
  safety_requirements: string;
  additional_notes: string;
  special_requests: string;
  action_items: string[];
  prepared_by?: string;
  prepared_signature?: string;
  prepared_date?: string;
  client_approval?: boolean;
  client_signature?: string;
  client_approval_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSiteSurveyData {
  project_id?: number;
  enquiry_id: number;
  site_visit_date: string;
  status?: 'pending' | 'completed' | 'approved' | 'rejected';
  project_manager?: string;
  other_project_manager?: string;
  client_name: string;
  location: string;
  attendees: string[];
  client_contact_person: string;
  client_phone: string;
  client_email: string;
  project_description: string;
  objectives: string;
  current_condition: string;
  existing_branding: string;
  access_logistics: string;
  parking_availability: string;
  size_accessibility: string;
  lifts: string;
  door_sizes: string;
  loading_areas: string;
  site_measurements: string;
  room_size: string;
  constraints: string;
  electrical_outlets: string;
  food_refreshment: string;
  branding_preferences: string;
  material_preferences: string;
  color_scheme: string;
  brand_guidelines: string;
  special_instructions: string;
  project_start_date?: string;
  project_deadline?: string;
  milestones: string;
  safety_conditions: string;
  potential_hazards: string;
  safety_requirements: string;
  additional_notes: string;
  special_requests: string;
  action_items: string[];
  prepared_by?: string;
  prepared_signature?: string;
  prepared_date?: string;
}

export interface UpdateSiteSurveyData extends Partial<CreateSiteSurveyData> {
  client_approval?: boolean;
  client_signature?: string;
  client_approval_date?: string;
}
