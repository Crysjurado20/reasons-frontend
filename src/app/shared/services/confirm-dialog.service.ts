import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  isOpen = signal(false);
  dialogData = signal<ConfirmDialogData>({
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'danger'
  });

  private result$ = new Subject<boolean>();

  confirm(data: ConfirmDialogData): Promise<boolean> {
    this.dialogData.set({
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      type: 'danger',
      ...data
    });
    this.isOpen.set(true);
    return new Promise(resolve => {
      this.result$.subscribe(result => resolve(result));
    });
  }

  resolve(value: boolean) {
    this.isOpen.set(false);
    this.result$.next(value);
  }
}
