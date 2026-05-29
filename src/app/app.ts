import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { AlertComponent } from './shared/components/alert/alert.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, CommonModule, AlertComponent, ConfirmDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('REASONS');

  private router = inject(Router);
  isPublicRoute = signal<boolean>(true); // Mostrar Navbar/Footer solo en rutas públicas

  ngOnInit() {
    // Detectar si estamos en ruta pública o privada al iniciar
    this.updateRouteType(this.router.url);

    // Actualizar al navegar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateRouteType(event.url);
    });
  }

  private updateRouteType(url: string) {
    const isPrivate = url.includes('/admin') || url.includes('/dashboard');
    this.isPublicRoute.set(!isPrivate);
  }
}
