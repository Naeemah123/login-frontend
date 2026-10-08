import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.exp && payload.exp * 1000 > Date.now()) {
      return true;
    }
  } catch {
    localStorage.removeItem('token');
    return router.createUrlTree(['/login']);
  }

  localStorage.removeItem('token');
  return router.createUrlTree(['/login']);
};