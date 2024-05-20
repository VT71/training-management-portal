import { Injectable, inject } from '@angular/core';
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);

  constructor(private fireauth : AngularFireAuth, private router : Router) { }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      updateProfile(response.user, {
        displayName: `${firstName} ${lastName}`,
      });

      sendEmailVerification(response.user);
    });

    return from(promise);
  }


  //forgot password 
  forgotPassword(email : string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']);
    }, err => {
      alert('Something went wrong');
    })
  }
}
