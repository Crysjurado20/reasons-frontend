import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
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
          <p class="text-gray-500 text-sm mt-1">Completa el formulario con la información del investigador institucional.</p>
        </div>
      </div>

      <div *ngIf="isLoading" class="py-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>

      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Primer Nombre <span class="text-red-500">*</span></label>
            <input type="text" formControlName="first_name" 
                   (keypress)="validateOnlyLetters($event)"
                   [ngClass]="{'border-red-500 focus:ring-red-200 focus:border-red-500': isFieldInvalid('first_name')}"
                   class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Juan">
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Segundo Nombre</label>
            <input type="text" formControlName="second_name" 
                   (keypress)="validateOnlyLetters($event)"
                   [ngClass]="{'border-red-500 focus:ring-red-200 focus:border-red-500': isFieldInvalid('second_name')}"
                   class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Carlos">
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Primer Apellido <span class="text-red-500">*</span></label>
            <input type="text" formControlName="first_lastname" 
                   (keypress)="validateOnlyLetters($event)"
                   [ngClass]="{'border-red-500 focus:ring-red-200 focus:border-red-500': isFieldInvalid('first_lastname')}"
                   class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Pérez">
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Segundo Apellido</label>
            <input type="text" formControlName="second_lastname" 
                   (keypress)="validateOnlyLetters($event)"
                   [ngClass]="{'border-red-500 focus:ring-red-200 focus:border-red-500': isFieldInvalid('second_lastname')}"
                   class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="Ej. Silva">
          </div>
        </div>

        <hr class="border-gray-100">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Email Institucional <span class="text-red-500">*</span></label>
            <input type="email" formControlName="institutional_email" 
                   [ngClass]="{'border-red-500 focus:ring-red-200 focus:border-red-500': isFieldInvalid('institutional_email')}"
                   class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="usuario@uta.edu.ec">
            <p *ngIf="form.get('institutional_email')?.hasError('pattern') && form.get('institutional_email')?.touched" class="text-xs text-red-500 font-medium">Debe ingresar un correo válido de la UTA (@uta.edu.ec).</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Cargo de Investigación <span class="text-red-500">*</span></label>
            <select formControlName="position" 
                    [ngClass]="{'border-red-500 focus:ring-red-200 focus:border-red-500': isFieldInvalid('position')}"
                    class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all bg-white text-sm">
              <option value="" disabled selected>Seleccione el cargo oficial...</option>
              <option *ngFor="let cargo of cargosUTA" [value]="cargo">{{ cargo }}</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700">Estado <span class="text-red-500">*</span></label>
            <select formControlName="status" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all bg-white">
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="ALUMNI">Ex-miembro</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Enlace ORCID</label>
          <input type="text" formControlName="orcid_link" 
                 [ngClass]="{'border-red-500 focus:ring-red-200 focus:border-red-500': isFieldInvalid('orcid_link')}"
                 class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="https://orcid.org/0000-0000-0000-0000">
          <p *ngIf="form.get('orcid_link')?.hasError('pattern') && form.get('orcid_link')?.touched" class="text-xs text-red-500 font-medium">Debe ingresar una URL válida (ej. https://orcid.org/...).</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Biografía</label>
          <textarea formControlName="biography" rows="4" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none" placeholder="Breve descripción del perfil profesional..."></textarea>
        </div>

        <div class="space-y-4 pt-4">
          <div class="flex justify-between items-center">
            <label class="text-sm font-semibold text-gray-700">Redes Sociales / Perfiles Externos</label>
            <button type="button" (click)="addSocial()" class="text-xs bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium">
              <span class="material-icons text-sm">add</span> Añadir
            </button>
          </div>
          <div formArrayName="researcher_socials" class="space-y-3">
            <div *ngFor="let soc of researcher_socials.controls; let i=index" [formGroupName]="i" class="flex items-center gap-3">
              <select formControlName="social_network_id" class="w-40 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-secondary outline-none text-sm bg-white">
                <option [ngValue]="null" disabled>Selecciona red...</option>
                <option *ngFor="let net of allSocialNetworks" [value]="net.id" [disabled]="isSocialNetworkSelected(net.id, i)" [hidden]="isSocialNetworkSelected(net.id, i)">
                  {{ net.name }}
                </option>
              </select>
              <div class="flex-1 flex flex-col gap-1">
                <input type="url" formControlName="url_profile" 
                       [ngClass]="{'border-red-500 focus:ring-red-200 focus:border-red-500': soc.get('url_profile')?.invalid && soc.get('url_profile')?.touched}"
                       class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-secondary outline-none text-sm" placeholder="https://linkedin.com/in/... (URL Perfil)">
                <p *ngIf="soc.get('url_profile')?.hasError('pattern') && soc.get('url_profile')?.touched" class="text-[10px] text-red-500 font-medium">Requiere un enlace válido (http:// o https://).</p>
              </div>
              <button type="button" (click)="removeSocial(i)" class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors self-start">
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
            <p *ngIf="researcher_socials.length === 0" class="text-xs text-gray-500 italic">No se han añadido redes sociales.</p>
          </div>
        </div>

        <div class="pt-6 flex justify-end gap-4 border-t border-gray-100">
          <a routerLink="/dashboard/researchers" class="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">Cancelar</a>
          <button type="submit" [disabled]="form.invalid || isSubmitting" 
                  class="px-8 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
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

  readonly cargosUTA: string[] = [
    'Docente Investigador Ocasional',
    'Director de Proyecto de Investigación',
    'Coordinador Académico / Técnico de Proyecto',
    'Personal de Apoyo Académico No Titular',
    'Estudiante Investigador / Becario'
  ];

  private readonly letrasPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  private readonly emailUtaPattern = /^[a-zA-Z0-9._%+-]+@uta\.edu\.ec$/;
  // Expresión regular para validar URLs reales obligatoriamente
  private readonly urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

  form: FormGroup = this.fb.group({
    first_name: ['', [Validators.required, Validators.pattern(this.letrasPattern)]],
    second_name: ['', [Validators.pattern(this.letrasPattern)]],
    first_lastname: ['', [Validators.required, Validators.pattern(this.letrasPattern)]],
    second_lastname: ['', [Validators.pattern(this.letrasPattern)]],
    institutional_email: ['', [Validators.required, Validators.pattern(this.emailUtaPattern)]],
    position: ['', Validators.required],
    status: ['ACTIVE', Validators.required],
    orcid_link: ['', [Validators.pattern(this.urlPattern)]], // Opcional, pero si se escribe, debe ser URL
    biography: [''],
    researcher_socials: this.fb.array([])
  });

  allSocialNetworks: any[] = [];

  get researcher_socials() { return this.form.get('researcher_socials') as FormArray; }

  ngOnInit() {
    this.loadSocialNetworks();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.editingId = params['id'];
        this.loadResearcher(this.editingId!);
      }
    });
  }

  validateOnlyLetters(event: KeyboardEvent): void {
    const key = event.key;
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    if (!pattern.test(key)) {
      event.preventDefault();
    }
  }

  loadSocialNetworks() {
    this.http.get<any[]>('http://localhost:3000/api/social-networks').subscribe({
      next: (data) => this.allSocialNetworks = data,
      error: () => console.error('Error al cargar redes sociales')
    });
  }

  isSocialNetworkSelected(networkId: number, currentIndex: number): boolean {
    const selectedIds = this.researcher_socials.value.map((s: any, index: number) =>
      index !== currentIndex ? Number(s.social_network_id) : null
    );
    return selectedIds.includes(Number(networkId));
  }

  addSocial() {
    this.researcher_socials.push(this.fb.group({
      social_network_id: [null, Validators.required],
      url_profile: ['', [Validators.required, Validators.pattern(this.urlPattern)]] // Obliga formato enlace
    }));
  }

  removeSocial(index: number) { this.researcher_socials.removeAt(index); }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  loadResearcher(id: number) {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:3000/api/researchers/${id}`).subscribe({
      next: (data) => {
        this.form.patchValue({
          first_name: data.first_name,
          second_name: data.second_name || '',
          first_lastname: data.first_lastname,
          second_lastname: data.second_lastname || '',
          institutional_email: data.institutional_email,
          position: data.position || '',
          status: data.status || 'ACTIVE',
          orcid_link: data.orcid_link || '',
          biography: data.biography || ''
        });

        if (this.researcher_socials.length > 0) {
          this.researcher_socials.clear();
        }

        const socialsData = data.researcher_socials;
        if (socialsData && Array.isArray(socialsData)) {
          socialsData.forEach((soc: any) => {
            this.researcher_socials.push(this.fb.group({
              social_network_id: [soc.social_network_id, Validators.required],
              url_profile: [soc.url_profile, [Validators.required, Validators.pattern(this.urlPattern)]]
            }));
          });
        }

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
      this.alertService.warning('Formulario inválido', 'Por favor, corrige los errores y completa los campos obligatorios.');
      return;
    }

    this.isSubmitting = true;
    
    // Saneamiento de datos antes de enviar al Backend
    const rawValues = this.form.value;
    const payload = {
      ...rawValues,
      // Si los campos opcionales van vacíos "", los convertimos estrictamente en null
      second_name: rawValues.second_name?.trim() === "" ? null : rawValues.second_name,
      second_lastname: rawValues.second_lastname?.trim() === "" ? null : rawValues.second_lastname,
      orcid_link: rawValues.orcid_link?.trim() === "" ? null : rawValues.orcid_link,
      biography: rawValues.biography?.trim() === "" ? null : rawValues.biography,
      researcher_socials: rawValues.researcher_socials.map((s: any) => ({
        social_network_id: Number(s.social_network_id),
        url_profile: s.url_profile
      }))
    };

    if (this.isEditing) {
      this.http.patch(`http://localhost:3000/api/researchers/${this.editingId}`, payload).subscribe({
        next: () => {
          this.alertService.success('Actualizado', 'Investigador actualizado con éxito.');
          this.router.navigate(['/dashboard/researchers']);
        },
        error: (err) => {
          this.alertService.error('Error', err.error?.message || 'No se pudo actualizar el registro.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.http.post('http://localhost:3000/api/researchers', payload).subscribe({
        next: () => {
          this.alertService.success('Creado', 'Investigador registrado con éxito.');
          this.router.navigate(['/dashboard/researchers']);
        },
        error: (err) => {
          this.alertService.error('Error', err.error?.message || 'No se pudo crear el registro.');
          this.isSubmitting = false;
        }
      });
    }
  }
}