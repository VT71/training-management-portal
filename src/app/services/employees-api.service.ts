import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeComplete } from '../interfaces/employee-complete';
import { catchError, concat, concatMap, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';
import { UsersApiService } from './users-api.service';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeesApiService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private usersApiService = inject(UsersApiService);
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

  public getEmployees() {
    return this.http.get<Employee[]>(`${this.baseUrl}/GetEmployees`).pipe(
      catchError((error) => {
        alert('Error when getting employees');
        return [];
      })
    );
  }

  public createEmployee(
    fullName: string,
    email: string,
    trainer: number,
    department: number
  ) {
    const createFirebauseUserRequest = this.authService.createNewUser(email);

    const createSqlUser = (firebaseUser: User) =>
      this.usersApiService.createUser(firebaseUser);

    const createSqlEmployee = (employee: Employee) =>
      this.http.post<User>(`${this.baseUrl}/CreateEmployee`, employee);

    return createFirebauseUserRequest.pipe(
      concatMap((firebaseUser) => {
        if (firebaseUser?.uid) {
          return createSqlUser({
            userId: firebaseUser?.uid,
            fullName,
            email,
            role: 'Employee',
          }).pipe(
            concatMap((sqlUser) => {
              return createSqlEmployee({
                employeeId: -1,
                trainer,
                userId: sqlUser.userId,
                departmentId: department,
              });
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }
}
