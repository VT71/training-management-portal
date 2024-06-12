import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeComplete } from '../interfaces/employee-complete';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeesApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5290/Employee';

  constructor() {}

  public getEmployeesComplete() {
    return this.http
      .get<EmployeeComplete[]>(`${this.baseUrl}/GetEmployeesComplete`)
      .pipe(
        catchError((error) => {
          alert('Error when getting employees');
          return [];
        })
      );
  }
}
