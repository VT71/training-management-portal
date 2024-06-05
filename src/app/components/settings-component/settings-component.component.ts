import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsersApiService } from '../../services/users-api.service';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-settings-component',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgIf, MatInputModule, MatFormFieldModule],
  templateUrl: './settings-component.component.html',
  styleUrl: './settings-component.component.css',
})
export class SettingsComponentComponent {
  private userApiService = inject(UsersApiService);
  private authService = inject(AuthService);

  public user$!: Observable<User>;

  ngOnInit() {
    if (this.authService?.user?.uid) {
      this.user$ = this.userApiService.getUserById(this.authService?.user?.uid);
    }
  }
}
