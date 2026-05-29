import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard-researchers',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
              <th class="py-3 px-4 font-semibold">Nombre Completo</th>
              <th class="py-3 px-4 font-semibold">Email Institucional</th>
              <th class="py-3 px-4 font-semibold">Cargo</th>
              <th class="py-3 px-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of researchers" class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td class="py-3 px-4">
                <div class="font-medium text-gray-800">{{item.first_name}} {{item.first_lastname}}</div>
                <div class="text-xs text-gray-500">{{item.orcid_link}}</div>
              </td>
              <td class="py-3 px-4 text-sm text-gray-600">{{item.institutional_email}}</td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{item.position || 'Investigador'}}
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
              <td colspan="4" class="py-8 text-center text-gray-500">
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

    const token = localStorage.getItem('auth_token');
    this.http.delete(`http://localhost:3000/api/researchers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.alertService.success('Eliminado', 'Investigador eliminado con éxito');
        this.loadResearchers();
      },
      error: () => this.alertService.error('Error', 'No se pudo eliminar')
    });
  }
}
