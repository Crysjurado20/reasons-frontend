import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
      
      <div class="flex items-center gap-4 mb-8">
        <a routerLink="/dashboard/projects" class="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <span class="material-icons">arrow_back</span>
        </a>
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-merriweather">{{ isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h2>
          <p class="text-gray-500 text-sm mt-1">Completa la información del proyecto de investigación.</p>
        </div>
      </div>

      <!-- Loader Interno -->
      <div *ngIf="isLoading" class="py-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>

      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Título del Proyecto <span class="text-red-500">*</span></label>
          <input type="text" formControlName="title" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Implementación de Algoritmos Genéticos...">
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Descripción <span class="text-red-500">*</span></label>
          <textarea formControlName="description" rows="5" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none" placeholder="Descripción detallada de los objetivos del proyecto..."></textarea>
        </div>

        <hr class="border-gray-100">

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Estado <span class="text-red-500">*</span></label>
            <select formControlName="status" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all bg-white">
              <option value="ACTIVE">Activo</option>
              <option value="COMPLETED">Completado</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Fecha de Inicio <span class="text-red-500">*</span></label>
            <input type="date" formControlName="start_date" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all text-gray-700">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Fecha de Fin</label>
            <input type="date" formControlName="end_date" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all text-gray-700">
          </div>
        </div>

        <div class="pt-6 flex justify-end gap-4 border-t border-gray-100">
          <a routerLink="/dashboard/projects" class="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">Cancelar</a>
          <button type="submit" [disabled]="isSubmitting" class="px-8 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            <span *ngIf="isSubmitting" class="material-icons animate-spin text-sm">refresh</span>
            <span>{{ isEditing ? 'Actualizar Cambios' : 'Guardar Proyecto' }}</span>
          </button>
        </div>

      </form>
    </div>
  `
})
export class ProjectFormComponent implements OnInit {
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
    title: ['', Validators.required],
    description: ['', Validators.required],
    status: ['ACTIVE', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['']
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.editingId = params['id'];
        this.loadProject(this.editingId!);
      }
    });
  }

  loadProject(id: number) {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:3000/api/projects/${id}`).subscribe({
      next: (data) => {
        // Format dates for input type="date"
        if (data.start_date) data.start_date = new Date(data.start_date).toISOString().split('T')[0];
        if (data.end_date) data.end_date = new Date(data.end_date).toISOString().split('T')[0];
        
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo cargar el proyecto');
        this.router.navigate(['/dashboard/projects']);
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
      this.http.put(`http://localhost:3000/api/projects/${this.editingId}`, payload, { headers }).subscribe({
        next: () => {
          this.alertService.success('Actualizado', 'Proyecto actualizado con éxito.');
          this.router.navigate(['/dashboard/projects']);
        },
        error: () => {
          this.alertService.error('Error', 'No se pudo actualizar el registro.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.http.post('http://localhost:3000/api/projects', payload, { headers }).subscribe({
        next: () => {
          this.alertService.success('Creado', 'Proyecto registrado con éxito.');
          this.router.navigate(['/dashboard/projects']);
        },
        error: () => {
          this.alertService.error('Error', 'No se pudo crear el registro.');
          this.isSubmitting = false;
        }
      });
    }
  }
}
