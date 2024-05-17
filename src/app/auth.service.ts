import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@firebase/auth';
import { Observable, from, last } from 'rxjs';

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
    ).then((response) =>
      updateProfile(response.user, { displayName: `${firstName} ${lastName}` })
    );

    return from(promise);
  }
}
