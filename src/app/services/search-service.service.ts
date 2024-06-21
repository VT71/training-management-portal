import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ArticleInterface } from '../interfaces/article.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  // Method to search for routes based on input text
  getArticles(searchValue: string): Observable<ArticleInterface[]> {
    return this.http.get<ArticleInterface[]>(
      `/api/articles?search=${searchValue}`
    );
  }
}
