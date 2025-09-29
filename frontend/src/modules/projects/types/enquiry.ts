export interface Enquiry {
  id: number;
  date_received: string;
  expected_delivery_date?: string;
  client_id: number;
  title: string;
  description?: string;
  project_scope?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'client_registered' | 'enquiry_logged' | 'site_survey_completed' | 'design_completed' | 'design_approved' | 'materials_specified' | 'budget_created' | 'quote_prepared' | 'quote_approved' | 'converted_to_project' | 'cancelled';
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
  creator?: {
    id: number;
    name: string;
  };
}

export interface CreateEnquiryData {
  date_received: string;
  expected_delivery_date?: string;
  client_id: number;
  title: string;
  description?: string;
  project_scope?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status: Enquiry['status'];
  department_id?: number;
  assigned_department?: string;
  project_deliverables?: string;
  contact_person: string;
  assigned_po?: number;
  follow_up_notes?: string;
  venue?: string;
  site_survey_skipped: boolean;
  site_survey_skip_reason?: string;
}

export interface UpdateEnquiryData extends Partial<CreateEnquiryData> {
  status?: Enquiry['status'];
}
