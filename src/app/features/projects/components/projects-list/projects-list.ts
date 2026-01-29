import { Component, OnInit, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectsService } from '../../../../core/services/projects';
import { ProjectDialogComponent } from '../project-dialog/project-dialog';


@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss'
})
export class ProjectsListComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  teamId = Number(this.route.snapshot.paramMap.get('teamId'));
  
  allProjects = this.projectsService.projects;
  loading = this.projectsService.loading;
  
  projects = computed(() => 
    this.allProjects().filter(p => p.teamId === this.teamId)
  );

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectsService.loadProjects().subscribe({
      error: () => {
        this.snackBar.open('שגיאה בטעינת הפרויקטים', 'סגור', { duration: 3000 });
      }
    });
  }

  openProjectDialog(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      data: { teamId: this.teamId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('הפרויקט נוצר בהצלחה!', 'סגור', { duration: 3000 });
        this.loadProjects();
      }
    });
  }

  viewTasks(projectId: number): void {
    this.router.navigate(['/tasks', projectId]);
  }

  goBack(): void {
    this.router.navigate(['/teams']);
  }
}