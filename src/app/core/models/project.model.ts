export interface Project {
  id: number;
  name: string;
  description?: string;
  teamId: number;
  teamName?: string;
  createdAt: string;
  memberCount?: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  teamId: number;
}