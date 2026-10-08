import { Routes } from '@angular/router';
import { Login } from './views/pages/auth/login/login';
import { Dashboard } from './views/pages/dashboard/dashboard';
import { authGuard } from './core/auth/_guards/auth-guard';
import { Register } from './views/pages/auth/register/register';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] }
];