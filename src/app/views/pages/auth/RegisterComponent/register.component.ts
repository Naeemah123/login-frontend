import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/_services/auth.service';
import { ToastService } from '../../../../core/_base/toast.service';
import { ToastComponent } from '../../../../core/_base/toast.component';
import { isControlHasError } from '../../../../core/_base/form.helpers';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, ToastComponent],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  form;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;

    this.authService.register(email!, password!).subscribe({
      next: (response) => {
        this.successMessage = response.response.message;
        this.errorMessage = '';
        this.toast.success(response.response.message);
        this.form.reset();
      },
      error: (error) => {
        const message =
          error.error?.response?.message || 'Registration failed';
        this.errorMessage = message;
        this.successMessage = '';
        this.toast.error(message);
      }
    });
  }

  isControlHasError(controlName: string, validationType: string) {
    return isControlHasError(this.form, controlName, validationType);
  }
}
