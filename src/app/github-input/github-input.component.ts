import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-github-input',
    templateUrl: 'github-input.component.html'
})
export class GithubInputComponent {
    public readonly formGroup: FormGroup;

    @Output()
    public onSubmit = new EventEmitter<{username: string, accessToken: string}>();

    constructor(formBuilder: FormBuilder) {
        this.formGroup = formBuilder.group({
            username: formBuilder.control(undefined, Validators.required),
            accessToken: formBuilder.control(undefined)
        })
    }

    onFormSubmitted() {
        const username = this.formGroup.controls.username.value;
        const accessToken = this.formGroup.controls.accessToken.value;
        this.onSubmit.emit({username, accessToken});
    }
}