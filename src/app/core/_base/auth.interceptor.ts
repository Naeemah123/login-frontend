import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { apiUrl } from '../_config/api.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const token = localStorage.getItem('token');

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

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        localStorage.removeItem('token');
        return throwError(() => error);
      }

      return http.post<any>(
        `${environment.apiUrl}${apiUrl.refresh}`,
        { refreshToken }
      ).pipe(
        switchMap((response) => {
          localStorage.setItem('token', response.data.accessToken);

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.data.accessToken}`
            }
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          return throwError(() => refreshError);
        })
      );
    })
  );
};