import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-group-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
      
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 font-merriweather">Configuración Institucional (REASONS)</h2>
        <p class="text-gray-500 text-sm mt-1">Modifica la información global, los objetivos y líneas de investigación del grupo.</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="py-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>

      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
        
        <!-- Sección 1: Información General -->
        <div class="bg-gray-50/50 p-6 rounded-lg border border-gray-100 space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4 font-merriweather">1. Información General</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2 md:col-span-1">
              <label class="text-sm font-semibold text-gray-700">Acrónimo <span class="text-red-500">*</span></label>
              <input type="text" formControlName="acronym" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. REASONS">
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-semibold text-gray-700">Nombre Completo <span class="text-red-500">*</span></label>
              <input type="text" formControlName="name" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Research in Engineering...">
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Descripción del Grupo <span class="text-red-500">*</span></label>
            <textarea formControlName="description" rows="4" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none" placeholder="Descripción detallada de REASONS..."></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700">Objetivo General <span class="text-red-500">*</span></label>
              <textarea formControlName="general_objective" rows="3" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none"></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700">Dominio <span class="text-red-500">*</span></label>
              <input type="text" formControlName="domain" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all">
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">URL del Logotipo</label>
            <input type="url" formControlName="url_logo" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="https://ruta.com/logo.png">
            <div *ngIf="form.get('url_logo')?.value" class="mt-2 flex items-center justify-center bg-white border border-gray-200 rounded-lg p-4 w-32 h-32">
              <img [src]="form.get('url_logo')?.value" alt="Logo preview" class="max-w-full max-h-full object-contain">
            </div>
          </div>
        </div>

        <!-- Sección 2: Información de Contacto -->
        <div class="bg-gray-50/50 p-6 rounded-lg border border-gray-100 space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4 font-merriweather">2. Información de Contacto</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700">Correo Electrónico Oficial <span class="text-red-500">*</span></label>
              <input type="email" formControlName="email" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="reasons@uta.edu.ec">
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700">Dirección Institucional <span class="text-red-500">*</span></label>
              <input type="text" formControlName="address" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Av. de Los Chasquis...">
            </div>
          </div>
        </div>

        <!-- Sección 3: Objetivos Específicos -->
        <div class="bg-gray-50/50 p-6 rounded-lg border border-gray-100 space-y-4">
          <div class="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
            <h3 class="text-lg font-semibold text-gray-800 font-merriweather">3. Objetivos Específicos</h3>
            <button type="button" (click)="addObjective()" class="text-xs bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium">
              <span class="material-icons text-sm">add</span> Añadir
            </button>
          </div>
          
          <div formArrayName="specific_objectives" class="space-y-3">
            <div *ngFor="let obj of specific_objectives.controls; let i=index" [formGroupName]="i" class="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div class="flex-1">
                <textarea formControlName="description" rows="2" class="w-full rounded border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-secondary outline-none text-sm resize-none" placeholder="Descripción del objetivo específico..."></textarea>
              </div>
              <button type="button" (click)="removeObjective(i)" class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors mt-1">
                <span class="material-icons text-sm">close</span>
              </button>
            </div>
            <p *ngIf="specific_objectives.length === 0" class="text-xs text-gray-500 italic text-center py-4">No hay objetivos registrados.</p>
          </div>
        </div>

        <!-- Sección 4: Líneas de Investigación -->
        <div class="bg-gray-50/50 p-6 rounded-lg border border-gray-100 space-y-4">
          <div class="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
            <h3 class="text-lg font-semibold text-gray-800 font-merriweather">4. Líneas de Investigación</h3>
            <button type="button" (click)="addLineOfResearch()" class="text-xs bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium">
              <span class="material-icons text-sm">add</span> Añadir
            </button>
          </div>
          
          <div formArrayName="lines_of_research" class="grid grid-cols-1 gap-4">
            <div *ngFor="let line of lines_of_research.controls; let i=index" [formGroupName]="i" class="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div class="flex-1 space-y-3">
                <input type="text" formControlName="title" class="w-full font-semibold rounded border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-secondary outline-none text-sm" placeholder="Título de la línea...">
                <textarea formControlName="description" rows="2" class="w-full rounded border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-secondary outline-none text-sm resize-none" placeholder="Descripción de la línea..."></textarea>
              </div>
              <button type="button" (click)="removeLineOfResearch(i)" class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors mt-1" title="Eliminar línea">
                <span class="material-icons text-sm">close</span>
              </button>
            </div>
            <p *ngIf="lines_of_research.length === 0" class="text-xs text-gray-500 italic text-center py-4">No hay líneas de investigación registradas.</p>
          </div>
        </div>

        <div class="fixed bottom-8 right-8 z-50">
          <button type="submit" [disabled]="isSubmitting" class="px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100">
            <span *ngIf="isSubmitting" class="material-icons animate-spin">refresh</span>
            <span *ngIf="!isSubmitting" class="material-icons">save</span>
            <span>Guardar Cambios</span>
          </button>
        </div>

      </form>
    </div>
  `
})
export class GroupSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  isSubmitting = false;
  groupId: number | null = null;
  exists = false;

  form: FormGroup = this.fb.group({
    acronym: ['', Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    general_objective: ['', Validators.required],
    domain: ['', Validators.required],
    url_logo: [''],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    specific_objectives: this.fb.array([]),
    lines_of_research: this.fb.array([])
  });

  get specific_objectives() { return this.form.get('specific_objectives') as FormArray; }
  get lines_of_research() { return this.form.get('lines_of_research') as FormArray; }

  ngOnInit() {
    this.loadSingletonGroup();
  }

  loadSingletonGroup() {
    // Tomamos el primer grupo (patrón singleton simulado en frontend)
    this.http.get<any[]>('http://localhost:3000/api/groups').subscribe({
      next: (groups) => {
        if (groups && groups.length > 0) {
          this.exists = true;
          const data = groups[0];
          this.groupId = data.id;
          
          this.form.patchValue({
            acronym: data.acronym,
            name: data.name,
            description: data.description,
            general_objective: data.general_objective,
            domain: data.domain,
            url_logo: data.url_logo,
            email: data.email,
            address: data.address
          });

          if (data.specific_objectives && Array.isArray(data.specific_objectives)) {
            data.specific_objectives.forEach((obj: any) => {
              this.specific_objectives.push(this.fb.group({ description: [obj.description, Validators.required] }));
            });
          }
          
          if (data.lines_of_research && Array.isArray(data.lines_of_research)) {
            data.lines_of_research.forEach((line: any) => {
              this.lines_of_research.push(this.fb.group({ 
                title: [line.title, Validators.required],
                description: [line.description, Validators.required] 
              }));
            });
          }
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo cargar la configuración del grupo');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addObjective() { 
    this.specific_objectives.push(this.fb.group({ description: ['', Validators.required] })); 
  }
  removeObjective(index: number) { this.specific_objectives.removeAt(index); }

  addLineOfResearch() { 
    this.lines_of_research.push(this.fb.group({ title: ['', Validators.required], description: ['', Validators.required] })); 
  }
  removeLineOfResearch(index: number) { this.lines_of_research.removeAt(index); }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.warning('Formulario incompleto', 'Revisa los campos obligatorios (*).');
      return;
    }

    this.isSubmitting = true;
    const payload = this.form.value;

    const request = this.exists && this.groupId
      ? this.http.patch(`http://localhost:3000/api/groups/${this.groupId}`, payload)
      : this.http.post('http://localhost:3000/api/groups', payload);

    request.pipe(
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res: any) => {
        this.alertService.success('Guardado', 'La configuración institucional ha sido actualizada correctamente.');
        if (!this.exists && res && res.id) {
          this.exists = true;
          this.groupId = res.id;
        }
      },
      error: (err) => {
        this.alertService.error('Error', err.error?.message || 'Hubo un problema al guardar la configuración.');
      }
    });
  }
}
