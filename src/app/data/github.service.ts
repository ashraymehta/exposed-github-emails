import {Octokit} from '@octokit/rest';
import {Injectable} from '@angular/core';
import {throttling} from "@octokit/plugin-throttling";
import {RateLimitError} from '../errors/rate-limit.error';

@Injectable({providedIn: 'root'})
export class GithubService {
    private static getOctokit(personalAccessToken?: string): Octokit {
        const ThrottledOctokit = Octokit.plugin(throttling);
        return new ThrottledOctokit({
            auth: personalAccessToken,
            throttle: {
                onRateLimit: () => {
                    throw new RateLimitError();
                },
                onAbuseLimit: () => {
                }
            }
        });
    }

    public async getExposedEmails(username: string, personalAccessToken?: string): Promise<{ repository: Repository, emails: string[] }[]> {
        const repositories = await this.getRepositories(username, personalAccessToken);
        const exposedEmailsPerRepository = new Set<{ repository: Repository, emails: string[] }>();
        for (const repository of repositories) {
            const commits = await this.getCommitsForRepositoryByUser(username, repository.name, personalAccessToken);
            const emailsForCommit = commits.map(c => c.author.email).concat(commits.map(c => c.committer.email));
            exposedEmailsPerRepository.add({
                repository: {name: repository.name, url: repository.url},
                emails: Array.from(new Set(emailsForCommit)).filter(email => !!email)
            });
        }
        return Array.from(exposedEmailsPerRepository);
    }

    public async getRateLimit(personalAccessToken?: string): Promise<RateLimit> {
        const octokit = GithubService.getOctokit(personalAccessToken);
        const rateLimitResponse = await octokit.rateLimit.get();
        return {
            limit: rateLimitResponse.data.rate.limit,
            remaining: rateLimitResponse.data.rate.remaining,
            reset: new Date(rateLimitResponse.data.rate.reset * 1000)
        };
    }

    private async getRepositories(username: string, personalAccessToken?: string): Promise<Repository[]> {
        const octokit = GithubService.getOctokit(personalAccessToken);
        const repos = await octokit.paginate(octokit.repos.listForUser, {username: username});
        return repos.map(repo => ({...repo, url: repo.html_url}));
    }

    private async getCommitsForRepositoryByUser(username: string, repository: string, personalAccessToken?: string): Promise<Commit[]> {
        const octokit = GithubService.getOctokit(personalAccessToken);
        const commits = await octokit.paginate(octokit.repos.listCommits, {owner: username, repo: repository, author: username});
        return commits.map(c => c.commit);
    }
}

export interface Repository {
    name: string;
    url: string;
}

interface Commit {
    author: { email: string; };
    committer: { email: string; };
}

export interface RateLimit {
    remaining: number;
    limit: number;
    reset: Date;
}