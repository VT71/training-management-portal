import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrainingInterface } from '../interfaces/training.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TrainingsService {
  private baseUrl: string = 'http://localhost:5290/Trainings';

  constructor(private http: HttpClient) {}

  public createTraining(
    training: TrainingInterface
  ): Observable<TrainingInterface> {
    return this.http
      .post<TrainingInterface>(`${this.baseUrl}/CreateTraining`, training)
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

  public updateTraining(
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

  public getTrainingById(trainingId: number): Observable<TrainingInterface> {
    return this.http
      .get<TrainingInterface>(`${this.baseUrl}/GetTraining/${trainingId}`)
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
}
