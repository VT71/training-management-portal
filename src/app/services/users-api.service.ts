import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5290/User/GetUsers/';

  constructor() {}

  public getUserById(userId: string) {
    return this.http.get<User>(this.baseUrl + userId).pipe(
      catchError((error) => {
        alert('Error when getting user data');
        return [];
      })
    );
  }
}
