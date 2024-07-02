// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isAuthenticated();
  if (isLoggedIn === true) {
    return isLoggedIn;
  }

  router.navigateByUrl('/login');
  return false;
};
