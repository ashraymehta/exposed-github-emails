import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-exposed-list',
    templateUrl: 'exposed-list.component.html'
})
export class ExposedListComponent {
    @Input()
    public readonly exposedEmails: string[];
}
