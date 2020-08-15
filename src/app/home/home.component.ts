import {Component} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    template: `
      <p>
        I'm home!
      </p>
    `,
    styles: []
})
export class HomeComponent {
    constructor(activatedRoute: ActivatedRoute) {
        activatedRoute.queryParams.subscribe(params => this.onQueryParamsChanged(params));
    }

    private onQueryParamsChanged(params: Params) {
        console.log(`Params changed! ${JSON.stringify(params)}`);
    }
}
