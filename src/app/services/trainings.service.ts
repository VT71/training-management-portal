import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrainingInterface } from '../interfaces/training.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { TrainingComplete } from '../interfaces/training-complete';
import { Department } from '../interfaces/department';
import { Employee } from '../interfaces/employee';
import { Sections } from '../interfaces/sections';

@Injectable({
  providedIn: 'root',
})
export class TrainingsService {
  private baseUrl: string = 'http://localhost:5290/Trainings';
  private trainingDataSignal: WritableSignal<TrainingInterface[]> = signal([]);
  
  constructor(private http: HttpClient) {}

  getTrainingDataSignal(): WritableSignal<TrainingInterface[]> {
    return this.trainingDataSignal;
  }


  public createTraining(
    training: TrainingInterface,
    departmentsData: Department[],
    employeesData: Employee[],
    sectionsData: Sections[]
  ): Observable<TrainingComplete> {
    return this.http
      .post<TrainingComplete>(`${this.baseUrl}/CreateTraining`, {
        ...training,
        departments: departmentsData,
        employees: employeesData,
        sections: sectionsData,
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getTrainings(userId?: string): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(
        userId
          ? `${this.baseUrl}/GetTrainings?userId=${userId}`
          : `${this.baseUrl}/GetTrainings`
      )
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
    trainingId: number,
    training: TrainingInterface,
    departmentsData: Department[],
    employeesData: Employee[],
    sectionsData: Sections[]
  ): Observable<TrainingComplete> {
    return this.http
      .put<TrainingComplete>(`${this.baseUrl}/UpdateTraining/${trainingId}`, {
        ...training,
        departments: departmentsData,
        employees: employeesData,
        sections: sectionsData,
      })
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
    employeeId: number,
    userId?: string
  ): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(
        userId
          ? `${this.baseUrl}/GetMissedTrainingsByEmployee?employeeId=${employeeId}&userId=${userId}`
          : `${this.baseUrl}/GetMissedTrainingsByEmployee?employeeId=${employeeId}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getCompletedTrainingsByEmployee(
    employeeId: number,
    userId?: string
  ): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(
        userId
          ? `${this.baseUrl}/GetCompletedTrainingsByEmployee?employeeId=${employeeId}&userId=${userId}`
          : `${this.baseUrl}/GetCompletedTrainingsByEmployee?employeeId=${employeeId}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getUpcomingTrainingsByEmployee(
    employeeId: number,
    userId?: string
  ): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(
        userId
          ? `${this.baseUrl}/GetUpcomingTrainingsByEmployee?employeeId=${employeeId}&userId=${userId}`
          : `${this.baseUrl}/GetUpcomingTrainingsByEmployee?employeeId=${employeeId}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  public getInProgressTrainingsByEmployee(
    employeeId: number,
    userId?: string
  ): Observable<TrainingInterface[]> {
    return this.http
      .get<TrainingInterface[]>(
        userId
          ? `${this.baseUrl}/GetInProgressTrainingsByEmployee?employeeId=${employeeId}&userId=${userId}`
          : `${this.baseUrl}/GetInProgressTrainingsByEmployee?employeeId=${employeeId}`
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
