import { Routes } from '@angular/router';
import { LoginComponent } from './views/pages/auth/login/login.component';
import { DashboardComponent } from './views/pages/dashboard/dashboard.component';
import { authGuard } from './core/auth/_guards/auth.guard';
import { RegisterComponent } from './views/pages/auth/register/register.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
];