import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department } from '../interfaces/department';
import { catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Department`;

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
