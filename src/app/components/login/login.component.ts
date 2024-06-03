import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  

  onSubmit(): void {
    if (this.form.valid) {
      const rawForm = this.form.getRawValue();
      this.authService.login(rawForm.email, rawForm.password).subscribe({
        error: (err) => {
          alert('Login Error');
        },
        complete: () => {
          this.router.navigateByUrl('/dashboard');
        },
      });
    }
  }
} 
