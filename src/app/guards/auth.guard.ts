import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isAuthenticated();

  return authService.rolesource.pipe(
    switchMap((role) => {
      if (role === '') {
        return authService.isAdmin().pipe(
          map((isAdmin) => {
            if (isLoggedIn === true) {
              return true;
            } else {
              router.navigateByUrl('/login');
              return false;
            }
          })
        );
      } else {
        if (isLoggedIn === true) {
          return of(true);
        } else {
          router.navigateByUrl('/login');
          return of(false);
        }
      }
    })
  );
};
