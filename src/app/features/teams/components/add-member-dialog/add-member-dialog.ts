import { Component, inject, Inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { TeamsService } from '../../../../core/services/teams';

interface DialogData {
  teamId: number;
  teamName: string;
}

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-member-dialog.html',
  styleUrl: './add-member-dialog.scss'
})
export class AddMemberDialogComponent {
  private fb = inject(FormBuilder);
  private teamsService = inject(TeamsService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<AddMemberDialogComponent>);

  submitting = signal(false);

  memberForm = this.fb.nonNullable.group({
    userId: ['', [Validators.required, Validators.min(1)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onSubmit(): void {
    if (this.memberForm.valid && !this.submitting()) {
      this.submitting.set(true);
      const userId = parseInt(this.memberForm.value.userId as any);

      this.teamsService.addMember(this.data.teamId, userId).subscribe({
        next: () => {
          this.snackBar.open('החבר נוסף בהצלחה', 'סגור', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error adding member:', error);
          this.submitting.set(false);
          const errorMsg = error?.error?.message || 'Error adding member to team';
          this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
