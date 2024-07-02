import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { ArticleInterface } from '../interfaces/article.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {


  constructor() {}

  // Method to search for routes based on input text
  // getArticles(searchValue: string): Observable<ArticleInterface[]> {
  //   const filteredArticles = this.articles.filter(article =>
  //     article.title.toLowerCase().includes(searchValue.toLowerCase())
  //   );
  //   return of(filteredArticles);
  // }

  filterResults(_searchValue: string): { title: string; route: string }[] {
    // Replace with your actual filtering logic based on your data
    return [];
  }
}
