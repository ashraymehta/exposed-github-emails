import {Component, Input} from '@angular/core';
import {Repository} from '../data/github.service';

@Component({
    selector: 'app-exposed-list',
    templateUrl: 'exposed-list.component.html'
})
export class ExposedListComponent {
    public exposedEmailsWithRepositories: { email: string, repositories: Repository[] }[];

    @Input()
    public set repositoriesAndExposedEmails(value: { repository: Repository, emails: string[] }[]) {
        const allExposedEmails = Array.from(new Set(value.flatMap(v => v.emails)));
        this.exposedEmailsWithRepositories = allExposedEmails.flatMap(email => {
            return {
                email: email,
                repositories: value.filter(v => v.emails.includes(email)).map(v => v.repository)
            };
        })
    }
}
