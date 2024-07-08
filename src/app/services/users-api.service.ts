import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/User`;

  constructor() {}

  public getUserById(userId: string) {
    return this.http.get<User>(`${this.baseUrl}/GetUsers/` + userId).pipe(
      catchError((error) => {
        alert('Error when getting user data');
        return [];
      })
    );
  }

  public updateUser(user: User) {
    return this.http.put<User>(`${this.baseUrl}/EditUser`, user).pipe(
      catchError((error) => {
        alert('Error when updating user');
        return [];
      })
    );
  }

  public createUser(user: User) {
    return this.http.post<User>(`${this.baseUrl}/CreateUser`, user).pipe(
      catchError((error) => {
        alert('Error when updating user');
        return [];
      })
    );
  }
}
