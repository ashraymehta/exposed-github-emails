import {GithubService} from '../data/github.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-access-token-prompt',
    templateUrl: 'access-token-prompt.component.html'
})
export class AccessTokenPromptComponent {
    public readonly formGroup: FormGroup;
    public readonly activeModal: NgbActiveModal;
    private readonly githubService: GithubService;
    @ViewChild("accessToken")
    private readonly accessTokenInput: ElementRef;

    constructor(activeModal: NgbActiveModal, formBuilder: FormBuilder, githubService: GithubService) {
        this.activeModal = activeModal;
        this.githubService = githubService;
        this.formGroup = formBuilder.group({
            accessToken: formBuilder.control(undefined, Validators.required)
        });
    }

    async onFormSubmitted(): Promise<void> {
        const accessToken = this.formGroup.controls.accessToken.value;
        this.accessTokenInput.nativeElement.classList.remove("is-invalid");
        try {
            await this.githubService.getRateLimit(accessToken);
            this.activeModal.close(accessToken);
        } catch (error) {
            this.accessTokenInput.nativeElement.classList.add("is-invalid");
        }
    }
}