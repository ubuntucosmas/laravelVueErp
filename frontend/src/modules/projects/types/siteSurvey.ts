export interface SiteSurvey {
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
  survey_date: string;
  location: string;
  surveyed_by: number;
  surveyed_by_user?: {
    id: number;
    name: string;
  };
  findings: string;
  recommendations: string;
  photos?: string[]; // URLs to photos
  measurements?: string;
  site_conditions: string;
  access_requirements: string;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CreateSiteSurveyData {
  enquiry_id: number;
  survey_date: string;
  location: string;
  surveyed_by: number;
  findings: string;
  recommendations: string;
  photos?: string[];
  measurements?: string;
  site_conditions: string;
  access_requirements: string;
}

export interface UpdateSiteSurveyData extends Partial<CreateSiteSurveyData> {
  status?: SiteSurvey['status'];
}