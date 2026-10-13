import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/_services/auth.service';
import { ToastService } from '../../../../core/_base/toast.service';
import { ToastComponent } from '../../../../core/_base/toast.component';
import { isControlHasError } from '../../../../core/_base/form.helpers';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ToastComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  form;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
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

  this.authService.login(email!, password!).subscribe({
    next: (response) => {
      this.authService.setSession(response.data.accessToken, response.data.refreshToken);
      this.toast.success('Login successful');
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
  const message = error.error?.response?.message || 'Login failed';
  this.errorMessage = message;
  this.toast.error(message);
  this.cdr.detectChanges();
}
  });
}
  isControlHasError(controlName: string, validationType: string) {
    return isControlHasError(this.form, controlName, validationType);
  }
}
