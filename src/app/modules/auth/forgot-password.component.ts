import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AnimateOnScrollDirective, RouterLink],
  template: `
<div class="min-h-screen flex items-center justify-center bg-background w-full p-4 relative overflow-hidden">
  <!-- Background Elements -->
  <div class="absolute inset-0 bg-pattern-dots opacity-5"></div>
  <div class="animate-blob absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl mix-blend-multiply"></div>
  <div class="animate-blob absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl mix-blend-multiply" style="animation-delay: 2s;"></div>

  <div class="w-full max-w-md bg-card p-8 shadow-2xl relative z-10 border border-gray-100" appAnimateOnScroll animationName="animate-zoom-in">
    <div class="text-center space-y-4 mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
        <span class="material-icons text-3xl">lock_reset</span>
      </div>
      <h1 class="text-3xl font-bold font-merriweather text-primary">Recuperar Contraseña</h1>
      <p class="text-muted-foreground text-sm">
        Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
      </p>
    </div>

    <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <div class="space-y-2 group">
        <label for="email" class="text-sm font-bold text-foreground">Correo Electrónico</label>
        <div class="relative">
          <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-secondary transition-colors">mail</span>
          <input id="email" type="email" formControlName="email" class="pl-10 flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 transition-all shadow-sm" placeholder="ejemplo@correo.com">
        </div>
        <p *ngIf="forgotForm.get('email')?.touched && forgotForm.get('email')?.invalid" class="text-xs font-medium text-destructive pl-1">Ingresa un correo electrónico válido.</p>
      </div>

      <button type="submit" [disabled]="isSubmitting" class="w-full h-12 flex items-center justify-center rounded-xl bg-primary text-white font-bold tracking-wide shadow-md hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
        <span *ngIf="isSubmitting" class="material-icons animate-spin mr-2 text-sm">refresh</span>
        {{ isSubmitting ? 'Enviando...' : 'Enviar enlace' }}
      </button>

      <div class="text-center mt-6">
        <a routerLink="/admin" class="text-sm font-semibold text-primary hover:text-secondary transition-colors inline-flex items-center">
          <span class="material-icons text-sm mr-1">arrow_back</span>
          Volver al inicio de sesión
        </a>
      </div>
    </form>
  </div>
</div>
  `
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  isSubmitting = false;

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isSubmitting = true;
      const email = this.forgotForm.value.email;

      this.http.post('http://localhost:3000/api/auth/forgot-password', { email }).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.alertService.success('¡Correo enviado!', 'Revisa tu bandeja de entrada para restablecer tu contraseña. Es posible que debas revisar la carpeta de SPAM.');
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || 'Hubo un error al procesar tu solicitud.';
          this.alertService.error('Error', msg);
        }
      });
    } else {
      this.forgotForm.markAllAsTouched();
    }
  }
}
