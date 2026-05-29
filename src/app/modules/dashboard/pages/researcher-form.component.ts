import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-researcher-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
      
      <div class="flex items-center gap-4 mb-8">
        <a routerLink="/dashboard/researchers" class="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <span class="material-icons">arrow_back</span>
        </a>
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-merriweather">{{ isEditing ? 'Editar Investigador' : 'Nuevo Investigador' }}</h2>
          <p class="text-gray-500 text-sm mt-1">Completa el formulario con la información del investigador.</p>
        </div>
      </div>

      <!-- Loader Interno -->
      <div *ngIf="isLoading" class="py-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>

      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Primer Nombre <span class="text-red-500">*</span></label>
            <input type="text" formControlName="first_name" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Juan">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Segundo Nombre</label>
            <input type="text" formControlName="second_name" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Carlos">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Primer Apellido <span class="text-red-500">*</span></label>
            <input type="text" formControlName="first_lastname" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Pérez">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Segundo Apellido</label>
            <input type="text" formControlName="second_lastname" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Silva">
          </div>
        </div>

        <hr class="border-gray-100">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Email Institucional <span class="text-red-500">*</span></label>
            <input type="email" formControlName="institutional_email" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="correo@reasons.edu.ec">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Cargo</label>
            <input type="text" formControlName="position" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Investigador Principal">
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Enlace ORCID</label>
          <input type="text" formControlName="orcid_link" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="https://orcid.org/0000-0000-0000-0000">
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Biografía</label>
          <textarea formControlName="biography" rows="4" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none" placeholder="Breve descripción del perfil profesional..."></textarea>
        </div>

        <div class="pt-6 flex justify-end gap-4 border-t border-gray-100">
          <a routerLink="/dashboard/researchers" class="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">Cancelar</a>
          <button type="submit" [disabled]="isSubmitting" class="px-8 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            <span *ngIf="isSubmitting" class="material-icons animate-spin text-sm">refresh</span>
            <span>{{ isEditing ? 'Actualizar Cambios' : 'Guardar Investigador' }}</span>
          </button>
        </div>

      </form>
    </div>
  `
})
export class ResearcherFormComponent implements OnInit {
  private http = inject(HttpClient);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  isEditing = false;
  editingId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  form: FormGroup = this.fb.group({
    first_name: ['', Validators.required],
    second_name: [''],
    first_lastname: ['', Validators.required],
    second_lastname: [''],
    institutional_email: ['', [Validators.required, Validators.email]],
    position: [''],
    orcid_link: [''],
    biography: ['']
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.editingId = params['id'];
        this.loadResearcher(this.editingId!);
      }
    });
  }

  loadResearcher(id: number) {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:3000/api/researchers/${id}`).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo cargar el investigador');
        this.router.navigate(['/dashboard/researchers']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.warning('Formulario incompleto', 'Revisa los campos obligatorios (*).');
      return;
    }

    this.isSubmitting = true;
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    const payload = this.form.value;

    if (this.isEditing) {
      this.http.put(`http://localhost:3000/api/researchers/${this.editingId}`, payload, { headers }).subscribe({
        next: () => {
          this.alertService.success('Actualizado', 'Investigador actualizado con éxito.');
          this.router.navigate(['/dashboard/researchers']);
        },
        error: () => {
          this.alertService.error('Error', 'No se pudo actualizar el registro.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.http.post('http://localhost:3000/api/researchers', payload, { headers }).subscribe({
        next: () => {
          this.alertService.success('Creado', 'Investigador registrado con éxito.');
          this.router.navigate(['/dashboard/researchers']);
        },
        error: () => {
          this.alertService.error('Error', 'No se pudo crear el registro.');
          this.isSubmitting = false;
        }
      });
    }
  }
}
