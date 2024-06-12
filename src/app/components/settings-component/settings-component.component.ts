import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UsersApiService } from '../../services/users-api.service';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription, map, of } from 'rxjs';
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
  private router = inject(Router);

  private subscriptions: Subscription[] = [];
  private fullUser!: User;
  public user$!: Observable<User>;

  public personalForm = this.fb.nonNullable.group({
    fullName: [
      '',
      [Validators.required, Validators.maxLength(255), Validators.minLength(1)],
    ],
    email: ['', [Validators.required, Validators.email]],
  });

  public passwordForm = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.maxLength(255)]],
    newPasswordRepeat: ['', [Validators.required, Validators.maxLength(255)]],
  });

  public onSubmitPersonal(): void {
    if (this.personalForm.valid && this.fullUser) {
      let rawForm = this.personalForm.getRawValue();

      const fireUpdateEmailSubscription = this.authService
        .updateEmail(rawForm.email)
        .subscribe({
          complete: () => {
            const apiUserUpdateSubscription = this.userApiService
              .updateUser({
                ...this.fullUser,
                email: rawForm.email,
                fullName: rawForm.fullName,
              })
              .subscribe({
                complete: () => {
                  if (this.personalForm.controls['email'].dirty) {
                    alert('Please verify your new email');
                  }
                },
                error: () => alert('Error occured when updating your email'),
              });
            this.subscriptions.push(apiUserUpdateSubscription);
          },
          error: () => {
            const fireLogoutSubscription = this.authService.logout().subscribe({
              complete: () => {
                this.router.navigateByUrl('/login');
                alert('Please log in again, then update your profile');
              },
            });
            this.subscriptions.push(fireLogoutSubscription);
          },
        });
      this.subscriptions.push(fireUpdateEmailSubscription);
    }
  }

  public onSubmitPassword(): void {
    if (this.passwordForm.valid) {
      let rawForm = this.passwordForm.getRawValue();
      if (rawForm.newPassword === rawForm.newPasswordRepeat) {
        const firePassSubscription = this.authService
          .updatePassword(rawForm?.newPassword)
          .subscribe({ complete: () => this.passwordForm.reset() });
        this.subscriptions.push(firePassSubscription);
      } else {
        alert('Passwords are not the same');
      }
    } else {
      alert('Please complete the form');
    }
  }

  public ngOnInit() {
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

  public ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
