import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../../core/auth/_services/auth.service';
import { ToastService } from '../../../../core/_base/toast.service';
import { isControlHasError } from '../../../../core/_base/form.helpers';
import { getHttpErrorMessage } from '../../../../core/_base/http-error.helpers';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
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
  successMessage = '';
  isSubmitting = false;

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .register(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.successMessage = response.response.message;
          this.errorMessage = '';
          this.toast.success(response.response.message);
          this.form.reset();
          this.isSubmitting = false;
        },
        error: (error: unknown) => {
          const message = getHttpErrorMessage(
            error,
            'Registration failed',
          );

          this.errorMessage = message;
          this.successMessage = '';
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