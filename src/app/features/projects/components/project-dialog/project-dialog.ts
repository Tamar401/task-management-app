import { Component, inject, signal, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectsService } from '../../../../core/services/projects';


interface DialogData {
  teamId: number;
}

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './project-dialog.html',
  styleUrl: './project-dialog.scss'
})
export class ProjectDialogComponent {
  private fb = inject(FormBuilder);
  private projectsService = inject(ProjectsService);
  private dialogRef = inject(MatDialogRef<ProjectDialogComponent>);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]]
  });

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.loading.set(true);
      
      const projectData: any = {
        name: this.projectForm.value.name!,
        teamId: this.data.teamId
      };
      
      if (this.projectForm.value.description && this.projectForm.value.description.trim()) {
        projectData.description = this.projectForm.value.description.trim();
      }
      
      this.projectsService.createProject(projectData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('שגיאה ביצירת הפרויקט', 'סגור', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}