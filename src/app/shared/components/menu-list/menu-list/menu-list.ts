import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface MenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-menu-list',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav aria-label="Menu">
      <ul class="flex flex-col gap-1">
        @for (item of items(); track item.route) {
          <li>
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-blue-50 text-blue-600 font-semibold"
              class="block px-4 py-2 rounded-lg text-sm text-gray-700
                     hover:bg-gray-100 transition-colors">
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: ``,
})
export class MenuList {
  items = input<MenuItem[]>([]);
}
