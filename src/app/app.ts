import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './core/_base/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('login-frontend');
}
