import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AnimateOnScrollDirective, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  
  groupInfo: any = null;
  stats: any = { projects: 0, researchers: 0, publications: 0 };
  isLoading = true;

  ngOnInit() {
    // Obtener información del grupo
    this.http.get<any[]>('http://localhost:3000/api/groups').subscribe({
      next: (groups) => {
        if (groups && groups.length > 0) {
          this.groupInfo = groups[0];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching group info', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    // Obtener estadísticas reales
    this.http.get<any>('http://localhost:3000/api/groups/stats').subscribe({
      next: (stats) => {
        if (stats) {
          this.stats = stats;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error fetching stats', err)
    });
  }

  // Helper method to get an icon based on index for lines of research
  getIconForLine(index: number): string {
    const icons = ['local_shipping', 'precision_manufacturing', 'eco', 'groups', 'lightbulb', 'science'];
    return icons[index % icons.length];
  }

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
