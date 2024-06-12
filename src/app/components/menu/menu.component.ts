import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  RouterLink,
  RouterLinkActive,
  UrlSegment,
} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription, filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive, NgIf, CommonModule, MatTooltipModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  public trainingsDropDownOpen = false;
  public trainingsDropDownActive = false;
  private subscriptions?: Subscription[];
  private authService: AuthService = inject(AuthService);
  public menuCollapsed = false;

  public manuallyUpdateTrainingsDropDownOpen(): void {
    this.trainingsDropDownOpen = !this.trainingsDropDownOpen;
    this.menuCollapsed = false;
  }

  public toggleMenu() {
    this.menuCollapsed = !this.menuCollapsed;
    this.trainingsDropDownOpen = false;
  }

  private updateTrainingsDropDown(url: string): void {
    if (url.includes('trainings')) {
      if (this.menuCollapsed) {
        this.trainingsDropDownOpen = false;
        this.trainingsDropDownActive = true;
      } else {
        this.trainingsDropDownOpen = true;
        this.trainingsDropDownActive = true;
      }
    } else {
      this.trainingsDropDownOpen = false;
      this.trainingsDropDownActive = false;
    }
  }

  public logOut(): void {
    this.authService.logout().subscribe({
      error: (err) => {
        alert('Sign out Error');
      },
      complete: () => {
        this.router.navigateByUrl('/login');
      },
    });
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
