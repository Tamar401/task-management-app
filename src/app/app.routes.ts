import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';


export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/teams', 
    pathMatch: 'full' 
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/components/register/register')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'teams',
    loadComponent: () => import('./features/teams/components/teams-list/teams-list')
      .then(m => m.TeamsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'projects/:teamId',
    loadComponent: () => import('./features/projects/components/projects-list/projects-list')
      .then(m => m.ProjectsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tasks/:projectId',
    loadComponent: () => import('./features/tasks/components/tasks-board/tasks-board')
      .then(m => m.TasksBoardComponent),
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    redirectTo: '/teams' 
  }
];