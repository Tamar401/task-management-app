import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError(error => {
      console.error('HTTP Error:', error);

      // Handle specific error codes
      switch (error.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          sessionStorage.removeItem('token');
          router.navigate(['/login']);
          snackBar.open('הסדרה פגה - אנא התחבר שוב', 'סגור', { duration: 3000 });
          break;

        case 403:
          // Forbidden
          snackBar.open('אין לך הרשאה לביצוע פעולה זו', 'סגור', { duration: 3000 });
          break;

        case 404:
          // Not found
          snackBar.open('הפריט לא נמצא', 'סגור', { duration: 3000 });
          break;

        case 400:
          // Bad request
          const errorMsg = error.error?.error || 'נתונים לא תקינים';
          snackBar.open(errorMsg, 'סגור', { duration: 3000 });
          break;

        case 409:
          // Conflict (e.g., email already exists)
          const conflictMsg = error.error?.error || 'קיימת התנגשות בנתונים';
          snackBar.open(conflictMsg, 'סגור', { duration: 3000 });
          break;

        case 500:
          // Server error
          snackBar.open('שגיאה בשרת - אנא נסה שוב מאוחר יותר', 'סגור', { duration: 3000 });
          break;

        case 0:
          // Network error
          snackBar.open('שגיאת חיבור - בדוק את החיבור לאינטרנט', 'סגור', { duration: 3000 });
          break;

        default:
          snackBar.open('אירעה שגיאה לא צפויה', 'סגור', { duration: 3000 });
      }

      return throwError(() => error);
    })
  );
};
