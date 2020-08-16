import {Component} from '@angular/core';
import {GithubService} from '../data/github.service';
import {ActivatedRoute, Params} from '@angular/router';
import {RateLimitError} from '../errors/rate-limit.error';

@Component({
    templateUrl: 'home.component.html',
    styles: []
})
export class HomeComponent {
    public readonly State = State;
    public exposedEmails: string[];
    public componentState: State = State.Idle;
    private readonly githubService: GithubService;

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
        this.componentState = State.Loading;
        try {
            this.exposedEmails = await this.githubService.getExposedEmails(username, accessToken);
        } catch (error) {
            if (error instanceof RateLimitError) {
                this.onRateLimitBreached();
            } else {
                throw error;
            }
        }
        this.componentState = State.Idle;
    }

    private onRateLimitBreached() {
        console.log(`Rate limit has been breached.`);
    }
}

enum State {
    Loading, Idle
}