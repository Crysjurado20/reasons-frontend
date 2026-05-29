import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="dialog.isOpen()"
         class="fixed inset-0 z-[300] flex items-center justify-center p-4"
         (click)="onBackdropClick($event)">

      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"></div>

      <!-- Dialog Card -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        
        <!-- Icon Header -->
        <div class="px-6 pt-8 pb-4 flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
               [ngClass]="dialog.dialogData().type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'">
            <span class="material-icons text-3xl"
                  [ngClass]="dialog.dialogData().type === 'danger' ? 'text-red-500' : 'text-yellow-500'">
              {{ dialog.dialogData().type === 'danger' ? 'delete_forever' : 'warning' }}
            </span>
          </div>
          <h3 class="text-xl font-bold text-gray-800 font-merriweather">
            {{ dialog.dialogData().title }}
          </h3>
          <p class="text-gray-500 text-sm mt-2 leading-relaxed">
            {{ dialog.dialogData().message }}
          </p>
        </div>

        <!-- Actions -->
        <div class="px-6 pb-6 flex gap-3 justify-center mt-2">
          <button
            (click)="dialog.resolve(false)"
            class="flex-1 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all">
            {{ dialog.dialogData().cancelText }}
          </button>
          <button
            (click)="dialog.resolve(true)"
            class="flex-1 px-5 py-2.5 rounded-xl font-semibold text-white transition-all shadow-md hover:shadow-lg active:scale-95"
            [ngClass]="dialog.dialogData().type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'">
            {{ dialog.dialogData().confirmText }}
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.9) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.2s ease-out; }
    .animate-scale-in { animation: scale-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
  `]
})
export class ConfirmDialogComponent {
  dialog = inject(ConfirmDialogService);

  onBackdropClick(event: MouseEvent) {
    // Only close if clicking on the backdrop, not the card
    if (event.target === event.currentTarget) {
      this.dialog.resolve(false);
    }
  }
}
