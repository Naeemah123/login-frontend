import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
  return this.http.post(
    `${this.api}/login`,
    {
      email,
      password
    },
    {
      responseType: 'text'
    }
  );
}
getDashboard(token: string) {
  return this.http.get(`${this.api}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
}