import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

const REGEX_LOWER_AND_UPPERCASE = new RegExp(/(?=.*[a-z])(?=.*[A-Z])/);
const PASSWORD_MIN_LENGTH = 8;

const ENDPOINT = 'https://demo-api.now.sh/users';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
	signupForm: FormGroup;
	success = false;
	error = null;

	constructor(private http: HttpClient) {
		this.signupForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
			lastName: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required, this.passwordValidator]),
			email: new FormControl('', [Validators.required, Validators.email])
		});
	}

	register() {
		this.signupForm.updateValueAndValidity();
		if (!this.signupForm.valid) {
			return this.signupForm.markAllAsTouched();
		}
		this.send();
	}

	send() {
		this.signupForm.disable();
		this.error = null;
		this.http.post(ENDPOINT, {
			firstName: this.signupForm.get('name')?.value,
			lastName: this.signupForm.get('lastName')?.value,
			email: this.signupForm.get('email')?.value,
		}).subscribe({
			next: (result) => {
				this.success = true;
			},
			error: (reason) => {
				this.error = reason;
				this.signupForm.enable();
			}
		})
	}

	passwordValidator(control: AbstractControl<any, any>): ValidationErrors | null {
		const password = control.value || '';
		const short = password.length < PASSWORD_MIN_LENGTH;
		console.log(control.parent)
		const casing = !password.match(REGEX_LOWER_AND_UPPERCASE);
		const words = [control.parent?.get('name')?.value, control.parent?.get('lastName')?.value];
		const disallowedWords = words.some((word) => SignUpComponent.containsWord(password, word));
		if (short || casing || disallowedWords) {
			return { short, casing: casing, disallowedWords }
		}
		return null;
	}

	static containsWord(value: string, word: string): boolean {
		if (!word) {
			return false;
		}
		return value.toLocaleLowerCase().includes(word.toLocaleLowerCase())
	}
}
