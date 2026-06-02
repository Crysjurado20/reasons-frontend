import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AnimateOnScrollDirective, RouterLink],
  template: `
<div class="min-h-screen flex items-center justify-center bg-background w-full p-4 relative overflow-hidden">
  <div class="absolute inset-0 bg-pattern-dots opacity-5"></div>
  <div class="animate-blob absolute top-0 -left-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl mix-blend-multiply"></div>

  <div class="w-full max-w-md bg-card p-8 shadow-2xl relative z-10 border border-gray-100" appAnimateOnScroll animationName="animate-zoom-in">
    <div class="text-center space-y-4 mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
        <span class="material-icons text-3xl">vpn_key</span>
      </div>
      <h1 class="text-3xl font-bold font-merriweather text-primary">Nueva Contraseña</h1>
      <p class="text-muted-foreground text-sm">
        Ingresa tu nueva contraseña para acceder al sistema.
      </p>
    </div>

    <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <div class="space-y-4">
        <div class="space-y-2 group">
          <label for="password" class="text-sm font-bold text-foreground">Nueva Contraseña</label>
          <div class="relative">
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-secondary transition-colors">lock</span>
            <input id="password" [type]="showPassword ? 'text' : 'password'" formControlName="password" class="pl-10 pr-10 flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 transition-all shadow-sm" placeholder="••••••••">
            <button type="button" (click)="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary focus:outline-none transition-colors">
              <span class="material-icons text-[20px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
          <p *ngIf="resetForm.get('password')?.touched && resetForm.get('password')?.invalid" class="text-xs font-medium text-destructive pl-1">La contraseña debe tener al menos 6 caracteres.</p>
        </div>

        <div class="space-y-2 group">
          <label for="confirmPassword" class="text-sm font-bold text-foreground">Confirmar Contraseña</label>
          <div class="relative">
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-secondary transition-colors">lock</span>
            <input id="confirmPassword" [type]="showConfirmPassword ? 'text' : 'password'" formControlName="confirmPassword" class="pl-10 pr-10 flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 transition-all shadow-sm" placeholder="••••••••">
            <button type="button" (click)="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary focus:outline-none transition-colors">
              <span class="material-icons text-[20px]">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
          <p *ngIf="resetForm.hasError('mismatch') && resetForm.get('confirmPassword')?.touched" class="text-xs font-medium text-destructive pl-1">Las contraseñas no coinciden.</p>
        </div>
      </div>

      <button type="submit" [disabled]="isSubmitting" class="w-full h-12 flex items-center justify-center rounded-xl bg-primary text-white font-bold tracking-wide shadow-md hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
        <span *ngIf="isSubmitting" class="material-icons animate-spin mr-2 text-sm">refresh</span>
        {{ isSubmitting ? 'Guardando...' : 'Restablecer Contraseña' }}
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
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isSubmitting = false;
  token = '';
  showPassword = false;
  showConfirmPassword = false;

  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    if (!this.token) {
      this.alertService.error('Token inválido', 'No se ha proporcionado un token para restablecer la contraseña.');
      this.router.navigate(['/admin']);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.isSubmitting = true;
      const pwd = this.resetForm.value.password;
      const email = this.route.snapshot.queryParamMap.get('email');

      this.http.post(`http://localhost:3000/api/auth/reset-password/${this.token}?email=${email}`, { password: pwd }).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.alertService.success('¡Contraseña actualizada!', 'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión.');
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || 'No se pudo restablecer la contraseña. Es posible que el enlace haya expirado.';
          this.alertService.error('Error', msg);
        }
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
