export const ENQUIRY_STATUSES = [
  'client_registered',
  'enquiry_logged',
  'site_survey_completed',
  'design_completed',
  'design_approved',
  'materials_specified',
  'budget_created',
  'quote_prepared',
  'quote_approved',
  'converted_to_project',
  'planning',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const ENQUIRY_PRIORITIES = [
  'low',
  'medium',
  'high',
  'urgent',
] as const;

export const ENQUIRY_STATUS_LABELS: Record<string, string> = {
  'client_registered': 'Client Registered',
  'enquiry_logged': 'Enquiry Logged',
  'site_survey_completed': 'Site Survey Done',
  'design_completed': 'Design Completed',
  'design_approved': 'Design Approved',
  'materials_specified': 'Materials Specified',
  'budget_created': 'Budget Created',
  'quote_prepared': 'Quote Prepared',
  'quote_approved': 'Quote Approved',
  'converted_to_project': 'Converted to Project',
  'planning': 'Planning',
  'in_progress': 'In Progress',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
  'pending': 'Pending',
};

export const ENQUIRY_STATUS_COLORS: Record<string, string> = {
  'client_registered': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'enquiry_logged': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'site_survey_completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'design_completed': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'design_approved': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'materials_specified': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'budget_created': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'quote_prepared': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'quote_approved': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  'converted_to_project': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'planning': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const PAGINATION_PER_PAGE = 6;

export const CONVERTIBLE_STATUSES = ['quote_approved'];
