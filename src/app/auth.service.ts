import { Injectable, inject } from '@angular/core';
import {
  Auth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs';
// import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/compat/auth'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$: Observable<any>;

  constructor(private router: Router) {
    this.user$ = this.firebaseAuth.authState;
  }

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
    ).then(
      (response) => {
        updateProfile(response.user, {
          displayName: `${firstName} ${lastName}`,
        });

        sendEmailVerification(response.user);
        this.router.navigateByUrl('/verify-email');
      },
      (err) => {
        alert('Register Error');
      }
    );

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(
        () => {
          this.router.navigateByUrl('/dashboard');
        },
        (err) => {
          alert('Login Error');
        }
      );
    return from(promise);
  }

  logout() {
    return this.afAuth.signOut();
  }

  forgotPassword(email: string): Observable<void> {
    const promise = sendPasswordResetEmail(this.firebaseAuth, email).then(
      () => {},
      (err) => {
        alert('Login Error');
      }
    );
    return from(promise);
  }


  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }
}
