import { Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
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

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Estado <span class="text-red-500">*</span></label>
          <select formControlName="status" class="w-full md:w-1/3 rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all bg-white">
            <option value="ACTIVE">Activo</option>
            <option value="COMPLETED">Completado</option>
          </select>
        </div>

        <hr class="border-gray-100">

        <!-- Objectives Array -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="text-sm font-semibold text-gray-700">Objetivos del Proyecto</label>
            <button type="button" (click)="addObjective()" class="text-xs bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium">
              <span class="material-icons text-sm">add</span> Añadir
            </button>
          </div>
          <div formArrayName="objectives" class="space-y-3">
            <div *ngFor="let obj of objectives.controls; let i=index" [formGroupName]="i" class="flex items-center gap-3">
              <input type="text" formControlName="description" class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-secondary outline-none text-sm" placeholder="Descripción del objetivo...">
              <button type="button" (click)="removeObjective(i)" class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
            <p *ngIf="objectives.length === 0" class="text-xs text-gray-500 italic">No se han añadido objetivos.</p>
          </div>
        </div>

        <!-- Results Array -->
        <div class="space-y-4 pt-4">
          <div class="flex justify-between items-center">
            <label class="text-sm font-semibold text-gray-700">Resultados del Proyecto</label>
            <button type="button" (click)="addResult()" class="text-xs bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium">
              <span class="material-icons text-sm">add</span> Añadir
            </button>
          </div>
          <div formArrayName="results" class="space-y-3">
            <div *ngFor="let res of results.controls; let i=index" [formGroupName]="i" class="flex items-center gap-3">
              <input type="text" formControlName="description" class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-secondary outline-none text-sm" placeholder="Descripción del resultado...">
              <button type="button" (click)="removeResult(i)" class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
            <p *ngIf="results.length === 0" class="text-xs text-gray-500 italic">No se han añadido resultados.</p>
          </div>
        </div>

        <!-- Researchers Autocomplete Chips -->
        <div class="space-y-4 pt-4 border-t border-gray-100">
          <label class="text-sm font-semibold text-gray-700">Investigadores Asignados</label>
          <mat-form-field appearance="outline" class="w-full">
            <mat-chip-grid #chipGrid aria-label="Selección de investigadores">
              <mat-chip-row *ngFor="let res of researchers.value; let i = index"
                            (removed)="removeResearcher(i)">
                {{ getResearcherName(res.researcher_id) }}
                <button matChipRemove [attr.aria-label]="'Eliminar'">
                  <mat-icon>cancel</mat-icon>
                </button>
              </mat-chip-row>
              <input placeholder="Buscar investigador..."
                     #researcherInput
                     [formControl]="researcherCtrl"
                     [matChipInputFor]="chipGrid"
                     [matAutocomplete]="auto">
            </mat-chip-grid>
            <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selected($event)">
              <mat-option *ngFor="let res of filteredResearchers | async" [value]="res">
                <div class="flex items-center gap-2">
                  <div class="h-6 w-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300">
                    <img *ngIf="res.url_photo" [src]="res.url_photo" class="h-full w-full object-cover">
                    <span *ngIf="!res.url_photo" class="material-icons text-[12px] text-gray-400">person</span>
                  </div>
                  <span class="text-sm">{{ res.first_name }} {{ res.first_lastname }}</span>
                </div>
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
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
    objectives: this.fb.array([]),
    results: this.fb.array([]),
    researchers: this.fb.array([])
  });

  researcherCtrl = new FormControl('');
  allResearchers: any[] = [];
  filteredResearchers!: Observable<any[]>;

  @ViewChild('researcherInput') researcherInput!: ElementRef<HTMLInputElement>;

  get objectives() { return this.form.get('objectives') as FormArray; }
  get results() { return this.form.get('results') as FormArray; }
  get researchers() { return this.form.get('researchers') as FormArray; }

  ngOnInit() {
    this.loadAllResearchers();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.editingId = params['id'];
        this.loadProject(this.editingId!);
      }
    });
  }

  loadAllResearchers() {
    this.http.get<any[]>('http://localhost:3000/api/researchers').subscribe(data => {
      this.allResearchers = data;
      this.filteredResearchers = this.researcherCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });
  }

  private _filter(value: string | any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    const selectedIds = this.researchers.value.map((r: any) => r.researcher_id);
    return this.allResearchers.filter(res => 
      !selectedIds.includes(res.id) &&
      `${res.first_name} ${res.first_lastname}`.toLowerCase().includes(filterValue)
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedResearcher = event.option.value;
    const currentIds = this.researchers.value.map((r: any) => r.researcher_id);
    
    if (!currentIds.includes(selectedResearcher.id)) {
      this.researchers.push(this.fb.group({
        researcher_id: [selectedResearcher.id, Validators.required]
      }));
    }
    
    if (this.researcherInput) {
      this.researcherInput.nativeElement.value = '';
    }
    this.researcherCtrl.setValue(null);
  }

  removeResearcher(index: number): void {
    this.researchers.removeAt(index);
    this.researcherCtrl.setValue(this.researcherCtrl.value);
  }

  getResearcherName(id: number): string {
    const res = this.allResearchers.find(r => r.id === id);
    return res ? `${res.first_name} ${res.first_lastname}` : 'Cargando...';
  }

  addObjective() { this.objectives.push(this.fb.group({ description: ['', Validators.required] })); }
  removeObjective(index: number) { this.objectives.removeAt(index); }

  addResult() { this.results.push(this.fb.group({ description: ['', Validators.required] })); }
  removeResult(index: number) { this.results.removeAt(index); }

  loadProject(id: number) {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:3000/api/projects/${id}`).subscribe({
      next: (data) => {
        this.form.patchValue({
          title: data.title,
          description: data.description,
          status: data.status
        });

        // Load objectives
        if (data.objectives && Array.isArray(data.objectives)) {
          data.objectives.forEach((obj: any) => {
            this.objectives.push(this.fb.group({ description: [obj.description, Validators.required] }));
          });
        }
        
        // Load results
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach((res: any) => {
            this.results.push(this.fb.group({ description: [res.description, Validators.required] }));
          });
        }
        
        // Load researchers
        const researchersData = data.researcher_projects || data.researchers;
        if (researchersData && Array.isArray(researchersData)) {
          researchersData.forEach((rel: any) => {
            this.researchers.push(this.fb.group({ researcher_id: [rel.researcher_id, Validators.required] }));
          });
        }

        this.researcherCtrl.setValue(this.researcherCtrl.value);
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
    const payload = this.form.value;

    if (this.isEditing) {
      this.http.patch(`http://localhost:3000/api/projects/${this.editingId}`, payload).subscribe({
        next: () => {
          this.alertService.success('Actualizado', 'Proyecto actualizado con éxito.');
          this.router.navigate(['/dashboard/projects']);
        },
        error: (err) => {
          this.alertService.error('Error', err.error?.message || 'No se pudo actualizar el registro.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.http.post('http://localhost:3000/api/projects', payload).subscribe({
        next: () => {
          this.alertService.success('Creado', 'Proyecto registrado con éxito.');
          this.router.navigate(['/dashboard/projects']);
        },
        error: (err) => {
          this.alertService.error('Error', err.error?.message || 'No se pudo crear el registro.');
          this.isSubmitting = false;
        }
      });
    }
  }
}
