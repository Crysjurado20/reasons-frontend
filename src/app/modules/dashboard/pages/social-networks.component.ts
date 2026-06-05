import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard-social-networks',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 font-merriweather">Redes Sociales</h2>
          <p class="text-gray-500 text-sm mt-1">Configuración del catálogo de redes sociales y perfiles externos.</p>
        </div>
        <a routerLink="/dashboard/social-networks/new" class="bg-secondary hover:bg-secondary/90 text-primary font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
          <span class="material-icons text-sm">add</span>
          <span>Nueva Red Social</span>
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
              <th class="py-3 px-4 font-semibold w-16 text-center">Ícono</th>
              <th class="py-3 px-4 font-semibold">Nombre de la Red</th>
              <th class="py-3 px-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of socialNetworks" class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td class="py-3 px-4 text-center">
                <img *ngIf="item.url_image" [src]="item.url_image" alt="logo" class="w-6 h-6 object-cover mx-auto rounded-sm">
                <span *ngIf="!item.url_image" class="material-icons text-gray-400">link</span>
              </td>
              <td class="py-3 px-4 font-medium text-gray-800">{{item.name}}</td>
              <td class="py-3 px-4 text-right space-x-2">
                <a [routerLink]="['/dashboard/social-networks/edit', item.id]" class="inline-block text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded-md transition-colors cursor-pointer" title="Editar">
                  <span class="material-icons text-sm align-middle">edit</span>
                </a>
                <button (click)="deleteSocialNetwork(item.id)" class="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded-md transition-colors" title="Eliminar">
                  <span class="material-icons text-sm align-middle">delete</span>
                </button>
              </td>
            </tr>
            
            <tr *ngIf="socialNetworks.length === 0">
              <td colspan="3" class="py-8 text-center text-gray-500">
                No hay redes sociales registradas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SocialNetworksDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private alertService = inject(AlertService);
  private confirmDialog = inject(ConfirmDialogService);
  private cdr = inject(ChangeDetectorRef);
  
  socialNetworks: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadSocialNetworks();
  }

  loadSocialNetworks() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/api/social-networks')
      .pipe(
        timeout(8000),
        catchError(() => {
          this.alertService.error('Error de conexión', 'No se pudieron cargar las redes sociales.');
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe(data => this.socialNetworks = data);
  }

  async deleteSocialNetwork(id: number) {
    const confirmed = await this.confirmDialog.confirm({
      title: '¿Eliminar Red Social?',
      message: 'Esta acción aplicará un borrado lógico y ocultará la red de las listas desplegables, pero conservará los perfiles existentes de los investigadores.',
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    if (!confirmed) return;

    this.http.delete(`http://localhost:3000/api/social-networks/${id}`).subscribe({
      next: () => {
        this.alertService.success('Eliminada', 'Red social eliminada con éxito');
        this.loadSocialNetworks();
      },
      error: () => this.alertService.error('Error', 'No se pudo eliminar la red social')
    });
  }
}
