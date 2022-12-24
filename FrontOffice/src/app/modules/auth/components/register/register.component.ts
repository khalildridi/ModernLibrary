import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomValidationService } from 'src/app/shared/services/custom-validation.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private customValidator: CustomValidationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        contact: [''],
        birth_date: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: this.customValidator.MatchPassword(
          'password',
          'confirmPassword'
        ),
      }
    );
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  register(): void {
    if (this.registerForm.valid) {
      this.authService
        .register(
          this.registerForm.value.name,
          this.registerForm.value.email,
          this.registerForm.value.password,
          this.registerForm.value.contact,
          this.registerForm.value.birth_date
        )
        .subscribe({
          next: (user: any) => {
            if (user && user.token) {
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.router.navigate(['/']);
              this.toastr.success('Signed up successfully', 'Register');
            }
          },
          error: (_err: any) => {
            this.toastr.error('The credentials are invalid', 'Register');
          },
        });
    }
  }
}
