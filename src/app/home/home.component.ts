import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GithubService} from '../data/github.service';
import {ActivatedRoute, Params} from '@angular/router';
import {RateLimitError} from '../errors/rate-limit.error';
import {AccessTokenPromptComponent} from '../access-token-prompt/access-token-prompt.component';

@Component({
    templateUrl: 'home.component.html',
    styles: []
})
export class HomeComponent implements OnInit {
    public readonly State = State;
    public exposedEmails: string[];
    public componentState: State = State.Idle;
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

    ngOnInit(): void {
        this.onRateLimitBreached();
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
            this.exposedEmails = undefined;
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

    private async onRateLimitBreached() {
        this.componentState = State.Idle;
        this.accessToken = await this.modalService.open(AccessTokenPromptComponent, {
            keyboard: false,
            backdrop: "static",
            centered: true
        }).result;
    }
}

enum State {
    Loading, Idle
}