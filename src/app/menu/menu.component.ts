import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  RouterLink,
  RouterLinkActive,
  UrlSegment,
} from '@angular/router';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  trainingsDropDownOpen = false;
  routerSubscription?: Subscription;

  updateTrainingsDropDownOpen(url: string): void {
    if (url.includes('trainings')) {
      this.trainingsDropDownOpen = true;
    } else {
      this.trainingsDropDownOpen = false;
    }
  }

  

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateTrainingsDropDownOpen(this.router.url);

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateTrainingsDropDownOpen(this.router.url);
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
