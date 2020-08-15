import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {RateLimitComponent} from './rate-limit/rate-limit.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        RateLimitComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbProgressbarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
