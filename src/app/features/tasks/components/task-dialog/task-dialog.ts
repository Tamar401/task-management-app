import { Component, inject, signal, OnInit, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task, TaskStatus, TaskPriority } from '../../../../core/models/task.model';
import { TasksService } from '../../../../core/services/tasks';


interface DialogData {
  projectId: number;
  status?: TaskStatus;
  task?: Task;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.scss'
})
export class TaskDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tasksService = inject(TasksService);
  private dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  isEditMode = signal(false);

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    status: ['todo' as TaskStatus, Validators.required],
    priority: ['normal' as TaskPriority, Validators.required],
    dueDate: ['']
  });

  statusOptions = [
    { value: 'todo', label: 'לביצוע' },
    { value: 'in_progress', label: 'בביצוע' },
    { value: 'done', label: 'הושלם' }
  ];

  priorityOptions = [
    { value: 'low', label: 'נמוכה' },
    { value: 'normal', label: 'רגילה' },
    { value: 'high', label: 'גבוהה' }
  ];

  ngOnInit(): void {
    if (this.data.task) {
      this.isEditMode.set(true);
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description || '',
        status: this.data.task.status,
        priority: this.data.task.priority,
        dueDate: this.data.task.dueDate || ''
      });
    } else if (this.data.status) {
      this.taskForm.patchValue({ status: this.data.status });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading.set(true);
      
      if (this.isEditMode()) {
        this.tasksService.updateTask(this.data.task!.id, this.taskForm.getRawValue()).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: () => {
            this.loading.set(false);
            this.snackBar.open('שגיאה בעדכון המשימה', 'סגור', { duration: 3000 });
          }
        });
      } else {
        const taskData = {
          ...this.taskForm.getRawValue(),
          projectId: this.data.projectId
        };
        
        this.tasksService.createTask(taskData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: () => {
            this.loading.set(false);
            this.snackBar.open('שגיאה ביצירת המשימה', 'סגור', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}