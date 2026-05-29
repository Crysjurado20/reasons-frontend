import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-publication-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
      
      <div class="flex items-center gap-4 mb-8">
        <a routerLink="/dashboard/publications" class="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <span class="material-icons">arrow_back</span>
        </a>
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-merriweather">{{ isEditing ? 'Editar Publicación' : 'Nueva Publicación' }}</h2>
          <p class="text-gray-500 text-sm mt-1">Completa la información del artículo científico.</p>
        </div>
      </div>

      <!-- Loader Interno -->
      <div *ngIf="isLoading" class="py-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>

      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Título de la Publicación <span class="text-red-500">*</span></label>
          <input type="text" formControlName="title" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Avances en Inteligencia Artificial...">
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Resumen (Abstract) <span class="text-red-500">*</span></label>
          <textarea formControlName="abstract" rows="6" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none" placeholder="Escribe o pega el abstract aquí..."></textarea>
        </div>

        <hr class="border-gray-100">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Fecha de Publicación <span class="text-red-500">*</span></label>
            <input type="date" formControlName="publication_date" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all text-gray-700">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Enlace DOI (Opcional)</label>
            <input type="url" formControlName="doi_link" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="https://doi.org/10.1000/xyz123">
          </div>
        </div>

        <div class="pt-6 flex justify-end gap-4 border-t border-gray-100">
          <a routerLink="/dashboard/publications" class="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">Cancelar</a>
          <button type="submit" [disabled]="isSubmitting" class="px-8 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            <span *ngIf="isSubmitting" class="material-icons animate-spin text-sm">refresh</span>
            <span>{{ isEditing ? 'Actualizar Cambios' : 'Guardar Publicación' }}</span>
          </button>
        </div>

      </form>
    </div>
  `
})
export class PublicationFormComponent implements OnInit {
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
    abstract: ['', Validators.required],
    doi_link: [''],
    publication_date: ['', Validators.required]
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.editingId = params['id'];
        this.loadPublication(this.editingId!);
      }
    });
  }

  loadPublication(id: number) {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:3000/api/publications/${id}`).subscribe({
      next: (data) => {
        if (data.publication_date) data.publication_date = new Date(data.publication_date).toISOString().split('T')[0];
        
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo cargar la publicación');
        this.router.navigate(['/dashboard/publications']);
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
      this.http.put(`http://localhost:3000/api/publications/${this.editingId}`, payload, { headers }).subscribe({
        next: () => {
          this.alertService.success('Actualizado', 'Publicación actualizada con éxito.');
          this.router.navigate(['/dashboard/publications']);
        },
        error: () => {
          this.alertService.error('Error', 'No se pudo actualizar el registro.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.http.post('http://localhost:3000/api/publications', payload, { headers }).subscribe({
        next: () => {
          this.alertService.success('Creado', 'Publicación registrada con éxito.');
          this.router.navigate(['/dashboard/publications']);
        },
        error: () => {
          this.alertService.error('Error', 'No se pudo crear el registro.');
          this.isSubmitting = false;
        }
      });
    }
  }
}
