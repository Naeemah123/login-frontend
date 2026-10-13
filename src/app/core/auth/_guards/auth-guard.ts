import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../_services/auth.service';

/**
 * Guard based on AuthService state.
 * - Valid access token -> allow.
 * - Expired access token but refresh token exists -> try one refresh first.
 * - No session / refresh fails -> redirect to /login.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAccessTokenValid()) {
    return true;
  }

  const refresh$ = auth.refreshOnce();
  if (!refresh$) {
    return router.createUrlTree(['/login']);
  }

  return refresh$.pipe(
    map(() => true),
    catchError(() => {
      auth.clearSession();
      return of(router.createUrlTree(['/login']));
    })
  );
};
