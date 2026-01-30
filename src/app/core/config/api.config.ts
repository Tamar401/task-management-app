import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    auth: {
      register: '/auth/register',
      login: '/auth/login'
    },
    teams: '/teams',
    projects: '/projects',
    tasks: '/tasks',
    comments: '/comments'
  }
} as const;