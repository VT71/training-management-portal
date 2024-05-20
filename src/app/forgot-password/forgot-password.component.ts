import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email : string = '';

  constructor(private auth: AuthService) {}


  forgotPassword() {
    this.auth.forgotPassword(this.email);
    this.email = '';
  }

}
