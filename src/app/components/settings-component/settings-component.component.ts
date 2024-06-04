import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsersApiService } from '../../services/users-api.service';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-settings-component',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  templateUrl: './settings-component.component.html',
  styleUrl: './settings-component.component.css',
})
export class SettingsComponentComponent {
  private userApiService = inject(UsersApiService);
  private authService = inject(AuthService);

  public user!: User;
  public user$!: Observable<User>;

  ngOnInit() {
    console.log('THIS UID: ' + JSON.stringify(this.authService?.user?.uid));
    if (this.authService?.user?.uid) {
        
      this.user$ = this.userApiService.getUserById(this.authService?.user?.uid);
    }
  }
}
