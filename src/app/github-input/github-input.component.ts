import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'app-github-input',
    templateUrl: 'github-input.component.html'
})
export class GithubInputComponent implements AfterViewInit {
    public readonly formGroup: FormGroup;

    @Output()
    public onSubmit = new EventEmitter<{ username: string }>();
    private readonly activatedRoute: ActivatedRoute;

    constructor(formBuilder: FormBuilder, activatedRoute: ActivatedRoute) {
        this.activatedRoute = activatedRoute;
        this.formGroup = formBuilder.group({
            username: formBuilder.control(undefined, Validators.required),
        })
    }

    onFormSubmitted() {
        const username = this.formGroup.controls.username.value;
        this.onSubmit.emit({username});
    }

    ngAfterViewInit(): void {
        this.activatedRoute.queryParams.subscribe(params => this.onQueryParamsChanged(params));
    }

    private async onQueryParamsChanged(params: Params): Promise<void> {
        const username = params.username;
        if (username) {
            this.formGroup.controls.username.setValue(username);
            this.onFormSubmitted();
        }
    }
}