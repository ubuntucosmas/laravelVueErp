// src/modules/production/types/labor.ts
export interface LaborAssignment {
    id: number;
    project_id: number;
    labor_category: 'workshop' | 'setup' | 'setdown';
    labor_type: 'internal' | 'external';
    employee_id?: number;
    employee?: {
      id: number;
      name: string;
      department: string;
      position: string;
      avatar?: string;
    };
    external_name?: string;
    external_rate?: number;
    hours_allocated: number;
    start_date: string;
    end_date: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ProjectWithAssignments {
    id: number;
    title: string;
    client: {
      id: number;
      name: string;
    };
    status: string;
    workshop_labor: LaborAssignment[];
    setup_labor: LaborAssignment[];
    setdown_labor: LaborAssignment[];
  }