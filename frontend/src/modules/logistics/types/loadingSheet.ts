export interface LoadingSheetItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  loaded: boolean;
}

export interface LoadingSheet {
  id: string;
  loadingSheetNumber: string;
  type: 'outbound' | 'return';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  projectId: string;
  projectName: string;
  date: string;
  time: string;
  items: LoadingSheetItem[];
  driver: string;
  vehicle: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
