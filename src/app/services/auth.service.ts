import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  verifyBeforeUpdateEmail,
  updatePassword,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { Observable, catchError, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  http = inject(HttpClient);
  user!: User | null;

  constructor(private router: Router) {
    this.updateUser();
  }

  private updateUser() {
    if (this.firebaseAuth.currentUser) {
      this.user = this.firebaseAuth.currentUser;
    } else {
      const sessionAuthUser = sessionStorage.getItem('authUser');
      if (sessionAuthUser) {
        const objSessionAuthUser = JSON.parse(sessionAuthUser);
        this.user = <User>objSessionAuthUser;
      } else {
        this.user = null;
      }
    }
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
      sessionStorage.setItem(
        'authUser',
        JSON.stringify(this.firebaseAuth.currentUser)
      );
    });
    return from(promise);
  }

  logout(): Observable<void> {
    this.user = null;
    sessionStorage.removeItem('authUser');
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

  updateEmail(newEmail: string): Observable<void> {
    this.updateUser();
    if (this.user) {
      const promise = verifyBeforeUpdateEmail(this.user, newEmail).then();
      return from(promise);
    }
    return of();
  }

  updatePassword(newPassword: string): Observable<void> {
    this.updateUser();
    if (this.user) {
      const promise = updatePassword(this.user, newPassword)
        .then(() => alert('Password Updated'))
        .catch((err) => {
          if (err?.code === 'auth/requires-recent-login') {
            this.router.navigateByUrl('/login');
            alert('Please log in again');
          }
        });
      return from(promise);
    }
    return of();
  }

  generatePassword(length: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%?';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

  createNewUser(email: string): Observable<void | User | null> {
    const tempPassword = this.generatePassword(12);

    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      tempPassword
    )
      .then((response) => {
        if (response?.user?.email) {
          sendPasswordResetEmail(this.firebaseAuth, response.user.email);
        }
        const newUser = this.firebaseAuth?.currentUser;
        return this.firebaseAuth.signOut().then(() => {
          return newUser;
        });
      })
      .catch((err) => alert('An error occured when creating a user account'));
    return from(promise);
  }

  isAdmin(): Observable<boolean> {
    this.updateUser();
    return this.http
      .get<boolean>(
        `http://localhost:5290/User/IsAdmin?userId=${
          this.user?.uid ? this.user?.uid : ''
        }`
      )
      .pipe(
        catchError((error) => {
          alert('Error when checking user for admin role');
          return [];
        })
      );
  }

  isAuthenticated(): boolean {
    return !!this.user || !!sessionStorage.getItem('authUser');
  }
}
