export const API_CONFIG = {
  baseUrl: 'http://localhost:3000/api',
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