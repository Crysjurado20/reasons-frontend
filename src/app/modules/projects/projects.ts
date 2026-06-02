import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProjectsService, Project } from '../../core/services/projects.service';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects implements OnInit {
  private projectsService = inject(ProjectsService);
  private cdr = inject(ChangeDetectorRef);

  projects: Project[] = []; 

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe(data => {
      this.projects = data;
            this.cdr.detectChanges();
    });
  }
}