import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  router = inject(Router);
  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  email: string = '';

  constructor(private auth: AuthService) {}

  forgotPassword(): void {
    const rawForm = this.form.getRawValue();
    this.auth.forgotPassword(rawForm.email).subscribe(() => {
      this.router.navigateByUrl('/verify-email');
    });
  }
}
