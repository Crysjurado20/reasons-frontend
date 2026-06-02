import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';

export interface Article {
  title: string;
  authors: string;
  abstract: string;
  citation: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/publications';

  getPublications(): Observable<Article[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      timeout(8000),
      map(backendPubs => {
        return backendPubs.map(pub => {
          let authorsString = 'Sin autores';
          if (pub.researcher_articles && pub.researcher_articles.length > 0) {
            authorsString = pub.researcher_articles.map((ra: any) => {
              const r = ra.researchers;
              if (!r) return 'Desconocido';
              const initial = r.first_name ? r.first_name.charAt(0) + '.' : '';
              return `${r.first_lastname || ''}, ${initial}`.trim();
            }).join(', ');
          }

          return {
            title: pub.title,
            abstract: pub.abstract || 'Sin resumen disponible.',
            citation: pub.cite || 'Sin cita registrada.',
            link: pub.url_journal_cover || '#',
            authors: authorsString
          };
        });
      }),
      catchError(() => of([]))
    );
  }
}