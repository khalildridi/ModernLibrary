import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  login(): void {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (user: any) => {
            if (user && user.token) {
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.router.navigate(['/']);
              this.toastr.success('Signed in successfully', 'Login');
            }
          },
          error: (_err: any) => {
            this.toastr.error('The credentials are invalid', 'Login');
          },
        });
    }
  }
}
