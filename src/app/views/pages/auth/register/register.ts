import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/_services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  form;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
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
        this.form.reset();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.response?.message || 'Registration failed';
        this.successMessage = '';
      }
    });
  }

  isControlHasError(controlName: string, validationType: string) {
    const control = this.form.get(controlName);
    return control?.hasError(validationType) && control.touched;
  }
}