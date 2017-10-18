export interface Analysis {
  id: string;
  project_id: string;
  pipeline_id?: string;
  description?: string;
  created_at: string;
  created_by: string;
  status: string;
}

export interface CreateRequest {
  project_id: string;
  description?: string;
}

export interface UpdateRequest {
  pipeline_id?: string;
  description?: string;
}

export interface ListRequest {
  limit?: number;
}
