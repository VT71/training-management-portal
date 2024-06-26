import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrainingInterface } from '../interfaces/training.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { TrainingComplete } from '../interfaces/training-complete';
import { Department } from '../interfaces/department';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root',
})
export class TrainingsService {
  private baseUrl: string = 'http://localhost:5290/Trainings';

  constructor(private http: HttpClient) {}

  public createTraining(
    training: TrainingInterface,
    departmentsData: Department[],
    employeesData: Employee[]
  ): Observable<TrainingComplete> {
    return this.http
      .post<TrainingComplete>(`${this.baseUrl}/CreateTraining`, {...training, departments: departmentsData, employees: employeesData})
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getTrainings(): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(`${this.baseUrl}/GetTrainings`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public deleteTraining(trainingId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/DeleteTraining/${trainingId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public updateTrainingById(
    training: TrainingInterface
  ): Observable<TrainingInterface> {
    return this.http
      .put<TrainingInterface>(`${this.baseUrl}/UpdateTraining`, training)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getTrainingById(trainingId: number): Observable<TrainingComplete> {
    return this.http
      .get<TrainingComplete>(`${this.baseUrl}/GetTraining/${trainingId}`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getMissedTrainingsByEmployee(
    employeeId: number
  ): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(
        `${this.baseUrl}/GetMissedTrainingsByEmployee/${employeeId}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getCompletedTrainingsByEmployee(
    employeeId: number
  ): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(
        `${this.baseUrl}/GetCompletedTrainingsByEmployee/${employeeId}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getUpcomingTrainingsByEmployee(
    employeeId: number
  ): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(
        `${this.baseUrl}/GetUpcomingTrainingsByEmployee/${employeeId}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getInProgressTrainingsByEmployee(
    employeeId: number
  ): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(
        `${this.baseUrl}/GetInProgressTrainingsByEmployee/${employeeId}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getMissedTrainings(): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(`${this.baseUrl}/GetMissedTrainings`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getUpcomingTrainings(): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(`${this.baseUrl}/GetUpcomingTrainings`)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
