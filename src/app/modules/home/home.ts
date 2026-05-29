import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AnimateOnScrollDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {}
