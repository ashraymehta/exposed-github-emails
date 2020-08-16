import {Component} from '@angular/core';
import {GithubService} from '../data/github.service';
import {ActivatedRoute, Params} from '@angular/router';

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
        this.exposedEmails = await this.githubService.getExposedEmails(username, accessToken);
        this.componentState = State.Idle;
    }
}

enum State {
    Loading, Idle
}