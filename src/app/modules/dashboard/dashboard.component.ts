import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  private router = inject(Router);
  user: any = null;
  sidebarOpen = signal(false);
  isDesktop = signal(window.innerWidth >= 768);

  @HostListener('window:resize')
  onResize() {
    this.isDesktop.set(window.innerWidth >= 768);
    if (this.isDesktop()) {
      this.sidebarOpen.set(false); // reset when going back to desktop
    }
  }

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
