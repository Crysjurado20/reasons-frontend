import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AnimateOnScrollDirective, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  private readonly alertService = inject(AlertService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isSubmitting = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.http.post<any>('http://localhost:3000/api/auth/login', credentials)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            // Guardar tokens utilizando AuthService (instanciado globalmente)
            localStorage.setItem('access_token', response.accessToken);
            localStorage.setItem('refresh_token', response.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Mostrar alerta elegante
            this.alertService.success('¡Login Exitoso!', `Bienvenido ${response.user.name}. Redirigiendo al Dashboard...`);
            
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1500);
          },
          error: (err) => {
            this.isSubmitting = false;
            const errorMsg = err.error?.message || 'Revisa tus credenciales e intenta nuevamente.';
            this.alertService.error('Error de autenticación', errorMsg);
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
      this.alertService.warning('Formulario incompleto', 'Por favor, llena los campos requeridos correctamente.');
    }
  }
}
