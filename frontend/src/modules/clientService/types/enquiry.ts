export interface Enquiry {
  id: number;
  date_received: string;
  expected_delivery_date?: string;
  client_name: string;
  project_name: string;
  project_deliverables: string;
  contact_person: string;
  status: 'client_registered' | 'enquiry_logged' | 'site_survey_completed' | 'design_completed' | 'design_approved' | 'materials_specified' | 'budget_created' | 'quote_prepared' | 'quote_approved' | 'converted_to_project' | 'cancelled';
  assigned_po?: string;
  follow_up_notes?: string;
  project_id?: number;
  enquiry_number: string;
  converted_to_project_id?: number;
  venue?: string;
  site_survey_skipped: boolean;
  site_survey_skip_reason?: string;
  created_by: number;
  created_by_user?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateEnquiryData {
  date_received: string;
  expected_delivery_date?: string;
  client_name: string;
  project_name: string;
  project_deliverables: string;
  contact_person: string;
  status: Enquiry['status'];
  assigned_po?: string;
  follow_up_notes?: string;
  venue?: string;
  site_survey_skipped: boolean;
  site_survey_skip_reason?: string;
}

export interface UpdateEnquiryData extends Partial<CreateEnquiryData> {
  status?: Enquiry['status'];
}
