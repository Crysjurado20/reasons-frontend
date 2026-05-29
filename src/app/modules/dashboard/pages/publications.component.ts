import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard-publications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-merriweather">Publicaciones</h2>
          <p class="text-gray-500 text-sm mt-1">Gestiona los artículos científicos publicados.</p>
        </div>
        <a routerLink="/dashboard/publications/new" class="bg-secondary hover:bg-secondary/90 text-primary font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
          <span class="material-icons text-sm">add</span>
          <span>Nueva Publicación</span>
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
              <th class="py-3 px-4 font-semibold">Título</th>
              <th class="py-3 px-4 font-semibold">Fecha de Publicación</th>
              <th class="py-3 px-4 font-semibold">Enlace DOI</th>
              <th class="py-3 px-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of publications" class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td class="py-3 px-4 font-medium text-gray-800 max-w-xs truncate" [title]="item.title">{{item.title}}</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{item.publication_date | date:'mediumDate'}}</td>
              <td class="py-3 px-4">
                <a *ngIf="item.doi_link" [href]="item.doi_link" target="_blank" class="text-blue-600 hover:underline text-sm flex items-center gap-1">
                  Ver Artículo <span class="material-icons text-[12px]">open_in_new</span>
                </a>
              </td>
              <td class="py-3 px-4 text-right space-x-2">
                <a [routerLink]="['/dashboard/publications/edit', item.id]" class="inline-block text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded-md transition-colors cursor-pointer" title="Editar">
                  <span class="material-icons text-sm align-middle">edit</span>
                </a>
                <button (click)="deletePublication(item.id)" class="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded-md transition-colors" title="Eliminar">
                  <span class="material-icons text-sm align-middle">delete</span>
                </button>
              </td>
            </tr>
            
            <tr *ngIf="publications.length === 0">
              <td colspan="4" class="py-8 text-center text-gray-500">
                No hay publicaciones registradas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PublicationsDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private alertService = inject(AlertService);
  private confirmDialog = inject(ConfirmDialogService);
  private cdr = inject(ChangeDetectorRef);
  
  publications: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadPublications();
  }

  loadPublications() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/api/publications')
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
      .subscribe(data => this.publications = data);
  }

  async deletePublication(id: number) {
    const confirmed = await this.confirmDialog.confirm({
      title: '¿Eliminar Publicación?',
      message: 'Esta acción no se puede deshacer. El registro será eliminado permanentemente.',
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    if (!confirmed) return;

    const token = localStorage.getItem('auth_token');
    this.http.delete(`http://localhost:3000/api/publications/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.alertService.success('Eliminado', 'Publicación eliminada con éxito');
        this.loadPublications();
      },
      error: () => this.alertService.error('Error', 'No se pudo eliminar')
    });
  }
}
