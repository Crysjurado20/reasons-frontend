import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard-researchers',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusFormatPipe],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-merriweather">Investigadores</h2>
          <p class="text-gray-500 text-sm mt-1">Gestiona el equipo de trabajo de REASONS.</p>
        </div>
        <a routerLink="/dashboard/researchers/new" class="bg-secondary hover:bg-secondary/90 text-primary font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
          <span class="material-icons text-sm">add</span>
          <span>Nuevo Investigador</span>
        </a>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="py-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto" *ngIf="!isLoading">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
              <th class="py-3 px-4 font-semibold w-14">Foto</th>
              <th class="py-3 px-4 font-semibold">Nombre Completo</th>
              <th class="py-3 px-4 font-semibold">Email Institucional</th>
              <th class="py-3 px-4 font-semibold">Cargo</th>
              <th class="py-3 px-4 font-semibold">Estado</th>
              <th class="py-3 px-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of researchers" class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td class="py-3 px-4">
                <div class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300">
                  <img *ngIf="item.url_photo" [src]="item.url_photo" class="h-full w-full object-cover">
                  <span *ngIf="!item.url_photo" class="material-icons text-gray-400">person</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="font-medium text-gray-800 flex items-center gap-2">
                  {{item.first_name}} {{item.first_lastname}}
                  <a *ngIf="item.orcid_link" [href]="item.orcid_link" target="_blank" title="Ver ORCID" class="text-[#A6CE39] hover:opacity-80 transition-opacity">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.44h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.719-4.097-3.719h-2.222z"/>
                    </svg>
                  </a>
                </div>
              </td>
              <td class="py-3 px-4 text-sm text-gray-600">{{item.institutional_email}}</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{item.position || 'Investigador'}}</td>
              <td class="py-3 px-4">
                <span *ngIf="item.status | statusFormat as statusInfo" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      [ngClass]="statusInfo.cssClass">
                  {{statusInfo.label}}
                </span>
              </td>
              <td class="py-3 px-4 text-right space-x-2">
                <a [routerLink]="['/dashboard/researchers/edit', item.id]" class="inline-block text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded-md transition-colors cursor-pointer" title="Editar">
                  <span class="material-icons text-sm align-middle">edit</span>
                </a>
                <button (click)="deleteResearcher(item.id)" class="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded-md transition-colors" title="Eliminar">
                  <span class="material-icons text-sm align-middle">delete</span>
                </button>
              </td>
            </tr>
            
            <tr *ngIf="researchers.length === 0">
              <td colspan="6" class="py-8 text-center text-gray-500">
                No hay investigadores registrados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ResearchersDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private alertService = inject(AlertService);
  private confirmDialog = inject(ConfirmDialogService);
  private cdr = inject(ChangeDetectorRef);
  
  researchers: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadResearchers();
  }

  loadResearchers() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/api/researchers')
      .pipe(
        timeout(8000),
        catchError(() => {
          this.alertService.error('Error de conexión', 'Verifica que el backend esté corriendo en el puerto 3000.');
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe(data => this.researchers = data);
  }

  async deleteResearcher(id: number) {
    const confirmed = await this.confirmDialog.confirm({
      title: '¿Eliminar Investigador?',
      message: 'Esta acción no se puede deshacer. El registro será eliminado permanentemente.',
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    if (!confirmed) return;

    this.http.delete(`http://localhost:3000/api/researchers/${id}`).subscribe({
      next: () => {
        this.alertService.success('Eliminado', 'Investigador eliminado con éxito');
        this.loadResearchers();
      },
      error: () => this.alertService.error('Error', 'No se pudo eliminar')
    });
  }
}
