import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../core/auth/_services/auth.service';
import { ToastService } from '../../../core/_base/toast.service';
import { getHttpErrorMessage } from '../../../core/_base/http-error.helpers';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  errorMessage = '';

  ngOnInit(): void {
    this.authService
      .getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (error: unknown) => {
          const message = getHttpErrorMessage(
            error,
            'Failed to load dashboard',
          );

          this.errorMessage = message;
          this.toast.error(message);
        },
      });
  }

  logout(): void {
    this.authService.logout();
    this.toast.success('Logged out');
  }
}