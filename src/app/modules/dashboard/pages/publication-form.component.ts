import { Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-publication-form',
  standalone: true,
  providers: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatChipsModule,
    MatIconModule
  ],
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
            <label class="text-sm font-semibold text-gray-700">Cita Formateada</label>
            <input type="text" formControlName="cite" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all text-gray-700" placeholder="Ej. APA Citation">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Estado de Publicación</label>
            <select formControlName="status" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all bg-white">
              <option value="PUBLISHED">Publicado</option>
              <option value="IN_REVIEW">En Revisión</option>
              <option value="DRAFT">Borrador</option>
            </select>
          </div>
        </div>
        
        <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">URL Portada de Revista (Opcional)</label>
            <input type="url" formControlName="url_journal_cover" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="https://...">
        </div>

        <!-- Researchers Custom Dropdown -->
        <div class="space-y-4 pt-4 border-t border-gray-100">
          <label class="text-sm font-semibold text-gray-700">Autores/Investigadores</label>

          <div class="relative" #dropdownContainer>
            <div class="flex flex-wrap gap-2 p-2.5 border border-gray-300 rounded-lg min-h-[44px] focus-within:ring-2 focus-within:ring-secondary focus-within:border-secondary transition-all cursor-text"
                 (click)="researcherInput.focus()">
              <span *ngFor="let res of researchers.value; let i = index"
                    class="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-sm font-medium px-2.5 py-1 rounded-full">
                {{ getResearcherName(res.researcher_id) }}
                <button type="button" (click)="$event.stopPropagation(); removeResearcher(i)"
                        class="text-secondary hover:text-red-500 transition-colors leading-none">
                  <span class="material-icons text-base leading-none">close</span>
                </button>
              </span>
              <input #researcherInput
                     type="text"
                     [formControl]="researcherCtrl"
                     (focus)="showDropdown = true"
                     placeholder="Buscar investigador..."
                     class="flex-1 min-w-[160px] outline-none bg-transparent text-sm py-0.5 placeholder-gray-400">
            </div>

            <!-- Dropdown list -->
            <div *ngIf="showDropdown"
                 class="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-52 overflow-y-auto">
              <div *ngFor="let res of availableResearchers"
                   (click)="selectResearcher(res)"
                   class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                <div class="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-300">
                  <img *ngIf="res.url_photo" [src]="res.url_photo" class="h-full w-full object-cover">
                  <span *ngIf="!res.url_photo" class="material-icons text-sm text-gray-400">person</span>
                </div>
                <span class="text-sm text-gray-800">{{ res.first_name }} {{ res.first_lastname }}</span>
              </div>
              <div *ngIf="availableResearchers.length === 0"
                   class="px-4 py-3 text-sm text-gray-500 italic text-center">
                No hay más investigadores disponibles.
              </div>
            </div>
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
    abstract: [''],
    cite: [''],
    status: ['PUBLISHED'],
    url_journal_cover: [''],
    researchers: this.fb.array([])
  });

  researcherCtrl = new FormControl('');
  allResearchers: any[] = [];
  showDropdown = false;

  @ViewChild('researcherInput') researcherInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  get researchers() { return this.form.get('researchers') as FormArray; }

  ngOnInit() {
    this.loadAllResearchers();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.editingId = params['id'];
        this.loadPublication(this.editingId!);
      }
    });
  }

  loadAllResearchers() {
    this.http.get<any[]>('http://localhost:3000/api/researchers').subscribe(data => {
      this.allResearchers = data;
    });
  }

  get availableResearchers(): any[] {
    const selectedIds = this.researchers.value.map((r: any) => r.researcher_id);
    const filterValue = (this.researcherCtrl.value || '').toLowerCase();
    return this.allResearchers.filter(res =>
      !selectedIds.includes(res.id) &&
      `${res.first_name} ${res.first_lastname}`.toLowerCase().includes(filterValue)
    );
  }

  selectResearcher(res: any): void {
    this.researchers.push(this.fb.group({
      researcher_id: [res.id, Validators.required]
    }));
    this.researcherCtrl.setValue('');
    // Al seleccionar, mantenemos el foco en el input para poder seguir añadiendo
    this.researcherInput.nativeElement.focus();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.showDropdown && this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  removeResearcher(index: number): void {
    this.researchers.removeAt(index);
  }

  getResearcherName(id: number): string {
    const res = this.allResearchers.find(r => r.id === id);
    return res ? `${res.first_name} ${res.first_lastname}` : 'Cargando...';
  }

  loadPublication(id: number) {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:3000/api/publications/${id}`).subscribe({
      next: (data) => {
        this.form.patchValue({
          title: data.title,
          abstract: data.abstract,
          cite: data.cite,
          status: data.status,
          url_journal_cover: data.url_journal_cover
        });

        const researchersData = data.researcher_articles || data.researchers;
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
    const payload = this.form.value;

    if (this.isEditing) {
      this.http.patch(`http://localhost:3000/api/publications/${this.editingId}`, payload).subscribe({
        next: () => {
          this.alertService.success('Actualizado', 'Publicación actualizada con éxito.');
          this.router.navigate(['/dashboard/publications']);
        },
        error: (err) => {
          this.alertService.error('Error', err.error?.message || 'No se pudo actualizar el registro.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.http.post('http://localhost:3000/api/publications', payload).subscribe({
        next: () => {
          this.alertService.success('Creado', 'Publicación registrada con éxito.');
          this.router.navigate(['/dashboard/publications']);
        },
        error: (err) => {
          this.alertService.error('Error', err.error?.message || 'No se pudo crear el registro.');
          this.isSubmitting = false;
        }
      });
    }
  }
}
