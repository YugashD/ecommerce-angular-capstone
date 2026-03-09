import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [class]="size()" fill="none"
         viewBox="0 0 24 24" stroke="currentColor" [attr.stroke-width]="strokeWidth()" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  `,
  styles: ``,
})
export class Logo {
  size = input<string>('w-6 h-6');
  strokeWidth = input<string>('2');
}
