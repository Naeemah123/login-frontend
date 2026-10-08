import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../_config/api.config';
import { ApiResponse } from '../_models/auth-response.model';
import { LoginData, DashboardData } from '../_models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<ApiResponse<LoginData>>(`${this.api}${apiUrl.login}`, { email, password });
  }

  register(email: string, password: string) {
    return this.http.post<ApiResponse<unknown>>(`${this.api}${apiUrl.register}`, { email, password });
  }

  refresh(refreshToken: string) {
    return this.http.post<ApiResponse<LoginData>>(`${this.api}${apiUrl.refresh}`, { refreshToken });
  }

  getDashboard() {
    return this.http.get<ApiResponse<DashboardData>>(`${this.api}${apiUrl.dashboard}`);
  }
}