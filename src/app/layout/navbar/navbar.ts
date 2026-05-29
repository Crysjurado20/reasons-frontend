import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  mobileMenuOpen = signal(false);

  toggleMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMenu() {
    this.mobileMenuOpen.set(false);
  }
}
