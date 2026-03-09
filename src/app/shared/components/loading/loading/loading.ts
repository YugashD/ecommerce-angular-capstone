import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-3 py-12"
         role="status" aria-live="polite">
      <div class="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"
           aria-hidden="true"></div>
      <p class="text-sm text-gray-500">{{ message() }}</p>
    </div>
  `,
  styles: ``,
})
export class Loading {
  readonly message = input('Loading...');
}
