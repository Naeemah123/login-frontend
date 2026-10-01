import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  form;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;

      this.authService.login(email!, password!).subscribe({
        next: (response) => {
          localStorage.setItem('token', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.log('Login failed:', error);
        }
      });
    }
  }
}