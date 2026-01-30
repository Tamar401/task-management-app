/**
 * Server Response Models - Define exact types for API responses
 * This ensures type safety when processing data from the backend
 */

// Task Server Response (snake_case as returned by Express backend)
export interface TaskServerResponse {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'normal' | 'high';
  project_id: number;
  assignee_id?: number;
  created_by: number;
  due_date?: string;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

// Comment Server Response (snake_case as returned by Express backend)
export interface CommentServerResponse {
  id: number;
  body: string;
  task_id: number;
  user_id: number;
  author_name?: string;
  created_at: string;
}

// Project Server Response (snake_case as returned by Express backend)
export interface ProjectServerResponse {
  id: number;
  name: string;
  description?: string;
  team_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Team Server Response (snake_case as returned by Express backend)
export interface TeamServerResponse {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  members?: TeamMemberServerResponse[];
}

// Team Member Server Response
export interface TeamMemberServerResponse {
  user_id: number;
  user_name: string;
  email: string;
  role: 'member' | 'admin';
}

// User Server Response
export interface UserServerResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination metadata
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Paginated API Response
export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMetadata;
}
