import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Task, TaskStatus } from '../../../../core/models/task.model';
import {  TaskCardComponent } from '../task-card/task-card';
import { TasksService } from '../../../../core/services/tasks';
import {  TaskDialogComponent } from '../task-dialog/task-dialog';

@Component({
  selector: 'app-tasks-board',
  standalone: true,
  imports: [
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TaskCardComponent
  ],
  templateUrl: './tasks-board.html',
  styleUrl: './tasks-board.scss'
})
export class TasksBoardComponent implements OnInit {
  private tasksService = inject(TasksService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  projectId = Number(this.route.snapshot.paramMap.get('projectId'));
  loading = this.tasksService.loading;
  allTasks = this.tasksService.tasks;

  todoTasks = computed(() => 
    this.allTasks().filter(t => t.status === 'todo' && t.projectId === this.projectId)
  );
  
  inProgressTasks = computed(() => 
    this.allTasks().filter(t => t.status === 'in_progress' && t.projectId === this.projectId)
  );

  onDrop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
    const task = event.item.data as Task;
    
    if (event.previousContainer === event.container) {
      return;
  }
  
  this.tasksService.updateTask(task.id, { status: newStatus }).subscribe({
    next: () => {
      this.snackBar.open('המשימה עודכנה בהצלחה!', 'סגור', { duration: 2000 });
    },
    error: () => {
      this.snackBar.open('שגיאה בעדכון המשימה', 'סגור', { duration: 3000 });
      this.loadTasks();
    }
  });
}
  
  doneTasks = computed(() => 
    this.allTasks().filter(t => t.status === 'done' && t.projectId === this.projectId)
  );

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService.loadTasks(this.projectId).subscribe({
      error: () => {
        this.snackBar.open('שגיאה בטעינת המשימות', 'סגור', { duration: 3000 });
      }
    });
  }

  openTaskDialog(status: TaskStatus = 'todo'): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      data: { projectId: this.projectId, status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('המשימה נוצרה בהצלחה!', 'סגור', { duration: 3000 });
      }
    });
  }



  onTaskDeleted(taskId: number): void {
    this.snackBar.open('המשימה נמחקה בהצלחה!', 'סגור', { duration: 2000 });
  }

  goBack(): void {
    this.router.navigate(['/projects', this.route.snapshot.paramMap.get('teamId')]);
  }
}