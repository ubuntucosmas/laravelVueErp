export interface WorkflowTemplate {
  id: number;
  name: string;
  description?: string;
  type: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  // Relations
  creator?: {
    id: number;
    name: string;
  };
  templateTasks?: WorkflowTemplateTask[];
  instances?: WorkflowInstance[];
}

export interface WorkflowTemplateTask {
  id: number;
  workflow_template_id: number;
  name: string;
  description?: string;
  sequence: number;
  department_id?: number;
  assigned_role?: string;
  estimated_duration_days?: number;
  is_required: boolean;
  dependencies?: number[];
  created_at: string;
  updated_at: string;
  // Relations
  workflowTemplate?: WorkflowTemplate;
  department?: {
    id: number;
    name: string;
  };
  workflowTasks?: WorkflowTask[];
}

export interface WorkflowInstance {
  id: number;
  workflow_template_id: number;
  entity_type: string;
  entity_id: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  workflowTemplate?: WorkflowTemplate;
  workflowTasks?: WorkflowTask[];
}

export interface WorkflowTask {
  id: number;
  workflow_instance_id: number;
  workflow_template_task_id: number;
  assigned_user_id?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
  due_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  workflowInstance?: WorkflowInstance;
  workflowTemplateTask?: WorkflowTemplateTask;
  assignedUser?: {
    id: number;
    name: string;
  };
}

export interface CreateWorkflowTemplateData {
  name: string;
  description?: string;
  type: string;
  is_active?: boolean;
}


export interface CreateWorkflowTemplateTaskData {
  workflow_template_id: number;
  name: string;
  description?: string;
  sequence: number;
  department_id?: number;
  assigned_role?: string;
  estimated_duration_days?: number;
  is_required?: boolean;
  dependencies?: number[];
}


export interface CreateWorkflowInstanceData {
  workflow_template_id: number;
  entity_type: string;
  entity_id: number;
}

export interface UpdateWorkflowInstanceData extends Partial<CreateWorkflowInstanceData> {
  status?: WorkflowInstance['status'];
  started_at?: string;
  completed_at?: string;
}

export interface CreateWorkflowTaskData {
  workflow_instance_id: number;
  workflow_template_task_id: number;
  assigned_user_id?: number;
  due_date?: string;
  notes?: string;
}

export interface UpdateWorkflowTaskData extends Partial<CreateWorkflowTaskData> {
  status?: WorkflowTask['status'];
  started_at?: string;
  completed_at?: string;
}
