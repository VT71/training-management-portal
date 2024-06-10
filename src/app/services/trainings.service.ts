import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrainingInterface } from '../interfaces/training.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TrainingsService {
  private baseUrl = 'http://localhost:5290/Trainings';

  constructor(private http: HttpClient) {}

  public updateTraining(
    training: TrainingInterface
  ): Observable<TrainingInterface> {

    return this.http
      .put<TrainingInterface>(
        `${this.baseUrl}/UpdateTraining/${training.trainingId}`,
        training
      )
      .pipe(
        catchError((error) => {
          alert('Error when updating training:');
          console.log('Errors:', error.error.errors); // Afișează erorile de validare în consolă
          throw error;
        })
      );
  }
}
