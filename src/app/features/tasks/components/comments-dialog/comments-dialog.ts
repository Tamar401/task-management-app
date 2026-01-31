import { Component, inject, OnInit, signal, Inject, HostListener } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { CommentsService } from '../../../../core/services/comments';
import { AuthService } from '../../../../core/services/auth';


interface DialogData {
  taskId: number;
  taskTitle: string;
}

@Component({
  selector: 'app-comments-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './comments-dialog.html',
  styleUrl: './comments-dialog.scss'
})
export class CommentsDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private commentsService = inject(CommentsService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<CommentsDialogComponent>);

  currentUser = this.authService.currentUser;
  comments = signal<any[]>([]);
  loading = signal(false);
  submitting = signal(false);

  commentForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.loadComments();
  }

@HostListener('document:keydown.enter', ['$event'])
handleEnterKey(e: Event): void {
  // המרה מפורשת (Casting) בתוך הפונקציה
  const event = e as KeyboardEvent; 
  
  if (!event.shiftKey && this.commentForm.valid && !this.submitting()) {
    event.preventDefault();
    this.onSubmit();
  }
}

  loadComments(): void {
    this.loading.set(true);
    this.commentsService.loadComments(this.data.taskId).subscribe({
      next: (comments) => {
        this.comments.set(comments);
        this.loading.set(false);
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.loading.set(false);
        this.snackBar.open('Error loading comments', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid && !this.submitting()) {
      this.submitting.set(true);
      
      const commentData = {
        body: this.commentForm.value.content!.trim(),
        taskId: this.data.taskId
      };

      this.commentsService.createComment(commentData).subscribe({
        next: (newComment) => {
          // Add new comment to local list
          this.comments.update(comments => [...comments, newComment]);
          this.commentForm.reset();
          this.submitting.set(false);
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (error) => {
          console.error('Error creating comment:', error);
          this.submitting.set(false);
          this.snackBar.open('Error adding comment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  private scrollToBottom(): void {
    const messagesList = document.querySelector('.messages-list');
    if (messagesList) {
      messagesList.scrollTop = messagesList.scrollHeight;
    }
  }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentsService.deleteComment(commentId, this.data.taskId).subscribe({
        next: () => {
          this.snackBar.open('Comment deleted successfully', 'Close', { duration: 2000 });
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
          this.snackBar.open('Error deleting comment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  isCommentOwner(comment: any): boolean {
    return comment.userId === this.currentUser()?.id;
  }

  close(): void {
    this.dialogRef.close();
  }
  autoResize(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
}
}