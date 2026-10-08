import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/_services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  email = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
  this.authService.getDashboard().subscribe({
    next: (response) => {
      this.email = response.data.sub;
    },
    error: (error) => {
        this.errorMessage = error.error?.response?.message || 'Failed to load dashboard';
      }
  });
  }
}