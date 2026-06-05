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
  selector: 'app-dashboard-publications',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusFormatPipe],
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
              <th class="py-3 px-4 font-semibold w-16">Portada</th>
              <th class="py-3 px-4 font-semibold">Título</th>
              <th class="py-3 px-4 font-semibold">Autores</th>
              <th class="py-3 px-4 font-semibold">Estado</th>
              <th class="py-3 px-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of publications" class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td class="py-3 px-4">
                <div class="h-14 w-10 rounded shadow-sm overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-200">
                  <img *ngIf="item.url_journal_cover" [src]="item.url_journal_cover" class="h-full w-full object-cover">
                  <span *ngIf="!item.url_journal_cover" class="material-icons text-gray-300">article</span>
                </div>
              </td>
              <td class="py-3 px-4 font-medium text-gray-800 max-w-xs truncate" [title]="item.title">{{item.title}}</td>
              <td class="py-3 px-4 text-sm text-gray-600">
                <div class="relative group inline-block cursor-default">
                  <!-- Truncation Logic -->
                  <span class="font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    {{ formatAuthorsList(item.researcher_articles || item.researchers) }}
                  </span>
                  
                  <!-- Tooltip -->
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 text-left">
                    <div *ngFor="let rel of (item.researcher_articles || item.researchers)" class="py-0.5">
                      {{ rel.researchers?.first_name || 'Autor' }} {{ rel.researchers?.first_lastname || 'Desconocido' }}
                    </div>
                    <div *ngIf="!(item.researcher_articles || item.researchers)?.length">
                      Sin autores asignados
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span *ngIf="item.status | statusFormat as statusInfo" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      [ngClass]="statusInfo.cssClass">
                  {{statusInfo.label}}
                </span>
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
              <td colspan="5" class="py-8 text-center text-gray-500">
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

  formatAuthorsList(authors: any[]): string {
    if (!authors || authors.length === 0) return 'Sin autores';
    
    // Convert to simplified names (Initial + Lastname)
    const formattedNames = authors.map(rel => {
      const researcher = rel.researchers;
      if (!researcher) return 'Desconocido';
      const initial = researcher.first_name ? researcher.first_name.charAt(0) + '.' : '';
      return `${initial} ${researcher.first_lastname || ''}`.trim();
    });

    if (formattedNames.length <= 2) {
      return formattedNames.join(', ');
    } else {
      return `${formattedNames[0]}, ${formattedNames[1]} +${formattedNames.length - 2} más`;
    }
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

    this.http.delete(`http://localhost:3000/api/publications/${id}`).subscribe({
      next: () => {
        this.alertService.success('Eliminado', 'Publicación eliminada con éxito');
        this.loadPublications();
      },
      error: () => this.alertService.error('Error', 'No se pudo eliminar')
    });
  }
}
