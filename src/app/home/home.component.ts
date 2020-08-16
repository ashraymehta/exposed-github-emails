import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Params} from '@angular/router';
import {RateLimitError} from '../errors/rate-limit.error';
import {GithubService, Repository} from '../data/github.service';
import {AccessTokenPromptComponent} from '../access-token-prompt/access-token-prompt.component';

@Component({
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    public readonly State = State;
    public componentState: State = State.Initial;
    public repositoriesAndExposedEmails: { repository: Repository, emails: string[] }[];
    private accessToken?: string;
    private readonly modalService: NgbModal;
    private readonly githubService: GithubService;

    constructor(activatedRoute: ActivatedRoute, githubService: GithubService, modalService: NgbModal) {
        this.githubService = githubService;
        this.modalService = modalService;
        activatedRoute.queryParams.subscribe(params => this.onQueryParamsChanged(params));
    }

    onGithubInputSubmission(data: { username: string; }) {
        this.refreshExposedEmails(data.username, this.accessToken);
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
            this.repositoriesAndExposedEmails = undefined;
            this.repositoriesAndExposedEmails = await this.githubService.getExposedEmails(username, accessToken);
            this.componentState = State.ShowingResults;
        } catch (error) {
            if (error instanceof RateLimitError) {
                this.onRateLimitBreached();
            } else {
                throw error;
            }
        }
    }

    private async onRateLimitBreached() {
        this.componentState = State.Initial;
        this.accessToken = await this.modalService.open(AccessTokenPromptComponent, {
            keyboard: false,
            backdrop: "static",
            centered: true
        }).result;
    }
}

enum State {
    Loading, Initial, ShowingResults
}