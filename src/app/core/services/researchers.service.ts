import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';

export interface Researcher {
  name: string;
  position: string;
  bio: string;
  orcid: string;
  email: string;
  url_photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResearchersService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/researchers';

  getResearchers(): Observable<Researcher[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      timeout(8000),
      map(backendResearchers => {
        return backendResearchers.map(res => ({
          name: `${res.first_name || ''} ${res.second_name || ''} ${res.first_lastname || ''} ${res.second_lastname || ''}`.replace(/\s+/g, ' ').trim(),
          position: res.position || 'Investigador',
          bio: res.biography || 'Sin biografía disponible.',
          orcid: res.orcid_link || '#',
          email: res.institutional_email || '',
          url_photo: res.url_photo
        }));
      }),
      catchError(() => of([]))
    );
  }
}