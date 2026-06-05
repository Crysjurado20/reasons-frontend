import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';

export interface Project {
  title: string;
  participants: string[];
  description: string;
  objectives: string[];
  status: 'Activo' | 'Completado';
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/projects';

  getProjects(): Observable<Project[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      timeout(8000),
      map(backendProjects => {
        return backendProjects.map(proj => {
          // 1. Extraer las descripciones de los objetivos de forma segura
          const listObjectives = proj.objectives 
            ? proj.objectives.map((obj: any) => obj.description) 
            : [];

          // 2. Mapear y formatear los nombres de los investigadores asignados
          const listParticipants = proj.researcher_projects 
            ? proj.researcher_projects.map((rp: any) => {
                const r = rp.researchers;
                if (!r) return 'Desconocido';
                
                // Unimos primer nombre, segundo nombre, primer apellido y segundo apellido
                const fullName = `${r.first_name || ''} ${r.second_name || ''} ${r.first_lastname || ''} ${r.second_lastname || ''}`;
                // Limpiamos espacios dobles por si no hay segundo nombre/apellido
                return fullName.replace(/\s+/g, ' ').trim();
              }) 
            : [];

          return {
            title: proj.title || 'Proyecto sin título',
            description: proj.description || '',
            status: proj.status === 'Completado' || proj.status === 'Activo' ? proj.status : 'Activo',
            objectives: listObjectives,
            participants: listParticipants
          };
        });
      }),
      catchError((error) => {
        console.error('Error atrapado en el servicio de proyectos:', error);
        return of([]);
      })
    );
  }
}