import { Injectable, inject } from '@angular/core';
import {
  Auth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';

import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);

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
      },
      (err) => {
        alert('Register Error');
      }
    );

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(
      () => {},
      (err) => {
        alert('Login Error');
      }
    );
    return from(promise);
  }
}
