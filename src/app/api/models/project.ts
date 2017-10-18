export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  created_by: string;
  status: string;
}

export interface CreateRequest {
  name: string;
  description?: string;
}

export interface UpdateRequest {
  name?: string;
  description?: string;
}

export interface ListRequest {
  limit?: number;
}
