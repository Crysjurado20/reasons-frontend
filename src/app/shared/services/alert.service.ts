import { Injectable, signal } from '@angular/core';

export interface Alert {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timeout?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alerts = signal<Alert[]>([]);

  show(alert: Omit<Alert, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const newAlert = { ...alert, id, timeout: alert.timeout || 5000 };
    
    this.alerts.update(alerts => [...alerts, newAlert]);

    if (newAlert.timeout > 0) {
      setTimeout(() => this.remove(id), newAlert.timeout);
    }
  }

  success(title: string, message: string, timeout = 5000) {
    this.show({ type: 'success', title, message, timeout });
  }

  error(title: string, message: string, timeout = 5000) {
    this.show({ type: 'error', title, message, timeout });
  }

  warning(title: string, message: string, timeout = 5000) {
    this.show({ type: 'warning', title, message, timeout });
  }

  info(title: string, message: string, timeout = 5000) {
    this.show({ type: 'info', title, message, timeout });
  }

  remove(id: string) {
    this.alerts.update(alerts => alerts.filter(a => a.id !== id));
  }
}
