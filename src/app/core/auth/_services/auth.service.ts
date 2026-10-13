import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../_config/api.config';
import { ApiResponse } from '../_models/auth-response.model';
import { LoginData, DashboardData } from '../_models/auth.model';

const ACCESS_KEY = 'token';
const REFRESH_KEY = 'refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;
  private refreshInFlight$: Observable<ApiResponse<LoginData>> | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  // ---- session storage: only AuthService touches localStorage ----
  setSession(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    this.refreshInFlight$ = null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken() || !!this.getRefreshToken();
  }

  isAccessTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return !!payload.exp && payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  login(email: string, password: string) {
    return this.http.post<ApiResponse<LoginData>>(`${this.api}${apiUrl.login}`, { email, password });
  }

  register(email: string, password: string) {
    return this.http.post<ApiResponse<unknown>>(`${this.api}${apiUrl.register}`, { email, password });
  }

  refresh(refreshToken: string) {
    return this.http.post<ApiResponse<LoginData>>(`${this.api}${apiUrl.refresh}`, { refreshToken });
  }

  /** Single-flight refresh: concurrent callers share one HTTP request. */
  refreshOnce(): Observable<ApiResponse<LoginData>> | null {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;
    if (!this.refreshInFlight$) {
      this.refreshInFlight$ = this.refresh(refreshToken).pipe(
        tap((response) => {
          this.setSession(response.data.accessToken, refreshToken);
        }),
        shareReplay(1)
      );
      // Clear the shared observable once it settles so later refreshes can run.
      const clear = () => (this.refreshInFlight$ = null);
      this.refreshInFlight$.subscribe({ next: clear, error: clear });
    }
    return this.refreshInFlight$;
  }

  getDashboard() {
    return this.http.get<ApiResponse<DashboardData>>(`${this.api}${apiUrl.dashboard}`);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }
}
