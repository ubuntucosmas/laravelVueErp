export interface QuotationItem {
  id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category: string;
}

export interface Quotation {
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
  materials_list_id?: number;
  title: string;
  description: string;
  items: QuotationItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  total_amount: number;
  valid_until: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  notes?: string;
  created_by: number;
  created_by_user?: {
    id: number;
    name: string;
  };
  approved_by?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateQuotationData {
  enquiry_id: number;
  materials_list_id?: number;
  title: string;
  description: string;
  items: Omit<QuotationItem, 'id' | 'total_price'>[];
  tax_rate: number;
  discount_rate: number;
  valid_until: string;
  notes?: string;
}

export interface UpdateQuotationData extends Partial<CreateQuotationData> {
  status?: Quotation['status'];
  approved_by?: number;
  approved_at?: string;
}

export interface CreateQuotationItemData {
  description: string;
  quantity: number;
  unit_price: number;
  category: string;
}