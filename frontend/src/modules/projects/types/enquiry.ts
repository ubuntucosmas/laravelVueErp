export interface Enquiry {
  id: number;
  client_id: number;
  client?: {
    id: number;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  project_scope: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'client_registered' | 'enquiry_logged' | 'site_survey_completed' | 'design_completed' | 'design_approved' | 'materials_specified' | 'budget_created' | 'quote_prepared' | 'quote_approved' | 'converted_to_project' | 'cancelled';
  department_id?: number;
  department?: {
    id: number;
    name: string;
    code: string;
  };
  assigned_department?: string;
  estimated_budget?: number;
  created_by: number;
  created_by_user?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateEnquiryData {
  client_id: number;
  title: string;
  description: string;
  project_scope: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department_id?: number;
  assigned_department?: string;
  estimated_budget?: number;
}

export interface UpdateEnquiryData extends Partial<CreateEnquiryData> {
  status?: Enquiry['status'];
}
