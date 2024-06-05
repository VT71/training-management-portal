import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsersApiService } from '../../services/users-api.service';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { Observable, map, of } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-settings-component',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    NgIf,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './settings-component.component.html',
  styleUrl: './settings-component.component.css',
})
export class SettingsComponentComponent {
  private userApiService = inject(UsersApiService);
  private authService = inject(AuthService);
  public fb = inject(FormBuilder);

  private fullUser!: User;
  public user$!: Observable<User>;

  public personalForm = this.fb.nonNullable.group({
    fullName: [
      '',
      [Validators.required, Validators.maxLength(255), Validators.minLength(1)],
    ],
    email: ['', [Validators.required, Validators.email]],
  });

  public onSubmitPersonal(): void {
    if (this.personalForm.valid && this.fullUser) {
      let rawForm = this.personalForm.getRawValue();

      this.userApiService
        .updateUser({
          ...this.fullUser,
          email: rawForm.email,
          fullName: rawForm.fullName,
        })
        .subscribe({ complete: () => alert('User updated') });
    }
  }

  ngOnInit() {
    if (this.authService?.user?.uid) {
      this.user$ = this.userApiService
        .getUserById(this.authService?.user?.uid)
        .pipe(
          map((user) => {
            if (user?.email && user?.fullName) {
              this.fullUser = user;
              this.personalForm.setValue({
                fullName: user.fullName,
                email: user.email,
              });
            }

            return user;
          })
        );
    }
  }
}
