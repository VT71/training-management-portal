import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, switchMap } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.rolesource.pipe(
    map((isAdmin) => {
      if (isAdmin === 'admin') {
        return true;
      } else {
        router.navigateByUrl('/dashboard/trainings');
        return false;
      }
    })
  );
};
