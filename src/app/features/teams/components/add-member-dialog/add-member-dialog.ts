import { Component, inject, Inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamsService } from '../../../../core/services/teams';

interface DialogData {
  teamId: number;
  teamName: string;
}

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>הוסף חבר לצוות {{ data.teamName }}</h2>
    <mat-dialog-content>
      <form [formGroup]="memberForm" class="form-container">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>מזהה משתמש</mat-label>
          <input 
            matInput 
            formControlName="userId" 
            type="number" 
            placeholder="הזן את מזהה המשתמש"
          />
          @if (memberForm.get('userId')?.hasError('required')) {
            <mat-error>שדה זה חובה</mat-error>
          }
          @if (memberForm.get('userId')?.hasError('min')) {
            <mat-error>מזהה המשתמש חייב להיות חיובי</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">ביטול</button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onSubmit()"
        [disabled]="!memberForm.valid || submitting()"
      >
        {{ submitting() ? 'הוספה...' : 'הוסף חבר' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }
    .full-width {
      width: 100%;
    }
    mat-dialog-actions {
      padding: 16px 0 0 0;
    }
  `]
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
          const errorMsg = error?.error?.message || 'שגיאה בהוספת החבר לצוות';
          this.snackBar.open(errorMsg, 'סגור', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
