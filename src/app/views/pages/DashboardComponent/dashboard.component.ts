import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/_services/auth.service';
import { ToastService } from '../../../core/_base/toast.service';
import { ToastComponent } from '../../../core/_base/toast.component';

@Component({
  selector: 'app-dashboard',
  imports: [ToastComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  errorMessage = '';

  constructor(private authService: AuthService, private toast: ToastService) {}

  ngOnInit() {
  this.authService.getDashboard().subscribe({
    error: (error) => {
        const message = error.error?.response?.message || 'Failed to load dashboard';
        this.errorMessage = message;
        this.toast.error(message);
      }
  });
  }

  logout(): void {
    this.authService.logout();
    this.toast.success('Logged out');
  }
}
