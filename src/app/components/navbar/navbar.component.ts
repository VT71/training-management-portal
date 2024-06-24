import { Component, OnInit, inject } from '@angular/core';
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
import { Observable } from 'rxjs';

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
export class NavbarComponent implements OnInit {
  isDropdownOpen = false;
  authService = inject(AuthService);
  usersApiService = inject(UsersApiService);
  router = inject(Router);

  query: string = '';

  searchResults: { title: string; route: string }[] = [];
  user$!: Observable<User>;
  searchValue = '';
  articles: ArticleInterface[] = [];

  public searchForm = new FormGroup({
    search: new FormControl(''),
  });

  constructor(public dialog: MatDialog, private searchService: SearchService) {}

  public readonly control = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    const sessionAuthUser = sessionStorage.getItem('authUser');
    if (sessionAuthUser) {
      const objSessionAuthUser = JSON.parse(sessionAuthUser);
      let uid = objSessionAuthUser?.uid;
      this.user$ = this.usersApiService.getUserById(uid);
    }

    this.fetchData();
  }

  fetchData(): void {
    this.searchService.getArticles(this.searchValue).subscribe((articles) => {
      this.articles = articles;
    });
  }

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

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: { type: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  // search(): void {
  //   const query = this.control.value;
  //   if (query) {
  //     this.router.navigate(['/search'], { queryParams: { q: query } });
  //     this.searchValue = this.searchService.getArticle(this.query);
  //   }
  // }
}
