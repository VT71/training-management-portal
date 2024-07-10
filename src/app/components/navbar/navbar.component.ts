import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonModule, NgIf } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogContentExampleDialog } from '../calendar/dialog-component/dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchService } from '../../services/search-service.service';
import { UsersApiService } from '../../services/users-api.service';
import { ArticleInterface } from '../../interfaces/article.interface';
import { User } from '../../interfaces/user';
import { Observable, Subscription } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-add-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatMenuTrigger,
    NgIf,
    MatBadgeModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isDropdownOpen = false;
  authService = inject(AuthService);
  usersApiService = inject(UsersApiService);
  router = inject(Router);
  public adminVersion = false;
  private subscriptions: Subscription[] = [];
  private clickListener: any;

  searchValue = '';
  filteredResults: { title: string; route: string }[] = [];
  showResults = false;
  selectedResultIndex: number = -1;
  user$!: Observable<User>;
  articles: { title: string; route: string }[] = [
    { title: 'Dashboard', route: '/dashboard' },
    { title: 'Settings', route: '/dashboard/settings' },
    { title: 'Trainings', route: '/dashboard/trainings' },
    { title: 'Employees', route: '/dashboard/employees' },
    { title: 'Departments', route: '/dashboard/departments' },
  ];

  public searchForm = new FormGroup({
    search: new FormControl(''),
  });

  constructor(public dialog: MatDialog, private searchService: SearchService, private elementRef: ElementRef) {}
  public readonly control = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    const sessionAuthUser = sessionStorage.getItem('authUser');
    if (sessionAuthUser) {
      const objSessionAuthUser = JSON.parse(sessionAuthUser);
      let uid = objSessionAuthUser?.uid;
      this.user$ = this.usersApiService.getUserById(uid);
    }

    const roleSubscription = this.authService.rolesource.subscribe((role) => {
      console.log('ROLE IN MENU: ' + role);
      if (role === 'admin') {
        this.adminVersion = true;
      } else {
        this.adminVersion = false;
      }
    });
    this.subscriptions?.push(roleSubscription);

    this.clickListener = this.onDocumentClick.bind(this);
    document.addEventListener('click', this.clickListener);
  }

  public onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    // Check if the clicked element is outside the dropdown
    if (this.isDropdownOpen && !this.elementRef.nativeElement.contains(targetElement)) {
      this.isDropdownOpen = false;
    }
  }

  public filterResults(): void {
    if (this.searchValue.trim() === '') {
      this.filteredResults = [];
      this.showResults = false;
      return;
    }

    const filtered = this.articles.filter((article) =>
      article.title.toLowerCase().includes(this.searchValue.toLowerCase())
    );

    this.filteredResults = filtered;
    this.showResults = true;
    this.selectedResultIndex = -1; // Reset selection when filtering
  }

  selectResult(result: { title: string; route: string }): void {
    this.router.navigateByUrl(result.route);
    this.searchValue = ''; // Clear search value after selecting
    this.showResults = false;
  }

  handleArrowUp(): void {
    if (this.selectedResultIndex > 0) {
      this.selectedResultIndex--;
    } else {
      this.selectedResultIndex = this.filteredResults.length - 1;
    }
  }

  handleArrowDown(): void {
    if (this.selectedResultIndex < this.filteredResults.length - 1) {
      this.selectedResultIndex++;
    } else {
      this.selectedResultIndex = 0;
    }
  }

  navigateToSelectedResult(): void {
    if (this.selectedResultIndex !== -1) {
      const selectedRoute =
        this.filteredResults[this.selectedResultIndex].route;
      this.router.navigateByUrl(selectedRoute);
      this.searchValue = ''; // Clear search value after navigating
      this.showResults = false;
    }
  }



  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const isClickedInside = targetElement.closest('.search');

    if (!isClickedInside) {
      this.filteredResults = [];
    }
  }

  public toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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

  public openConfirmDialog(event: Event): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.openDialog();
      }
      this.router.navigate(['/dashboard/trainings/calendar']);
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '650px',
      height: '630px',
      data: { type: 'add' },
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      // Aici poți gestiona acțiunile după închiderea dialogului de adăugare (dacă este necesar)
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  clearSearch(): void {
    this.searchValue = '';
    this.filteredResults = [];
    this.showResults = false;
    this.selectedResultIndex = -1;
  }
}
