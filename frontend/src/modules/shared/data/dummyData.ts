import type { Enquiry } from '../../clientService/types/enquiry'

export const dummyEnquiries: Enquiry[] = [
  {
    id: 1,
    date_received: '2024-09-01',
    expected_delivery_date: '2024-09-15',
    client_name: 'ABC Corporation',
    project_name: 'Corporate Event Booth Setup',
    project_deliverables: 'Complete booth design, construction, and setup for 200 attendees',
    contact_person: 'John Doe',
    status: 'enquiry_logged',
    assigned_po: 'PO12345',
    follow_up_notes: 'Client prefers email communication',
    enquiry_number: 'ENQ-2024-0001',
    venue: 'Convention Center',
    site_survey_skipped: false,
    created_by: 1,
    created_by_user: {
      id: 1,
      name: 'Client Service Officer 1'
    },
    created_at: '2024-09-01T10:00:00Z',
    updated_at: '2024-09-01T10:00:00Z'
  },
  {
    id: 2,
    date_received: '2024-09-05',
    expected_delivery_date: '2024-09-20',
    client_name: 'XYZ Events',
    project_name: 'Wedding Exhibition Display',
    project_deliverables: 'Elegant display booth with lighting and branding',
    contact_person: 'Jane Smith',
    status: 'client_registered',
    enquiry_number: 'ENQ-2024-0002',
    venue: 'Exhibition Hall',
    site_survey_skipped: true,
    site_survey_skip_reason: 'Client provided detailed specifications',
    created_by: 2,
    created_by_user: {
      id: 2,
      name: 'Client Service Officer 2'
    },
    created_at: '2024-09-05T14:30:00Z',
    updated_at: '2024-09-10T16:45:00Z'
  },
  {
    id: 3,
    date_received: '2024-08-20',
    expected_delivery_date: '2024-09-10',
    client_name: 'ABC Corporation',
    project_name: 'Product Launch Event',
    project_deliverables: 'Stage setup, lighting, sound system, and branding',
    contact_person: 'Mike Johnson',
    status: 'converted_to_project',
    assigned_po: 'PO67890',
    enquiry_number: 'ENQ-2024-0003',
    venue: 'Grand Hotel Ballroom',
    site_survey_skipped: false,
    created_by: 1,
    created_by_user: {
      id: 1,
      name: 'Client Service Officer 1'
    },
    created_at: '2024-08-20T09:15:00Z',
    updated_at: '2024-09-15T11:20:00Z'
  }
]
