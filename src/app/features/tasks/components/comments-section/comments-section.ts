import { Component, input, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { CommentsService } from '../../../../core/services/comments';
import { AuthService } from '../../../../core/services/auth';


@Component({
  selector: 'app-comments-section',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './comments-section.html',
  styleUrl: './comments-section.scss'
})
export class CommentsSectionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private commentsService = inject(CommentsService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  taskId = input.required<number>();

  comments = this.commentsService.comments;
loading = this.commentsService.loading;
  submitting = signal(false);

  commentForm = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(1)]]
  });

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentsService.loadComments(this.taskId()).subscribe({
      error: () => {
        this.snackBar.open('Error loading comments', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid && this.commentForm.value.content?.trim()) {
      this.submitting.set(true);
      
      const commentData = {
        body: this.commentForm.value.content.trim(),
        taskId: this.taskId()
      };

      this.commentsService.createComment(commentData).subscribe({
        next: () => {
          this.commentForm.reset();
          this.submitting.set(false);
          // Refresh comments
          this.loadComments();
        },
        error: () => {
          this.submitting.set(false);
          this.snackBar.open('Error adding comment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  }
}