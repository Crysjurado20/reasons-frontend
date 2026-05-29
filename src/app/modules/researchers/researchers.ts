import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Researcher {
  name: string;
  position: string;
  bio: string;
  orcid: string;
  email: string;
}

import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-researchers',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './researchers.html',
  styleUrl: './researchers.scss'
})
export class Researchers {
  team: Researcher[] = [
    {
      name: 'Franklin Tigre Ortega',
      position: 'Director',
      bio: 'Docente universitario en la carrera de Ingeniería Industrial en la UTA. Magíster en Gestión de Operaciones y doctorando en la UPV. Investigación en cadena de suministro y PYMES.',
      orcid: 'https://orcid.org/0000-0003-0254-029X',
      email: 'fg.tigre@uta.edu.ec'
    },
    {
      name: 'John Reyes Vásquez',
      position: 'Subdirector',
      bio: 'Doctor en Ingeniería y Producción Industrial (UPV). Experiencia en procesos logísticos, gestión de cadena de suministro e industria 4.0.',
      orcid: 'http://orcid.org/0000-0002-5446-5490',
      email: 'johnpreyes@uta.edu.ec'
    },
    {
      name: 'Ana Pamela Castro Martin',
      position: 'Investigador',
      bio: 'Ingeniera Mecatrónica con Maestría en Sistemas de Manufactura. Investigación en conectividad de procesos, IoT e Industria 4.0/5.0.',
      orcid: 'https://orcid.org/0000-0002-7954-7871',
      email: 'ap.castro@uta.edu.ec'
    },
    {
      name: 'Daysi Ortiz Guerrero',
      position: 'Investigador',
      bio: 'Magíster en Gestión de Operaciones. Especialista en optimización de procesos, eficiencia operativa y manufactura esbelta.',
      orcid: 'https://orcid.org/0000-0001-6485-808X',
      email: 'dm.ortiz@uta.edu.ec'
    }
  ];
}
