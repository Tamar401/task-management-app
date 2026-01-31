import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="home-container">
      <!-- Background Animation -->
      <div class="animated-background">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>

      <!-- Hero Section -->
      <section class="hero" @fadeInUp>
        <div class="hero-content">
          <h1 class="hero-title" @staggerTitle>
            <span class="word" *ngFor="let word of titleWords; let i = index">
              {{ word }}
            </span>
          </h1>
          <p class="hero-subtitle">Intelligent task management for your entire team</p>
          
          <div class="cta-buttons" @staggerAnimation>
            <a routerLink="/login" class="btn btn-primary" @scaleIn>
              <mat-icon>login</mat-icon>
              Sign In
            </a>
            <a routerLink="/register" class="btn btn-secondary" @scaleIn>
              <mat-icon>person_add</mat-icon>
              Sign Up
            </a>
          </div>
        </div>

        <div class="hero-illustration">
          <div class="floating-card card-1">
            <mat-icon>assignment</mat-icon>
            <p>Tasks</p>
          </div>
          <div class="floating-card card-2">
            <mat-icon>people</mat-icon>
            <p>Teams</p>
          </div>
          <div class="floating-card card-3">
            <mat-icon>folder</mat-icon>
            <p>Projects</p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features" @staggerAnimation>
        <h2>Key Features</h2>
        <div class="features-grid">
          <div class="feature-card" *ngFor="let feature of features; let i = index" [style.animation-delay]="i * 100 + 'ms'">
            <div class="feature-icon">
              <mat-icon>{{ feature.icon }}</mat-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats">
        <div class="stat-item" *ngFor="let stat of stats">
          <div class="stat-number">{{ stat.number }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2026 Wolf Tasks - All Rights Reserved</p>
      </footer>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      overflow: hidden;
      position: relative;
    }

    .animated-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }

    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.3;
      animation: blobAnimation 8s infinite ease-in-out;
    }

    .blob-1 {
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.5);
      top: -50px;
      left: -50px;
      animation-delay: 0s;
    }

    .blob-2 {
      width: 250px;
      height: 250px;
      background: rgba(100, 200, 255, 0.4);
      bottom: -30px;
      right: -30px;
      animation-delay: 2s;
    }

    .blob-3 {
      width: 200px;
      height: 200px;
      background: rgba(150, 100, 255, 0.4);
      bottom: 50px;
      left: 50%;
      animation-delay: 4s;
    }

    @keyframes blobAnimation {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }

    .hero {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 80px 40px;
      max-width: 1400px;
      margin: 0 auto;
      gap: 60px;
    }

    .hero-content {
      flex: 1;
    }

    .hero-title {
      font-size: 4rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 20px;
      letter-spacing: -2px;
    }

    .word {
      display: inline-block;
      margin-right: 10px;
      animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
    }

    .hero-subtitle {
      font-size: 1.3rem;
      margin-bottom: 40px;
      opacity: 0.95;
      font-weight: 300;
    }

    .cta-buttons {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 14px 32px;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      text-decoration: none;
      transform: translateY(0);
    }

    .btn-primary {
      background: white;
      color: #667eea;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .btn-primary:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-4px);
    }

    .hero-illustration {
      flex: 1;
      position: relative;
      height: 400px;
    }

    .floating-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      animation: float 6s ease-in-out infinite;
    }

    .card-1 {
      width: 100px;
      top: 0;
      left: 0;
      animation-delay: 0s;
    }

    .card-2 {
      width: 100px;
      top: 150px;
      right: 0;
      animation-delay: 1s;
    }

    .card-3 {
      width: 100px;
      bottom: 0;
      left: 50px;
      animation-delay: 2s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(3deg); }
    }

    .floating-card mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .floating-card p {
      font-size: 0.9rem;
      margin: 0;
    }

    /* Features Section */
    .features {
      position: relative;
      z-index: 1;
      padding: 100px 40px;
      max-width: 1400px;
      margin: 0 auto;
      text-align: center;
    }

    .features h2 {
      font-size: 3rem;
      margin-bottom: 60px;
      font-weight: 800;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 40px 30px;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      animation: slideUp 0.6s ease-out forwards;
      opacity: 0;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .feature-card:hover {
      transform: translateY(-10px) scale(1.02);
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .feature-icon {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 32px;
    }

    .feature-card h3 {
      font-size: 1.3rem;
      margin-bottom: 15px;
      font-weight: 700;
    }

    .feature-card p {
      font-size: 0.95rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    /* Stats Section */
    .stats {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-around;
      padding: 80px 40px;
      max-width: 1000px;
      margin: 0 auto;
      flex-wrap: wrap;
      gap: 40px;
    }

    .stat-item {
      text-align: center;
      animation: slideUp 0.6s ease-out forwards;
    }

    .stat-number {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    /* Footer */
    .footer {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 40px;
      border-top: 2px solid rgba(255, 255, 255, 0.1);
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .hero {
        flex-direction: column;
        padding: 40px 20px;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .cta-buttons {
        flex-direction: column;
        width: 100%;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .stats {
        flex-direction: column;
      }

      .stat-number {
        font-size: 2.5rem;
      }
    }
  `],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerTitle', [
      transition(':enter', [
        query('.word', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(100, [
            animate('0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('staggerAnimation', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'scale(0.8)' }),
          stagger(100, [
            animate('0.5s cubic-bezier(0.34, 1.56, 0.64, 1)', 
              style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.6s 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class HomeComponent {
  titleWords = ['Wolf', 'Tasks', '-', 'Smart', 'Task', 'Management'];

  features = [
    {
      icon: 'assignment_turned_in',
      title: 'Task Management',
      description: 'Create, edit and update tasks easily with an intuitive interface'
    },
    {
      icon: 'group_work',
      title: 'Team Collaboration',
      description: 'Work with your team in real-time and see instant updates'
    },
    {
      icon: 'dashboard',
      title: 'Reports & Analytics',
      description: 'Track project progress with clear graphics and insights'
    },
    {
      icon: 'security',
      title: 'Advanced Security',
      description: 'Keep your data safe with encryption and access codes'
    },
    {
      icon: 'notifications_active',
      title: 'Smart Alerts',
      description: 'Get notified about important tasks and deadlines'
    },
    {
      icon: 'cloud_sync',
      title: 'Cloud Sync',
      description: 'Access your data from any device, anytime'
    }
  ];

  stats = [
    { number: '1000+', label: 'Active Users' },
    { number: '5000+', label: 'Completed Tasks' },
    { number: '99.9%', label: 'Uptime' }
  ];
}
