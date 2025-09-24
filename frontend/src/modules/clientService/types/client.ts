export interface Client {
  id: number;
  FullName: string;
  ContactPerson: string;
  Email: string;
  Phone: string;
  AltContact?: string;
  Address: string;
  City: string;
  County: string;
  PostalAddress?: string;
  CustomerType: 'individual' | 'company' | 'organization';
  LeadSource: string;
  PreferredContact: 'email' | 'phone' | 'sms';
  Industry?: string;
  companyName: string;
  isActive: boolean;
  registration_date: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  FullName: string;
  ContactPerson: string;
  Email: string;
  Phone: string;
  AltContact?: string;
  Address: string;
  City: string;
  County: string;
  PostalAddress?: string;
  CustomerType: 'individual' | 'company' | 'organization';
  LeadSource: string;
  PreferredContact: 'email' | 'phone' | 'sms';
  Industry?: string;
  companyName: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  status?: 'active' | 'inactive';
}
