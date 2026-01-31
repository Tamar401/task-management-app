import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Team, CreateTeamRequest } from '../models/team.model';
import { TeamServerResponse } from '../models/server-response.model';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.teams}`;

  teams = signal<Team[]>([]);
  loading = signal(false);
  private teamDescriptions = this.loadDescriptionsFromStorage();

  private loadDescriptionsFromStorage(): Map<number, string> {
    try {
      const stored = localStorage.getItem('teamDescriptions');
      if (stored) {
        const map = new Map<number, string>();
        Object.entries(JSON.parse(stored)).forEach(([key, value]) => {
          map.set(parseInt(key), value as string);
        });
        return map;
      }
    } catch (e) {
      console.error('Error loading team descriptions from storage', e);
    }
    return new Map<number, string>();
  }

  private saveDescriptionsToStorage(): void {
    try {
      const obj: Record<string, string> = {};
      this.teamDescriptions.forEach((value, key) => {
        obj[key.toString()] = value;
      });
      localStorage.setItem('teamDescriptions', JSON.stringify(obj));
    } catch (e) {
      console.error('Error saving team descriptions to storage', e);
    }
  }

  private normalizeTeam(serverTeam: TeamServerResponse): Team {
    const description = this.teamDescriptions.get(serverTeam.id) || serverTeam.description || '';
    const memberCount = serverTeam.members?.length || 1;
    return {
      id: serverTeam.id,
      name: serverTeam.name,
      description: description,
      createdAt: serverTeam.created_at,
      memberCount: memberCount > 0 ? memberCount : 1
    };
  }

  loadTeams(): Observable<Team[]> {
    this.loading.set(true);
    this.teamDescriptions = this.loadDescriptionsFromStorage();
    return this.http.get<TeamServerResponse[]>(this.apiUrl).pipe(
      map(teams => teams.map(t => this.normalizeTeam(t))),
      tap(teams => {
        this.teams.set(teams);
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  createTeam(team: CreateTeamRequest): Observable<Team> {
    return this.http.post<any>(this.apiUrl, team).pipe(
      map(serverTeam => {
        if (team.description) {
          this.teamDescriptions.set(serverTeam.id, team.description);
          this.saveDescriptionsToStorage();
        }
        return this.normalizeTeam(serverTeam);
      }),
      tap(normalizedTeam => {
        this.teams.update(teams => [...teams, normalizedTeam]);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  addMember(teamId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${teamId}/members`, { userId }).pipe(
      tap(() => {
        // Update member count in client
        this.teams.update(teams =>
          teams.map(team =>
            team.id === teamId
              ? { ...team, memberCount: (team.memberCount || 0) + 1 }
              : team
          )
        );
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}