export interface MaterialItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  total_cost: number;
  supplier?: string;
  procurement_status: 'not_started' | 'ordered' | 'received' | 'cancelled';
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
}

export interface MaterialsList {
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
  title: string;
  description: string;
  items: MaterialItem[];
  total_cost: number;
  created_by: number;
  created_by_user?: {
    id: number;
    name: string;
  };
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CreateMaterialsListData {
  enquiry_id: number;
  title: string;
  description: string;
  items: Omit<MaterialItem, 'id' | 'total_cost'>[];
}

export interface UpdateMaterialsListData extends Partial<CreateMaterialsListData> {
  status?: MaterialsList['status'];
}

export interface CreateMaterialItemData {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  supplier?: string;
  estimated_delivery_date?: string;
}

export interface UpdateMaterialItemData extends Partial<CreateMaterialItemData> {
  procurement_status?: MaterialItem['procurement_status'];
  actual_delivery_date?: string;
}