import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Comment, CreateCommentRequest } from '../models/comment.model';
import { CommentServerResponse, ApiResponse } from '../models/server-response.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.comments}`;

  public comments = signal<Comment[]>([]);
  public loading = signal<boolean>(false);
  
  // Map של תגובות לפי taskId
  private commentsMap = new Map<number, Comment[]>();

  private normalizeComment(serverComment: CommentServerResponse): Comment {
    return {
      id: serverComment.id,
      body: serverComment.body,
      taskId: serverComment.task_id,
      userId: serverComment.user_id,
      userName: serverComment.author_name || 'Anonymous User',
      createdAt: serverComment.created_at
    };
  }

  loadComments(taskId: number): Observable<Comment[]> {
    this.loading.set(true);
    const params = new HttpParams().set('taskId', taskId.toString());
    
    return this.http.get<CommentServerResponse[]>(this.apiUrl, { params }).pipe(
      map(comments => comments.map(c => this.normalizeComment(c))),
      tap(normalizedComments => {
        this.commentsMap.set(taskId, normalizedComments);
        this.comments.set(normalizedComments);
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Error loading comments:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  createComment(comment: CreateCommentRequest): Observable<Comment> {
    return this.http.post<CommentServerResponse>(this.apiUrl, comment).pipe(
      map(serverComment => this.normalizeComment(serverComment)),
      tap(normalizedComment => {
        const taskComments = this.commentsMap.get(comment.taskId) || [];
        this.commentsMap.set(comment.taskId, [...taskComments, normalizedComment]);
        this.comments.update(comments => [...comments, normalizedComment]);
      }),
      catchError(error => {
        console.error('Error creating comment:', error);
        return throwError(() => error);
      })
    );
  }

  deleteComment(commentId: number, taskId?: number): Observable<void> {
    const url = `${this.apiUrl}/${commentId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        // Remove from comments array
        this.comments.update(comments => 
          comments.filter(c => c.id !== commentId)
        );
        
        // Remove from commentsMap if taskId provided
        if (taskId !== undefined) {
          const taskComments = this.commentsMap.get(taskId) || [];
          this.commentsMap.set(taskId, taskComments.filter(c => c.id !== commentId));
        }
      }),
      catchError(error => {
        console.error('Error deleting comment:', error);
        return throwError(() => error);
      })
    );
  }

  getCommentsForTask(taskId: number): Comment[] {
    return this.commentsMap.get(taskId) || [];
  }
}