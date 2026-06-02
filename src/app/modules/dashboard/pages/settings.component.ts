import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="max-w-4xl mx-auto space-y-6">
  <div class="mb-8">
    <h2 class="text-3xl font-bold font-merriweather text-gray-800">Ajustes de Perfil</h2>
    <p class="text-gray-500 mt-2">Administra tu información de cuenta y seguridad.</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Cambio de Email -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div class="flex items-center space-x-3 mb-6">
        <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <span class="material-icons">email</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800">Cambiar Correo</h3>
      </div>
      
      <form [formGroup]="emailForm" (ngSubmit)="onEmailSubmit()" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-bold text-gray-700">Nuevo Correo Electrónico</label>
          <input type="email" formControlName="newEmail" class="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" placeholder="nuevo@correo.com">
          <p *ngIf="emailForm.get('newEmail')?.touched && emailForm.get('newEmail')?.invalid" class="text-xs text-red-500">Formato de correo inválido.</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-bold text-gray-700">Contraseña Actual</label>
          <div class="relative">
            <input [type]="showEmailPassword ? 'text' : 'password'" formControlName="currentPassword" class="pr-10 flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" placeholder="••••••••">
            <button type="button" (click)="showEmailPassword = !showEmailPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary focus:outline-none transition-colors">
              <span class="material-icons text-[20px]">{{ showEmailPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
          <p *ngIf="emailForm.get('currentPassword')?.touched && emailForm.get('currentPassword')?.invalid" class="text-xs text-red-500">Requerido.</p>
        </div>

        <button type="submit" [disabled]="isSubmittingEmail" class="mt-4 w-full h-11 bg-primary text-white font-semibold rounded-xl shadow-md hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 flex justify-center items-center">
          <span *ngIf="isSubmittingEmail" class="material-icons animate-spin mr-2 text-sm">refresh</span>
          Actualizar Correo
        </button>
      </form>
    </div>

    <!-- Cambio de Contraseña -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div class="flex items-center space-x-3 mb-6">
        <div class="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <span class="material-icons">password</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800">Cambiar Contraseña</h3>
      </div>
      
      <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-bold text-gray-700">Contraseña Actual</label>
          <div class="relative">
            <input [type]="showCurrentPwd ? 'text' : 'password'" formControlName="currentPassword" class="pr-10 flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" placeholder="••••••••">
            <button type="button" (click)="showCurrentPwd = !showCurrentPwd" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary focus:outline-none transition-colors">
              <span class="material-icons text-[20px]">{{ showCurrentPwd ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
          <p *ngIf="passwordForm.get('currentPassword')?.touched && passwordForm.get('currentPassword')?.invalid" class="text-xs text-red-500">Requerido.</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-bold text-gray-700">Nueva Contraseña</label>
          <div class="relative">
            <input [type]="showNewPwd ? 'text' : 'password'" formControlName="newPassword" class="pr-10 flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" placeholder="••••••••">
            <button type="button" (click)="showNewPwd = !showNewPwd" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary focus:outline-none transition-colors">
              <span class="material-icons text-[20px]">{{ showNewPwd ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
          <p *ngIf="passwordForm.get('newPassword')?.touched && passwordForm.get('newPassword')?.invalid" class="text-xs text-red-500">Mínimo 6 caracteres.</p>
        </div>

        <button type="submit" [disabled]="isSubmittingPassword" class="mt-4 w-full h-11 bg-primary text-white font-semibold rounded-xl shadow-md hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 flex justify-center items-center">
          <span *ngIf="isSubmittingPassword" class="material-icons animate-spin mr-2 text-sm">refresh</span>
          Actualizar Contraseña
        </button>
      </form>
    </div>
  </div>
</div>
  `
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly alertService = inject(AlertService);

  isSubmittingEmail = false;
  isSubmittingPassword = false;

  showEmailPassword = false;
  showCurrentPwd = false;
  showNewPwd = false;

  emailForm: FormGroup = this.fb.group({
    newEmail: ['', [Validators.required, Validators.email]],
    currentPassword: ['', [Validators.required]]
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  onEmailSubmit() {
    if (this.emailForm.valid) {
      this.isSubmittingEmail = true;
      this.http.post('http://localhost:3000/api/auth/change-email', this.emailForm.value, { headers: this.getAuthHeaders() }).subscribe({
        next: (res: any) => {
          this.isSubmittingEmail = false;
          this.alertService.success('Éxito', 'Correo actualizado exitosamente.');
          this.emailForm.reset();
          // Update local user data if needed
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.email = res.email || this.emailForm.value.newEmail;
            localStorage.setItem('user', JSON.stringify(user));
          }
        },
        error: (err: any) => {
          this.isSubmittingEmail = false;
          this.alertService.error('Error', err.error?.message || 'Error al actualizar el correo.');
        }
      });
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid) {
      this.isSubmittingPassword = true;
      this.http.post('http://localhost:3000/api/auth/change-password', this.passwordForm.value, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          this.isSubmittingPassword = false;
          this.alertService.success('Éxito', 'Contraseña actualizada exitosamente.');
          this.passwordForm.reset();
        },
        error: (err: any) => {
          this.isSubmittingPassword = false;
          this.alertService.error('Error', err.error?.message || 'Error al actualizar la contraseña.');
        }
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}