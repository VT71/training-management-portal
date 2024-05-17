import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
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
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    console.log('submitting form');
    const rawForm = this.form.getRawValue();
    this.authService
      .register(
        rawForm.firstName,
        rawForm.lastName,
        rawForm.email,
        rawForm.password
      )
      .subscribe(() => {
        this.router.navigateByUrl('/dashboard');
      });
  }
}
