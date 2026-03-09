import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center"
         role="alert" aria-live="assertive">
      <div class="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-600"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
             aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>

      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-semibold text-gray-800">{{ title() }}</h2>
        <p class="text-sm text-gray-500 max-w-sm">{{ message() }}</p>
      </div>

      @if (retryable()) {
        <button
          type="button"
          (click)="retry.emit()"
          class="mt-2 px-5 py-2 rounded-md bg-red-600 text-white text-sm font-medium
                 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                 transition-colors cursor-pointer">
          Try again
        </button>
      }
    </div>
  `,
  styles: ``,
})
export class ErrorMessage {
  readonly title = input('Something went wrong');
  readonly message = input('An unexpected error occurred. Please try again later.');
  readonly retryable = input(true);

  readonly retry = output<void>();
}
