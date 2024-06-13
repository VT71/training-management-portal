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


  public createTraining(training: TrainingInterface): Observable<TrainingInterface> {
    return this.http
      .post<TrainingInterface>(`${this.baseUrl}/CreateTraining`, training)
      .pipe(
        catchError((error) => {
          alert('Error when creating training:');
          console.log('Errors:', error.error.errors);
          return throwError(error);
        })
      );
  }
}
