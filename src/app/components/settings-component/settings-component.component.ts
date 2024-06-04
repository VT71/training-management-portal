import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsersApiService } from '../../services/users-api.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-settings-component',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './settings-component.component.html',
  styleUrl: './settings-component.component.css',
})
export class SettingsComponentComponent {
  private userApiService = inject(UsersApiService);
  public user: User = { userId: '', fullName: '', email: '', role: '' };

  ngOnInit() {
    this.userApiService.getUserById('0YWw6P0ggtSQL6XMiW6A0D6mxE33').subscribe({
      next: (res: User) => {
        this.user = res;
      },
      error: (err) => {
        alert('Error occured when getting user data');
      },
    });
  }
}
