import {ActivatedRoute} from '@angular/router';
import {Component, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GithubService, Repository} from '../data/github.service';
import {GithubInputComponent} from '../github-input/github-input.component';
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

    @ViewChild(GithubInputComponent)
    private readonly githubInputComponent: GithubInputComponent;

    constructor(activatedRoute: ActivatedRoute, githubService: GithubService, modalService: NgbModal) {
        this.githubService = githubService;
        this.modalService = modalService;
    }

    onGithubInputSubmission(data: { username: string; }) {
        this.refreshExposedEmails(data.username, this.accessToken);
    }

    private async refreshExposedEmails(username, accessToken) {
        this.componentState = State.Loading;
        try {
            this.repositoriesAndExposedEmails = undefined;
            this.repositoriesAndExposedEmails = await this.githubService.getExposedEmails(username, accessToken);
            this.componentState = State.ShowingResults;
        } catch (error) {
            if (error.status === 403) {
                this.onRateLimitBreached();
            } else if (error.status === 404) {
                this.componentState = State.Initial;
                this.githubInputComponent.markUsernameInvalid();
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