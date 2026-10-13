import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error';
  text: string;
}

/** One shared toast/notification helper for success and error messages. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly messages = signal<ToastMessage[]>([]);
  private nextId = 1;

  private push(type: ToastMessage['type'], text: string, timeout = 4000): void {
    const id = this.nextId++;
    this.messages.update((list) => [...list, { id, type, text }]);
    setTimeout(() => this.dismiss(id), timeout);
  }

  success(text: string): void {
    this.push('success', text);
  }

  error(text: string): void {
    this.push('error', text);
  }

  dismiss(id: number): void {
    this.messages.update((list) => list.filter((m) => m.id !== id));
  }

  clear(): void {
    this.messages.set([]);
  }
}
