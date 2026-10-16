import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../../core/auth/_services/auth.service';
import { ToastService } from '../../../../core/_base/toast.service';
import { isControlHasError } from '../../../../core/_base/form.helpers';
import { getHttpErrorMessage } from '../../../../core/_base/http-error.helpers';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly form: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  errorMessage = '';
  isSubmitting = false;

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService
      .login(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.authService.setSession(
            response.data.accessToken,
            response.data.refreshToken,
          );

          this.isSubmitting = false;
          this.toast.success('Login successful');
          this.router.navigate(['/dashboard']);
        },
        error: (error: unknown) => {
          const message = getHttpErrorMessage(error, 'Login failed');

          this.errorMessage = message;
          this.toast.error(message);
          this.isSubmitting = false;
        },
      });
  }

  isControlHasError(
    controlName: string,
    validationType: string,
  ): boolean {
    return isControlHasError(this.form, controlName, validationType);
  }
}