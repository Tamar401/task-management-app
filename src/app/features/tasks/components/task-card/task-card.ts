import { Component, input, output, inject, signal, SecurityContext } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Task } from '../../../../core/models/task.model';
import { TasksService } from '../../../../core/services/tasks';
import { CommentsService } from '../../../../core/services/comments';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog';


@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatBadgeModule
  ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCardComponent {
  private dialog = inject(MatDialog);
  private tasksService = inject(TasksService);
  private commentsService = inject(CommentsService);
  private snackBar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);

  task = input.required<Task>();
  taskDeleted = output<number>();

  commentsCount = signal(0);

  ngOnInit(): void {
    this.loadCommentsCount();
  }

  loadCommentsCount(): void {
    this.commentsService.loadComments(this.task().id).subscribe({
      next: (comments) => {
        this.commentsCount.set(comments.length);
      },
      error: () => {}
    });
  }

  getPriorityColor(priority: string): string {
    const colors = {
      'low': 'accent',
      'medium': 'primary',
      'high': 'warn'
    };
    return colors[priority as keyof typeof colors] || 'primary';
  }

  getPriorityLabel(priority: string): string {
    const labels = {
      'low': 'נמוכה',
      'medium': 'בינונית',
      'high': 'גבוהה'
    };
    return labels[priority as keyof typeof labels] || priority;
  }

  // Sanitize text content to prevent XSS
  sanitizeText(text: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, text) || text;
  }

  openComments(event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(CommentsDialogComponent, {
      width: '500px',
      height: '600px',
      maxWidth: '90vw',
      panelClass: 'comments-dialog',
      data: { 
        taskId: this.task().id,
        taskTitle: this.task().title
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadCommentsCount();
    });
  }

  editTask(event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      data: { task: this.task(), projectId: this.task().projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('המשימה עודכנה בהצלחה!', 'סגור', { duration: 2000 });
      }
    });
  }

  deleteTask(event: Event): void {
    event.stopPropagation();
    
    if (confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
      this.tasksService.deleteTask(this.task().id).subscribe({
        next: () => {
          this.taskDeleted.emit(this.task().id);
          this.snackBar.open('המשימה נמחקה בהצלחה!', 'סגור', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('שגיאה במחיקת המשימה', 'סגור', { duration: 3000 });
        }
      });
    }
  }
}