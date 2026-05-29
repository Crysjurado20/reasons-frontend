import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Article {
  title: string;
  authors: string;
  abstract: string;
  citation: string;
  link: string;
}

import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './publications.html',
  styleUrl: './publications.scss'
})
export class Publications {
  articles: Article[] = [
    {
      title: 'Modelo PROS50 para la Mejora de Procesos en MIPYMES',
      authors: 'Tigre, F., Ortiz, D., Reyes, J.',
      abstract: 'Este artículo presenta un modelo integral diseñado para optimizar los procesos sostenibles en las pequeñas y medianas empresas del sector textil, utilizando herramientas de manufactura esbelta e industria 4.0.',
      citation: 'Tigre, F., et al. (2025). Modelo PROS50 para MIPYMES. Journal of Sustainable Manufacturing, 12(4), 45-60.',
      link: 'https://imagineresearch.org/modelo-pros50-para-mipymes-textiles/'
    },
    {
      title: 'Integración de IoT en la cadena de suministro del sector calzado',
      authors: 'Castro, P., Reyes, J., Sánchez, C.',
      abstract: 'Se describe la implementación de sensores y conectividad en tiempo real para la trazabilidad y eficiencia en la logística de la industria del calzado ecuatoriana.',
      citation: 'Castro, P., et al. (2024). IoT en la cadena de suministro. International Journal of Logistics, 8(2), 112-130.',
      link: '#'
    }
  ];
}
