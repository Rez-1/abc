import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
	let component: SignUpComponent;
	let fixture: ComponentFixture<SignUpComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SignUpComponent],
			imports: [HttpClientTestingModule, ReactiveFormsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(SignUpComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('register', () => {
		beforeEach(() => {
			spyOn(component, 'send');
		});

		it('should not call send on invalid', () => {
			component.signupForm.setErrors({ test: true });
			component.register();

			expect(component.send).not.toHaveBeenCalled();
		});

		it('should call send on valid', () => {
			spyOnProperty(component.signupForm, 'valid').and.returnValue(true)
			component.register();

			expect(component.send).toHaveBeenCalled();
		})
	});

	describe('passwordValidator', () => {
		it('should return too short', () => {
			expect(component.passwordValidator({value: 'aaaa'} as any)).toEqual({short: true, casing: true, disallowedWords: false});
		});

		it('should return bad casing', () => {
			expect(component.passwordValidator({value: 'aaaaaaaa'} as any)).toEqual({short: false, casing: true, disallowedWords: false});
		});

		it('should return disallowedwords used', () => {
			component.signupForm.get('name')?.setValue('aaaa');
			expect(component.passwordValidator({value: 'aaaaAAAA', parent: component.signupForm} as any)).toEqual({short: false, casing: false, disallowedWords: true});
		});
		
		it('should return null', () => {
			expect(component.passwordValidator({value: 'aaaaAAAA'} as any)).toEqual(null);
		});
	});
});
