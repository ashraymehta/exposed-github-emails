import {Component, OnInit} from '@angular/core';
import {GithubService, RateLimit} from '../data/github.service';

@Component({
    selector: 'app-rate-limit',
    templateUrl: 'rate-limit.component.html'
})
export class RateLimitComponent implements OnInit {
    public rateLimit: RateLimit;
    private readonly githubService: GithubService;

    constructor(githubService: GithubService) {
        this.githubService = githubService;
    }

    ngOnInit(): void {
        this.refreshRateLimit();
    }

    public async refreshRateLimit(accessToken?: string) {
        this.rateLimit = await this.githubService.getRateLimit(accessToken);
    }
}