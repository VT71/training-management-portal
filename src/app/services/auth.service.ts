import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user: User | null;

  constructor(private router: Router) {
    this.user = this.firebaseAuth.currentUser;
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
    ).then((response) => {
      // Will no longer set full names in firebase. They will be set on our DB
      //   updateProfile(response.user, {
      //     displayName: `${firstName} ${lastName}`,
      //   });

      sendEmailVerification(response.user);
    });

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {
      this.user = this.firebaseAuth.currentUser;
    });
    return from(promise);
  }

  logout(): Observable<void> {
    this.user = null;
    const promise = signOut(this.firebaseAuth).then(() => {});
    return from(promise);
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

  isAuthenticated(): boolean {
    return !!this.user;
  }
}
