import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SectionProgress } from '../interfaces/section-progress';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressApiService {
  private baseUrl: string = 'http://localhost:5290/Progress';

  constructor(private http: HttpClient) {}

  public getAllProgressByUserTraining(
    userId: string,
    trainingId: number
  ): Observable<SectionProgress[]> {
    return this.http.get<SectionProgress[]>(
      `${this.baseUrl}/GetAllProgressByUserTraining?userId=${userId}&trainingId=${trainingId}`
    );
  }
}
