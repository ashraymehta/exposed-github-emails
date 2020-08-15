import {Component, ViewChild} from '@angular/core';
import {GithubService} from '../data/github.service';
import {ActivatedRoute, Params} from '@angular/router';
import {RateLimitComponent} from '../rate-limit/rate-limit.component';

@Component({
    templateUrl: 'home.component.html',
    styles: []
})
export class HomeComponent {
    public exposedEmails: string[];
    private readonly githubService: GithubService;
    @ViewChild(RateLimitComponent)
    private readonly rateLimitComponent: RateLimitComponent;

    constructor(activatedRoute: ActivatedRoute, githubService: GithubService) {
        this.githubService = githubService;
        activatedRoute.queryParams.subscribe(params => this.onQueryParamsChanged(params));
    }

    onGithubInputSubmission(data: { username: string; accessToken: string }) {
        this.refreshExposedEmails(data.username, data.accessToken);
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