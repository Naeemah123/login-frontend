import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/_services/auth.service';
import { apiUrl } from '../_config/api.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status !== 401 || req.url.endsWith(apiUrl.refresh)) {
        return throwError(() => error);
      }

      // Single-flight: AuthService shares one refresh call at a time.
      const refresh$ = auth.refreshOnce();

      if (!refresh$) {
        auth.clearSession();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      return refresh$.pipe(
        switchMap((response) => {
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.data.accessToken}`
            }
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          auth.clearSession();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
