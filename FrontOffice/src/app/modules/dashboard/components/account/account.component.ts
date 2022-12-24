import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/modules/models/user.model';
import { UserRestService } from 'src/app/shared/services/user-rest.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  id!: string;
  user_points: number = 0;
  accountForm: FormGroup = new FormGroup({});

  constructor(
    private userService: UserRestService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.pattern('(9[1236])(\\d{7})')],
      street: [''],
      city: [''],
      district: [''],
      zipCode: [''],
    });

    this.userService.getId().subscribe((res: any) => {
      if (res) {
        this.id = res.user._id;
        this.user_points = res.user.points;

        this.accountForm.patchValue({
          name: res.user.name,
          email: res.user.email,
          contact: res.user.contact,
          street: res.user.address?.street,
          city: res.user.address?.city,
          district: res.user.address?.district,
          zipCode: res.user.address?.zipCode,
        });
      }
    });
  }

  get accountFormControl() {
    return this.accountForm.controls;
  }

  saveChanges() {
    this.userService
      .save(
        this.id,
        this.accountForm.value.name,
        this.accountForm.value.email,
        this.accountForm.value.contact,
        this.accountForm.value.street,
        this.accountForm.value.city,
        this.accountForm.value.district,
        this.accountForm.value.zipCode
      )
      .subscribe((data: any) => {
        if (data?._id === this.id) {
          this.toastr.success(
            'Your details were updated successfully',
            'Details'
          );
        } else {
          this.toastr.error(
            'Something went wrong, details not updated',
            'Details'
          );
        }
      });
  }
}
