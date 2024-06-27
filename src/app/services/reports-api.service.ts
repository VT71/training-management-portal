import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrainingInterface } from '../interfaces/training.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TrainingComplete } from '../interfaces/training-complete';
import { DepartmentProgress } from '../interfaces/department-progress';
import { TrainingTypeStat } from '../interfaces/training-type-stat';

@Injectable({
  providedIn: 'root',
})
export class ReportsApiService {
  private baseUrl: string = 'http://localhost:5290/Reports';

  constructor(private http: HttpClient) {}

  public getPercentageOfCompletedTrainingsByRange(
    startDate: string,
    endDate: string
  ): Observable<number> {
    return this.http
      .get<number>(
        `${this.baseUrl}/GetPercentageOfCompletedTrainingsByRange?startDate=${startDate}&endDate=${endDate}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getDepartmentsProgress(
    startDate: string,
    endDate: string
  ): Observable<DepartmentProgress[]> {
    return this.http
      .get<DepartmentProgress[]>(
        `${this.baseUrl}/GetDepartmentsProgress?startDate=${startDate}&endDate=${endDate}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getTotalTrainingsByType(
    startDate: string,
    endDate: string
  ): Observable<TrainingTypeStat[]> {
    return this.http
      .get<TrainingTypeStat[]>(
        `${this.baseUrl}/GetTotalTrainingsByType?startDate=${startDate}&endDate=${endDate}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
