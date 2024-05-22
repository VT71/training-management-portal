import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, MatMenuTrigger, NgIf, MatBadgeModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isDropdownOpen = false;
  authService = inject(AuthService);
  router = inject(Router);

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logOut(): void {
    this.authService.logout().subscribe({
      error: (err) => {
        alert('Sign out Error');
      },
      complete: () => {
        this.router.navigateByUrl('/login');
      },
    });
  }
}
