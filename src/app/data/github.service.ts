import {Octokit} from '@octokit/rest';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class GithubService {
    private static getOctokit(personalAccessToken?: string): Octokit {
        return new Octokit({auth: personalAccessToken});
    }

    public async getExposedEmails(username: string, personalAccessToken?: string): Promise<string[]> {
        const repositories = await this.getRepositoryNames(username, personalAccessToken);
        const exposedEmails = new Set<string>();
        for (const repository of repositories) {
            const commits = await this.getCommitsForRepositoryByUser(username, repository, personalAccessToken);
            const emailsForCommit = commits.map(c => c.author.email).concat(commits.map(c => c.committer.email));
            emailsForCommit.forEach(email => exposedEmails.add(email));
        }
        return Array.from(exposedEmails);
    }

    public async getRateLimit(personalAccessToken?: string): Promise<RateLimit> {
        const octokit = GithubService.getOctokit(personalAccessToken);
        const rateLimitResponse = await octokit.rateLimit.get();
        return {
            remaining: rateLimitResponse.data.rate.remaining,
            reset: new Date(rateLimitResponse.data.rate.reset * 1000)
        };
    }

    private async getRepositoryNames(username: string, personalAccessToken?: string): Promise<string[]> {
        const octokit = GithubService.getOctokit(personalAccessToken);
        const repositories = await octokit.paginate(octokit.repos.listForUser, {username: username});
        return repositories.map(r => r.name);
    }

    private async getCommitsForRepositoryByUser(username: string, repository: string, personalAccessToken?: string): Promise<Commit[]> {
        const octokit = GithubService.getOctokit(personalAccessToken);
        const commits = await octokit.paginate(octokit.repos.listCommits, {owner: username, repo: repository, author: username});
        return commits.map(c => c.commit);
    }
}

interface Commit {
    author: { email: string; };
    committer: { email: string; };
}

export interface RateLimit {
    remaining: number;
    reset: Date;
}