import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
      <div *ngFor="let alert of alertService.alerts()" 
           class="animate-fade-in-up bg-white rounded-xl shadow-2xl border-l-4 overflow-hidden transform transition-all flex items-start p-4"
           [ngClass]="{
             'border-green-500': alert.type === 'success',
             'border-red-500': alert.type === 'error',
             'border-blue-500': alert.type === 'info',
             'border-yellow-500': alert.type === 'warning'
           }">
        
        <!-- Icon -->
        <div class="flex-shrink-0 mr-3">
          <span class="material-icons text-2xl"
                [ngClass]="{
                  'text-green-500': alert.type === 'success',
                  'text-red-500': alert.type === 'error',
                  'text-blue-500': alert.type === 'info',
                  'text-yellow-500': alert.type === 'warning'
                }">
            {{ getIcon(alert.type) }}
          </span>
        </div>

        <!-- Content -->
        <div class="flex-1">
          <h3 class="text-sm font-bold text-gray-900 font-merriweather">{{ alert.title }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ alert.message }}</p>
        </div>

        <!-- Close button -->
        <button (click)="alertService.remove(alert.id)" class="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
          <span class="material-icons text-sm">close</span>
        </button>
      </div>
    </div>
  `
})
export class AlertComponent {
  alertService = inject(AlertService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'info': return 'info';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }
}
