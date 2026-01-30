import { Injectable } from '@angular/core';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  
  private isDevelopment = !this.isProduction();

  private isProduction(): boolean {
    return typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
  }

  log(message: string, level: LogLevel = 'info', data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'error':
        console.error(logMessage, data || '');
        this.sendToServer(message, level, data);
        break;
      case 'warn':
        console.warn(logMessage, data || '');
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(logMessage, data || '');
        }
        break;
      case 'info':
      default:
        console.log(logMessage, data || '');
        break;
    }
  }

  // Send errors to server for monitoring (future: Sentry, LogRocket, etc.)
  private sendToServer(message: string, level: LogLevel, data?: any): void {
    // TODO: Implement error tracking to server
    // Example: Send to Sentry, LogRocket, or custom error tracking
    if (!this.isDevelopment) {
      // Only send errors in production
      // fetch('/api/logs', { method: 'POST', body: JSON.stringify({ message, level, data }) });
    }
  }

  error(message: string, error?: Error | any): void {
    this.log(message, 'error', error);
  }

  warn(message: string, data?: any): void {
    this.log(message, 'warn', data);
  }

  info(message: string, data?: any): void {
    this.log(message, 'info', data);
  }

  debug(message: string, data?: any): void {
    this.log(message, 'debug', data);
  }
}
