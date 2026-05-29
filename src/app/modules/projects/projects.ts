import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  participants: string[];
  description: string;
  objectives: string[];
  status: 'Activo' | 'Completado';
}

import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  projects: Project[] = [
    {
      title: 'Modelo PROS50 para MIPYMES textiles',
      participants: ['Franklin Tigre Ortega', 'Daysi Ortiz Guerrero'],
      description: 'Investigación enfocada en la toma de decisiones sostenibles y el diseño de modelos eficientes para empresas manufactureras y PYMES del sector textil en Ecuador.',
      objectives: [
        'Optimización de recursos textiles',
        'Reducción de huella de carbono',
        'Mejora del rendimiento de la cadena de suministro'
      ],
      status: 'Activo'
    },
    {
      title: 'ARTEEKO: Manipulador robótico para el mueble tapizado',
      participants: ['Ana Pamela Castro Martin', 'John Reyes Vásquez'],
      description: 'Diseño e implementación de un sistema robótico inteligente basado en Internet de las Cosas (IoT) orientado a la industria 4.0 para el sector del mueble tapizado.',
      objectives: [
        'Diseño mecánico del manipulador',
        'Integración IoT',
        'Desarrollo de algoritmos de control predictivo'
      ],
      status: 'Completado'
    }
  ];
}
