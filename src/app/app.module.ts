import {NgModule} from '@angular/core';
import {LottieModule} from 'ngx-lottie';
import {AppComponent} from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {LoaderComponent} from './loader/loader.component';
import {NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {RateLimitComponent} from './rate-limit/rate-limit.component';
import {SearchIconComponent} from './search-icon/search-icon.component';
import {GithubInputComponent} from './github-input/github-input.component';
import {ExposedListComponent} from './exposed-list/exposed-list.component';
import {AccessTokenPromptComponent} from './access-token-prompt/access-token-prompt.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        RateLimitComponent,
        GithubInputComponent,
        LoaderComponent,
        ExposedListComponent,
        AccessTokenPromptComponent,
        SearchIconComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbProgressbarModule,
        ReactiveFormsModule,
        LottieModule.forRoot({player: () => import('lottie-web')})
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
