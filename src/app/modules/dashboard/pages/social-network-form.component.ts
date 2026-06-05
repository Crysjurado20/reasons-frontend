import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-social-network-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
      
      <div class="flex items-center gap-4 mb-8">
        <a routerLink="/dashboard/social-networks" class="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <span class="material-icons">arrow_back</span>
        </a>
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-merriweather">{{ isEditing ? 'Editar Red Social' : 'Nueva Red Social' }}</h2>
          <p class="text-gray-500 text-sm mt-1">Configura los detalles de esta red social para el catálogo.</p>
        </div>
      </div>

      <div *ngIf="isLoading" class="py-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>

      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Nombre de la Red <span class="text-red-500">*</span></label>
          <input type="text" formControlName="name" 
                 [ngClass]="{'border-red-500 focus:ring-red-200 focus:border-red-500': isFieldInvalid('name')}"
                 class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. LinkedIn, ORCID, ResearchGate...">
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">URL del Ícono/Logo (Opcional)</label>
          <input type="url" formControlName="url_image" 
                 [ngClass]="{'border-red-500 focus:ring-red-200 focus:border-red-500': isFieldInvalid('url_image')}"
                 class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="https://ruta-de-la-imagen.com/logo.png">
          <p *ngIf="form.get('url_image')?.hasError('pattern') && form.get('url_image')?.touched" class="text-xs text-red-500 font-medium">Debe ingresar una URL de enlace válida (http:// o https://).</p>
          
          <div *ngIf="form.get('url_image')?.value && form.get('url_image')?.valid" class="mt-3 flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 w-max">
            <span class="text-xs text-gray-500 font-medium">Previsualización (24x24px):</span>
            <img [src]="form.get('url_image')?.value" class="w-6 h-6 object-cover rounded-sm border border-gray-200" alt="Logo preview">
          </div>
        </div>

        <div class="pt-6 flex justify-end gap-4 border-t border-gray-100">
          <a routerLink="/dashboard/social-networks" class="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">Cancelar</a>
          <button type="submit" [disabled]="form.invalid || isSubmitting" 
                  class="px-8 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="isSubmitting" class="material-icons animate-spin text-sm">refresh</span>
            <span>{{ isEditing ? 'Actualizar Cambios' : 'Guardar Red Social' }}</span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class SocialNetworkFormComponent implements OnInit {
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

  // Regex definitiva para URLs, puertos locales y strings de consulta complejos
  private readonly urlPattern = /^(https?:\/\/)?(localhost|[\da-z.-]+\.[a-z.]{2,6})(:[0-9]{1,5})?(\/[\/\w\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e.-]*)*\/?$/i;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    url_image: ['', [Validators.pattern(this.urlPattern)]] // Validado con la regex corregida
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.editingId = params['id'];
        this.loadData(this.editingId!);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  loadData(id: number) {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:3000/api/social-networks/${id}`).subscribe({
      next: (data) => {
        this.form.patchValue({
          name: data.name,
          url_image: data.url_image || ''
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo cargar el registro');
        this.router.navigate(['/dashboard/social-networks']);
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
    const rawValues = this.form.value;

    // Saneamiento de campos: si va vacío string "", convertimos a NULL para evitar colisiones en DB
    const payload = {
      ...rawValues,
      url_image: rawValues.url_image?.trim() === "" ? null : rawValues.url_image
    };

    const request = this.isEditing 
      ? this.http.patch(`http://localhost:3000/api/social-networks/${this.editingId}`, payload)
      : this.http.post('http://localhost:3000/api/social-networks', payload);

    request.subscribe({
      next: () => {
        this.alertService.success(this.isEditing ? 'Actualizado' : 'Creado', 'Red social guardada con éxito.');
        this.router.navigate(['/dashboard/social-networks']);
      },
      error: (err) => {
        this.alertService.error('Error', err.error?.message || 'No se pudo guardar el registro.');
        this.isSubmitting = false;
      }
    });
  }
}