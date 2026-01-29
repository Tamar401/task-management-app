import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Task, TaskStatus, TaskPriority } from '../../../../core/models/task.model';
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
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
  private fb = inject(FormBuilder);

  projectId = Number(this.route.snapshot.paramMap.get('projectId'));
  loading = this.tasksService.loading;
  allTasks = this.tasksService.tasks;

  // Filter signals
  searchText = signal('');
  filterPriority = signal<TaskPriority | ''>('');
  filterStatus = signal<TaskStatus | ''>('');

  // Computed filtered tasks
  filteredTasks = computed(() => {
    let tasks = this.allTasks().filter(t => t.projectId === this.projectId);
    
    const search = this.searchText().toLowerCase();
    const priority = this.filterPriority();
    const status = this.filterStatus();

    if (search) {
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(search) || 
        (t.description && t.description.toLowerCase().includes(search))
      );
    }

    if (priority) {
      tasks = tasks.filter(t => t.priority === priority);
    }

    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }

    return tasks;
  });

  todoTasks = computed(() => 
    this.filteredTasks().filter(t => t.status === 'todo')
  );
  
  inProgressTasks = computed(() => 
    this.filteredTasks().filter(t => t.status === 'in_progress')
  );

  doneTasks = computed(() => 
    this.filteredTasks().filter(t => t.status === 'done')
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

  clearFilters(): void {
    this.searchText.set('');
    this.filterPriority.set('');
    this.filterStatus.set('');
  }

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