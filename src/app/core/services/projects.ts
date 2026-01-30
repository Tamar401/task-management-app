import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Project, CreateProjectRequest } from '../models/project.model';
import { ProjectServerResponse } from '../models/server-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.projects}`;

  projects = signal<Project[]>([]);
  loading = signal(false);

  private normalizeProject(serverProject: ProjectServerResponse): Project {
    return {
      id: serverProject.id,
      name: serverProject.name,
      description: serverProject.description,
      teamId: serverProject.team_id,
      teamName: '',
      createdAt: serverProject.created_at
    };
  }

  loadProjects(): Observable<Project[]> {
    this.loading.set(true);
    return this.http.get<ProjectServerResponse[]>(this.apiUrl).pipe(
      map(projects => projects.map(p => this.normalizeProject(p))),
      tap(projects => {
        this.projects.set(projects);
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  createProject(project: CreateProjectRequest): Observable<Project> {
    return this.http.post<any>(this.apiUrl, project).pipe(
      map(serverProject => this.normalizeProject(serverProject)),
      tap(normalizedProject => {
        this.projects.update(projects => [...projects, normalizedProject]);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}