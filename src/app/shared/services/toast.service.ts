import { Injectable, signal } from '@angular/core';

export interface Toast {
  // Unique identifier used to target and dismiss a specific toast.
  id: number;

  // message displayed inside the notification.
  message: string;

  // variant of the notification:
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Internal signal holding all currently visible toasts.
  private _toasts = signal<Toast[]>([]);

  // Public projection consumed by the Toast display component.
  readonly toasts = this._toasts.asReadonly();

  // Auto-incrementing counter used to assign unique IDs to each toast.
  private nextId = 0;


  // Displays a new toast notification
  show(message: string, type: Toast['type'] = 'success', duration = 3000): void {
    const id = ++this.nextId;
    this._toasts.update(list => [...list, { id, message, type }]);
    // Schedule automatic dismissal after the specified duration
    setTimeout(() => this.dismiss(id), duration);
  }

  // Removes a specific toast from the active list by its unique ID.
  dismiss(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}
