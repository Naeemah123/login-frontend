import { Component } from '@angular/core';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  email = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.authService.getDashboard(token).subscribe({
        next: (response: any) => {
          this.email = response.user.email;
        },
        error: (error) => {
          console.log('Dashboard request failed:', error);
        }
      });
    }
  }
}