import { Routes } from '@angular/router';
import { LoginComponent } from './views/pages/auth/LoginComponent/login.component';
import { DashboardComponent } from './views/pages/DashboardComponent/dashboard.component';
import { authGuard } from './core/auth/_guards/auth-guard';
import { RegisterComponent } from './views/pages/auth/RegisterComponent/register.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
];