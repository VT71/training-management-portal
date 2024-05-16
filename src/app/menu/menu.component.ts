import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  trainingsDropDownOpen = false;

  toggleTrainingsDropDown() {
    this.trainingsDropDownOpen = !this.trainingsDropDownOpen;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/trainings') {
      this.trainingsDropDownOpen = true;
    }
  }
}
