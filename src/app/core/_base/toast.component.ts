import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  template: `
    <div class="toast-container">
      @for (msg of toast.messages(); track msg.id) {
        <div class="toast" [class.success]="msg.type === 'success'" [class.error]="msg.type === 'error'">
          <span>{{ msg.text }}</span>
          <button type="button" (click)="toast.dismiss(msg.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container { position: fixed; top: 16px; right: 16px; z-index: 1000; display: flex; flex-direction: column; gap: 8px; }
    .toast { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 6px; color: #fff; min-width: 240px; }
    .toast.success { background: #2e7d32; }
    .toast.error { background: #c62828; }
    .toast button { background: transparent; border: none; color: #fff; font-size: 16px; cursor: pointer; }
  `]
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
