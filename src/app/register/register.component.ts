import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeatPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    // if (this.form.valid) {
    const rawForm = this.form.getRawValue();
    //   if (rawForm.password === rawForm.repeatPassword) {
    this.authService
      .register(
        rawForm.firstName,
        rawForm.lastName,
        rawForm.email,
        rawForm.password
      )
      .subscribe(() => {
        this.router.navigateByUrl('/verify-email');
      });
    //   }
    // }
  }
}
