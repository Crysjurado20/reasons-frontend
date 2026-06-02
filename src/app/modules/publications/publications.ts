import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationsService, Article } from '../../core/services/publications.service';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './publications.html',
  styleUrl: './publications.scss'
})
export class Publications implements OnInit {
  private publicationsService = inject(PublicationsService);
  private cdr = inject(ChangeDetectorRef);

  articles: Article[] = [];

  ngOnInit(): void {
    this.publicationsService.getPublications().subscribe(data => {
      this.articles = data;
      this.cdr.detectChanges();
    });
  }
}