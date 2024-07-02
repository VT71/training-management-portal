import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, switchMap } from 'rxjs';
import { GlobalStateService } from '../services/global-state.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.rolesource.pipe(
    switchMap((isAdmin) => {
      if (isAdmin === '') {
        return authService.isAdmin().pipe(
          map((isAdmin) => {
            if (isAdmin === true) {
              return true;
            } else {
              router.navigateByUrl('/dashboard/trainings');
              return false;
            }
          })
        );
      } else if (isAdmin === 'admin') {
        return of(true);
      } else {
        router.navigateByUrl('/dashboard/trainings');
        return of(false);
      }
    })
  );
};
