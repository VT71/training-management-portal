import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  

  private importantRoutes = [
    { title: 'Home', route: '/home' },
    { title: 'Login', route: '/login' },
    { title: 'Regiter', route: '/register' },
    // Add more routes as needed
  ];

  constructor() { }

  // Method to search for routes based on input text
  searchRoutes(query: string) {
    query = query.toLowerCase().trim();
    return this.importantRoutes.filter(route =>
      route.title.toLowerCase().includes(query)
    );
  }

}
