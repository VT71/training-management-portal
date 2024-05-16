import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ MatIconModule , MatMenuModule, MatMenuTrigger, NgIf, MatBadgeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    
  }
}
