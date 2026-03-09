import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center justify-between gap-4 min-w-64 max-w-sm px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto transition-all duration-200 ease-out"
          [class]="typeClass(toast.type)"
          role="status">
          <span>{{ toast.message }}</span>
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Dismiss notification">
            &#x2715;
          </button>
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class ToastComponent {
  constructor(public toastService: ToastService) { }

  typeClass(type: 'success' | 'error' | 'info'): string {
    return {
      success: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      info: 'bg-blue-600 text-white',
    }[type];
  }
}
