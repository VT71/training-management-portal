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
  public trainingsDropDownOpen = false;
  public trainingsDropDownActive = false;
  private subscriptions?: Subscription[];

  public manuallyUpdateTrainingsDropDownOpen(): void {
    this.trainingsDropDownOpen = !this.trainingsDropDownOpen;
  }

  private updateTrainingsDropDown(url: string): void {
    if (url.includes('trainings')) {
      this.trainingsDropDownOpen = true;
      this.trainingsDropDownActive = true;
    } else {
      this.trainingsDropDownOpen = false;
      this.trainingsDropDownActive = false;
    }
    console.log('Open?:' + this.trainingsDropDownOpen);
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateTrainingsDropDown(this.router.url);

    const routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateTrainingsDropDown(this.router.url);
      });

    this.subscriptions?.push(routerSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach((subscription) => subscription.unsubscribe());
  }
}
