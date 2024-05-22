// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('Guard state: ', authService.user);

  const isLoggedIn = authService.isAuthenticated();
  if (isLoggedIn === true) {
    return isLoggedIn;
  }
  
  router.navigateByUrl('/login');
  return false;
};
