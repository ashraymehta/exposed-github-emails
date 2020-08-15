import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
      <div class="container h-100">
        <router-outlet></router-outlet>
      </div>`
})
export class AppComponent {
}
