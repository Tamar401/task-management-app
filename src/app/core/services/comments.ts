import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Comment, CreateCommentRequest } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.comments}`;
// בתוך comments.service.ts
public comments = signal<Comment[]>([]);
public loading = signal<boolean>(false);
  // Map של תגובות לפי taskId
  private commentsMap = new Map<number, Comment[]>();

  loadComments(taskId: number): Observable<Comment[]> {
    const params = new HttpParams().set('taskId', taskId.toString());
    
    return this.http.get<Comment[]>(this.apiUrl, { params }).pipe(
      tap(comments => {
        console.log(`Comments loaded for task ${taskId}:`, comments);
        this.commentsMap.set(taskId, comments);
      }),
      catchError(error => {
        console.error('Error loading comments:', error);
        return throwError(() => error);
      })
    );
  }

  createComment(comment: CreateCommentRequest): Observable<Comment> {
    console.log('Creating comment with data:', comment);
    
    return this.http.post<Comment>(this.apiUrl, comment).pipe(
      tap(newComment => {
        console.log('Comment created successfully:', newComment);
        
        // עדכן רק את התגובות של המשימה הספציפית
        const taskComments = this.commentsMap.get(comment.taskId) || [];
        this.commentsMap.set(comment.taskId, [...taskComments, newComment]);
      }),
      catchError(error => {
        console.error('Error creating comment:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }

  getCommentsForTask(taskId: number): Comment[] {
    return this.commentsMap.get(taskId) || [];
  }
}