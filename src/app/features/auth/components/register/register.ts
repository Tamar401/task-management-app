import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  touched = signal({
    name: false,
    email: false,
    password: false
  });

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]]
  });

  constructor() {
    // Track when user starts typing
    this.registerForm.get('name')?.valueChanges.subscribe(() => {
      this.touched.update(t => ({ ...t, name: true }));
    });
    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      this.touched.update(t => ({ ...t, email: true }));
    });
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.touched.update(t => ({ ...t, password: true }));
    });
  }

  shouldShowError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    const touchedValue = this.touched();
    const isTouched = (touchedValue as any)[fieldName];
    return !!(field?.invalid && isTouched);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading.set(true);
      
      this.authService.register(this.registerForm.getRawValue()).subscribe({
        next: () => {
          this.router.navigate(['/teams']);
          this.snackBar.open('Signed up successfully!', 'Close', { duration: 3000 });
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Sign up failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}