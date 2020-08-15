import {Component, ViewChild} from '@angular/core';
import {GithubService} from '../data/github.service';
import {ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RateLimitComponent} from '../rate-limit/rate-limit.component';

@Component({
    templateUrl: 'home.component.html',
    styles: []
})
export class HomeComponent {
    public exposedEmails: string[];
    public readonly formGroup: FormGroup;
    private readonly githubService: GithubService;
    @ViewChild(RateLimitComponent)
    private readonly rateLimitComponent: RateLimitComponent;

    constructor(activatedRoute: ActivatedRoute, githubService: GithubService, formBuilder: FormBuilder) {
        this.githubService = githubService;
        this.formGroup = formBuilder.group({
            username: formBuilder.control(undefined, Validators.required),
            accessToken: formBuilder.control(undefined)
        })
        activatedRoute.queryParams.subscribe(params => this.onQueryParamsChanged(params));
    }

    onFormSubmit() {
        this.refreshExposedEmails(this.formGroup.controls.username.value, this.formGroup.controls.accessToken.value);
    }

    private async onQueryParamsChanged(params: Params): Promise<void> {
        const username = params.username;
        const accessToken = params.accessToken;
        if (username) {
            await this.refreshExposedEmails(username, accessToken);
        }
    }

    private async refreshExposedEmails(username, accessToken) {
        this.exposedEmails = await this.githubService.getExposedEmails(username, accessToken);
        await this.rateLimitComponent.refreshRateLimit(accessToken);
    }
}