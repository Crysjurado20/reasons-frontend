import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFormat',
  standalone: true
})
export class StatusFormatPipe implements PipeTransform {
  transform(value: string | undefined | null): { label: string; cssClass: string } {
    if (!value) {
      return { label: 'Desconocido', cssClass: 'bg-gray-100 text-gray-800' };
    }

    switch (value.toUpperCase()) {
      // Proyectos e Investigadores
      case 'ACTIVE':
        return { label: 'Activo', cssClass: 'bg-green-100 text-green-800' };
      case 'INACTIVE':
        return { label: 'Inactivo', cssClass: 'bg-red-100 text-red-800' };
      case 'ALUMNI':
        return { label: 'Ex-miembro', cssClass: 'bg-blue-100 text-blue-800' };
      
      // Publicaciones y Proyectos
      case 'DRAFT':
        return { label: 'Borrador', cssClass: 'bg-gray-100 text-gray-800' };
      case 'IN_REVIEW':
        return { label: 'En Revisión', cssClass: 'bg-yellow-100 text-yellow-800' };
      case 'PUBLISHED':
        return { label: 'Publicado', cssClass: 'bg-green-100 text-green-800' };

      // Si llega un estado no mapeado
      default:
        return { label: value, cssClass: 'bg-gray-100 text-gray-800' };
    }
  }
}
