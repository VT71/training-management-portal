import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SectionProgress } from '../interfaces/section-progress';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProgressApiService {
  private baseUrl: string = `${environment.apiUrl}/Progress`;

  constructor(private http: HttpClient) {}

  public getAllProgressByUserTraining(
    userId: string,
    trainingId: number
  ): Observable<SectionProgress[]> {
    return this.http.get<SectionProgress[]>(
      `${this.baseUrl}/GetAllProgressByUserTraining?userId=${userId}&trainingId=${trainingId}`
    );
  }

  public updateProgress(
    sectionId: number,
    userId: string,
    progress: number
  ): Observable<Object> {
    return this.http.post<Object>(
      `${this.baseUrl}/UpdateSectionProgress?sectionId=${sectionId}&userId=${userId}&progress=${progress}`,
      {}
    );
  }
}
