import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchersService, Researcher } from '../../core/services/researchers.service';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-researchers',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './researchers.html',
  styleUrl: './researchers.scss'
})
export class Researchers implements OnInit {
  private researchersService = inject(ResearchersService);
  private cdr = inject(ChangeDetectorRef);

  team: Researcher[] = [];

  ngOnInit(): void {
    this.researchersService.getResearchers().subscribe(data => {
      this.team = data;
      this.cdr.detectChanges();
    });
  }
}