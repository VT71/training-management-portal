import { Injectable, inject } from '@angular/core';
import { Auth, sendEmailVerification } from '@angular/fire/auth';

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
    ).then((response) => {
      updateProfile(response.user, {
        displayName: `${firstName} ${lastName}`,
      });

      sendEmailVerification(response.user);
    });

    return from(promise);
  }
}
