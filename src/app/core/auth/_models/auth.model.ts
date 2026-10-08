export interface LoginData {
  accessToken: string;
  refreshToken: string;
}

export interface DashboardData {
  sub: string;
  role: string;
  type: string;
}