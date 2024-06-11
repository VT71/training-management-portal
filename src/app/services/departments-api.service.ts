import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department } from '../interfaces/department';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5290/Department';

  constructor() {}

  public getDepartments() {
    return this.http.get<Department[]>(`${this.baseUrl}/GetDepartments`).pipe(
      catchError((error) => {
        alert('Error when getting departments');
        return [];
      })
    );
  }
}
