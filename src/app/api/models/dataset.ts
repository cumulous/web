export interface Dataset {
  id: string;
  project_id: string;
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
  description?: string;
}

export interface ListRequest {
  limit?: number;
}
