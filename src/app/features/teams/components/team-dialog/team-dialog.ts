import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamsService } from '../../../../core/services/teams';


@Component({
  selector: 'app-team-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './team-dialog.html',
  styleUrl: './team-dialog.scss'
})
export class TeamDialogComponent {
  private fb = inject(FormBuilder);
  private teamsService = inject(TeamsService);
  private dialogRef = inject(MatDialogRef<TeamDialogComponent>);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);

  teamForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]]
  });

  onSubmit(): void {
    if (this.teamForm.valid) {
      this.loading.set(true);
      
      // Build object with only populated fields
      const teamData: any = {
        name: this.teamForm.value.name!
      };
      
      // Add description only if it's not empty
      if (this.teamForm.value.description && this.teamForm.value.description.trim()) {
        teamData.description = this.teamForm.value.description.trim();
      }
      
      this.teamsService.createTeam(teamData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading.set(false);
          this.snackBar.open('Error creating team', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}