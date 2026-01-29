import { Component, input, output, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { Task } from '../../../../core/models/task.model';
import { CommentsSectionComponent } from '../comments-section/comments-section';
import { TasksService } from '../../../../core/services/tasks';
import { TaskDialogComponent } from '../task-dialog/task-dialog';


@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    CommentsSectionComponent
  ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCardComponent {
  private dialog = inject(MatDialog);
  private tasksService = inject(TasksService);
  private snackBar = inject(MatSnackBar);

  task = input.required<Task>();
  taskDeleted = output<number>();

  getPriorityColor(priority: string): string {
  const colors = {
    'low': 'accent',
    'normal': 'primary',
    'high': 'warn'
  };
  return colors[priority as keyof typeof colors] || 'primary';
}

getPriorityLabel(priority: string): string {
  const labels = {
    'low': 'נמוכה',
    'normal': 'רגילה',
    'high': 'גבוהה'
  };
  return labels[priority as keyof typeof labels] || priority;
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
        },
        error: () => {
          this.snackBar.open('שגיאה במחיקת המשימה', 'סגור', { duration: 3000 });
        }
      });
    }
  }
}